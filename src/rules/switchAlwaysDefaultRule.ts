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
    public static FAILURE_STRING = "Switch doesn't contain a default case statement";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new SwitchAlwaysDefaultRuleWalker(syntaxTree, this.getOptions()));
    }
}

export class SwitchAlwaysDefaultRuleWalker extends Lint.RuleWalker {

    public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax) {
        if (!this.containsDefaultSwitchClause(node.switchClauses)) {
            var position = this.getPosition() + node.switchKeyword.leadingTriviaWidth();
            var failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
            this.addFailure(failure);
        }

        super.visitSwitchStatement(node);
    }

    private containsDefaultSwitchClause(switchClauses: TypeScript.ISwitchClauseSyntax[]) {
        for (var i = 0; i < switchClauses.length; i++) {
            var child = switchClauses[i];
            if (child.kind() === TypeScript.SyntaxKind.DefaultSwitchClause) {
                return true;
            }
        }
        return false;
    }
}
