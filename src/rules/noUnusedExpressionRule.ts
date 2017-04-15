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
    isAssignmentKind, isBinaryExpression, isConditionalExpression, isExpressionStatement,
    isIdentifier, isNumericLiteral, isPrefixUnaryExpression, isVoidExpression,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { unwrapParentheses } from "../language/utils";

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
            Two arguments may be optionally provided:

            * \`${ALLOW_FAST_NULL_CHECKS}\` allows to use logical operators to perform fast null checks and perform
            method or function calls for side effects (e.g. \`e && e.preventDefault()\`).
            * \`${ALLOW_NEW}\` allows 'new' expressions for side effects (e.g. \`new ModifyGlobalState();\`.
            * \`${ALLOW_TAGGED_TEMPLATE}\` allows tagged templates for side effects (e.g. \`this.add\\\`foo\\\`;\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [ALLOW_FAST_NULL_CHECKS],
            },
            minLength: 0,
            maxLength: 1,
        },
        optionExamples: [true, [true, ALLOW_FAST_NULL_CHECKS]],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "unused expression, expected an assignment or function call";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnusedExpressionWalker(sourceFile, this.ruleName, {
            allowFastNullChecks: this.ruleArguments.indexOf(ALLOW_FAST_NULL_CHECKS) !== -1,
            allowNew: this.ruleArguments.indexOf(ALLOW_NEW) !== -1,
            allowTaggedTemplate: this.ruleArguments.indexOf(ALLOW_TAGGED_TEMPLATE) !== -1,
        }));
    }
}

class NoUnusedExpressionWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isExpressionStatement(node)) {
                if (!isDirective(node) && this.isUnusedExpression(node.expression)) {
                    this.reportFailure(node);
                }
            } else if (isVoidExpression(node)) {
                // allow `void 0`
                if (!isLiteralZero(node.expression) && this.isUnusedExpression(node.expression)) {
                    this.reportFailure(node.expression);
                }
            } else if (isBinaryExpression(node)) {
                if (node.operatorToken.kind === ts.SyntaxKind.CommaToken) {
                    // allow indirect eval: `(0, eval)("code");`
                    if (!isIndirectEval(node) && this.isUnusedExpression(node.left)) {
                        this.reportFailure(node.left);
                    }
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private reportFailure(node: ts.Node) {
        const start = node.getStart(this.sourceFile);
        const end = node.end;
        // don't add a new failure if it is contained in another failure's span
        for (const failure of this.failures) {
            if (failure.getStartPosition().getPosition() <= start &&
                failure.getEndPosition().getPosition() >= end) {
                return;
            }
        }
        this.addFailure(start, end, Rule.FAILURE_STRING);
    }

    private isUnusedExpression(expression: ts.Expression): boolean {
        expression = unwrapParentheses(expression);
        switch (expression.kind) {
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.YieldExpression:
            case ts.SyntaxKind.DeleteExpression:
            case ts.SyntaxKind.AwaitExpression:
            case ts.SyntaxKind.PostfixUnaryExpression:
                return false;
            case ts.SyntaxKind.NewExpression:
                return !this.options.allowNew;
            case ts.SyntaxKind.TaggedTemplateExpression:
                return !this.options.allowTaggedTemplate;
            default:
        }
        if (isPrefixUnaryExpression(expression) &&
            (expression.operator === ts.SyntaxKind.PlusPlusToken || expression.operator === ts.SyntaxKind.MinusMinusToken)) {
            return false;
        }
        if (isConditionalExpression(expression)) {
            return this.isUnusedExpression(expression.whenTrue) || this.isUnusedExpression(expression.whenFalse);
        }
        if (isBinaryExpression(expression)) {
            const operatorKind = expression.operatorToken.kind;
            if (isAssignmentKind(operatorKind)) {
                return false;
            }
            if (this.options.allowFastNullChecks &&
                (operatorKind === ts.SyntaxKind.AmpersandAmpersandToken || operatorKind === ts.SyntaxKind.BarBarToken)) {
                return this.isUnusedExpression(expression.right);
            } else if (operatorKind === ts.SyntaxKind.CommaToken) {
                return this.isUnusedExpression(expression.left) || this.isUnusedExpression(expression.right);
            }
        }
        return true;
    }
}

function isLiteralZero(node: ts.Expression) {
    return isNumericLiteral(node) && node.text === "0";
}

function isIndirectEval(node: ts.BinaryExpression): boolean {
    return isIdentifier(node.right) && node.right.text === "eval" &&
        isLiteralZero(node.left) &&
        node.parent!.kind === ts.SyntaxKind.ParenthesizedExpression &&
        node.parent!.parent!.kind === ts.SyntaxKind.CallExpression;
}

function isDirective(node: ts.ExpressionStatement) {
    if (node.expression.kind !== ts.SyntaxKind.StringLiteral || !canContainDirective(node.parent!)) {
        return false;
    }

    const parent = node.parent as ts.BlockLike;
    // check if all previous statements in block are also directives
    for (let i = parent.statements.indexOf(node) - 1; i >= 0; --i) {
        const statement = parent.statements[i];
        if (!isExpressionStatement(statement) || statement.expression.kind !== ts.SyntaxKind.StringLiteral) {
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
            switch (node.parent!.kind) {
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
