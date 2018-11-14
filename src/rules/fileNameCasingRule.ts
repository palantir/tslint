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
    SnakeCase = "snake-case",
}

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
            * \`${Casing.SnakeCase}\`: File names must be snake-cased: \`file_name.ts\`.`,
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                    enum: [Casing.CamelCase, Casing.PascalCase, Casing.KebabCase, Casing.SnakeCase],
                },
            ],
        },
        optionExamples: [
            [true, Casing.CamelCase],
            [true, Casing.PascalCase],
            [true, Casing.KebabCase],
            [true, Casing.SnakeCase],
        ],
        hasFix: false,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

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

    private static isCorrectCasing(fileName: string, casing: Casing): boolean {
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

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (this.ruleArguments.length !== 1) {
            return [];
        }

        const casing = this.ruleArguments[0] as Casing;
        const fileName = path.parse(sourceFile.fileName).name;
        if (!Rule.isCorrectCasing(fileName, casing)) {
            return [
                new Lint.RuleFailure(sourceFile, 0, 0, Rule.FAILURE_STRING(casing), this.ruleName),
            ];
        }

        return [];
    }
}
