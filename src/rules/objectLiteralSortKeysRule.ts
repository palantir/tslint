/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

import { isObjectLiteralExpression, isSameLine } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_IGNORE_CASE = "ignore-case";

interface Options {
    ignoreCase: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-sort-keys",
        description: "Requires keys in object literals to be sorted alphabetically",
        rationale: "Useful in preventing merge conflicts",
        optionsDescription: `You may optionally pass "${OPTION_IGNORE_CASE}" to compare keys case insensitive.`,
        options: {
            type: "string",
            enum: [OPTION_IGNORE_CASE],
        },
        optionExamples: [
            true,
            [true, OPTION_IGNORE_CASE],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(name: string) {
        return `The key '${name}' is not sorted alphabetically`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            ignoreCase: this.ruleArguments.indexOf(OPTION_IGNORE_CASE) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isObjectLiteralExpression(node) && node.properties.length > 1 &&
            !isSameLine(ctx.sourceFile, node.properties.pos, node.end)) {
            let lastKey: string | undefined;
            const {options: {ignoreCase}} = ctx;
            outer: for (const property of node.properties) {
                switch (property.kind) {
                    case ts.SyntaxKind.SpreadAssignment:
                        lastKey = undefined; // reset at spread
                        break;
                    case ts.SyntaxKind.ShorthandPropertyAssignment:
                    case ts.SyntaxKind.PropertyAssignment:
                        if (property.name.kind === ts.SyntaxKind.Identifier ||
                            property.name.kind === ts.SyntaxKind.StringLiteral) {
                            const key = ignoreCase ? property.name.text.toLowerCase() : property.name.text;
                            // comparison with undefined is expected
                            if (lastKey! > key) {
                                ctx.addFailureAtNode(property.name, Rule.FAILURE_STRING_FACTORY(property.name.text));
                                break outer; // only show warning on first out-of-order property
                            }
                            lastKey = key;
                        }
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}
