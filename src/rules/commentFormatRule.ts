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

import { ENABLE_DISABLE_REGEX } from "../enableDisableRules";
import * as Lint from "../index";
import { escapeRegExp, isLowerCase, isUpperCase } from "../utils";

interface IExceptionsObject {
    "ignore-words"?: string[];
    "ignore-pattern"?: string;
}

interface Options {
    space: boolean;
    case: Case;
    exceptions?: RegExp;
    failureSuffix: string;
    allowTrailingLowercase: boolean;
}

interface Failures {
    leadingSpace: boolean;
    uppercase: boolean;
    lowercase: boolean;
    firstLetterPos: number;
}

const enum Case {
    None,
    Lower,
    Upper,
}

const OPTION_SPACE = "check-space";
const OPTION_LOWERCASE = "check-lowercase";
const OPTION_UPPERCASE = "check-uppercase";
const OPTION_ALLOW_TRAILING_LOWERCASE = "allow-trailing-lowercase";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "comment-format",
        description: "Enforces formatting rules for single-line comments.",
        rationale: "Helps maintain a consistent, readable style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            Four arguments may be optionally provided:

            * \`"${OPTION_SPACE}"\` requires that all single-line comments must begin with a space, as in \`// comment\`
                * note that for comments starting with multiple slashes, e.g. \`///\`, leading slashes are ignored
                * TypeScript reference comments are ignored completely
            * \`"${OPTION_LOWERCASE}"\` requires that the first non-whitespace character of a comment must be lowercase, if applicable.
            * \`"${OPTION_UPPERCASE}"\` requires that the first non-whitespace character of a comment must be uppercase, if applicable.
            * \`"${OPTION_ALLOW_TRAILING_LOWERCASE}"\` allows that only the first comment of a series of comments needs to be uppercase.
                * requires \`"${OPTION_UPPERCASE}"\`
                * comments must start at the same position

            Exceptions to \`"${OPTION_LOWERCASE}"\` or \`"${OPTION_UPPERCASE}"\` can be managed with object that may be passed as last
            argument.

            One of two options can be provided in this object:

            * \`"ignore-words"\`  - array of strings - words that will be ignored at the beginning of the comment.
            * \`"ignore-pattern"\` - string - RegExp pattern that will be ignored at the beginning of the comment.
            `,
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "string",
                        enum: [
                            OPTION_SPACE,
                            OPTION_LOWERCASE,
                            OPTION_UPPERCASE,
                            OPTION_ALLOW_TRAILING_LOWERCASE,
                        ],
                    },
                    {
                        type: "object",
                        properties: {
                            "ignore-words": {
                                type: "array",
                                items: {
                                    type: "string",
                                },
                            },
                            "ignore-pattern": {
                                type: "string",
                            },
                        },
                        minProperties: 1,
                        maxProperties: 1,
                    },
                ],
            },
            minLength: 1,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_SPACE, OPTION_UPPERCASE, OPTION_ALLOW_TRAILING_LOWERCASE],
            [true, OPTION_LOWERCASE, { "ignore-words": ["TODO", "HACK"] }],
            [true, OPTION_LOWERCASE, { "ignore-pattern": "STD\\w{2,3}\\b" }],
        ],
        type: "style",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static LOWERCASE_FAILURE = "comment must start with lowercase letter";
    public static SPACE_LOWERCASE_FAILURE = "comment must start with a space and lowercase letter";
    public static UPPERCASE_FAILURE = "comment must start with uppercase letter";
    public static SPACE_UPPERCASE_FAILURE = "comment must start with a space and uppercase letter";
    public static LEADING_SPACE_FAILURE = "comment must start with a space";
    public static IGNORE_WORDS_FAILURE_FACTORY = (words: string[]): string =>
        ` or the word(s): ${words.join(", ")}`;
    public static IGNORE_PATTERN_FAILURE_FACTORY = (pattern: string): string =>
        ` or its start must match the regex pattern "${pattern}"`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

function parseOptions(options: Array<string | IExceptionsObject>): Options {
    return {
        allowTrailingLowercase: has(OPTION_ALLOW_TRAILING_LOWERCASE),
        case:
            has(OPTION_LOWERCASE)
                ? Case.Lower
                : has(OPTION_UPPERCASE)
                    ? Case.Upper
                    : Case.None,
        failureSuffix: "",
        space: has(OPTION_SPACE),
        ...composeExceptions(options[options.length - 1]),
    };

    function has(option: string): boolean {
        return options.indexOf(option) !== -1;
    }
}

function composeExceptions(
    option?: string | IExceptionsObject,
): undefined | { exceptions: RegExp; failureSuffix: string } {
    if (typeof option !== "object") {
        return undefined;
    }
    const ignorePattern = option["ignore-pattern"];
    if (ignorePattern !== undefined) {
        return {
            exceptions: new RegExp(`^\\s*(${ignorePattern})`),
            failureSuffix: Rule.IGNORE_PATTERN_FAILURE_FACTORY(ignorePattern),
        };
    }

    const ignoreWords = option["ignore-words"];
    if (ignoreWords !== undefined && ignoreWords.length !== 0) {
        return {
            exceptions: new RegExp(
                `^\\s*(?:${ignoreWords.map(word => escapeRegExp(word.trim())).join("|")})\\b`,
            ),
            failureSuffix: Rule.IGNORE_WORDS_FAILURE_FACTORY(ignoreWords),
        };
    }
    return undefined;
}

function walk(ctx: Lint.WalkContext<Options>) {
    utils.forEachComment(ctx.sourceFile, (fullText, { kind, pos, end }) => {
        let start = pos + 2;
        if (
            kind !== ts.SyntaxKind.SingleLineCommentTrivia ||
            // exclude empty comments
            start === end ||
            // exclude /// <reference path="...">
            (fullText[start] === "/" &&
                ctx.sourceFile.referencedFiles.some(ref => ref.pos >= pos && ref.end <= end))
        ) {
            return;
        }

        // skip all leading slashes
        while (fullText[start] === "/") {
            ++start;
        }
        if (start === end) {
            return;
        }
        const commentText = fullText.slice(start, end);
        // whitelist //#region and //#endregion and JetBrains IDEs' "//noinspection ..."
        if (/^(?:#(?:end)?region|noinspection\s)/.test(commentText)) {
            return;
        }

        const failures: Failures = { leadingSpace: false, uppercase: false, lowercase: false, firstLetterPos: -1};
        if (ctx.options.space && commentText[0] !== " ") {
            failures.leadingSpace = true;
        }

        if (
            ctx.options.case === Case.None ||
            (ctx.options.exceptions !== undefined && ctx.options.exceptions.test(commentText)) ||
            ENABLE_DISABLE_REGEX.test(commentText)
        ) {
            addFailure(ctx, commentText, start, end, failures);
            return;
        }

        // search for first non-space character to check if lower or upper
        const charPos = commentText.search(/\S/);
        if (charPos === -1) {
            addFailure(ctx, commentText, start, end, failures);
            return;
        }
        failures.firstLetterPos = charPos;
        if (ctx.options.case === Case.Lower && !isLowerCase(commentText[charPos])) {
            failures.lowercase = true;
        } else if (ctx.options.case === Case.Upper && !isUpperCase(commentText[charPos])) {
            failures.uppercase = true;
            if (ctx.options.allowTrailingLowercase) {
                const lineAndCharCurrentComment = ts.getLineAndCharacterOfPosition(ctx.sourceFile, pos);
                const posPrevComment = ctx.sourceFile.getPositionOfLineAndCharacter(
                    lineAndCharCurrentComment.line - 1, 0) + lineAndCharCurrentComment.character;

                const prevComment = utils.getCommentAtPosition(ctx.sourceFile, posPrevComment);
                if (prevComment !== undefined && prevComment.pos === posPrevComment) {
                    failures.uppercase = false;
                }
            }
        }
        addFailure(ctx, commentText, start, end, failures);
    });
}

function addFailure(ctx: Lint.WalkContext<Options>, comment: string, start: number, end: number, failures: Failures) {
    // No failure detected
    if (!failures.leadingSpace && !failures.lowercase && !failures.uppercase) {
        return;
    }

    if (failures.lowercase) {
        const msg = failures.leadingSpace ? Rule.SPACE_LOWERCASE_FAILURE : Rule.LOWERCASE_FAILURE;
        const fix = generateFix(comment, start, failures);
        ctx.addFailure(start, end, msg + ctx.options.failureSuffix, fix);
    } else if (failures.uppercase) {
        const msg = failures.leadingSpace ? Rule.SPACE_UPPERCASE_FAILURE : Rule.UPPERCASE_FAILURE;
        const fix = generateFix(comment, start, failures);
        ctx.addFailure(start, end, msg + ctx.options.failureSuffix, fix);
    } else {
        // Only whitespace failure
        ctx.addFailure(start, end, Rule.LEADING_SPACE_FAILURE, generateFix(comment, start, failures));
    }
}

function generateFix(comment: string, start: number, failures: Failures) {
    if (failures.lowercase) {
        const fix = comment[failures.firstLetterPos].toLowerCase();
        if (failures.leadingSpace) {
            return new Lint.Replacement(start, 1, ` ${fix}`);
        }
        return new Lint.Replacement(start + failures.firstLetterPos, 1, fix);
    } else if (failures.uppercase) {
        const fix = comment[failures.firstLetterPos].toUpperCase();
        if (failures.leadingSpace) {
            return new Lint.Replacement(start, 1, ` ${fix}`);
        }
        return new Lint.Replacement(start + failures.firstLetterPos, 1, fix);
    } else {
        return Lint.Replacement.appendText(start, " ");
    }
}
