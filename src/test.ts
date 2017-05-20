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

import * as colors from "colors";
import * as diff from "diff";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as semver from "semver";
import * as ts from "typescript";

import {Replacement} from "./language/rule/rule";
import * as Linter from "./linter";
import {LintError} from "./test/lintError";
import * as parse from "./test/parse";
import {mapDefined, readBufferWithDetectedEncoding} from "./utils";

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
        [fileName: string]: TestOutput | SkippedTest,
    };
}

export function runTests(patterns: string[], rulesDirectory?: string | string[]): TestResult[] {
    const files: string[] = [];
    for (const pattern of patterns) {
        files.push(...glob.sync(`${pattern}/tslint.json`));
    }
    return files.map((directory: string): TestResult => runTest(path.dirname(directory), rulesDirectory));
}

export function runTest(testDirectory: string, rulesDirectory?: string | string[]): TestResult {
    // needed to get colors to show up when passing through Grunt
    (colors as any).enabled = true;

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

        const fileBasename = path.basename(fileToLint, MARKUP_FILE_EXTENSION);
        const fileCompileName = fileBasename.replace(/\.lint$/, "");
        let fileText = isEncodingRule ? readBufferWithDetectedEncoding(fs.readFileSync(fileToLint)) : fs.readFileSync(fileToLint, "utf-8");
        const tsVersionRequirement = parse.getTypescriptVersionRequirement(fileText);
        if (tsVersionRequirement !== undefined) {
            const tsVersion = new semver.SemVer(ts.version);
            // remove prerelease suffix when matching to allow testing with nightly builds
            if (!semver.satisfies(`${tsVersion.major}.${tsVersion.minor}.${tsVersion.patch}`, tsVersionRequirement)) {
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
        const fileTextWithoutMarkup = parse.removeErrorMarkup(fileText);
        const errorsFromMarkup = parse.parseErrorsFromMarkup(fileText);

        let program: ts.Program | undefined;
        if (hasConfig) {
            const compilerHost: ts.CompilerHost = {
                fileExists: () => true,
                getCanonicalFileName: (filename: string) => filename,
                getCurrentDirectory: () => "",
                getDefaultLibFileName: () => ts.getDefaultLibFileName(compilerOptions),
                getDirectories: (_path: string) => [],
                getNewLine: () => "\n",
                getSourceFile(filenameToGet: string) {
                    const target = compilerOptions.target === undefined ? ts.ScriptTarget.ES5 : compilerOptions.target;
                    if (filenameToGet === ts.getDefaultLibFileName(compilerOptions)) {
                        const fileContent = fs.readFileSync(ts.getDefaultLibFilePath(compilerOptions), "utf8");
                        return ts.createSourceFile(filenameToGet, fileContent, target);
                    } else if (filenameToGet === fileCompileName) {
                        return ts.createSourceFile(fileBasename, fileTextWithoutMarkup, target, true);
                    } else if (fs.existsSync(path.resolve(path.dirname(fileToLint), filenameToGet))) {
                        const text = fs.readFileSync(path.resolve(path.dirname(fileToLint), filenameToGet), "utf8");
                        return ts.createSourceFile(filenameToGet, text, target, true);
                    }
                    throw new Error(`Couldn't get source file '${filenameToGet}'`);
                },
                readFile: (x: string) => x,
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
        linter.lint(isEncodingRule ? fileToLint : fileBasename, fileTextWithoutMarkup, tslintConfig);
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
    let didAllTestsPass = true;

    for (const fileName of Object.keys(testResult.results)) {
        const results = testResult.results[fileName];
        process.stdout.write(`${fileName}:`);

        /* tslint:disable:no-console */
        if (results.skipped) {
            console.log(colors.yellow(` Skipped, requires typescript ${results.requirement}`));
        } else {
            const markupDiffResults = diff.diffLines(results.markupFromMarkup, results.markupFromLinter);
            const fixesDiffResults = diff.diffLines(results.fixesFromLinter, results.fixesFromMarkup);
            const didMarkupTestPass = !markupDiffResults.some((diff) => diff.added === true || diff.removed === true);
            const didFixesTestPass = !fixesDiffResults.some((diff) => diff.added === true || diff.removed === true);

            if (didMarkupTestPass && didFixesTestPass) {
                console.log(colors.green(" Passed"));
            } else {
                console.log(colors.red(" Failed!"));
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
    console.log(colors.green(`Expected (from ${extension} file)`));
    console.log(colors.red("Actual (from TSLint)"));

    for (const diffResult of diffResults) {
        let color = colors.grey;
        if (diffResult.added === true) {
            color = colors.green.underline;
        } else if (diffResult.removed === true) {
            color = colors.red.underline;
        }
        process.stdout.write(color(diffResult.value));
    }
    /* tslint:enable:no-console */
}
