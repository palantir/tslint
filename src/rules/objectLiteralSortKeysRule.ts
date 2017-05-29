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

const OPTION_CHECK_SINGLE_LINE = "check-single-line";
const OPTION_IGNORE_CASE = "ignore-case";
const OPTION_SHORTHAND_FIRST = "shorthand-first";
const OPTION_SHORTHAND_LAST = "shorthand-last";

interface Options {
    checkSingleLine: boolean;
    ignoreCase: boolean;
    shorthandFirst: boolean;
    shorthandLast: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-sort-keys",
        description: "Requires keys in object literals to be sorted alphabetically",
        rationale: "Useful in preventing merge conflicts",
        optionsDescription: Lint.Utils.dedent`
            Possible settings are:

            * \`"${OPTION_CHECK_SINGLE_LINE}"\`: Check objects defined on a single line.
            * \`"${OPTION_IGNORE_CASE}"\`: Compare keys without .
            * \`"${OPTION_SHORTHAND_FIRST}"\`: Ensure shorthand properties are placed before longhand properties.
            * \`"${OPTION_SHORTHAND_LAST}"\`: Ensure shorthand properties are placed after longhand properties.
            `,
        options: {
            type: "string",
            enum: [
                OPTION_CHECK_SINGLE_LINE,
                OPTION_IGNORE_CASE,
                OPTION_SHORTHAND_FIRST,
                OPTION_SHORTHAND_LAST,
            ],
        },
        optionExamples: [
            true,
            [true, OPTION_IGNORE_CASE],
            [true, OPTION_IGNORE_CASE, OPTION_SHORTHAND_FIRST],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static SHORTHAND_FAILURE_FACTORY(name: string, shorthandFirst: boolean) {
        if (shorthandFirst) {
            return `The key '${name}' should come before longhand assignments`;
        }
        return `The key '${name}' should come before shorthand assignments`;
    }

    public static FAILURE_STRING_FACTORY(name: string) {
        return `The key '${name}' is not sorted alphabetically`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            checkSingleLine: this.ruleArguments.indexOf(OPTION_CHECK_SINGLE_LINE) !== -1,
            ignoreCase: this.ruleArguments.indexOf(OPTION_IGNORE_CASE) !== -1,
            shorthandFirst: this.ruleArguments.indexOf(OPTION_SHORTHAND_FIRST) !== -1,
            shorthandLast: this.ruleArguments.indexOf(OPTION_SHORTHAND_LAST) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { options, sourceFile } = ctx;

    return ts.forEachChild(sourceFile, function cb(node): void {
        // Only check object literals with at least one key
        if (!isObjectLiteralExpression(node) || node.properties.length <= 1) {
            return ts.forEachChild(node, cb);
        }

        // Only check single-line object literals if explicitly asked
        if (!options.checkSingleLine && isSameLine(sourceFile, node.properties.pos, node.end)) {
            return ts.forEachChild(node, cb);
        }

        const { ignoreCase, shorthandFirst, shorthandLast } = options;
        const checkSyntaxKind = shorthandFirst || shorthandLast;

        let lastKey: string | undefined;
        let lastSyntax: ts.SyntaxKind | undefined;

        outer: for (const property of node.properties) {
            // Have we switched from shorthand/longhand
            const hasSwitched = lastSyntax !== undefined && lastSyntax !== property.kind;

            switch (property.kind) {
                // Currently not checking spread
                case ts.SyntaxKind.SpreadAssignment:
                    break;

                case ts.SyntaxKind.ShorthandPropertyAssignment:
                case ts.SyntaxKind.PropertyAssignment:
                    const propName = property.name;
                    // Only evaluate non-computed property names
                    if (propName.kind === ts.SyntaxKind.ComputedPropertyName) {
                      break outer;
                    }

                    const propText = propName.text;
                    if (checkSyntaxKind && hasSwitched) {
                        const isFailed = shorthandFirst
                            ? lastSyntax !== ts.SyntaxKind.ShorthandPropertyAssignment
                            : lastSyntax === ts.SyntaxKind.ShorthandPropertyAssignment;

                        if (isFailed) {
                            ctx.addFailureAtNode(propName, Rule.SHORTHAND_FAILURE_FACTORY(propText, shorthandFirst));
                            break outer;
                        }
                        // Switched syntax and didn't fail, start the key-checking over
                        lastKey = undefined;
                    }

                    const key = ignoreCase ? propText.toLowerCase() : propText;
                    // comparison with undefined is expected
                    if (lastKey! > key) {
                        ctx.addFailureAtNode(propName, Rule.FAILURE_STRING_FACTORY(propText));
                        break outer; // only show warning on first out-of-order property
                    }
                    lastKey = key;
                    lastSyntax = property.kind;
            }
        }
        return ts.forEachChild(node, cb);
    });
}
