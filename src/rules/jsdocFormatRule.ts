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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_CHECK_MULTILINE_START = "check-multiline-start";
const OPTION_PREFER_SINGLELINE = "prefer-singleline";
const OPTION_MAX_WIDTH = "max-width";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "jsdoc-format",
        description: "Enforces basic format rules for JSDoc comments.",
        descriptionDetails: Lint.Utils.dedent`
            The following rules are enforced for JSDoc comments (comments starting with \`/**\`):

            * each line contains an asterisk and asterisks must be aligned
            * each asterisk must be followed by either a space or a newline (except for the first and the last)
            * the only characters before the asterisk on each line must be whitespace characters
            * one line comments must start with \`/** \` and end with \`*/\`
            * multiline comments don't allow text after \`/** \` in the first line (with option \`"${OPTION_CHECK_MULTILINE_START}"\`)
        `,
        rationale: "Helps maintain a consistent, readable style for JSDoc comments.",
        optionsDescription: Lint.Utils.dedent`
            You can optionally specify the option \`"${OPTION_CHECK_MULTILINE_START}"\` to enforce the first line of a
            multiline JSDoc comment to be empty.

            You can optionally specify the option \`"${OPTION_PREFER_SINGLELINE}"\` and \`"${OPTION_MAX_WIDTH}"\`to require JSDoc comments
            that can fit on a single line to do so.
        `,
        options: {
            type: "array",
            minItems: 0,
            maxItems: 3,
            items: {
                type: "string",
                enum: [OPTION_CHECK_MULTILINE_START, OPTION_PREFER_SINGLELINE],
            },
        },
        optionExamples: [
            true,
            [true, OPTION_CHECK_MULTILINE_START],
            [true, OPTION_PREFER_SINGLELINE, { OPTION_MAX_WIDTH: 80}],
            [true, OPTION_CHECK_MULTILINE_START, OPTION_PREFER_SINGLELINE, { OPTION_MAX_WIDTH: 80 }],
        ],
        type: "style",
        typescriptOnly: false,
        codeExamples: [
            {
                description: "Keep short jsdoc comments to a single line",
                config: Lint.Utils.dedent`
                    "rules": { "jsdoc-format": [true, "prefer-singleline", {"max-width": 80}] }
                `,
                pass: Lint.Utils.dedent`
                    /**
                     * good multline
                     * jsdoc docblock
                     */

                    /** good singleline jsdoc dockblock */
                `,
                fail: Lint.Utils.dedent`
                    /** bad single line jsdock block because it's way too long to fit on a single line */

                    /**
                     * bad multiline jsdoc docblock
                     */
                `,
            },
        ],
    };
    /* tslint:enable:object-literal-sort-keys */

    public static ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
    public static FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";
    public static PREFER_SINGLE_LINE_FAILURE = "short jsdoc block should be on single line";
    public static SINGLE_LINE_MAX_WIDTH_FAILURE = "singleline jsdoc block should fit within maxWidth characters";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const maxWidthOption = this.ruleArguments.find((arg) => typeof arg === "object" && typeof arg[OPTION_MAX_WIDTH] === "number");
        let maxWidth;
        if (maxWidthOption) {
            maxWidth = maxWidthOption[OPTION_MAX_WIDTH];
        }

        return this.applyWithFunction(sourceFile, walk, {
            firstLineOfMultiline: this.ruleArguments.indexOf(OPTION_CHECK_MULTILINE_START) !== -1,
            maxWidth,
            preferSingleline: this.ruleArguments.indexOf(OPTION_PREFER_SINGLELINE) !== -1,
        });
    }
}

interface Options {
    firstLineOfMultiline: boolean;
    preferSingleline: boolean;
    maxWidth: number;
}

function shouldBeSingleline(ctx: Lint.WalkContext<Options>, lines: string[], {pos, end}: ts.CommentRange): boolean {
    if (!ctx.options.preferSingleline) {
        return false;
    }

    if (lines.length === 3) {
        ctx.addFailure(pos, end, Rule.PREFER_SINGLE_LINE_FAILURE, [
            Lint.Replacement.replaceFromTo(pos, end, `/** ${lines[1].trim().substr(1).trim()} */`),
        ]);
    }

    return false;
}

function shouldBeMultiline(ctx: Lint.WalkContext<Options>, lines: string[], fullText: string, { pos, end }: ts.CommentRange): boolean {
    if (!ctx.options.preferSingleline && !ctx.options.maxWidth) {
        return false;
    }

    if (lines.length !== 1) {
        return false;
    }

    if (lines[0].length <= ctx.options.maxWidth) {
        return false;
    }

    // Find the start of the first line
    const lb = utils.getLineBreakStyle(ctx.sourceFile);
    let startPos = pos;
    while (startPos > 0 && fullText[startPos - 1] !== lb) {
        startPos--;
    }

    const fullWidthLines = fullText.slice(startPos, end).split(lb);
    const indentLength = fullWidthLines[0].indexOf("/") + 1;
    const indent = Array(indentLength).join(" ");

    const rawComment = lines[0]
        .trim()
        .replace(/\/\*\*\s*/, "")
        .replace(/\*\/\s*$/, "");

    const newLines = rawComment
        // Split lines into words
        .split(/\s+/)
        // Make sure we don't have gaps because of double spaces
        .filter(Boolean)
        // Assemble the lines bottom to top so we don't have to figure out the
        // last line's index on each iteration; we can just use [0]
        .reduce(
            (acc, word) => {
                const newLine = `${acc[0]} ${word}`;
                if (newLine.length <= ctx.options.maxWidth) {
                    acc[0] = newLine;
                } else {
                    acc.unshift(`${indent} * ${word}`);
                }
                return acc;
            },
            [`${indent} *`],
    )
    // Flip the list so it's in top-to-bottom order
    .reverse();

    newLines.unshift(`${indent}/**`);
    newLines.push(`${indent} */`);

    ctx.addFailure(pos, end, Rule.SINGLE_LINE_MAX_WIDTH_FAILURE, [
        Lint.Replacement.replaceFromTo(startPos, end, newLines.join(lb)),
    ]);

    return true;
}

function walk(ctx: Lint.WalkContext<Options>) {
    return utils.forEachComment(ctx.sourceFile, (fullText, range) => {
        const { kind, pos, end } = range;
        if (kind !== ts.SyntaxKind.MultiLineCommentTrivia ||
            fullText[pos + 2] !== "*" || fullText[pos + 3] === "*" || fullText[pos + 3] === "/") {
                return;
            }
        const lines = fullText.slice(pos + 3, end - 2).split("\n");
        const firstLine = lines[0];

        if (shouldBeSingleline(ctx, lines, range)) {
            return;
        }

        if (shouldBeMultiline(ctx, lines, fullText, range)) {
            return;
        }

        if (lines.length === 1) {
            if (firstLine[0] !== " " || !firstLine.endsWith(" ")) {
                ctx.addFailure(pos, end, Rule.FORMAT_FAILURE_STRING);
            }
            return;
        }

        const alignColumn = getAlignColumn(ctx.sourceFile, pos + 1);
        if (ctx.options.firstLineOfMultiline && /\S/.test(firstLine)) {
            // first line of multiline JSDoc should be empty, i.e. only contain whitespace
            ctx.addFailureAt(pos, firstLine.length + 3, Rule.FORMAT_FAILURE_STRING);
        }
        let lineStart = pos + firstLine.length + 4; // +3 for the comment start "/**" and +1 for the newline
        const endIndex = lines.length - 1;
        for (let i = 1; i < endIndex; ++i) {
            const line = lines[i].endsWith("\r") ? lines[i].slice(0, -1) : lines[i];
            // regex is: start of string, followed by any amount of whitespace, followed by *,
            // followed by either a space or the end of the string
            if (!/^\s*\*(?: |$)/.test(line)) {
                ctx.addFailureAt(lineStart, line.length, Rule.FORMAT_FAILURE_STRING);
            }
            if (line.indexOf("*") !== alignColumn) {
                ctx.addFailureAt(lineStart, line.length, Rule.ALIGNMENT_FAILURE_STRING);
            }
            lineStart += lines[i].length + 1; // + 1 for the splitted-out newline
        }
        const lastLine = lines[endIndex];
        // last line should only consist of whitespace
        if (lastLine.search(/\S/) !== -1) {
            ctx.addFailure(lineStart, end, Rule.FORMAT_FAILURE_STRING);
        }
        if (lastLine.length !== alignColumn) {
            ctx.addFailure(lineStart, end, Rule.ALIGNMENT_FAILURE_STRING);
        }

    });
}

function getAlignColumn(sourceFile: ts.SourceFile, pos: number) {
    const result = ts.getLineAndCharacterOfPosition(sourceFile, pos);
    // handle files starting with BOM
    return result.line === 0 && sourceFile.text[0] === "\uFEFF"
        ? result.character - 1
        : result.character;
}
