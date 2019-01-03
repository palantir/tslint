/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

const ENFORCE_TRAILING_NEWLINE = "enforce-trailing-newline";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "file-header",
        description:
            "Enforces a certain header comment for all files, matched by a regular expression.",
        optionsDescription: Lint.Utils.dedent`
            The first option, which is mandatory, is a regular expression that all headers should match.
            The second argument, which is optional, is a string that should be inserted as a header comment
            if fixing is enabled and no header that matches the first argument is found.
            The third argument, which is optional, is a string that denotes whether or not a newline should
            exist on the header.`,
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                },
                {
                    type: "string",
                },
                {
                    type: "string",
                },
            ],
            additionalItems: false,
            minLength: 1,
            maxLength: 3,
        },
        optionExamples: [[true, "Copyright \\d{4}", "Copyright 2018", ENFORCE_TRAILING_NEWLINE]],
        hasFix: true,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static MISSING_HEADER_FAILURE_STRING = "missing file header";
    public static MISSING_NEW_LINE_FAILURE_STRING = "missing new line following the file header";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const { text } = sourceFile;
        const headerFormat = new RegExp(this.ruleArguments[0] as string);
        const textToInsert = this.ruleArguments[1] as string | undefined;
        const enforceExtraTrailingLine =
            this.ruleArguments.indexOf(ENFORCE_TRAILING_NEWLINE) !== -1;

        // ignore shebang if it exists
        let offset = text.startsWith("#!") ? text.indexOf("\n") : 0;
        // returns the text of the first comment or undefined
        const commentText = ts.forEachLeadingCommentRange(text, offset, (pos, end, kind) =>
            text.substring(pos + 2, kind === ts.SyntaxKind.SingleLineCommentTrivia ? end : end - 2),
        );

        if (commentText === undefined || !headerFormat.test(commentText)) {
            const isErrorAtStart = offset === 0;
            if (!isErrorAtStart) {
                ++offset; // show warning in next line after shebang
            }
            const leadingNewlines = isErrorAtStart ? 0 : 1;
            const trailingNewlines = isErrorAtStart ? 2 : 1;

            const fix =
                textToInsert !== undefined
                    ? Lint.Replacement.appendText(
                          offset,
                          this.createComment(
                              sourceFile,
                              textToInsert,
                              leadingNewlines,
                              trailingNewlines,
                          ),
                      )
                    : undefined;
            return [
                new Lint.RuleFailure(
                    sourceFile,
                    offset,
                    offset,
                    Rule.MISSING_HEADER_FAILURE_STRING,
                    this.ruleName,
                    fix,
                ),
            ];
        }

        const trailingNewLineViolation =
            enforceExtraTrailingLine &&
            headerFormat.test(commentText) &&
            this.doesNewLineEndingViolationExist(text, offset);

        if (trailingNewLineViolation) {
            const trailingCommentRanges = ts.getTrailingCommentRanges(text, offset);
            const endOfComment = trailingCommentRanges![0].end;
            const lineEnding = this.generateLineEnding(sourceFile);
            const fix =
                textToInsert !== undefined
                    ? Lint.Replacement.appendText(endOfComment, lineEnding)
                    : undefined;

            return [
                new Lint.RuleFailure(
                    sourceFile,
                    offset,
                    offset,
                    Rule.MISSING_NEW_LINE_FAILURE_STRING,
                    this.ruleName,
                    fix,
                ),
            ];
        }

        return [];
    }

    private createComment(
        sourceFile: ts.SourceFile,
        commentText: string,
        leadingNewlines = 1,
        trailingNewlines = 1,
    ) {
        const lineEnding = this.generateLineEnding(sourceFile);
        return (
            lineEnding.repeat(leadingNewlines) +
            [
                "/*!",
                // split on both types of line endings in case users just typed "\n" in their configs
                // but are working in files with \r\n line endings
                // Trim trailing spaces to play nice with `no-trailing-whitespace` rule
                ...commentText.split(/\r?\n/g).map(line => ` * ${line}`.replace(/\s+$/, "")),
                " */",
            ].join(lineEnding) +
            lineEnding.repeat(trailingNewlines)
        );
    }

    private generateLineEnding(sourceFile: ts.SourceFile) {
        const maybeCarriageReturn =
            sourceFile.text[sourceFile.getLineEndOfPosition(0)] === "\r" ? "\r" : "";
        return `${maybeCarriageReturn}\n`;
    }

    private doesNewLineEndingViolationExist(text: string, offset: number): boolean {
        const entireComment = ts.forEachLeadingCommentRange(text, offset, (pos, end) =>
            text.substring(pos, end + 2),
        );

        const NEW_LINE_FOLLOWING_HEADER = /^.*((\r)?\n){2,}$/gm;
        return (
            entireComment !== undefined && NEW_LINE_FOLLOWING_HEADER.test(entireComment) !== null
        );
    }
}
