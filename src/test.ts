/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as chalk from "chalk";
import * as diff from "diff";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as semver from "semver";
import * as ts from "typescript";

import { Replacement } from "./language/rule/rule";
import * as Linter from "./linter";
import { denormalizeWinPath, mapDefined, readBufferWithDetectedEncoding } from "./utils";
import { LintError } from "./verify/lintError";
import * as parse from "./verify/parse";

const MARKUP_FILE_EXTENSION = ".lint";
const FIXES_FILE_EXTENSION = ".fix";

export interface TestOutput {
    skipped: false;
    errorsFromLinter: LintError[];
    errorsFromMarkup: LintError[];
    fixesFromLinter: string;
    fixesFromMarkup: string;
    markupFromLinter: string;
    markupFromMarkup: string;
}

export interface SkippedTest {
    skipped: true;
    requirement: string;
}

export interface TestResult {
    directory: string;
    results: {
        [fileName: string]: TestOutput | SkippedTest;
    };
}

export async function runTests(patterns: string[], rulesDirectory?: string | string[]): Promise<TestResult[]> {
    const files: string[] = [];
    for (let pattern of patterns) {
        if (path.basename(pattern) !== "tslint.json") {
            pattern = path.join(pattern, "tslint.json");
        }
        files.push(...glob.sync(pattern));
    }
    return await Promise.all(
        files.map(async (directory: string): Promise<TestResult> => await runTest(path.dirname(directory), rulesDirectory)));
}

export async function runTest(testDirectory: string, rulesDirectory?: string | string[]): Promise<TestResult> {
    const filesToLint = glob.sync(path.join(testDirectory, `**/*${MARKUP_FILE_EXTENSION}`));
    const tslintConfig = Linter.findConfiguration(path.join(testDirectory, "tslint.json"), "").results;
    const tsConfig = path.join(testDirectory, "tsconfig.json");
    let compilerOptions: ts.CompilerOptions = { allowJs: true };
    const hasConfig = fs.existsSync(tsConfig);
    if (hasConfig) {
        const {config, error} = ts.readConfigFile(tsConfig, ts.sys.readFile);
        if (error !== undefined) {
            throw new Error(JSON.stringify(error));
        }

        const parseConfigHost = {
            fileExists: fs.existsSync,
            readDirectory: ts.sys.readDirectory,
            readFile: (file: string) => fs.readFileSync(file, "utf8"),
            useCaseSensitiveFileNames: true,
        };
        compilerOptions = ts.parseJsonConfigFileContent(config, parseConfigHost, testDirectory).options;
    }
    const results: TestResult = { directory: testDirectory, results: {} };

    for (const fileToLint of filesToLint) {
        const isEncodingRule = path.basename(testDirectory) === "encoding";

        const fileCompileName = denormalizeWinPath(path.resolve(fileToLint.replace(/\.lint$/, "")));
        let fileText = isEncodingRule ? readBufferWithDetectedEncoding(fs.readFileSync(fileToLint)) : fs.readFileSync(fileToLint, "utf-8");
        const tsVersionRequirement = parse.getTypescriptVersionRequirement(fileText);
        if (tsVersionRequirement !== undefined) {
            // remove prerelease suffix when matching to allow testing with nightly builds
            if (!semver.satisfies(parse.getNormalizedTypescriptVersion(), tsVersionRequirement)) {
                results.results[fileToLint] = {
                    requirement: tsVersionRequirement,
                    skipped: true,
                };
                continue;
            }
            // remove the first line from the file before continuing
            const lineBreak = fileText.search(/\n/);
            fileText = lineBreak === -1 ? "" : fileText.substr(lineBreak + 1);
        }
        fileText = parse.preprocessDirectives(fileText);
        const fileTextWithoutMarkup = parse.removeErrorMarkup(fileText);
        const errorsFromMarkup = parse.parseErrorsFromMarkup(fileText);

        let program: ts.Program | undefined;
        if (hasConfig) {
            const compilerHost: ts.CompilerHost = {
                fileExists: (file) => file === fileCompileName || fs.existsSync(file),
                getCanonicalFileName: (filename) => filename,
                getCurrentDirectory: () => process.cwd(),
                getDefaultLibFileName: () => ts.getDefaultLibFileName(compilerOptions),
                getDirectories: (dir) => fs.readdirSync(dir),
                getNewLine: () => "\n",
                getSourceFile(filenameToGet, target) {
                    if (denormalizeWinPath(filenameToGet) === fileCompileName) {
                        return ts.createSourceFile(filenameToGet, fileTextWithoutMarkup, target, true);
                    }
                    if (path.basename(filenameToGet) === filenameToGet) {
                        // resolve path of lib.xxx.d.ts
                        filenameToGet = path.join(path.dirname(ts.getDefaultLibFilePath(compilerOptions)), filenameToGet);
                    }
                    const text = fs.readFileSync(filenameToGet, "utf8");
                    return ts.createSourceFile(filenameToGet, text, target, true);
                },
                readFile: (x) => x,
                useCaseSensitiveFileNames: () => true,
                writeFile: () => null,
            };

            program = ts.createProgram([fileCompileName], compilerOptions, compilerHost);
        }

        const lintOptions = {
            fix: false,
            formatter: "prose",
            formattersDirectory: "",
            rulesDirectory,
        };
        const linter = new Linter(lintOptions, program);
        // Need to use the true path (ending in '.lint') for "encoding" rule so that it can read the file.
        await linter.lint(isEncodingRule ? fileToLint : fileCompileName, fileTextWithoutMarkup, tslintConfig);
        const failures = linter.getResult().failures;
        const errorsFromLinter: LintError[] = failures.map((failure) => {
            const startLineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const endLineAndCharacter = failure.getEndPosition().getLineAndCharacter();

            return {
                endPos: {
                    col: endLineAndCharacter.character,
                    line: endLineAndCharacter.line,
                },
                message: failure.getFailure(),
                startPos: {
                    col: startLineAndCharacter.character,
                    line: startLineAndCharacter.line,
                },
            };
        });

        // test against fixed files
        let fixedFileText = "";
        let newFileText = "";
        try {
            const fixedFile = fileToLint.replace(/\.lint$/, FIXES_FILE_EXTENSION);
            const stat = fs.statSync(fixedFile);
            if (stat.isFile()) {
                fixedFileText = fs.readFileSync(fixedFile, "utf8");
                const fixes = mapDefined(failures, (f) => f.getFix());
                newFileText = Replacement.applyFixes(fileTextWithoutMarkup, fixes);
            }
        } catch (e) {
            fixedFileText = "";
            newFileText = "";
        }

        results.results[fileToLint] = {
            errorsFromLinter,
            errorsFromMarkup,
            fixesFromLinter: newFileText,
            fixesFromMarkup: fixedFileText,
            markupFromLinter: parse.createMarkupFromErrors(fileTextWithoutMarkup, errorsFromMarkup),
            markupFromMarkup: parse.createMarkupFromErrors(fileTextWithoutMarkup, errorsFromLinter),
            skipped: false,
        };
    }

    return results;
}

export function consoleTestResultsHandler(testResults: TestResult[]): boolean {
    let didAllTestsPass = true;

    for (const testResult of testResults) {
        if (!consoleTestResultHandler(testResult)) {
            didAllTestsPass = false;
        }
    }

    return didAllTestsPass;
}

export function consoleTestResultHandler(testResult: TestResult): boolean {
    // needed to get colors to show up when passing through Grunt
    (chalk as any).enabled = true;

    let didAllTestsPass = true;

    for (const fileName of Object.keys(testResult.results)) {
        const results = testResult.results[fileName];
        process.stdout.write(`${fileName}:`);

        /* tslint:disable:no-console */
        if (results.skipped) {
            console.log(chalk.yellow(` Skipped, requires typescript ${results.requirement}`));
        } else {
            const markupDiffResults = diff.diffLines(results.markupFromMarkup, results.markupFromLinter);
            const fixesDiffResults = diff.diffLines(results.fixesFromLinter, results.fixesFromMarkup);
            const didMarkupTestPass = !markupDiffResults.some((hunk) => hunk.added === true || hunk.removed === true);
            const didFixesTestPass = !fixesDiffResults.some((hunk) => hunk.added === true || hunk.removed === true);

            if (didMarkupTestPass && didFixesTestPass) {
                console.log(chalk.green(" Passed"));
            } else {
                console.log(chalk.red(" Failed!"));
                didAllTestsPass = false;
                if (!didMarkupTestPass) {
                    displayDiffResults(markupDiffResults, MARKUP_FILE_EXTENSION);
                }
                if (!didFixesTestPass) {
                    displayDiffResults(fixesDiffResults, FIXES_FILE_EXTENSION);
                }
            }
        }
        /* tslint:enable:no-console */
    }

    return didAllTestsPass;
}

function displayDiffResults(diffResults: diff.IDiffResult[], extension: string) {
    /* tslint:disable:no-console */
    console.log(chalk.green(`Expected (from ${extension} file)`));
    console.log(chalk.red("Actual (from TSLint)"));

    for (const diffResult of diffResults) {
        let color = chalk.grey;
        if (diffResult.added) {
            color = chalk.green.underline;
        } else if (diffResult.removed) {
            color = chalk.red.underline;
        }
        process.stdout.write(color(diffResult.value));
    }
    /* tslint:enable:no-console */
}
