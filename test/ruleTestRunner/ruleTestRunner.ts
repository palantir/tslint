/*
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

import * as diff from "diff";
import * as colors from "colors";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";

import * as Linter from "../../src/tslint";
import * as parse from "./modules/parse";
import {LintError, FILE_EXTENSION} from "./modules/types";

// needed to get colors to show up when passing through Grunt
(colors as any).enabled = true;

console.log();
console.log(colors.underline("Testing Lint Rules:"));

let hadTestFailure = false;
const testDirectories = glob.sync("test/rules/**/tslint.json").map(path.dirname);

for (const testDirectory of testDirectories) {
    const filesToLint = glob.sync(path.join(testDirectory, `**/*${FILE_EXTENSION}`));
    const tslintConfig = JSON.parse(fs.readFileSync(path.join(testDirectory, "tslint.json"), "utf8"));

    for (const fileToLint of filesToLint) {
        process.stdout.write(`${fileToLint}:`);

        const baseFilename = path.basename(fileToLint, ".linttest");
        const fileData = fs.readFileSync(fileToLint, "utf8");
        const fileDataWithoutMarkup = parse.removeErrorMarkup(fileData);
        const errorsFromMarkup = parse.parseErrorsFromMarkup(fileData);

        const options = {
            configuration: tslintConfig,
            formatter: "prose",
            formattersDirectory: "",
            rulesDirectory: "",
        };

        const linter = new Linter(baseFilename, fileDataWithoutMarkup, options);
        const errorsFromLinter: LintError[] = linter.lint().failures.map((failure) => {
            const startCol = failure.getStartPosition().getLineAndCharacter().character;
            const startLine = failure.getStartPosition().getLineAndCharacter().line;
            const endCol = failure.getEndPosition().getLineAndCharacter().character;
            const endLine = failure.getEndPosition().getLineAndCharacter().line;

            return {
                endPos: { col: endCol, line: endLine },
                message: failure.getFailure(),
                startPos: { col: startCol, line: startLine },
            };
        });

        const markupFromMarkup = parse.createMarkupFromErrors(fileDataWithoutMarkup, errorsFromMarkup);
        const markupFromLinter = parse.createMarkupFromErrors(fileDataWithoutMarkup, errorsFromLinter);

        const diffResults = diff.diffLines(markupFromMarkup, markupFromLinter);
        const didTestPass = !diffResults.some((diff) => diff.added || diff.removed);

        if (didTestPass) {
            console.log(colors.green(" Passed"));
        } else {
            console.log(colors.red(" Failed!"));
            console.log(colors.red("Expected (from .linttest file)"));
            console.log(colors.green("Actual (from TSLint)"));

            hadTestFailure = true;

            for (const diffResult of diffResults) {
                let text: string;
                if (diffResult.added) {
                    text = colors.green(diffResult.value);
                } else if (diffResult.removed) {
                    text = colors.red(diffResult.value);
                } else {
                    text = colors.gray(diffResult.value);
                }
                process.stdout.write(text);
            }
        }

     }
 }

if (hadTestFailure) {
    process.exit(1);
}
