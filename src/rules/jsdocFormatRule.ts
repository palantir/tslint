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
        `,
        options: {
            type: "array",
            minItems: 0,
            maxItems: 1,
            items: {
                type: "string",
                enum: [OPTION_CHECK_MULTILINE_START],
            },
        },
        optionExamples: [true, [true, OPTION_CHECK_MULTILINE_START]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
    public static FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            firstLineOfMultiline: this.ruleArguments.indexOf(OPTION_CHECK_MULTILINE_START) !== -1,
        });
    }
}

interface Options {
    firstLineOfMultiline: boolean;
}

function walk(ctx: Lint.WalkContext<Options>) {
    return utils.forEachComment(ctx.sourceFile, (fullText, { kind, pos, end }) => {
        if (
            kind !== ts.SyntaxKind.MultiLineCommentTrivia ||
            fullText[pos + 2] !== "*" ||
            fullText[pos + 3] === "*" ||
            fullText[pos + 3] === "/"
        ) {
            return;
        }
        const lines = fullText.slice(pos + 3, end - 2).split("\n");
        const firstLine = lines[0];
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
