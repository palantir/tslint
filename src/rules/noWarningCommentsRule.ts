/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";
import * as utils from "../utils";

interface IOptionsObject {
    location?: string;
    terms?: string[];
}

interface Options {
    location?: "start" | "anywhere";
    terms?: string[];
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-warning-comments",
        description: "Enforces preventing comments that include any of the terms deemed to be 'warnings'.",
        rationale: "Helps avoid unfinished or buggy code being checked in to source control.",
        optionsDescription: Lint.Utils.dedent`
            Two arguments may be optionally provided:

            * \`"location"\` specifies where to look for 'warning' terms in comments:
                * 'start' specifies at the start.
                * 'anywhere' specifies anywhere in the comment.
            * \`"terms"\` specifies a list of terms (case-insensitive) to be considered 'warning' terms.

            By default, \`"location"\` defaults to \`"start"\` and \`"terms"\` defaults to
            \`["todo", "fixme", "xxx"]\`.
            `,
        options: {
            type: "object",
            additionalProperties: false,
            properties: {
                terms: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
                location: {type: "string"},
            },
        },
        optionExamples: [
            true,
            [true, {location: "anywhere"}],
            [true, {location: "start", terms: ["todo", "fixme", "xxx"]}],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static COMMENT_ERROR_FACTORY = (term: string, location: "start" | "anywhere"): string =>
        `Warning term '${term}' found ${location === "start" ? "at start of" : "in"} comment`

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments[0] as IOptionsObject));
    }
}

function parseOptions(options: IOptionsObject): Options {
    if (typeof options === "undefined" || options === null) {
        options = {};
    }

    if (
        (typeof options.location !== "undefined" && options.location !== null) &&
        options.location !== "start" &&
        options.location !== "anywhere") {
        throw new Error(`Option 'location' value is invalid: ${options.location}`);
    }

    if (
        (typeof options.terms !== "undefined" && options.terms !== null) &&
        !(options.terms instanceof Array)) {
        throw new Error("Option 'terms' must be a string array.");
    }

    return {
        location: (typeof options.location !== "undefined" && options.location !== null) ?
            options.location as "start" | "anywhere" :
            "start",
        terms: (typeof options.terms !== "undefined" && options.terms !== null) ?
            options.terms :
            ["todo", "fixme", "xxx"],
    };
}

function checkCommentContainsWarningTerms(comment: string, regExps: RegExp[], rng: ts.CommentRange, ctx: Lint.WalkContext<Options>) {
    regExps.forEach((regExp) => {
        const match = regExp.exec(comment);
        if (typeof match !== "undefined" && match !== null) {
            ctx.addFailure(rng.pos, rng.end, Rule.COMMENT_ERROR_FACTORY(match[1], ctx.options.location!));
        }
    });
}

function convertToRegExp(term: string, location: "start" | "anywhere") {
    const escaped = utils.escapeRegExp(term);
    let prefix;

    /*
     * If the term ends in a word character (a-z0-9_), ensure a word
     * boundary at the end, so that substrings do not get falsely
     * matched. eg "todo" in a string such as "mastodon".
     * If the term ends in a non-word character, then \b won't match on
     * the boundary to the next non-word character, which would likely
     * be a space. For example `/\bFIX!\b/.test('FIX! blah') === false`.
     * In these cases, use no bounding match. Same applies for the
     * prefix, handled below.
     */
    const suffix = /\w$/.test(term) ? "\\b" : "";

    if (location === "start") {
        /*
         * When matching at the start, ignore leading whitespace, and
         * there's no need to worry about word boundaries.
         */
        prefix = "^\\s*";
    } else if (/^\w/.test(term)) {
        prefix = "\\b";
    } else {
        prefix = "";
    }

    return new RegExp(`${prefix}(${escaped})${suffix}`, "i");
}

function walk(ctx: Lint.WalkContext<Options>) {
    const warningRegExps: RegExp[] = ctx.options.terms!.map((term) => convertToRegExp(term, ctx.options.location!));

    tsutils.forEachComment(ctx.sourceFile, (fullText, {kind, pos, end}) => {
        let start = pos + 2;
        if (
            // exclude empty single-line comments
            start === end ||
            // exclude /// <reference path="...">
            fullText[start] === "/" && ctx.sourceFile.referencedFiles.some((ref) => ref.pos >= pos && ref.end <= end)) {
            return;
        }
        // skip all leading slashes/asterisks
        while (fullText[start] === "/" || fullText[start] === "*") {
            ++start;
        }
        if (start === end) {
            return;
        }
        const commentText = fullText.slice(start, end);

        checkCommentContainsWarningTerms(commentText, warningRegExps, {kind, pos, end}, ctx);
    });
}
