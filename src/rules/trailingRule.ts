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
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class TrailingRule extends AbstractRule {
        public static FAILURE_STRING = "trailing whitespace";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new TrailingWalker(syntaxTree));
        }
    }

    class TrailingWalker extends Lint.RuleWalker {
        public visitToken(token: TypeScript.ISyntaxToken): void {
            super.visitToken(token);
            this.checkForTrailingWhitespace(token.trailingTrivia());
        }

        public visitNode(node: TypeScript.SyntaxNode): void {
            super.visitNode(node);
            this.checkForTrailingWhitespace(node.trailingTrivia());
        }

        private checkForTrailingWhitespace(triviaList: TypeScript.ISyntaxTriviaList) {
            if (triviaList.count() < 2) {
                return;
            }

            // skip the newline
            var lastButOne = triviaList.count() - 2;
            var trivia = triviaList.syntaxTriviaAt(lastButOne);
            var triviaKind = trivia.kind();
            if (triviaList.hasNewLine() && triviaKind === TypeScript.SyntaxKind.WhitespaceTrivia) {
                var start = this.position() - trivia.fullWidth() - 1;
                var failure = this.createFailure(start, trivia.fullWidth(), TrailingRule.FAILURE_STRING);
                this.addFailure(failure);
            }
        }
    }

}
