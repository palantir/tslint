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

type RegexConfig = Record<string, Casing>;

type SimpleConfig = Casing;

type Config = SimpleConfig | RegexConfig;

type ValidationResult = Casing | undefined;

type Validator<T extends Config> = (sourceFile: ts.SourceFile, casing: T) => ValidationResult;

const rules = [Casing.CamelCase, Casing.PascalCase, Casing.KebabCase, Casing.SnakeCase];

const validCasingOptions = new Set(rules);

function isCorrectCasing(fileName: string, casing: Casing): boolean {
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

const getValidRegExp = (regExpString: string): RegExp | undefined => {
    try {
        return RegExp(regExpString, "i");
    } catch {
        return undefined;
    }
};

const validateWithRegexConfig: Validator<RegexConfig> = (sourceFile, casingConfig) => {
    const fileBaseName = path.parse(sourceFile.fileName).base;

    const fileNameMatches = Object.keys(casingConfig);
    if (fileNameMatches.length === 0) {
        Rule.showWarning(`At least one file name match must be provided`);
        return undefined;
    }

    for (const rawMatcher of fileNameMatches) {
        const regex = getValidRegExp(rawMatcher);
        if (regex === undefined) {
            Rule.showWarning(`Invalid regular expression provided: ${rawMatcher}`);
            continue;
        }

        const casing = casingConfig[rawMatcher];
        if (!validCasingOptions.has(casing)) {
            Rule.showWarning(`Unexpected casing option provided: ${casing}`);
            continue;
        }

        if (!regex.test(fileBaseName)) {
            continue;
        }

        return isCorrectCasing(fileBaseName, casing) ? undefined : casing;
    }

    return undefined;
};

const validateWithSimpleConfig: Validator<SimpleConfig> = (sourceFile, casingConfig) => {
    if (!validCasingOptions.has(casingConfig)) {
        Rule.showWarning(`Unexpected casing option provided: ${casingConfig}`);
        return undefined;
    }

    const fileName = path.parse(sourceFile.fileName).name;
    const isValid = isCorrectCasing(fileName, casingConfig);

    return isValid ? undefined : casingConfig;
};

const validate = (
    sourceFile: ts.SourceFile,
    casingConfig: Config | undefined,
): ValidationResult | undefined => {
    if (casingConfig === undefined) {
        Rule.showWarning("Provide a rule option as string or object");
        return undefined;
    }

    if (typeof casingConfig === "string") {
        return validateWithSimpleConfig(sourceFile, casingConfig);
    }

    if (typeof casingConfig === "object") {
        return validateWithRegexConfig(sourceFile, casingConfig);
    }

    Rule.showWarning("Received unexpected rule option");
    return undefined;
};

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "file-name-casing",
        description: "Enforces a consistent file naming convention",
        rationale: "Helps maintain a consistent style across a file hierarchy",
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`${Casing.CamelCase}\`: File names must be camel-cased: \`fileName.ts\`.
            * \`${Casing.PascalCase}\`: File names must be Pascal-cased: \`FileName.ts\`.
            * \`${Casing.KebabCase}\`: File names must be kebab-cased: \`file-name.ts\`.
            * \`${Casing.SnakeCase}\`: File names must be snake-cased: \`file_name.ts\`.

            Or an object, where the key represents a regular expression that
            matches the file name, and the value is the file name rule from
            the previous list.

            * \{ \".tsx\": \"${Casing.PascalCase}\", \".ts\": \"${Casing.CamelCase}\" \}
        `,
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "array",
                        items: [
                            {
                                type: "string",
                                enum: rules,
                            },
                        ],
                    },
                    {
                        type: "object",
                        additionalProperties: {
                            type: "string",
                            enum: rules,
                        },
                        minProperties: 1,
                    },
                ],
            },
        },
        optionExamples: [
            [true, Casing.CamelCase],
            [true, Casing.PascalCase],
            [true, Casing.KebabCase],
            [true, Casing.SnakeCase],
            [
                true,
                {
                    ".tsx": Casing.PascalCase,
                    ".ts": Casing.CamelCase,
                },
            ],
            [
                true,
                {
                    ".style.ts": Casing.KebabCase,
                    ".tsx": Casing.PascalCase,
                    ".*": Casing.CamelCase,
                },
            ],
        ],
        hasFix: false,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static showWarning(message: string): void {
        showWarningOnce(`Warning: ${Rule.metadata.ruleName} - ${message}`);
    }

    private static FAILURE_STRING(expectedCasing: Casing): string {
        return `File name must be ${Rule.stylizedNameForCasing(expectedCasing)}`;
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

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (this.ruleArguments.length !== 1) {
            return [];
        }

        const casingConfig = this.ruleArguments[0] as Config | undefined;
        const validation = validate(sourceFile, casingConfig);

        return validation === undefined
            ? []
            : [
                  new Lint.RuleFailure(
                      sourceFile,
                      0,
                      0,
                      Rule.FAILURE_STRING(validation),
                      this.ruleName,
                  ),
              ];
    }
}
