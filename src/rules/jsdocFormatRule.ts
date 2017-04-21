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
            * one line comments must start with \`/** \` and end with \`*/\``,
        rationale: "Helps maintain a consistent, readable style for JSDoc comments.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
    public static FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return utils.forEachComment(ctx.sourceFile, (fullText, {kind, pos, end}) => {
        if (kind !== ts.SyntaxKind.MultiLineCommentTrivia ||
            fullText[pos + 2] !== "*" || fullText[pos + 3] === "*" || fullText[pos + 3] === "/") {
            return;
        }
        const lines = fullText.slice(pos + 3, end - 2).split(/\n/);
        const firstLine = lines[0];
        if (lines.length === 1) {
            if (!firstLine.startsWith(" ") || !firstLine.endsWith(" ")) {
                ctx.addFailure(pos, end, Rule.FORMAT_FAILURE_STRING);
            }
            return;
        }

        const alignColumn = ts.getLineAndCharacterOfPosition(ctx.sourceFile, pos + 1).character;
        let lineStart = pos + firstLine.length + 4; // +3 for the comment start "/**" and +1 for the newline
        const endIndex = lines.length - 1;
        for (let i = 1; i < endIndex; ++i) {
            const line = lines[i];
            // regex is: start of string, followed by any amount of whitespace, followed by *,
            // followed by either a space or the end of the string
            if (!/^\s*\*(?: |\r?$)/.test(line)) {
                ctx.addFailureAt(lineStart, lineLength(line), Rule.FORMAT_FAILURE_STRING);
            }
            if (line.indexOf("*") !== alignColumn) {
                ctx.addFailureAt(lineStart, lineLength(line), Rule.ALIGNMENT_FAILURE_STRING);
            }
            lineStart += line.length + 1; // + 1 for the splitted-out newline
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

function lineLength(line: string) {
    return line.endsWith("\r") ? line.length - 1 : line.length;
}
