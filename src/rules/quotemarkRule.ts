/**
 * @license
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
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "quotemark",
        description: "Requires single or double quotes for string literals.",
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"single"\` enforces single quotes.
            * \`"double"\` enforces double quotes.
            * \`"jsx-single"\` enforces single quotes for JSX attributes.
            * \`"jsx-double"\` enforces double quotes for JSX attributes.
            * \`"avoid-escape"\` allows you to use the "other" quotemark in cases where escaping would normally be required.
            For example, \`[true, "double", "avoid-escape"]\` would not report a failure on the string literal \`'Hello "World"'\`.`,
        options: {
            type: "list",
            listType: {
                type: "enum",
                enumValues: ["single", "double", "jsx-single", "jsx-double", "avoid-escape"],
            },
        },
        optionExamples: ['[true, "single", "avoid-escape"]', '[true, "single", "jsx-double"]'],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

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
    private jsxQuoteMark: QuoteMark;
    private avoidEscape: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        const ruleArguments = this.getOptions();

        if (ruleArguments.indexOf("single") > -1) {
            this.quoteMark = QuoteMark.SINGLE_QUOTES;
        }

        if (ruleArguments.indexOf("jsx-single") > -1) {
            this.jsxQuoteMark = QuoteMark.SINGLE_QUOTES;
        } else if (ruleArguments.indexOf("jsx-double") > -1) {
            this.jsxQuoteMark = QuoteMark.DOUBLE_QUOTES;
        } else {
            this.jsxQuoteMark = this.quoteMark;
        }

        this.avoidEscape = ruleArguments.indexOf("avoid-escape") > 0;
    }

    public visitStringLiteral(node: ts.StringLiteral) {
        const inJsx = (node.parent.kind === ts.SyntaxKind.JsxAttribute);
        const text = node.getText();
        const width = node.getWidth();
        const position = node.getStart();

        const firstCharacter = text.charAt(0);
        const lastCharacter = text.charAt(text.length - 1);

        const quoteMark = inJsx ? this.jsxQuoteMark : this.quoteMark;
        const expectedQuoteMark = (quoteMark === QuoteMark.SINGLE_QUOTES) ? "'" : "\"";

        if (firstCharacter !== expectedQuoteMark || lastCharacter !== expectedQuoteMark) {
            // allow the "other" quote mark to be used, but only to avoid having to escape
            const includesOtherQuoteMark = text.slice(1, -1).indexOf(expectedQuoteMark) !== -1;

            if (!(this.avoidEscape && includesOtherQuoteMark)) {
                const failureMessage = (quoteMark === QuoteMark.SINGLE_QUOTES)
                    ? Rule.SINGLE_QUOTE_FAILURE
                    : Rule.DOUBLE_QUOTE_FAILURE;

                this.addFailure(this.createFailure(position, width, failureMessage));
            }
        }

        super.visitStringLiteral(node);
    }
}
