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

import { isCallExpression, isIdentifier, isPropertyAccessExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isNegativeNumberLiteral } from "../language/utils";

const NUMBER_METHODS = new Set(["toExponential", "toFixed", "toPrecision", "toString"]);

interface AllowedNumbersType {
    "allowed-numbers": number[];
}
interface IgnoreJsxType {
    "ignore-jsx": boolean;
}
interface ParsedOptionsType {
    "allowed-numbers": number[];
    "ignore-jsx"?: boolean;
}
type OptionsType = IgnoreJsxType | AllowedNumbersType;

const IGNORE_JSX_OPTION = "ignore-jsx";
const ALLOWED_NUMBERS_OPTION = "allowed-numbers";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-magic-numbers",
        description: Lint.Utils.dedent`
            Disallows the use constant number values outside of variable assignments.
            When no list of allowed values is specified, -1, 0 and 1 are allowed by default.`,
        rationale: Lint.Utils.dedent`
            Magic numbers should be avoided as they often lack documentation.
            Forcing them to be stored in variables gives them implicit documentation.
        `,
        optionsDescription: Lint.Utils.dedent`
            Options may either be a list of numbers to ignore (not consider 'magic'), or an object containing up to two properties:
            * \`${ALLOWED_NUMBERS_OPTION}\` as the list of numbers to ignore.
            * \`${IGNORE_JSX_OPTION}\` to specify that 'magic' numbers should be allowed as JSX attributes.`,
        options: {
            type: "array",
            items: {
                type: "number",
            },
            properties: {
                type: "object",
                [ALLOWED_NUMBERS_OPTION]: {
                    type: "array",
                },
                [IGNORE_JSX_OPTION]: {
                    type: "boolean",
                },
            },
            minLength: 1,
        },

        optionExamples: [
            [true, 1, 2, 3],
            [
                true,
                {
                    [ALLOWED_NUMBERS_OPTION]: [1, 2, 3],
                    [IGNORE_JSX_OPTION]: true,
                },
            ],
        ],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static ALLOWED_NODES = new Set<ts.SyntaxKind>([
        ts.SyntaxKind.ExportAssignment,
        ts.SyntaxKind.FirstAssignment,
        ts.SyntaxKind.LastAssignment,
        ts.SyntaxKind.PropertyAssignment,
        ts.SyntaxKind.ShorthandPropertyAssignment,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.VariableDeclarationList,
        ts.SyntaxKind.EnumMember,
        ts.SyntaxKind.PropertyDeclaration,
        ts.SyntaxKind.Parameter,
    ]);

    public static DEFAULT_ALLOWED = [-1, 0, 1];

    public static FAILURE_STRING(num: string): string {
        return `'magic numbers' are not allowed: ${num}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoMagicNumbersWalker(
                sourceFile,
                this.ruleName,
                this.ruleArguments.length > 0
                    ? parseOptions(this.ruleArguments)
                    : parseOptions(Rule.DEFAULT_ALLOWED),
            ),
        );
    }
}

function parseOptions(options: Array<OptionsType | number>): ParsedOptionsType {
    const parsedOptions: ParsedOptionsType = { [ALLOWED_NUMBERS_OPTION]: [] };
    for (const option of options) {
        if (typeof option === "number") {
            parsedOptions[ALLOWED_NUMBERS_OPTION].push(option);
            continue;
        }
        if (option.hasOwnProperty(ALLOWED_NUMBERS_OPTION)) {
            const numberOptions = (option as AllowedNumbersType)[ALLOWED_NUMBERS_OPTION];
            if (Array.isArray(numberOptions) && numberOptions.length > 0) {
                numberOptions.forEach((num: number) =>
                    parsedOptions[ALLOWED_NUMBERS_OPTION].push(num),
                );
            }
        }
        if (option.hasOwnProperty(IGNORE_JSX_OPTION)) {
            parsedOptions[IGNORE_JSX_OPTION] = (option as IgnoreJsxType)[IGNORE_JSX_OPTION];
        }
    }
    return parsedOptions;
}

class NoMagicNumbersWalker extends Lint.AbstractWalker<ParsedOptionsType | number[]> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isCallExpression(node)) {
                if (isIdentifier(node.expression) && node.expression.text === "parseInt") {
                    return node.arguments.length === 0 ? undefined : cb(node.arguments[0]);
                }

                if (
                    isPropertyAccessExpression(node.expression) &&
                    NUMBER_METHODS.has(node.expression.name.text)
                ) {
                    return;
                }
            }

            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return this.checkNumericLiteral(node, (node as ts.NumericLiteral).text);
            }
            if (isNegativeNumberLiteral(node)) {
                return this.checkNumericLiteral(
                    node,
                    `-${(node.operand as ts.NumericLiteral).text}`,
                );
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private isAllowedNumber(num: string): boolean {
        const numberOptions = (this.options as ParsedOptionsType)[ALLOWED_NUMBERS_OPTION];
        if (numberOptions.length > 0) {
            return numberOptions.some((allowedNum: number) =>
                /* Using Object.is() to differentiate between pos/neg zero */
                Object.is(allowedNum, parseFloat(num)),
            );
        }
        return false;
    }

    private checkNumericLiteral(node: ts.Node, num: string) {
        const shouldIgnoreJsxExpression =
            node.parent.kind === ts.SyntaxKind.JsxExpression &&
            (this.options as ParsedOptionsType)[IGNORE_JSX_OPTION];

        if (
            !Rule.ALLOWED_NODES.has(node.parent.kind) &&
            !this.isAllowedNumber(num) &&
            !shouldIgnoreJsxExpression
        ) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING(num));
        }
    }
}
