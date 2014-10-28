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
        // get the position for the first case statement
        var position = this.positionAfter(node.switchKeyword,
                                          node.openParenToken, node.expression,
                                          node.closeParenToken, node.openBraceToken);

        var switchClauses = node.switchClauses;
        for (var i = 0; i < switchClauses.length; i++) {
            var child = switchClauses[i];
            var kind = child.kind();
            var fullWidth = TypeScript.fullWidth(child);
            if (kind === TypeScript.SyntaxKind.CaseSwitchClause) {
                position += fullWidth;
                var switchClause = <TypeScript.CaseSwitchClauseSyntax>child;
                isFallingThrough = this.fallsThrough(switchClause.statements);
                // no break statements and no statements means the fallthrough is expected.
                // last item doesn't need a break
                if (isFallingThrough && switchClause.statements.length > 0 && ((switchClauses.length - 1) > i)) {
                    // remove trailing trivia (new line)
                    if (!this.fallThroughAllowed(switchClauses[i + 1])) {
                        this.addFailure(this.createFailure(position - TypeScript.trailingTriviaWidth(child), 1,
                            Rule.FAILURE_STRING_PART + "'case'"));
                    }
                }
            } else {
                // case statement falling through a default
                if (isFallingThrough && !this.fallThroughAllowed(child)) {
                    var failureString = Rule.FAILURE_STRING_PART + "'default'";
                    // remove trailing trivia (new line)
                    this.addFailure(this.createFailure(position - TypeScript.trailingTriviaWidth(child), 1, failureString));
                }
                // add the width after setting the failure, the error isn't at the end of the default but right before it.
                position += fullWidth;
            }
        }
        super.visitSwitchStatement(node);
    }

    private fallThroughAllowed(nextCaseOrDefaultStatement: TypeScript.ISyntaxNodeOrToken): boolean {
        var childCount = TypeScript.childCount(nextCaseOrDefaultStatement);
        var firstChild = TypeScript.childAt(nextCaseOrDefaultStatement, 0);
        var triviaList = childCount > 0 ? TypeScript.leadingTrivia(firstChild) : null;
        if (triviaList) {
            // This list also contains elements for spaces, comments and newlines
            for (var i = 0; i < triviaList.count(); i++) {
                var trivia = triviaList.syntaxTriviaAt(i);
                if (trivia.isComment()) {
                    if (trivia.fullText() === "/* falls through */") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private fallsThrough(list: TypeScript.ISyntaxElement[]) {
        for (var i = 0; i < list.length; i++) {
            var nodeKind = list[i].kind();
            if (nodeKind === TypeScript.SyntaxKind.BreakStatement ||
                nodeKind === TypeScript.SyntaxKind.ThrowStatement ||
                nodeKind === TypeScript.SyntaxKind.ReturnStatement) {
                return false;
            }
        }
        return true;
    }
}
