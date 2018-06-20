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
import { isCamelCased, isKebabCased, isPascalCased } from "../utils";

enum Casing {
    CamelCase = "camel-case",
    PascalCase = "pascal-case",
    KebabCase = "kebab-case",
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
            * \`${Casing.KebabCase}\`: File names must be kebab-cased: \`file-name.ts\`.`,
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                    enum: [Casing.CamelCase, Casing.PascalCase, Casing.KebabCase],
                },
            ],
        },
        optionExamples: [
            [true, Casing.CamelCase],
            [true, Casing.PascalCase],
            [true, Casing.KebabCase],
        ],
        hasFix: false,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(expectedCasing: string): string {
        return `File name must be ${expectedCasing}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (this.ruleArguments.length !== 1) {
            return [];
        }

        const casing = this.ruleArguments[0] as Casing;

        let isCorrectCasing = true;
        const fileName = path.parse(sourceFile.fileName).name;
        switch (casing) {
            case Casing.CamelCase:
                isCorrectCasing = isCamelCased(fileName);
                break;
            case Casing.PascalCase:
                isCorrectCasing = isPascalCased(fileName);
                break;
            case Casing.KebabCase:
                isCorrectCasing = isKebabCased(fileName);
        }

        if (!isCorrectCasing) {
            return [new Lint.RuleFailure(sourceFile, 0, 0, Rule.FAILURE_STRING(casing), this.ruleName)];
        }

        return [];
    }
}
