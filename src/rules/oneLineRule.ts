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

/// <reference path='rule.ts'/>
/// <reference path='../language/stateAwareRuleWalker.ts'/>

module Lint.Rules {

    export class OneLineRule extends AbstractRule {
        public static BRACE_FAILURE_STRING = "misplaced opening brace";
        public static CATCH_FAILURE_STRING = "misplaced 'catch'";
        public static ELSE_FAILURE_STRING = "misplaced 'else'";
        public static WHITESPACE_FAILURE_STRING = "missing whitespace";

        public isEnabled(): boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            var braceWalker = new BraceWalker(syntaxTree);
            return this.applyWithWalker(braceWalker);
        }
    }

    class BraceWalker extends Lint.StateAwareRuleWalker {
        public visitToken(token: TypeScript.ISyntaxToken): void {
            var kind = token.kind();
            var lastState = this.getLastState();

            if (kind === TypeScript.SyntaxKind.OpenBraceToken && lastState !== undefined) {
                var lastKind = lastState.token.kind();
                if (lastKind === TypeScript.SyntaxKind.CloseParenToken ||
                    lastKind === TypeScript.SyntaxKind.DoKeyword ||
                    lastKind === TypeScript.SyntaxKind.ElseKeyword ||
                    lastKind === TypeScript.SyntaxKind.IdentifierName ||
                    lastKind === TypeScript.SyntaxKind.StringLiteral ||
                    lastKind === TypeScript.SyntaxKind.TryKeyword) {

                    var failure;
                    var lastLine = this.getLine(lastState.position);
                    var currentLine = this.getLine(this.position());

                    if (currentLine !== lastLine) {
                        failure = this.createFailure(this.position(), token.width(), OneLineRule.BRACE_FAILURE_STRING);
                        this.addFailure(failure);
                    } else if (!this.hasTrailingWhiteSpace(lastState.token)) {
                        failure = this.createFailure(this.position(), token.width(), OneLineRule.WHITESPACE_FAILURE_STRING);
                        this.addFailure(failure);
                    }
                  }
            }

            super.visitToken(token);
        }

        public visitElseClause(node: TypeScript.ElseClauseSyntax): void {
            var lastState = this.getLastState();
            if (lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
                var failure = this.createFailure(this.position(), node.elseKeyword.width(), OneLineRule.ELSE_FAILURE_STRING);
                this.addFailure(failure);
            }

            super.visitElseClause(node);
        }

        public visitCatchClause(node: TypeScript.CatchClauseSyntax): void {
            var lastState = this.getLastState();
            if (lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
                var failure = this.createFailure(this.position(), node.catchKeyword.width(), OneLineRule.CATCH_FAILURE_STRING);
                this.addFailure(failure);
            }

            super.visitCatchClause(node);
        }

        private getLine(position): number {
            return this.getSyntaxTree().lineMap().getLineAndCharacterFromPosition(position).line();
        }

        private hasTrailingWhiteSpace(token: TypeScript.ISyntaxToken): boolean {
            var trivia = token.trailingTrivia();
            if (trivia.count() < 1) {
                return false;
            }

            var kind = trivia.syntaxTriviaAt(0).kind();
            return (kind === TypeScript.SyntaxKind.WhitespaceTrivia);
        }
    }

}
