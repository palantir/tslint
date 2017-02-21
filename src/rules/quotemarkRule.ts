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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "quotemark",
        description: "Requires single or double quotes for string literals.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"single"\` enforces single quotes.
            * \`"double"\` enforces double quotes.
            * \`"jsx-single"\` enforces single quotes for JSX attributes.
            * \`"jsx-double"\` enforces double quotes for JSX attributes.
            * \`"avoid-escape"\` allows you to use the "other" quotemark in cases where escaping would normally be required.
            For example, \`[true, "double", "avoid-escape"]\` would not report a failure on the string literal \`'Hello "World"'\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["single", "double", "jsx-single", "jsx-double", "avoid-escape"],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: ['[true, "single", "avoid-escape"]', '[true, "single", "jsx-double"]'],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(actual: string, expected: string) {
        return `${actual} should be ${expected}`;
    }

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            const ruleArguments = this.getOptions().ruleArguments;
            const quoteMarkString = ruleArguments[0];
            return (quoteMarkString === "single" || quoteMarkString === "double");
        }

        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new QuotemarkWalker(sourceFile, this.getOptions()));
    }
}

class QuotemarkWalker extends Lint.RuleWalker {
    private quoteMark: string;
    private jsxQuoteMark: string;
    private avoidEscape: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.quoteMark = this.hasOption("single") ? "'" : '"';
        this.jsxQuoteMark = this.hasOption("jsx-single") ? "'" : this.hasOption("jsx-double") ? '"' : this.quoteMark;
        this.avoidEscape = this.hasOption("avoid-escape");
    }

    public visitStringLiteral(node: ts.StringLiteral) {
        const expectedQuoteMark = node.parent!.kind === ts.SyntaxKind.JsxAttribute ? this.jsxQuoteMark : this.quoteMark;
        const text = node.getText();
        const actualQuoteMark = text[0];
        if (actualQuoteMark !== expectedQuoteMark && !(this.avoidEscape && node.text.includes(expectedQuoteMark))) {
            const escapedText = text.slice(1, -1).replace(new RegExp(expectedQuoteMark, "g"), `\\${expectedQuoteMark}`);
            const newText = expectedQuoteMark + escapedText + expectedQuoteMark;
            this.addFailureAtNode(node, Rule.FAILURE_STRING(actualQuoteMark, expectedQuoteMark),
                this.createFix(this.createReplacement(node.getStart(), node.getWidth(), newText)));
        }
    }
}
