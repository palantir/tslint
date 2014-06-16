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
    public static FAILURE_STRING_PART = "Switch Case fall through: ";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSwitchCaseFallThroughWalker(syntaxTree, this.getOptions()));
    }
}

export class NoSwitchCaseFallThroughWalker extends Lint.RuleWalker {

    private hasLastCaseStatementReturn: boolean = undefined;

    public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax) {
        this.hasLastCaseStatementReturn = undefined;
        super.visitSwitchStatement(node);
    }

    public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): void {
        if (node.statements.childCount() === 0) {
            // Empty case statement
            return;
        }
        for (var i = 0; i < node.childCount(); i++) {
            var nodeKind = node.childAt(i).kind();
            if (nodeKind === TypeScript.SyntaxKind.BreakStatement) {
                this.hasLastCaseStatementReturn = true;
                return;
            }
        }
        this.hasLastCaseStatementReturn = false;
        this.addFailure(this.createFailure(this.position(), 1, Rule.FAILURE_STRING_PART));
    }

    public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): void {
        if (this.hasLastCaseStatementReturn === false) {
            this.addFailure(this.createFailure(this.position(), 1, Rule.FAILURE_STRING_PART));
        }
    }
}
