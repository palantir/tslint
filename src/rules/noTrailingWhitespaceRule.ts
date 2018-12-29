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

import { forEachComment, forEachTokenWithTrivia, getLineRanges } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { getTemplateRanges } from "./noConsecutiveBlankLinesRule";

const OPTION_IGNORE_COMMENTS = "ignore-comments";
const OPTION_IGNORE_JSDOC = "ignore-jsdoc";
const OPTION_IGNORE_TEMPLATE_STRINGS = "ignore-template-strings";
const OPTION_IGNORE_BLANK_LINES = "ignore-blank-lines";

interface Options {
    ignoreTemplates: boolean;
    ignoreComments: boolean;
    ignoreJsDoc: boolean;
    ignoreBlankLines: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-trailing-whitespace",
        description: "Disallows trailing whitespace at the end of a line.",
        rationale:
            "Keeps version control diffs clean as it prevents accidental whitespace from being committed.",
        optionsDescription: Lint.Utils.dedent`
            Possible settings are:

            * \`"${OPTION_IGNORE_TEMPLATE_STRINGS}"\`: Allows trailing whitespace in template strings.
            * \`"${OPTION_IGNORE_COMMENTS}"\`: Allows trailing whitespace in comments.
            * \`"${OPTION_IGNORE_JSDOC}"\`: Allows trailing whitespace only in JSDoc comments.
            * \`"${OPTION_IGNORE_BLANK_LINES}"\`: Allows trailing whitespace on empty lines.`,
        hasFix: true,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_IGNORE_COMMENTS,
                    OPTION_IGNORE_JSDOC,
                    OPTION_IGNORE_TEMPLATE_STRINGS,
                    OPTION_IGNORE_BLANK_LINES,
                ],
            },
        },
        optionExamples: [true, [true, OPTION_IGNORE_COMMENTS], [true, OPTION_IGNORE_JSDOC]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "trailing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const ignoreComments = this.ruleArguments.indexOf(OPTION_IGNORE_COMMENTS) !== -1;
        return this.applyWithFunction(sourceFile, walk, {
            ignoreBlankLines: this.ruleArguments.indexOf(OPTION_IGNORE_BLANK_LINES) !== -1,
            ignoreComments,
            ignoreJsDoc: ignoreComments || this.ruleArguments.indexOf(OPTION_IGNORE_JSDOC) !== -1,
            ignoreTemplates: this.ruleArguments.indexOf(OPTION_IGNORE_TEMPLATE_STRINGS) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const possibleFailures: ts.TextRange[] = [];
    const sourceFile = ctx.sourceFile;
    const text = sourceFile.text;
    for (const line of getLineRanges(sourceFile)) {
        // \s matches any whitespace character (equal to [\r\n\t\f\v ])
        const match = text.substr(line.pos, line.contentLength).match(/\s+$/);
        if (match !== null && !(ctx.options.ignoreBlankLines && match.index === 0)) {
            possibleFailures.push({
                end: line.pos + line.contentLength,
                pos: line.pos + match.index!,
            });
        }
    }

    if (possibleFailures.length === 0) {
        return;
    }
    const excludedRanges = ctx.options.ignoreTemplates
        ? ctx.options.ignoreJsDoc
            ? getExcludedRanges(sourceFile, ctx.options)
            : getTemplateRanges(sourceFile)
        : ctx.options.ignoreJsDoc
            ? getExcludedComments(sourceFile, ctx.options)
            : [];
    for (const possibleFailure of possibleFailures) {
        if (
            !excludedRanges.some(
                range => range.pos < possibleFailure.pos && possibleFailure.pos < range.end,
            )
        ) {
            ctx.addFailure(
                possibleFailure.pos,
                possibleFailure.end,
                Rule.FAILURE_STRING,
                Lint.Replacement.deleteFromTo(possibleFailure.pos, possibleFailure.end),
            );
        }
    }
}

function getExcludedRanges(sourceFile: ts.SourceFile, options: Options): ts.TextRange[] {
    const intervals: ts.TextRange[] = [];
    forEachTokenWithTrivia(sourceFile, (text, kind, range) => {
        if (kind >= ts.SyntaxKind.FirstTemplateToken && kind <= ts.SyntaxKind.LastTemplateToken) {
            intervals.push(range);
        } else if (options.ignoreComments) {
            if (
                kind === ts.SyntaxKind.SingleLineCommentTrivia ||
                kind === ts.SyntaxKind.MultiLineCommentTrivia
            ) {
                intervals.push(range);
            }
        } else if (options.ignoreJsDoc) {
            if (isJsDoc(text, kind, range)) {
                intervals.push(range);
            }
        }
    });
    return intervals;
}

function getExcludedComments(sourceFile: ts.SourceFile, options: Options): ts.TextRange[] {
    const intervals: ts.TextRange[] = [];
    forEachComment(sourceFile, (text, comment) => {
        if (
            options.ignoreComments ||
            (options.ignoreJsDoc && isJsDoc(text, comment.kind, comment))
        ) {
            intervals.push(comment);
        }
    });
    return intervals;
}

function isJsDoc(sourceText: string, kind: ts.SyntaxKind, range: ts.TextRange) {
    return (
        kind === ts.SyntaxKind.MultiLineCommentTrivia &&
        sourceText[range.pos + 2] === "*" &&
        sourceText[range.pos + 3] !== "*"
    );
}
