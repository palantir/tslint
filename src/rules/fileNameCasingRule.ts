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

import * as Lint from "../index";
import { isCamelCased, isKebabCased, isPascalCased, isSnakeCased } from "../utils";

enum Casing {
    CamelCase = "camel-case",
    PascalCase = "pascal-case",
    KebabCase = "kebab-case",
    SnakeCase = "snake-case"
}

type FileNameRegExpWithCasing = [string, Casing];
type FileNameCasings = FileNameRegExpWithCasing[];

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "file-name-casing",
        description: "Enforces a consistent file naming convention",
        rationale: "Helps maintain a consistent style across a file hierarchy",
        optionsDescription: Lint.Utils.dedent`
            One argument which is either a string defining the file casing or an array consisting of a file name
            matches and corresponding casing strings.

            * In both cases the casing string must be one of the options:
            ** \`${Casing.CamelCase}\`: File names must be camel-cased: \`fileName.ts\`.
            ** \`${Casing.PascalCase}\`: File names must be pascal-cased: \`FileName.ts\`.
            ** \`${Casing.KebabCase}\`: File names must be kebab-cased: \`file-name.ts\`.
            ** \`${Casing.SnakeCase}\`: File names must be snake-cased: \`file_name.ts\`.
        
            * The array again consists of array with two items. The first item must be a case-insenstive
            regular expression to match files, the second item must be a valid casing option (see above)`,
        options: {
            type: "list",
            listType: {
                anyOf: [
                    {
                        type: "string",
                        enum: [
                            Casing.CamelCase,
                            Casing.PascalCase,
                            Casing.KebabCase,
                            Casing.SnakeCase
                        ]
                    },
                    {
                        type: "array",
                        items: [
                            {
                                type: "string"
                            },
                            {
                                type: "string",
                                enum: [
                                    Casing.CamelCase,
                                    Casing.PascalCase,
                                    Casing.KebabCase,
                                    Casing.SnakeCase
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        optionExamples: [
            [true, Casing.CamelCase],
            [true, Casing.PascalCase],
            [true, Casing.KebabCase],
            [true, Casing.SnakeCase],
            [
                true,
                [
                    [".style.ts$", Casing.KebabCase],
                    [".tsx$", Casing.PascalCase],
                    [".*", Casing.CamelCase]
                ]
            ]
        ],
        hasFix: false,
        type: "style",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    private static FAILURE_STRING(expectedCasing: Casing): string {
        return `File name must be ${Rule.stylizedNameForCasing(expectedCasing)}`;
    }

    private static isValidCasingOption(casing: string) {
        return (
            [Casing.CamelCase, Casing.KebabCase, Casing.PascalCase, Casing.SnakeCase].indexOf(
                casing as Casing
            ) !== -1
        );
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

    private static findApplicableCasing(
        fileBaseName: string,
        fileNameCasings: FileNameCasings
    ): Casing | null {
        const applicableCasing = fileNameCasings.find(fileNameCasing => {
            const fileNameMatch = fileNameCasing[0];
            return (
                Rule.isValidRegExp(fileNameMatch) && RegExp(fileNameMatch, "i").test(fileBaseName)
            );
        });

        return applicableCasing !== undefined ? applicableCasing[1] : null;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (this.ruleArguments.length !== 1) {
            return [];
        }

        let casing: Casing | null = null;

        const parsedPath = path.parse(sourceFile.fileName);

        if (typeof this.ruleArguments[0] === "object") {
            casing = Rule.findApplicableCasing(parsedPath.base, this
                .ruleArguments[0] as FileNameCasings);
        } else if (typeof this.ruleArguments[0] === "string") {
            casing = this.ruleArguments[0] as Casing;
        }

        if (casing === null || !Rule.isValidCasingOption(casing)) {
            return [];
        }

        if (!Rule.hasFileNameCorrectCasing(parsedPath.name, casing)) {
            return [
                new Lint.RuleFailure(sourceFile, 0, 0, Rule.FAILURE_STRING(casing), this.ruleName)
            ];
        }

        return [];
    }
}
