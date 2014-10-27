/*
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

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "expected an assignment or function call";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new UnusedExpressionWalker(syntaxTree, this.getOptions()));
    }
}

class UnusedExpressionWalker extends Lint.RuleWalker {
    private expressionIsUnused: boolean;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);
        this.expressionIsUnused = true;
    }

    public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax) {
        this.expressionIsUnused = true;
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        super.visitExpressionStatement(node);
        if (this.expressionIsUnused) {
            // ignore valid unused expressions
            if (node.expression.kind() === TypeScript.SyntaxKind.StringLiteral) {
                var expressionText = (<TypeScript.ISyntaxToken> node.expression).text();
                if (expressionText === "\"use strict\"" || expressionText === "'use strict'") {
                    return;
                }
            } else if (node.expression.kind() === TypeScript.SyntaxKind.DeleteExpression) {
                return;
            }

            this.addFailure(this.createFailure(position, TypeScript.width(node), Rule.FAILURE_STRING));
        }
    }

    public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax) {
        super.visitBinaryExpression(node);
        switch (node.kind()) {
            case TypeScript.SyntaxKind.AssignmentExpression:
            case TypeScript.SyntaxKind.AddAssignmentExpression:
            case TypeScript.SyntaxKind.SubtractAssignmentExpression:
            case TypeScript.SyntaxKind.MultiplyAssignmentExpression:
            case TypeScript.SyntaxKind.DivideAssignmentExpression:
            case TypeScript.SyntaxKind.ModuloAssignmentExpression:
            case TypeScript.SyntaxKind.AndAssignmentExpression:
            case TypeScript.SyntaxKind.ExclusiveOrAssignmentExpression:
            case TypeScript.SyntaxKind.OrAssignmentExpression:
            case TypeScript.SyntaxKind.LeftShiftAssignmentExpression:
            case TypeScript.SyntaxKind.SignedRightShiftAssignmentExpression:
            case TypeScript.SyntaxKind.UnsignedRightShiftAssignmentExpression:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    }

    public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax) {
        super.visitPrefixUnaryExpression(node);
        switch (node.kind()) {
            case TypeScript.SyntaxKind.PreIncrementExpression:
            case TypeScript.SyntaxKind.PreDecrementExpression:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    }

    public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax) {
        super.visitPostfixUnaryExpression(node);
        this.expressionIsUnused = false; // the only kinds of postfix expressions are postincrement and postdecrement
    }

    public visitBlock(node: TypeScript.BlockSyntax) {
        super.visitBlock(node);
        this.expressionIsUnused = true;
    }

    public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax) {
        super.visitSimpleArrowFunctionExpression(node);
        this.expressionIsUnused = true;
    }

    public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax) {
        super.visitParenthesizedArrowFunctionExpression(node);
        this.expressionIsUnused = true;
    }

    public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax) {
        super.visitInvocationExpression(node);
        this.expressionIsUnused = false;
    }

    public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax) {
        this.visitNodeOrToken(node.condition);
        this.expressionIsUnused = true;
        this.visitToken(node.questionToken);
        this.visitNodeOrToken(node.whenTrue);
        var firstExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = true;
        this.visitToken(node.colonToken);
        this.visitNodeOrToken(node.whenFalse);
        var secondExpressionIsUnused = this.expressionIsUnused;
        // if either expression is unused, then that expression's branch is a no-op unless it's
        // being assigned to something or passed to a function, so consider the entire expression unused
        this.expressionIsUnused = firstExpressionIsUnused || secondExpressionIsUnused;
    }

}
