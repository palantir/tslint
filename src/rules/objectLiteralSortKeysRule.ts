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
    isObjectLiteralExpression,
    isPropertyAssignment,
    isSameLine,
    isShorthandPropertyAssignment,
    isSpreadAssignment,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_CHECK_SINGLE_LINE = "check-single-line";
const OPTION_IGNORE_CASE = "ignore-case";

const OPTION_ORDER_SPREAD = "spread";
const OPTION_ORDER_SHORTHAND = "shorthand";
const OPTION_ORDER_LONGHAND = "longhand";

enum KEY_ORDER {
  OPTION_ORDER_SPREAD,
  OPTION_ORDER_SHORTHAND,
  OPTION_ORDER_LONGHAND,
}

const KEY_ORDER_MAP = {
    [ts.SyntaxKind.PropertyAssignment]: OPTION_ORDER_LONGHAND,
    [ts.SyntaxKind.ShorthandPropertyAssignment]: OPTION_ORDER_SHORTHAND,
    [ts.SyntaxKind.SpreadAssignment]: OPTION_ORDER_SPREAD,
};

type ORDER_OPTION = "spread" | "shorthand" | "longhand";

const BEHAVIOR_OPTIONS = {
    enum: [
        OPTION_CHECK_SINGLE_LINE,
        OPTION_IGNORE_CASE,
    ],
    type: "string",
};

const SORT_OPTIONS = {
    items: {
        enum: KEY_ORDER,
        type: "string",
    },
    maxLength: 3,
    type: "array",
};

interface IOptions {
  checkSingleLine: boolean;
  ignoreCase: boolean;
  order?: ORDER_OPTION[];
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-sort-keys",
        description: "Requires keys in object literals to be sorted as specified",
        rationale: "Useful in ensuring consistency and preventing merge conflicts",
        optionsDescription: Lint.Utils.dedent`
            Two types of options are available:

            Individual strings that control general functionality.
            Possible settings are:

            * \`"${OPTION_CHECK_SINGLE_LINE}"\`: Check objects defined on a single line.
            * \`"${OPTION_IGNORE_CASE}"\`: Ignore case when comparing keys.

            An array of strings that control ordering of properties by type.
            Possible settings are:

            * \`"${OPTION_ORDER_SPREAD}"\`: Spread assignments \`{...props}\`.
            * \`"${OPTION_ORDER_SHORTHAND}"\`: Shorthand properties \`{ isError, isValid }\`.
            * \`"${OPTION_ORDER_LONGHAND}"\`: Normal, longhand properties \`{ isError: false }\`.
        `,
        options: {
          type: "array",
          items: [BEHAVIOR_OPTIONS, SORT_OPTIONS],
          additionalItems: false,
        },
        optionExamples: [
            true,
            [true, OPTION_IGNORE_CASE],
            [true, OPTION_IGNORE_CASE, [OPTION_ORDER_SPREAD, OPTION_ORDER_SHORTHAND]],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(name: string) {
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
    };

    for (const arg of ruleArgs) {
        if (Array.isArray(arg)) {
            options.order = arg;
            break;
        }
    }

    return options;
}

function walk(ctx: Lint.WalkContext<IOptions>) {
    const { options, sourceFile } = ctx;
    const { checkSingleLine, ignoreCase, order } = options;

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

    function propertyRank(property: ts.ObjectLiteralElementLike): number {
        const propKind = KEY_ORDER_MAP[property.kind];

        if (order == undefined || propKind == undefined) {
            return -1;
        }

        return order.indexOf(propKind as ORDER_OPTION);
    }

    function cb(node: ts.Node): void {
        if (!canCheckNode(node)) {
            return ts.forEachChild(node, cb);
        }

        let lastKey: string | undefined;
        let lastRank: number | undefined;
        let lastRankKind: string | undefined;

        const { properties } = node as ts.ObjectLiteralExpression;
        for (const property of properties) {
            if (!(isPropertyAssignment(property)
                || isShorthandPropertyAssignment(property)
                || isSpreadAssignment(property))) {
                continue;
            }

            if (order != undefined) {
                const propRank = propertyRank(property);
                const hasError = lastRank !== undefined // not the first prop
                    && propRank !== -1 // have a specified order
                    && (lastRank! > propRank || lastRank! === -1); // last rank is higher order or not set

                if (hasError) {
                    let error2 = "first";
                    if (lastRankKind !== undefined) {
                      error2 = `before ${lastRankKind} properties`;
                    }

                    const error = `${order[propRank]} properties should come ${error2}`;
                    ctx.addFailureAtNode(property, error);
                    break;
                }

                if (propRank !== lastRank) {
                  lastKey = undefined;
                }

                lastRank = propRank;
                lastRankKind = KEY_ORDER_MAP[property.kind];
            }

            // Not alpha-checking spread assignments
            if (isSpreadAssignment(property)) {
              continue;
            }

            const { name: propName } = property;
            if (propName.kind === ts.SyntaxKind.ComputedPropertyName) {
                continue;
            }

            const propText = propName.text;
            const key = ignoreCase ? propText.toLowerCase() : propText;
            // comparison with undefined is expected
            if (lastKey! > key) {
                ctx.addFailureAtNode(propName, Rule.FAILURE_STRING_FACTORY(propText));
                break;
            }
            lastKey = key;
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(sourceFile, cb);
}
