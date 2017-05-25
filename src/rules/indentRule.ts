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

const OPTION_USE_TABS = "tabs";
const OPTION_USE_SPACES = "spaces";
const OPTION_INDENT_SIZE_2 = 2;
const OPTION_INDENT_SIZE_4 = 4;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "indent",
        description: "Enforces indentation with tabs or spaces.",
        rationale: Lint.Utils.dedent`
            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,
            cleaner diffs in version control, and easier programmatic manipulation.`,
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`${OPTION_USE_SPACES}\` enforces consistent spaces.
            * \`${OPTION_USE_TABS}\` enforces consistent tabs.

            A second optional argument specifies indentation size:

            * \`${OPTION_INDENT_SIZE_2.toString()}\` enforces 2 space indentation.
            * \`${OPTION_INDENT_SIZE_4.toString()}\` enforces 4 space indentation.

            Indentation size is required for auto-fixing, but not for rule checking.
            `,
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                    enum: [OPTION_USE_TABS, OPTION_USE_SPACES],
                },
                {
                    type: "number",
                    enum: [OPTION_INDENT_SIZE_2, OPTION_INDENT_SIZE_4],
                },
            ],
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_USE_SPACES],
            [true, OPTION_USE_SPACES, OPTION_INDENT_SIZE_4],
            [true, OPTION_USE_TABS, OPTION_INDENT_SIZE_2],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_TABS = "tab indentation expected";
    public static FAILURE_STRING_SPACES = "space indentation expected";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new IndentWalker(sourceFile, this.getOptions()));
    }
}

// visit every token and enforce that only the right character is used for indentation
class IndentWalker extends Lint.RuleWalker {
    private failureString: string;
    private regExp: RegExp;
    private replacementFactory: (lineStart: number, fullLeadingWhitespace: string) => Lint.Replacement | undefined;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        // fixer is only provided with the indent size arg
        if (this.getOptions().length === 2 && typeof this.getOptions()[1] === "number"
            && (this.getOptions()[1] === OPTION_INDENT_SIZE_2 || this.getOptions()[1] === OPTION_INDENT_SIZE_4)) {
            // tslint:disable-next-line:no-unsafe-any
            const size = this.getOptions()[1] as number;
            let replaceRegExp: RegExp;
            let replaceIndent: string;

            if (this.hasOption(OPTION_USE_TABS)) {
                this.regExp = new RegExp(" ".repeat(size));
                this.failureString = Rule.FAILURE_STRING_TABS;
                // we want to find every group of `size` spaces, plus up to one 'incomplete' group
                replaceRegExp = new RegExp(`^( {${size}})+( {1,${size - 1}})?`, "g");
                replaceIndent = "\t";
            } else if (this.hasOption(OPTION_USE_SPACES)) {
                this.regExp = new RegExp("\t");
                this.failureString = `${size} ${Rule.FAILURE_STRING_SPACES}`;
                replaceRegExp = new RegExp("\t", "g");
                replaceIndent = " ".repeat(size);
            }

            this.replacementFactory = (lineStart, fullLeadingWhitespace) =>
                new Lint.Replacement(lineStart, fullLeadingWhitespace.length, fullLeadingWhitespace.replace(
                    replaceRegExp, (match) => replaceIndent.repeat(Math.ceil(match.length / size)),
                ));
        } else {
            if (this.hasOption(OPTION_USE_TABS)) {
                this.regExp = new RegExp(" ");
                this.failureString = Rule.FAILURE_STRING_TABS;
            } else if (this.hasOption(OPTION_USE_SPACES)) {
                this.regExp = new RegExp("\t");
                this.failureString = Rule.FAILURE_STRING_SPACES;
            }
            this.replacementFactory = () => undefined;
        }
    }

    public visitSourceFile(node: ts.SourceFile) {
        if (!this.hasOption(OPTION_USE_TABS) && !this.hasOption(OPTION_USE_SPACES)) {
            // if we don't have either option, no need to check anything, and no need to call super, so just return
            return;
        }

        let endOfComment = -1;
        let endOfTemplateString = -1;
        const scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text);
        for (const lineStart of node.getLineStarts()) {
            if (lineStart < endOfComment || lineStart < endOfTemplateString) {
                // skip checking lines inside multi-line comments or template strings
                continue;
            }

            scanner.setTextPos(lineStart);

            let currentScannedType = scanner.scan();
            let fullLeadingWhitespace = "";
            let lastStartPos = -1;

            while (currentScannedType === ts.SyntaxKind.WhitespaceTrivia) {
                const startPos = scanner.getStartPos();
                if (startPos === lastStartPos) {
                    break;
                }
                lastStartPos = startPos;

                fullLeadingWhitespace += scanner.getTokenText();
                currentScannedType = scanner.scan();
            }

            const commentRanges = ts.getTrailingCommentRanges(node.text, lineStart);
            if (commentRanges !== undefined) {
                endOfComment = commentRanges[commentRanges.length - 1].end;
            } else {
                let scanType = currentScannedType;

                // scan until we reach end of line, skipping over template strings
                while (scanType !== ts.SyntaxKind.NewLineTrivia && scanType !== ts.SyntaxKind.EndOfFileToken) {
                    if (scanType === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
                        // template string without expressions - skip past it
                        endOfTemplateString = scanner.getStartPos() + scanner.getTokenText().length;
                    } else if (scanType === ts.SyntaxKind.TemplateHead) {
                        // find end of template string containing expressions...
                        while (scanType !== ts.SyntaxKind.TemplateTail && scanType !== ts.SyntaxKind.EndOfFileToken) {
                            scanType = scanner.scan();
                            if (scanType === ts.SyntaxKind.CloseBraceToken) {
                                scanType = scanner.reScanTemplateToken();
                            }
                        }
                        // ... and skip past it
                        endOfTemplateString = scanner.getStartPos() + scanner.getTokenText().length;
                    }
                    scanType = scanner.scan();
                }
            }

            switch (currentScannedType) {
                case ts.SyntaxKind.SingleLineCommentTrivia:
                case ts.SyntaxKind.MultiLineCommentTrivia:
                case ts.SyntaxKind.NewLineTrivia:
                    // ignore lines that have comments before the first token
                    continue;
            }

            if (this.regExp.test(fullLeadingWhitespace)) {
                this.addFailureAt(lineStart, fullLeadingWhitespace.length, this.failureString,
                    this.replacementFactory(lineStart, fullLeadingWhitespace),
                );
            }
        }
        // no need to call super to visit the rest of the nodes, so don't call super here
    }
}
