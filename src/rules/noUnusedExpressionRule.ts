/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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
    isAssignmentKind,
    isBinaryExpression,
    isConditionalExpression,
    isExpressionStatement,
    isIdentifier,
    isNumericLiteral,
    isParenthesizedExpression,
    isVoidExpression,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const ALLOW_FAST_NULL_CHECKS = "allow-fast-null-checks";
const ALLOW_NEW = "allow-new";
const ALLOW_TAGGED_TEMPLATE = "allow-tagged-template";

interface Options {
    allowFastNullChecks: boolean;
    allowNew: boolean;
    allowTaggedTemplate: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused-expression",
        description: "Disallows unused expression statements.",
        descriptionDetails: Lint.Utils.dedent`
            Unused expressions are expression statements which are not assignments or function calls
            (and thus usually no-ops).`,
        rationale: Lint.Utils.dedent`
            Detects potential errors where an assignment or function call was intended.`,
        optionsDescription: Lint.Utils.dedent`
            Three arguments may be optionally provided:

            * \`${ALLOW_FAST_NULL_CHECKS}\` allows to use logical operators to perform fast null checks and perform
            method or function calls for side effects (e.g. \`e && e.preventDefault()\`).
            * \`${ALLOW_NEW}\` allows 'new' expressions for side effects (e.g. \`new ModifyGlobalState();\`.
            * \`${ALLOW_TAGGED_TEMPLATE}\` allows tagged templates for side effects (e.g. \`this.add\\\`foo\\\`;\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [ALLOW_FAST_NULL_CHECKS, ALLOW_NEW, ALLOW_TAGGED_TEMPLATE],
            },
            minLength: 0,
            maxLength: 3,
        },
        optionExamples: [true, [true, ALLOW_FAST_NULL_CHECKS]],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "unused expression, expected an assignment or function call";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            allowFastNullChecks: this.ruleArguments.indexOf(ALLOW_FAST_NULL_CHECKS) !== -1,
            allowNew: this.ruleArguments.indexOf(ALLOW_NEW) !== -1,
            allowTaggedTemplate: this.ruleArguments.indexOf(ALLOW_TAGGED_TEMPLATE) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    let checking = false;
    let allowFastNullChecks = true;
    return ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): boolean | undefined {
        if (checking) {
            if (isParenthesizedExpression(node) || isVoidExpression(node)) {
                return cb(node.expression);
            } else if (isConditionalExpression(node)) {
                noCheck(node.condition, cb);
                return both(node.whenTrue, node.whenFalse);
            } else if (isBinaryExpression(node)) {
                switch (node.operatorToken.kind) {
                    case ts.SyntaxKind.CommaToken:
                        if (isIndirectEval(node)) {
                            return false;
                        }
                        return both(node.left, node.right);
                    case ts.SyntaxKind.AmpersandAmpersandToken:
                    case ts.SyntaxKind.BarBarToken:
                        if (allowFastNullChecks) {
                            noCheck(node.left, cb);
                            return cb(node.right);
                        }
                }
            }
            noCheck(node, forEachChild);
            return isUnusedExpression(node, ctx.options);
        }
        if (isExpressionStatement(node)) {
            allowFastNullChecks = ctx.options.allowFastNullChecks;
            if (!isDirective(node)) {
                check(node.expression, node);
            }
            allowFastNullChecks = true;
            return false;
        } else if (isVoidExpression(node)) {
            // allow `void 0` and `void(0)`
            if (
                !isLiteralZero(
                    isParenthesizedExpression(node.expression)
                        ? node.expression.expression
                        : node.expression,
                )
            ) {
                check(node.expression);
            }
            return false;
        } else if (
            isBinaryExpression(node) &&
            node.operatorToken.kind === ts.SyntaxKind.CommaToken &&
            !isIndirectEval(node)
        ) {
            check(node.left);
            return cb(node.right);
        }
        return ts.forEachChild(node, cb);
    }

    function forEachChild(node: ts.Node) {
        return ts.forEachChild(node, cb);
    }

    function check(node: ts.Node, failNode?: ts.Node): void {
        checking = true;
        if (cb(node)) {
            ctx.addFailureAtNode(failNode === undefined ? node : failNode, Rule.FAILURE_STRING);
        }
        checking = false;
    }

    function noCheck(node: ts.Node, callback: (node: ts.Node) => void): void {
        const old = allowFastNullChecks;
        checking = false;
        allowFastNullChecks = true;
        callback(node);
        allowFastNullChecks = old;
        checking = true;
    }

    function both(one: ts.Node, two: ts.Node): boolean {
        if (cb(one)) {
            if (cb(two)) {
                return true;
            } else {
                ctx.addFailureAtNode(one, Rule.FAILURE_STRING);
            }
        } else if (cb(two)) {
            ctx.addFailureAtNode(two, Rule.FAILURE_STRING);
        }
        return false;
    }
}

function isUnusedExpression(node: ts.Node, options: Options): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.YieldExpression:
        case ts.SyntaxKind.DeleteExpression:
        case ts.SyntaxKind.AwaitExpression:
        case ts.SyntaxKind.PostfixUnaryExpression:
            return false;
        case ts.SyntaxKind.NewExpression:
            return !options.allowNew;
        case ts.SyntaxKind.TaggedTemplateExpression:
            return !options.allowTaggedTemplate;
        case ts.SyntaxKind.BinaryExpression:
            return !isAssignmentKind((node as ts.BinaryExpression).operatorToken.kind);
        case ts.SyntaxKind.PrefixUnaryExpression:
            return (
                (node as ts.PrefixUnaryExpression).operator !== ts.SyntaxKind.PlusPlusToken &&
                (node as ts.PrefixUnaryExpression).operator !== ts.SyntaxKind.MinusMinusToken
            );
        default:
            return true;
    }
}

function isLiteralZero(node: ts.Expression) {
    return isNumericLiteral(node) && node.text === "0";
}

function isIndirectEval(node: ts.BinaryExpression): boolean {
    return (
        isIdentifier(node.right) &&
        node.right.text === "eval" &&
        isLiteralZero(node.left) &&
        node.parent.kind === ts.SyntaxKind.ParenthesizedExpression &&
        node.parent.parent.kind === ts.SyntaxKind.CallExpression
    );
}

function isDirective(node: ts.ExpressionStatement) {
    if (node.expression.kind !== ts.SyntaxKind.StringLiteral || !canContainDirective(node.parent)) {
        return false;
    }

    const parent = node.parent as ts.BlockLike;
    // check if all previous statements in block are also directives
    for (let i = parent.statements.indexOf(node) - 1; i >= 0; --i) {
        const statement = parent.statements[i];
        if (
            !isExpressionStatement(statement) ||
            statement.expression.kind !== ts.SyntaxKind.StringLiteral
        ) {
            return false;
        }
    }
    return true;
}

function canContainDirective(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.SourceFile:
        case ts.SyntaxKind.ModuleBlock:
            return true;
        case ts.SyntaxKind.Block:
            switch (node.parent.kind) {
                case ts.SyntaxKind.ArrowFunction:
                case ts.SyntaxKind.FunctionExpression:
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.Constructor:
                case ts.SyntaxKind.GetAccessor:
                case ts.SyntaxKind.SetAccessor:
                    return true;
                default:
                    return false;
            }
        default:
            return false;
    }
}
