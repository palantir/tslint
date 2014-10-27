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
    public static DO_FAILURE_STRING = "do statements must be braced";
    public static ELSE_FAILURE_STRING = "else statements must be braced";
    public static FOR_FAILURE_STRING = "for statements must be braced";
    public static IF_FAILURE_STRING = "if statements must be braced";
    public static WHILE_FAILURE_STRING = "while statements must be braced";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new CurlyWalker(syntaxTree, this.getOptions()));
    }
}

class CurlyWalker extends Lint.RuleWalker {
    public visitForInStatement(node: TypeScript.ForInStatementSyntax): void {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForInStatement(node);
    }

    public visitForStatement(node: TypeScript.ForStatementSyntax): void {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForStatement(node);
    }

    public visitIfStatement(node: TypeScript.IfStatementSyntax): void {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.IF_FAILURE_STRING);
        }

        super.visitIfStatement(node);
    }

    public visitElseClause(node: TypeScript.ElseClauseSyntax): void {
        if (node.statement.kind() !== TypeScript.SyntaxKind.IfStatement &&
            !this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.ELSE_FAILURE_STRING);
        }

        super.visitElseClause(node);
    }

    public visitDoStatement(node: TypeScript.DoStatementSyntax): void {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.DO_FAILURE_STRING);
        }

        super.visitDoStatement(node);
    }

    public visitWhileStatement(node: TypeScript.WhileStatementSyntax): void {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.WHILE_FAILURE_STRING);
        }

        super.visitWhileStatement(node);
    }

    private isStatementBraced(node: TypeScript.IStatementSyntax): boolean {
        var childCount = TypeScript.childCount(node);
        if (childCount === 3) {
            if (TypeScript.childAt(node, 0).kind() === TypeScript.SyntaxKind.FirstPunctuation &&
                TypeScript.childAt(node, 1).kind() === TypeScript.SyntaxKind.List &&
                TypeScript.childAt(node, 2).kind() === TypeScript.SyntaxKind.CloseBraceToken) {

                return true;
            }
        }

        return false;
    }

    private addFailureForNode(node: TypeScript.ISyntaxElement, failure: string) {
        var leadingWidth = TypeScript.leadingTriviaWidth(node);
        var start = this.getPosition() + leadingWidth;
        var end = TypeScript.width(node);

        this.addFailure(this.createFailure(start, end, failure));
    }
}
