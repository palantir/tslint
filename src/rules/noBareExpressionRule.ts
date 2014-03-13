/*
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

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "expected an assignment or function call and instead saw an expression";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new BareExpressionWalker(syntaxTree, this.getOptions()));
    }
}

class BareExpressionWalker extends Lint.RuleWalker {
    private expressionIsBare: boolean;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);
        this.expressionIsBare = true;
    }

    public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax) {
        this.expressionIsBare = true;
        var position = this.position() + node.leadingTriviaWidth();
        super.visitExpressionStatement(node);
        if (this.expressionIsBare) {
            this.addFailure(this.createFailure(position, node.width(), Rule.FAILURE_STRING));
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
                this.expressionIsBare = false;
                break;
            default:
                this.expressionIsBare = true;
        }
    }

    public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax) {
        super.visitPrefixUnaryExpression(node);
        switch (node.kind()) {
            case TypeScript.SyntaxKind.PreIncrementExpression:
            case TypeScript.SyntaxKind.PreDecrementExpression:
                this.expressionIsBare = false;
                break;
            default:
                this.expressionIsBare = true;
        }
    }

    public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax) {
        super.visitPostfixUnaryExpression(node);
        switch (node.kind()) {
            case TypeScript.SyntaxKind.PostIncrementExpression:
            case TypeScript.SyntaxKind.PostDecrementExpression:
                this.expressionIsBare = false;
                break;
            default: // there currently aren't any other postfix unary expressions, but leave this here for completeness
                this.expressionIsBare = true;
        }
    }

    public visitBlock(node: TypeScript.BlockSyntax) {
        super.visitBlock(node);
        this.expressionIsBare = true;
    }

    public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax) {
        super.visitSimpleArrowFunctionExpression(node);
        this.expressionIsBare = true;
    }

    public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax) {
        super.visitParenthesizedArrowFunctionExpression(node);
        this.expressionIsBare = true;
    }

    public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax) {
        super.visitInvocationExpression(node);
        this.expressionIsBare = false;
    }

    public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax) {
        this.visitNodeOrToken(node.condition);
        this.expressionIsBare = true;
        this.visitToken(node.questionToken);
        this.visitNodeOrToken(node.whenTrue);
        var firstExpressionIsBare = this.expressionIsBare;
        this.expressionIsBare = true;
        this.visitToken(node.colonToken);
        this.visitNodeOrToken(node.whenFalse);
        var secondExpressionIsBare = this.expressionIsBare;
        // if either expression is bare, then that expression's branch is a no-op unless it's
        // being assigned to something or passed to a function, so consider the entire expression bare
        this.expressionIsBare = firstExpressionIsBare || secondExpressionIsBare;
    }

}
