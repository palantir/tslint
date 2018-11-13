/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import * as path from "path";
import * as ts from "typescript";

import { showWarningOnce } from "../error";
import * as Lint from "../index";
import { isCamelCased, isKebabCased, isPascalCased, isSnakeCased } from "../utils";

enum Casing {
    CamelCase = "camel-case",
    PascalCase = "pascal-case",
    KebabCase = "kebab-case",
    SnakeCase = "snake-case",
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "file-name-casing",
        description: "Enforces a consistent file naming convention",
        rationale: "Helps maintain a consistent style across a file hierarchy",
        optionsDescription: Lint.Utils.dedent`
            One argument which is either a string defining the file casing or an object with key values pairs
            consisting of a file name match and a corresponding casing.

            * In both cases the casing string must be one of this options:
            ** \`${Casing.CamelCase}\`: File names must be camel-cased: \`fileName.ts\`.
            ** \`${Casing.PascalCase}\`: File names must be pascal-cased: \`FileName.ts\`.
            ** \`${Casing.KebabCase}\`: File names must be kebab-cased: \`file-name.ts\`.
            ** \`${Casing.SnakeCase}\`: File names must be snake-cased: \`file_name.ts\`.

            * The key of the object option be a case-insenstive regular expression to match files,
            the second item must be a valid casing option for these files (see above)`,
        options: {
            oneOf: [
                {
                    type: "string",
                    enum: [Casing.CamelCase, Casing.PascalCase, Casing.KebabCase, Casing.SnakeCase],
                },
                {
                    type: "object",
                    additionalProperties: {
                        type: "string",
                        enum: [
                            Casing.CamelCase,
                            Casing.PascalCase,
                            Casing.KebabCase,
                            Casing.SnakeCase,
                        ],
                    },
                    minProperties: 1,
                },
            ],
        },
        optionExamples: [
            [true, Casing.CamelCase],
            [true, Casing.PascalCase],
            [true, Casing.KebabCase],
            [true, Casing.SnakeCase],
            [
                true,
                {
                    ".style.ts$": Casing.KebabCase,
                    ".tsx$": Casing.PascalCase,
                    ".*": Casing.CamelCase,
                },
            ],
        ],
        hasFix: false,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    private static readonly validCasingOptions = new Set([
        Casing.CamelCase,
        Casing.KebabCase,
        Casing.PascalCase,
        Casing.SnakeCase,
    ]);

    private static FAILURE_STRING(expectedCasing: Casing): string {
        return `File name must be ${Rule.stylizedNameForCasing(expectedCasing)}`;
    }

    private static isValidCasingOption(casing: string): boolean {
        return Rule.validCasingOptions.has(casing as Casing);
    }

    private static stylizedNameForCasing(casing: Casing): string {
        switch (casing) {
            case Casing.CamelCase:
                return "camelCase";
            case Casing.PascalCase:
                return "PascalCase";
            case Casing.KebabCase:
                return "kebab-case";
            case Casing.SnakeCase:
                return "snake_case";
        }
    }

    private static hasFileNameCorrectCasing(fileName: string, casing: Casing): boolean {
        switch (casing) {
            case Casing.CamelCase:
                return isCamelCased(fileName);
            case Casing.PascalCase:
                return isPascalCased(fileName);
            case Casing.KebabCase:
                return isKebabCased(fileName);
            case Casing.SnakeCase:
                return isSnakeCased(fileName);
        }
    }

    private static isValidRegExp(regExpString: string) {
        try {
            RegExp(regExpString);
            return true;
        } catch (e) {
            return false;
        }
    }

    private static getCasingFromStringArgument(ruleArgument: string): Casing | undefined {
        if (!Rule.isValidCasingOption(ruleArgument)) {
            Rule.showWarning(`Unexpected casing option provided: ${ruleArgument}`);
            return undefined;
        }

        return ruleArgument as Casing;
    }

    private static getCasingFromObjectArgument(
        ruleArgument: { [index: string]: string },
        fileBaseName: string,
    ): Casing | undefined {
        const fileNameMatches = Object.keys(ruleArgument);

        if (fileNameMatches.length === 0) {
            Rule.showWarning(`Atleast one file name match must be provided`);
            return undefined;
        }

        const matchingFileNameMatch = fileNameMatches.find(fileNameMatch => {
            if (!this.isValidRegExp(fileNameMatch)) {
                Rule.showWarning(`Invalid regular expression provided: ${fileNameMatch}`);
                return false;
            }

            if (!Rule.isValidCasingOption(ruleArgument[fileNameMatch])) {
                Rule.showWarning(`Unexpected casing option provided: ${ruleArgument}`);
                return false;
            }

            return RegExp(fileNameMatch, "i").test(fileBaseName);
        });

        if (matchingFileNameMatch === undefined) {
            return undefined;
        }

        return ruleArgument[matchingFileNameMatch] as Casing;
    }

    private static showWarning(message: string): void {
        showWarningOnce(`Warning: ${Rule.metadata.ruleName} - ${message}`);
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (this.ruleArguments.length !== 1) {
            Rule.showWarning("Provide a rule option as string or object");
            return [];
        }

        const ruleArgument = this.ruleArguments[0];

        let casing: Casing | undefined;

        const parsedPath = path.parse(sourceFile.fileName);

        if (typeof ruleArgument === "object") {
            const objectRuleArgument = ruleArgument as { [index: string]: string };
            casing = Rule.getCasingFromObjectArgument(objectRuleArgument, parsedPath.base);
        } else if (typeof ruleArgument === "string") {
            casing = Rule.getCasingFromStringArgument(ruleArgument);
        } else {
            Rule.showWarning("Received unexpected rule option");
            return [];
        }

        if (casing === undefined) {
            return [];
        }

        if (!Rule.hasFileNameCorrectCasing(parsedPath.name, casing)) {
            return [
                new Lint.RuleFailure(sourceFile, 0, 0, Rule.FAILURE_STRING(casing), this.ruleName),
            ];
        }

        return [];
    }
}
