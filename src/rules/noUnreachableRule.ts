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
    public static FAILURE_STRING = "unreachable code";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new UnreachableWalker(syntaxTree, this.getOptions()));
    }
}

class UnreachableWalker extends Lint.RuleWalker {
    private hasReturned: boolean;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);
        this.hasReturned = false;
    }

    public visitNode(node: TypeScript.SyntaxNode): void {
        var previousReturned = this.hasReturned;
        // function declarations can be hoisted -- so set hasReturned to false until we're done with the function
        if (node.kind() === TypeScript.SyntaxKind.FunctionDeclaration) {
            this.hasReturned = false;
        }

        if (this.hasReturned) {
            this.hasReturned = false;
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            this.addFailure(this.createFailure(position, TypeScript.width(node), Rule.FAILURE_STRING));
        }

        super.visitNode(node);

        // if there is further code after the hoisted function and we returned before that code is unreachable
        // so reset hasReturned to its previous state to check for that
        if (node.kind() === TypeScript.SyntaxKind.FunctionDeclaration) {
            this.hasReturned = previousReturned;
        }
    }

    public visitBlock(node: TypeScript.BlockSyntax): void {
        super.visitBlock(node);
        this.hasReturned = false;
    }

    public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): void {
        super.visitCaseSwitchClause(node);
        this.hasReturned = false;
    }

    public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): void {
        super.visitDefaultSwitchClause(node);
        this.hasReturned = false;
    }

    public visitIfStatement(node: TypeScript.IfStatementSyntax): void {
        super.visitIfStatement(node);
        this.hasReturned = false;
    }

    public visitElseClause(node: TypeScript.ElseClauseSyntax): void {
        super.visitElseClause(node);
        this.hasReturned = false;
    }

    public visitOptionalNode(node: TypeScript.SyntaxNode): void {
        if (node != null && node.kind() === TypeScript.SyntaxKind.ElseClause) {
            // if we're an else clause then we're in the middle of processing an if statement
            // and thus we want to disregard the case where the previous statement ended with a return
            this.hasReturned = false;
        }
        super.visitOptionalNode(node);
    }

    public visitBreakStatement(node: TypeScript.BreakStatementSyntax): void {
        super.visitBreakStatement(node);
        this.hasReturned = true;
    }

    public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): void {
        super.visitContinueStatement(node);
        this.hasReturned = true;
    }

    public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): void {
        super.visitReturnStatement(node);
        this.hasReturned = true;
    }

    public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): void {
        super.visitThrowStatement(node);
        this.hasReturned = true;
    }
}
