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
import * as ts from "typescript";

import {IReplacement} from "./language/rule/rule";
import {createCompilerOptions} from "./language/utils";
import {LintError} from "./test/lintError";
import * as parse from "./test/parse";
import * as Linter from "./tslint";

const MARKUP_FILE_EXTENSION = ".lint";
const FIXES_FILE_EXTENSION = ".fix";

export interface TestResult {
    directory: string;
    results: {
        [fileName: string]: {
            errorsFromLinter: LintError[];
            errorsFromMarkup: LintError[];
            fixesFromLinter: string;
            fixesFromMarkup: string;
            markupFromLinter: string;
            markupFromMarkup: string;
        }
    };
}

export function runTest(testDirectory: string, rulesDirectory?: string | string[]): TestResult {
    const filesToLint = glob.sync(path.join(testDirectory, `**/*${MARKUP_FILE_EXTENSION}`));
    const tslintConfig = Linter.findConfiguration(path.join(testDirectory, "tslint.json"), null);
    const results: TestResult = { directory: testDirectory, results: {} };

    for (const fileToLint of filesToLint) {
        const fileBasename = path.basename(fileToLint, MARKUP_FILE_EXTENSION);
        const fileCompileName = fileBasename.replace(/\.lint$/, "");
        const fileText = fs.readFileSync(fileToLint, "utf8");
        const fileTextWithoutMarkup = parse.removeErrorMarkup(fileText);
        const errorsFromMarkup = parse.parseErrorsFromMarkup(fileText);

        let program: ts.Program;
        if (tslintConfig.linterOptions && tslintConfig.linterOptions.typeCheck) {
            const compilerOptions = createCompilerOptions();
            const compilerHost: ts.CompilerHost = {
                fileExists: () => true,
                getCanonicalFileName: (filename: string) => filename,
                getCurrentDirectory: () => "",
                getDefaultLibFileName: () => ts.getDefaultLibFileName(compilerOptions),
                getNewLine: () => "\n",
                getSourceFile: function (filenameToGet: string) {
                    if (filenameToGet === this.getDefaultLibFileName()) {
                        const fileText = fs.readFileSync(ts.getDefaultLibFilePath(compilerOptions)).toString();
                        return ts.createSourceFile(filenameToGet, fileText, compilerOptions.target);
                    } else if (filenameToGet === fileCompileName) {
                        return ts.createSourceFile(fileBasename, fileTextWithoutMarkup, compilerOptions.target, true);
                    }
                },
                readFile: () => null,
                useCaseSensitiveFileNames: () => true,
                writeFile: () => null,
            };

            program = ts.createProgram([fileCompileName], compilerOptions, compilerHost);
            // perform type checking on the program, updating nodes with symbol table references
            ts.getPreEmitDiagnostics(program);
        }

        const lintOptions = {
            configuration: tslintConfig,
            formatter: "prose",
            formattersDirectory: "",
            rulesDirectory,
        };
        const linter = new Linter(fileBasename, fileTextWithoutMarkup, lintOptions, program);
        const failures = linter.lint().failures;
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
        let fixedFileText: string;
        let newFileText: string;
        try {
            const fixedFile = fileToLint.replace(/\.lint$/, FIXES_FILE_EXTENSION);
            const stat = fs.statSync(fixedFile);
            if (stat.isFile()) {
                fixedFileText = fs.readFileSync(fixedFile, "utf8");
                // accumulate replacements
                const replacements = failures.reduce((acc, failure) => {
                    const fixes = failure.getFixes();
                    if (fixes.length > 0) {
                        return acc.concat(fixes[0].replacements);
                    } else {
                        return acc;
                    }
                }, [] as IReplacement[]);
                // sort in reverse so that diffs are properly applied
                replacements.sort((a, b) => (b.start + b.length) - (a.start + a.length));
                newFileText = replacements.reduce((acc, r) => {
                    return acc.substring(0, r.start) + r.text + acc.substring(r.start + r.length);
                }, fileTextWithoutMarkup);
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
        };
    }

    return results;
}

export function consoleTestResultHandler(testResult: TestResult): boolean {
    let didAllTestsPass = true;

    for (const fileName of Object.keys(testResult.results)) {
        const results = testResult.results[fileName];
        process.stdout.write(`${fileName}:`);

        const markupDiffResults = diff.diffLines(results.markupFromMarkup, results.markupFromLinter);
        const fixesDiffResults = diff.diffLines(results.fixesFromMarkup, results.fixesFromLinter);
        const didMarkupTestPass = !markupDiffResults.some((diff) => diff.added || diff.removed);
        const didFixesTestPass = !fixesDiffResults.some((diff) => diff.added || diff.removed);

        /* tslint:disable:no-console */
        if (didMarkupTestPass && didFixesTestPass) {
            console.log(colors.green(" Passed"));
        } else {
            console.log(colors.red(" Failed!"));
        }
        if (!didMarkupTestPass) {
            console.log(colors.green(`Expected markup (from ${MARKUP_FILE_EXTENSION} file)`));
            console.log(colors.red("Actual (from TSLint)"));

            didAllTestsPass = false;

            for (const diffResult of markupDiffResults) {
                let color = colors.grey;
                if (diffResult.added) {
                    color = colors.green;
                } else if (diffResult.removed) {
                    color = colors.red;
                }
                process.stdout.write(color(diffResult.value));
            }
        }
        if (!didFixesTestPass) {
            console.log(colors.green(`Expected fixes (from ${FIXES_FILE_EXTENSION} file)`));
            console.log(colors.red("Actual (from TSLint)"));

            didAllTestsPass = false;

            for (const diffResult of fixesDiffResults) {
                let color = colors.grey;
                if (diffResult.added) {
                    color = colors.green;
                } else if (diffResult.removed) {
                    color = colors.red;
                }
                process.stdout.write(color(diffResult.value));
            }
        }
        /* tslint:enable:no-console */
    }

    return didAllTestsPass;
}
