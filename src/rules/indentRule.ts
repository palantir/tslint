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

            * \`"spaces"\` enforces consistent spaces.
            * \`"tabs"\` enforces consistent tabs.`,
        options: {
            type: "string",
            enum: ["tabs", "spaces"],
        },
        optionExamples: [[true, "spaces"]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_TABS = "tab indentation expected";
    public static FAILURE_STRING_SPACES = "space indentation expected";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const type = this.ruleArguments.indexOf(OPTION_USE_TABS) !== -1 ? "tabs" :
            this.ruleArguments.indexOf(OPTION_USE_SPACES) !== -1 ? "spaces" : undefined;
        return type === undefined ? [] : this.applyWithFunction(sourceFile, walk, { type });
    }
}

// visit every token and enforce that only the right character is used for indentation
function walk(ctx: Lint.WalkContext<{ type: "tabs" | "spaces" }>): void {
    const { sourceFile } = ctx;
    const badWhitespace = ctx.options.type === "tabs" ? " " : "\t";

    let endOfComment = -1;
    let endOfTemplateString = -1;
    const scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, sourceFile.text);
    for (const lineStart of sourceFile.getLineStarts()) {
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

        const commentRanges = ts.getTrailingCommentRanges(sourceFile.text, lineStart);
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

        if (fullLeadingWhitespace.includes(badWhitespace)) {
            ctx.addFailureAt(lineStart, fullLeadingWhitespace.length,
                ctx.options.type === "tabs" ? Rule.FAILURE_STRING_TABS : Rule.FAILURE_STRING_SPACES);
        }
    }
}
