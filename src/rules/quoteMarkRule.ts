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

    enum QuoteMark {
        SINGLE_QUOTES,
        DOUBLE_QUOTES
    }

    export class QuoteMarkRule extends AbstractRule {
        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            var sourceUnit = syntaxTree.sourceUnit();
            var quoteMarkString : string = this.getValue();
            var quoteMark : QuoteMark;

            if (quoteMarkString === "single") {
                quoteMark = QuoteMark.SINGLE_QUOTES;
            } else if (quoteMarkString === "double") {
                quoteMark = QuoteMark.DOUBLE_QUOTES;
            } else {
                throw new Error("Unknown quote style " + quoteMarkString);
            }

            return this.applyWithWalker(new QuoteWalker(syntaxTree, quoteMark));
        }
    }

    class QuoteWalker extends Lint.RuleWalker {
        static DOUBLE_QUOTE_FAILURE = "' should be \"";
        static SINGLE_QUOTE_FAILURE = "\" should be '";

        private quoteMark : QuoteMark;

        constructor(syntaxTree: TypeScript.SyntaxTree, quoteMark: QuoteMark) {
            super(syntaxTree);
            this.quoteMark = quoteMark;
        }

        public visitToken(token : TypeScript.ISyntaxToken): void {
            this.handleToken(token);
            super.visitToken(token);
        }

        private handleToken(operatorToken: TypeScript.ISyntaxToken) {
            var failure = null;
            var operatorKind = operatorToken.kind();

            if (operatorKind === TypeScript.SyntaxKind.StringLiteral) {
                var fullText = operatorToken.fullText();
                var textStart = operatorToken.leadingTriviaWidth();
                var width = operatorToken.width();
                var textEnd = textStart + width - 1;
                var firstChar = fullText.charAt(textStart);
                var lastChar = fullText.charAt(textEnd);

                if (this.quoteMark === QuoteMark.SINGLE_QUOTES) {
                    if (firstChar !== "'" || lastChar !== "'") {
                        failure = this.createFailure(this.position(), width, QuoteWalker.SINGLE_QUOTE_FAILURE);
                    }
                } else if (this.quoteMark === QuoteMark.DOUBLE_QUOTES) {
                    if (firstChar !== "\"" || lastChar !== "\"") {
                        failure = this.createFailure(this.position(), width, QuoteWalker.DOUBLE_QUOTE_FAILURE);
                    }
                }
            }

            if (failure) {
                this.addFailure(failure);
            }
        }
    }

}
