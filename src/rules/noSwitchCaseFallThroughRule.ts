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
    public static FAILURE_STRING_PART = "Expected a 'break' before ";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSwitchCaseFallThroughWalker(syntaxTree, this.getOptions()));
    }
}

export class NoSwitchCaseFallThroughWalker extends Lint.RuleWalker {

    public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax) {
        var isFallingThrough = false;
        // get position for first case statement
        var position = this.positionAfter(node.switchKeyword, node.openParenToken, node.expression, node.closeParenToken, node.openBraceToken);
        for (var i = 0; i < node.switchClauses.childCount(); i++) {
            var child = node.switchClauses.childAt(i);
            var kind = child.kind();
            var fullWidth = child.fullWidth();
            if (kind === TypeScript.SyntaxKind.CaseSwitchClause) {
                position += fullWidth;
                var switchClause = <TypeScript.CaseSwitchClauseSyntax>child;
                isFallingThrough = !this.hasBreakStatement(switchClause.statements);
                // no break statements and no statements means the fallthrough is expected.
                // last item doesn't need a break
                if (isFallingThrough && switchClause.statements.childCount() > 0 && ((node.switchClauses.childCount() - 1) > i)) {
                    // remove trailing trivia (new line)
                    this.addFailure(this.createFailure(position - child.trailingTriviaWidth(), 1, Rule.FAILURE_STRING_PART + "'case'"));
                }
            } else {
                // case statement falling through a default, this is always an error
                if (isFallingThrough) {
                    // remove trailing trivia (new line)
                    this.addFailure(this.createFailure(position - child.trailingTriviaWidth(), 1, Rule.FAILURE_STRING_PART + "'default'"));
                }
                // add the width after setting the failure, the error isn't at the end of the default but right before it.
                position += fullWidth;
            }
        }
        super.visitSwitchStatement(node);
    }

    private hasBreakStatement(list: TypeScript.ISyntaxList) {
        for (var i = 0; i < list.childCount(); i++) {
            var nodeKind = list.childAt(i).kind();
            if (nodeKind === TypeScript.SyntaxKind.BreakStatement ||
                nodeKind === TypeScript.SyntaxKind.ThrowStatement ||
                nodeKind === TypeScript.SyntaxKind.ReturnStatement) {
                return true;
            }
        }
        return false;
    }
}
