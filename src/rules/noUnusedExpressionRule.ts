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

import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "expected an assignment or function call";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnusedExpressionWalker(sourceFile, this.getOptions()));
    }
}

class NoUnusedExpressionWalker extends Lint.RuleWalker {
    private expressionIsUnused: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.expressionIsUnused = true;
    }

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        this.expressionIsUnused = true;
        super.visitExpressionStatement(node);
        if (this.expressionIsUnused) {
            // ignore valid unused expressions
            if (node.expression.kind === ts.SyntaxKind.StringLiteral) {
                const expressionText = node.expression.getText();
                if (expressionText === "\"use strict\"" || expressionText === "'use strict'") {
                    return;
                }
            } else if (node.expression.kind === ts.SyntaxKind.DeleteExpression || node.expression.kind === ts.SyntaxKind.YieldExpression) {
                return;
            }

            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        super.visitBinaryExpression(node);
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.EqualsToken:
            case ts.SyntaxKind.PlusEqualsToken:
            case ts.SyntaxKind.MinusEqualsToken:
            case ts.SyntaxKind.AsteriskEqualsToken:
            case ts.SyntaxKind.SlashEqualsToken:
            case ts.SyntaxKind.PercentEqualsToken:
            case ts.SyntaxKind.AmpersandEqualsToken:
            case ts.SyntaxKind.CaretEqualsToken:
            case ts.SyntaxKind.BarEqualsToken:
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        super.visitPrefixUnaryExpression(node);
        switch (node.operator) {
            case ts.SyntaxKind.PlusPlusToken:
            case ts.SyntaxKind.MinusMinusToken:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    }

    public visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        super.visitPostfixUnaryExpression(node);
        this.expressionIsUnused = false; // the only kinds of postfix expressions are postincrement and postdecrement
    }

    public visitBlock(node: ts.Block) {
        super.visitBlock(node);
        this.expressionIsUnused = true;
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        super.visitArrowFunction(node);
        this.expressionIsUnused = true;
    }

    public visitCallExpression(node: ts.CallExpression) {
        super.visitCallExpression(node);
        this.expressionIsUnused = false;
    }

    public visitConditionalExpression(node: ts.ConditionalExpression) {
        this.visitNode(node.condition);
        this.expressionIsUnused = true;
        this.visitNode(node.whenTrue);
        const firstExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = true;
        this.visitNode(node.whenFalse);
        const secondExpressionIsUnused = this.expressionIsUnused;
        // if either expression is unused, then that expression's branch is a no-op unless it's
        // being assigned to something or passed to a function, so consider the entire expression unused
        this.expressionIsUnused = firstExpressionIsUnused || secondExpressionIsUnused;
    }
}
