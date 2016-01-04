import * as colors from "colors";
import * as diff from "diff";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";

import * as Linter from "./tslint";
import * as parse from "./test/parse";
import {FILE_EXTENSION, LintError} from "./test/types";

export interface TestResult {
    directory: string;
    results: {
        [fileName: string]: {
            errorsFromMarkup: LintError[];
            errorsFromLinter: LintError[];
            markupFromLinter: string;
            markupFromMarkup: string;
        }
    };
}

export function runTest(testDirectory: string): TestResult {
    const filesToLint = glob.sync(path.join(testDirectory, `**/*${FILE_EXTENSION}`));
    const tslintConfig = JSON.parse(fs.readFileSync(path.join(testDirectory, "tslint.json"), "utf8"));
    const results: TestResult = { directory: testDirectory, results: {} };

    for (const fileToLint of filesToLint) {
        const fileBasename = path.basename(fileToLint, ".linttest");
        const fileText = fs.readFileSync(fileToLint, "utf8");
        const fileTextWithoutMarkup = parse.removeErrorMarkup(fileText);
        const errorsFromMarkup = parse.parseErrorsFromMarkup(fileText);

        const lintOptions = {
            configuration: tslintConfig,
            formatter: "prose",
            formattersDirectory: "",
            rulesDirectory: "",
        };
        const linter = new Linter(fileBasename, fileTextWithoutMarkup, lintOptions);
        const errorsFromLinter: LintError[] = linter.lint().failures.map((failure) => {
            const startLineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const endLineAndCharacter = failure.getEndPosition().getLineAndCharacter();

            return {
                endPos: { col: endLineAndCharacter.character, line: endLineAndCharacter.line },
                message: failure.getFailure(),
                startPos: { col: startLineAndCharacter.character, line: startLineAndCharacter.line },
            };
        });

        results.results[fileToLint] = {
            errorsFromMarkup,
            errorsFromLinter,
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

        const diffResults = diff.diffLines(results.markupFromMarkup, results.markupFromLinter);
        const didTestPass = !diffResults.some((diff) => diff.added || diff.removed);

        if (didTestPass) {
            console.log(colors.green(" Passed"));
        } else {
            console.log(colors.red(" Failed!"));
            console.log(colors.red("Expected (from .linttest file)"));
            console.log(colors.green("Actual (from TSLint)"));

            didAllTestsPass = false;

            for (const diffResult of diffResults) {
                let color = colors.gray;
                if (diffResult.added) {
                    color = colors.green;
                } else if (diffResult.removed) {
                    color = colors.red;
                }
                process.stdout.write(color(diffResult.value));
            }
        }
    }

    return didAllTestsPass;
}
