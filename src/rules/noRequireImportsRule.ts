/**
 * @license
 * Copyright 2015 Palantir Technologies, Inc.
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

import { findImports, ImportKind } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_IGNORE_MODULE = "ignore-module";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-require-imports",
        description: "Disallows invocation of `require()`.",
        rationale: "Prefer the newer ES6-style imports over `require()`.",
        optionsDescription: "Not configurable.",
        options: {
            items: {
                properties: {
                    "ignore-module": {
                        type: "array",
                        items: {
                            type: "string",
                        },
                        minLength: 1,
                    },
                },
                type: "object",
            },
            maxLength: 1,
            minLength: 0,
            type: "array",
        },
        optionExamples: [true, [true, { [OPTION_IGNORE_MODULE]: ["\\.html$", "\\.css$"] }]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "require() style import is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const patternConfig = this.ruleArguments[0] as { "ignore-module": string[] } | undefined;
        return this.applyWithFunction(sourceFile, walk, extractIgnoreModule(patternConfig));
    }
}

function walk(ctx: Lint.WalkContext<RegExp[] | undefined>) {
    const { options: ignorePatterns, sourceFile } = ctx;
    for (const name of findImports(sourceFile, ImportKind.AllRequireLike)) {
        if (ignorePatterns === undefined || !ignoreNode(name, ignorePatterns)) {
            ctx.addFailureAtNode(name.parent!, Rule.FAILURE_STRING);
        }
    }
}

function extractIgnoreModule(patternConfig: { "ignore-module": string[] } | undefined) {
    if (patternConfig === undefined || patternConfig[OPTION_IGNORE_MODULE] === undefined) {
        return undefined;
    }

    const ignoredExpressions = [];
    for (const exp of patternConfig[OPTION_IGNORE_MODULE]) {
        ignoredExpressions.push(new RegExp(exp));
    }

    return ignoredExpressions;
}

function ignoreNode(name: ts.LiteralExpression, ignorePatterns: RegExp[]) {
    for (const ignorePattern of ignorePatterns) {
        if (ignorePattern.test(name.text)) {
            return true;
        }
    }

    return false;
}
