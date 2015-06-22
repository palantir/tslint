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

enum QuoteMark {
    SINGLE_QUOTES,
    DOUBLE_QUOTES
}

export class Rule extends Lint.Rules.AbstractRule {
    public static SINGLE_QUOTE_FAILURE = "\" should be '";
    public static DOUBLE_QUOTE_FAILURE = "' should be \"";

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            const quoteMarkString = this.getOptions().ruleArguments[0];
            return (quoteMarkString === "single" || quoteMarkString === "double");
        }

        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new QuoteWalker(sourceFile, this.getOptions()));
    }
}

class QuoteWalker extends Lint.RuleWalker {
    private quoteMark: QuoteMark;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        const quoteMarkString = this.getOptions()[0];
        if (quoteMarkString === "single") {
            this.quoteMark = QuoteMark.SINGLE_QUOTES;
        } else {
            this.quoteMark = QuoteMark.DOUBLE_QUOTES;
        }
    }

    public visitNode(node : ts.Node) {
        this.handleNode(node);
        super.visitNode(node);
    }

    private handleNode(node: ts.Node) {
        let failure: Lint.RuleFailure;

        if (node.kind === ts.SyntaxKind.StringLiteral) {
            const text = node.getText();
            const width = node.getWidth();
            const position = node.getStart();

            const firstCharacter = text.charAt(0);
            const lastCharacter = text.charAt(text.length - 1);

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

        if (failure != null) {
            this.addFailure(failure);
        }
    }
}
