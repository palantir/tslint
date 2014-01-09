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
        if (this.hasReturned) {
            this.hasReturned = false;
            var position = this.position() + node.leadingTriviaWidth();
            this.addFailure(this.createFailure(position, node.width(), Rule.FAILURE_STRING));
        }

        super.visitNode(node);
    }

    public visitBlock(node: TypeScript.BlockSyntax): void {
        this.hasReturned = false;
        super.visitBlock(node);
        this.hasReturned = false;
    }

    public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): void {
        this.hasReturned = false;
        super.visitCaseSwitchClause(node);
        this.hasReturned = false;
    }

    public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): void {
        this.hasReturned = false;
        super.visitDefaultSwitchClause(node);
        this.hasReturned = false;
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
