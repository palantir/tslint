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
        constructor() {
            super("oneline");
        }

        public isEnabled(): boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            var braceWalker = new BraceWalker(syntaxTree);
            return this.applyWithWalker(braceWalker);
        }
    }

    class BraceWalker extends Lint.StateAwareRuleWalker {
        static BRACE_FAILURE_STRING = "misplaced opening brace";
        static CATCH_FAILURE_STRING = "misplaced 'catch'";
        static ELSE_FAILURE_STRING = "misplaced 'else'";
        static WHITESPACE_FAILURE_STRING = "missing whitespace";

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

                    var lastLine = this.getLine(lastState.position);
                    var currentLine = this.getLine(this.position());

                    if (currentLine !== lastLine) {
                        this.addFailure(this.createFailure(this.position(), BraceWalker.BRACE_FAILURE_STRING));
                    } else if (!this.hasTrailingWhiteSpace(lastState.token)) {
                        this.addFailure(this.createFailure(this.position(), BraceWalker.WHITESPACE_FAILURE_STRING));
                    }
                  }
            }

            super.visitToken(token);
        }

        public visitElseClause(node: TypeScript.ElseClauseSyntax): void {
            var lastState = this.getLastState();
            if (lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
                this.addFailure(this.createFailure(this.position(), BraceWalker.ELSE_FAILURE_STRING));
            }

            super.visitElseClause(node);
        }

        public visitCatchClause(node: TypeScript.CatchClauseSyntax): void {
            var lastState = this.getLastState();
            if (lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
                this.addFailure(this.createFailure(this.position(), BraceWalker.CATCH_FAILURE_STRING));
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
