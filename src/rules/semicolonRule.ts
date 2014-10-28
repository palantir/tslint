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
    public static FAILURE_STRING = "missing semicolon";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new SemicolonWalker(syntaxTree, this.getOptions()));
    }
}

class SemicolonWalker extends Lint.RuleWalker {
    public visitVariableStatement(node: TypeScript.VariableStatementSyntax) {
        var position = this.positionAfter(node.modifiers, node.variableDeclaration);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitVariableStatement(node);
    }

    public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax) {
        var position = this.positionAfter(node.expression);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitExpressionStatement(node);
    }

    public visitReturnStatement(node: TypeScript.ReturnStatementSyntax) {
        var position = this.positionAfter(node.returnKeyword, node.expression);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitReturnStatement(node);
    }

    public visitBreakStatement(node: TypeScript.BreakStatementSyntax) {
        var position = this.positionAfter(node.breakKeyword, node.identifier);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitBreakStatement(node);
    }

    public visitContinueStatement(node: TypeScript.ContinueStatementSyntax) {
        var position = this.positionAfter(node.continueKeyword, node.identifier);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitContinueStatement(node);
    }

    public visitThrowStatement(node: TypeScript.ThrowStatementSyntax) {
        var position = this.positionAfter(node.throwKeyword, node.expression);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitThrowStatement(node);
    }

    public visitDoStatement(node: TypeScript.DoStatementSyntax) {
        var position = this.positionAfter(node.doKeyword,
                                          node.statement,
                                          node.whileKeyword,
                                          node.openParenToken,
                                          node.condition,
                                          node.closeParenToken);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitDoStatement(node);
    }

    public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax) {
        var position = this.positionAfter(node.debuggerKeyword);
        this.checkSemicolonAt(node.semicolonToken, position);

        super.visitDebuggerStatement(node);
    }

    private checkSemicolonAt(token: TypeScript.ISyntaxToken, position: number) {
        // if there is a semi-colon token, just return
        if (token != null) {
            return;
        }

        // otherwise, add a failure at the given position
        var adjustedPosition = (position <= this.getLimit()) ? position - 1 : position;
        this.addFailure(this.createFailure(adjustedPosition, 0, Rule.FAILURE_STRING));
    }
}
