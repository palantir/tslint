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

enum QuoteMark {
    SINGLE_QUOTES,
    DOUBLE_QUOTES
}

export class Rule extends Lint.Rules.AbstractRule {
    public static SINGLE_QUOTE_FAILURE = "\" should be '";
    public static DOUBLE_QUOTE_FAILURE = "' should be \"";

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            var quoteMarkString = this.getOptions()[0];
            return (quoteMarkString === "single" || quoteMarkString === "double");
        }

        return false;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var quoteMark: QuoteMark;
        var quoteMarkString = this.getOptions()[0];
        var sourceUnit = syntaxTree.sourceUnit();

        if (quoteMarkString === "single") {
            quoteMark = QuoteMark.SINGLE_QUOTES;
        } else {
            quoteMark = QuoteMark.DOUBLE_QUOTES;
        }

        return this.applyWithWalker(new QuoteWalker(syntaxTree, quoteMark));
    }
}

class QuoteWalker extends Lint.RuleWalker {
    private quoteMark: QuoteMark;

    constructor(syntaxTree: TypeScript.SyntaxTree, quoteMark: QuoteMark) {
        super(syntaxTree);
        this.quoteMark = quoteMark;
    }

    public visitToken(token : TypeScript.ISyntaxToken): void {
        this.handleToken(token);
        super.visitToken(token);
    }

    private handleToken(token: TypeScript.ISyntaxToken) {
        var failure = null;
        if (token.kind() === TypeScript.SyntaxKind.StringLiteral) {
            var fullText = token.fullText();
            var width = token.width();
            var position = this.position() + token.leadingTriviaWidth();

            var textStart = token.leadingTriviaWidth();
            var textEnd = textStart + width - 1;
            var firstCharacter = fullText.charAt(textStart);
            var lastCharacter = fullText.charAt(textEnd);

            if (this.quoteMark === QuoteMark.SINGLE_QUOTES) {
                if (firstCharacter !== "'" || lastCharacter !== "'") {
                    failure = this.createFailure(position, width, Rule.SINGLE_QUOTE_FAILURE);
                }
            } else if (this.quoteMark === QuoteMark.DOUBLE_QUOTES) {
                if (firstCharacter !== "\"" || lastCharacter !== "\"") {
                    failure = this.createFailure(position, width, Rule.DOUBLE_QUOTE_FAILURE);
                }
            }
        }

        if (failure) {
            this.addFailure(failure);
        }
    }
}
