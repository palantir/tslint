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

import { forEachTokenWithTrivia, getLineRanges } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { getTemplateRanges } from "./noConsecutiveBlankLinesRule";

const OPTION_IGNORE_COMMENTS = "ignore-comments";
const OPTION_IGNORE_JSDOC = "ignore-jsdoc";

const enum IgnoreOption {
    None,
    Comments,
    JsDoc,
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-trailing-whitespace",
        description: "Disallows trailing whitespace at the end of a line.",
        rationale: "Keeps version control diffs clean as it prevents accidental whitespace from being committed.",
        optionsDescription: Lint.Utils.dedent`
            Possible settings are:

            * \`"${OPTION_IGNORE_COMMENTS}"\`: Allows trailing whitespace in comments.
            * \`"${OPTION_IGNORE_JSDOC}"\`: Allows trailing whitespace only in JSDoc comments.`,
        hasFix: true,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_IGNORE_COMMENTS, OPTION_IGNORE_JSDOC],
            },
        },
        optionExamples: [
            "true",
            `[true, "${OPTION_IGNORE_COMMENTS}"]`,
            `[true, "${OPTION_IGNORE_JSDOC}"]`,
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "trailing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        let option = IgnoreOption.None;
        if (this.ruleArguments.indexOf(OPTION_IGNORE_COMMENTS) !== -1) {
            option = IgnoreOption.Comments;
        } else if (this.ruleArguments.indexOf(OPTION_IGNORE_JSDOC) !== -1) {
            option = IgnoreOption.JsDoc;
        }
        return this.applyWithFunction(sourceFile, walk, option);
    }
}

function walk(ctx: Lint.WalkContext<IgnoreOption>) {
    const possibleFailures: ts.TextRange[] = [];
    const sourceFile = ctx.sourceFile;
    const text = sourceFile.text;
    for (const range of getLineRanges(sourceFile)) {
        const line = text.substring(range.pos, range.end).replace(/\r?\n/, "");
        const match = line.match(/^(.*?)\s+$/);
        if (match !== null) {
            possibleFailures.push({
                end: range.pos + line.length,
                pos: range.pos + match[1].length,
            });
        }
    }

    if (possibleFailures.length === 0) {
        return;
    }
    const excludedRanges = ctx.options === IgnoreOption.None
                           ? getTemplateRanges(ctx.sourceFile)
                           : getExcludedRanges(ctx.sourceFile, ctx.options);
    for (const possibleFailure of possibleFailures) {
        if (!excludedRanges.some((range) => range.pos < possibleFailure.pos && possibleFailure.pos < range.end)) {
            ctx.addFailure(possibleFailure.pos, possibleFailure.end, Rule.FAILURE_STRING, ctx.createFix(
                Lint.Replacement.deleteFromTo(possibleFailure.pos, possibleFailure.end),
            ));
        }
    }
}

function getExcludedRanges(sourceFile: ts.SourceFile, option: IgnoreOption): ts.TextRange[] {
    const intervals: ts.TextRange[] = [];
    forEachTokenWithTrivia(sourceFile, (text, kind, range) => {
        if (kind >= ts.SyntaxKind.FirstTemplateToken && kind <= ts.SyntaxKind.LastTemplateToken) {
            intervals.push(range);
        } else if (option === IgnoreOption.Comments) {
            if (kind === ts.SyntaxKind.SingleLineCommentTrivia || kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                intervals.push(range);
            }
        } else if (option === IgnoreOption.JsDoc) {
            if (kind === ts.SyntaxKind.MultiLineCommentTrivia && text[range.pos + 2] === "*" && text[range.pos + 3] !== "*") {
                intervals.push(range);
            }
        }
    });
    return intervals;
}
