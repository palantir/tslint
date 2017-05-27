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
        type: "format",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(expected: string): string {
        return `${expected} indentation expected`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = parseOptions(this.ruleArguments);
        return options === undefined ? [] : this.applyWithFunction(sourceFile, walk, options);
    }
}

function parseOptions(ruleArguments: any[]): Options | undefined {
    const type = ruleArguments[0] as string;
    if (type !== OPTION_USE_TABS && type !== OPTION_USE_SPACES) { return undefined; }

    const size = ruleArguments[1] as number | undefined;
    return {
        size: size === OPTION_INDENT_SIZE_2 || size === OPTION_INDENT_SIZE_4 ? size : undefined,
        tabs: type === OPTION_USE_TABS,
    };
}

interface Options {
    readonly tabs: boolean;
    readonly size?: 2 | 4;
}

// visit every token and enforce that only the right character is used for indentation
function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options: { tabs, size } } = ctx;
    const regExp = tabs ? new RegExp(" ".repeat(size === undefined ? 1 : size)) : /\t/;

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

        if (regExp.test(fullLeadingWhitespace)) {
            const failure = Rule.FAILURE_STRING(tabs ? "tab" : size === undefined ? "space" : `${size} space`);
            ctx.addFailureAt(lineStart, fullLeadingWhitespace.length, failure, createFix(lineStart, fullLeadingWhitespace));
        }
    }

    function createFix(lineStart: number, fullLeadingWhitespace: string): Lint.Fix | undefined {
        if (size === undefined) { return undefined; }
        const replaceRegExp = tabs
            // we want to find every group of `size` spaces, plus up to one 'incomplete' group
            ? new RegExp(`^( {${size}})+( {1,${size - 1}})?`, "g")
            : /\t/g;
        const replacement = fullLeadingWhitespace.replace(replaceRegExp, (match) =>
            (tabs ? "\t" : " ".repeat(size)).repeat(Math.ceil(match.length / size!)));
        return new Lint.Replacement(lineStart, fullLeadingWhitespace.length, replacement);
    }
}
