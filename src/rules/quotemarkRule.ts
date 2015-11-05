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

import * as ts from "typescript";
import * as Lint from "../lint";

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
        return this.applyWithWalker(new QuotemarkWalker(sourceFile, this.getOptions()));
    }
}

class QuotemarkWalker extends Lint.RuleWalker {
    private quoteMark = QuoteMark.DOUBLE_QUOTES;
    private avoidEscape: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        const ruleArguments = this.getOptions();
        const quoteMarkString = ruleArguments[0];
        if (quoteMarkString === "single") {
            this.quoteMark = QuoteMark.SINGLE_QUOTES;
        } else {
            this.quoteMark = QuoteMark.DOUBLE_QUOTES;
        }

        this.avoidEscape = ruleArguments.indexOf("avoid-escape") > 0;
    }

    public visitStringLiteral(node: ts.StringLiteral) {
        const text = node.getText();
        const width = node.getWidth();
        const position = node.getStart();

        const firstCharacter = text.charAt(0);
        const lastCharacter = text.charAt(text.length - 1);

        const expectedQuoteMark = (this.quoteMark === QuoteMark.SINGLE_QUOTES) ? "'" : "\"";

        if (firstCharacter !== expectedQuoteMark || lastCharacter !== expectedQuoteMark) {
            // allow the "other" quote mark to be used, but only to avoid having to escape
            const includesOtherQuoteMark = text.slice(1, -1).indexOf(expectedQuoteMark) !== -1;

            if (!(this.avoidEscape && includesOtherQuoteMark)) {
                const failureMessage = (this.quoteMark === QuoteMark.SINGLE_QUOTES)
                    ? Rule.SINGLE_QUOTE_FAILURE
                    : Rule.DOUBLE_QUOTE_FAILURE;

                this.addFailure(this.createFailure(position, width, failureMessage));
            }
        }

        super.visitStringLiteral(node);
    }
}
