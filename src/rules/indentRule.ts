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

const OPTION_USE_TABS = "tabs";
const OPTION_USE_SPACES = "spaces";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "indent",
        description: "Enforces indentation with tabs or spaces.",
        rationale: Lint.Utils.dedent`
            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,
            cleaner diffs in version control, and easier programatic manipulation.`,
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`"spaces"\` enforces consistent spaces.
            * \`"tabs"\` enforces consistent tabs.`,
        options: {
            type: "enum",
            enumValues: ["tabs", "spaces"],
        },
        optionExamples: ['[true, "spaces"]'],
        type: "maintainability",
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

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        if (this.hasOption(OPTION_USE_TABS)) {
            this.regExp = new RegExp(" ");
            this.failureString = Rule.FAILURE_STRING_TABS;
        } else if (this.hasOption(OPTION_USE_SPACES)) {
            this.regExp = new RegExp("\t");
            this.failureString = Rule.FAILURE_STRING_SPACES;
        }
    }

    public visitSourceFile(node: ts.SourceFile) {
        if (!this.hasOption(OPTION_USE_TABS) && !this.hasOption(OPTION_USE_SPACES)) {
            // if we don't have either option, no need to check anything, and no need to call super, so just return
            return;
        }

        let endOfComment = -1;
        const scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text);
        for (let lineStart of node.getLineStarts()) {
            if (lineStart < endOfComment) {
                // skip checking lines inside multi-line comments
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
            if (commentRanges) {
                endOfComment = commentRanges[commentRanges.length - 1].end;
            }

            if (currentScannedType === ts.SyntaxKind.SingleLineCommentTrivia
                    || currentScannedType === ts.SyntaxKind.MultiLineCommentTrivia
                    || currentScannedType === ts.SyntaxKind.NewLineTrivia) {
                // ignore lines that have comments before the first token
                continue;
            }

            if (fullLeadingWhitespace.match(this.regExp)) {
                this.addFailure(this.createFailure(lineStart, fullLeadingWhitespace.length, this.failureString));
            }
        }
        // no need to call super to visit the rest of the nodes, so don't call super here
    }
}
