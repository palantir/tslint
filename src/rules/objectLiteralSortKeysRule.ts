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

import {
    isComputedPropertyName,
    isObjectLiteralExpression,
    isSameLine,
    isShorthandPropertyAssignment,
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

const OPTION_CHECK_SINGLE_LINE = "check-single-line";
const OPTION_IGNORE_CASE = "ignore-case";
const OPTION_SHORTHAND_FIRST = "shorthand-first";

interface IOptions {
    checkSingleLine: boolean;
    ignoreCase: boolean;
    shorthandFirst: boolean;
}

type SortableProperty = ts.PropertyAssignment | ts.ShorthandPropertyAssignment;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-sort-keys",
        description: "Requires keys in object literals to be sorted alphabetically",
        rationale: Lint.Utils.dedent`
            Keeping object literal properties alphabetized can be useful in ensuring
            consistency and can help prevent merge conflicts. In addition, grouping
            shorthand properties first can improve readability and help prevent errors.`,
        optionsDescription: Lint.Utils.dedent`
            Three arguments may be optionally provided:

            * \`"${OPTION_CHECK_SINGLE_LINE}"\`: Check objects defined on a single line.
            * \`"${OPTION_IGNORE_CASE}"\`: Ignore case when comparing keys.
            * \`"${OPTION_SHORTHAND_FIRST}"\`: Enforces shorthand properties appear first.
        `,
        options: {
            type: "array",
            items: {
                enum: [
                    OPTION_CHECK_SINGLE_LINE,
                    OPTION_IGNORE_CASE,
                    OPTION_SHORTHAND_FIRST,
                ],
                type: "string",
            },
            additionalItems: false,
            minLength: 0,
            maxLength: 3,
        },
        optionExamples: [
            true,
            [true, OPTION_IGNORE_CASE],
            [true, OPTION_IGNORE_CASE, OPTION_SHORTHAND_FIRST],
            [true, OPTION_CHECK_SINGLE_LINE, OPTION_IGNORE_CASE, OPTION_SHORTHAND_FIRST],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static SHORTHAND_FAILURE_FACTORY(name: string) {
        return `Shorthand property '${name}' should come before normal properties`;
    }

    public static ALHPA_FAILURE_FACTORY(name: string) {
        return `The key '${name}' is not sorted alphabetically`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

function parseOptions(ruleArgs: any[]): IOptions {
    const options: IOptions = {
        checkSingleLine: ruleArgs.indexOf(OPTION_CHECK_SINGLE_LINE) !== -1,
        ignoreCase: ruleArgs.indexOf(OPTION_IGNORE_CASE) !== -1,
        shorthandFirst: ruleArgs.indexOf(OPTION_SHORTHAND_FIRST) !== -1,
    };
    return options;
}

function walk(ctx: Lint.WalkContext<IOptions>) {
    const { options, sourceFile } = ctx;
    const { checkSingleLine, ignoreCase, shorthandFirst } = options;

    function canCheckNode(node: ts.Node) {
        // Only check object literals with at least one key
        if (!isObjectLiteralExpression(node) || node.properties.length <= 1) {
            return false;
        }

        // Only check single-line object literals if explicitly asked
        if (!checkSingleLine && isSameLine(sourceFile, node.properties.pos, node.end)) {
            return false;
        }

        return true;
    }

    function shouldCheckSyntax(currentProperty: SortableProperty, lastProperty?: SortableProperty) {
        // Only check syntax if option is set, we have a property to check ,and they changed
        if (!shorthandFirst || lastProperty === undefined) {
            return false;
        }
        return currentProperty.kind !== lastProperty.kind;
    }

    function cb(node: ts.Node): void {
        if (!canCheckNode(node)) {
            return ts.forEachChild(node, cb);
        }

        let lastKey: string | undefined;  // to look back for spelling
        let lastProperty: SortableProperty | undefined; // to look back for assignment

        const { properties } = node as ts.ObjectLiteralExpression;
        outer: for (const property of properties) {
            // Only evaluate properties that apply
            switch (property.kind) {
                // Restart ordering after spread assignments
                case ts.SyntaxKind.SpreadAssignment:
                    lastKey = undefined;
                    lastProperty = undefined;
                    break;

                case ts.SyntaxKind.ShorthandPropertyAssignment:
                case ts.SyntaxKind.PropertyAssignment:
                    // Don't try to sort computed properties
                    const propName = property.name;
                    if (isComputedPropertyName(propName)) {
                        break;
                    }

                    // Set the values to compare
                    const propText = propName.text;
                    const key = ignoreCase ? propText.toLowerCase() : propText;

                    if (shouldCheckSyntax(property, lastProperty)) {
                        // Syntax changed and it's shorthand now, so we were not previously
                        if (isShorthandPropertyAssignment(property)) {
                            ctx.addFailureAtNode(propName, Rule.SHORTHAND_FAILURE_FACTORY(propText));
                            break outer;
                        }
                        // Reset the alpha keys to re-start alpha sorting by syntax
                        lastKey = key;
                        lastProperty = property;
                        break;
                    }

                    // comparison with undefined is expected
                    if (lastKey! > key) {
                        ctx.addFailureAtNode(propName, Rule.ALHPA_FAILURE_FACTORY(propText));
                        break outer;
                    }
                    lastKey = key;
                    lastProperty = property;
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(sourceFile, cb);
}
