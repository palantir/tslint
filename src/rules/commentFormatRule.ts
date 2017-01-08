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
import { escapeRegExp } from "../utils";

interface IExceptionsObject {
    ignoreWords?: string[];
    ignorePattern?: string;
}

type ExceptionsRegExp = RegExp | null;

const OPTION_SPACE = "check-space";
const OPTION_LOWERCASE = "check-lowercase";
const OPTION_UPPERCASE = "check-uppercase";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "comment-format",
        description: "Enforces formatting rules for single-line comments.",
        rationale: "Helps maintain a consistent, readable style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            Three arguments may be optionally provided:

            * \`"check-space"\` requires that all single-line comments must begin with a space, as in \`// comment\`
                * note that comments starting with \`///\` are also allowed, for things such as \`///<reference>\`
            * \`"check-lowercase"\` requires that the first non-whitespace character of a comment must be lowercase, if applicable.
            * \`"check-uppercase"\` requires that the first non-whitespace character of a comment must be uppercase, if applicable.
            
            Exceptions to \`"check-lowercase"\` or \`"check-uppercase"\` can be managed with object that may be passed as last argument.
            
            One of two options can be provided in this object:
                
                * \`"ignoreWords"\`  - array of strings - words that will be ignored at the beginning of the comment.
                * \`"ignorePattern"\` - string - RegExp pattern that will be ignored at the beginning of the comment.
            `,
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "string",
                        enum: [
                            "check-space",
                            "check-lowercase",
                            "check-uppercase",
                        ],
                    },
                    {
                        type: "object",
                        properties: {
                            ignoreWords: {
                                type: "array",
                                items: {
                                    type: "string",
                                },
                            },
                            ignorePattern: {
                                type: "string",
                            },
                        },
                        minProperties: 1,
                        maxProperties: 1,
                    },
                ],
            },
            minLength: 1,
            maxLength: 4,
        },
        optionExamples: [
            '[true, "check-space", "check-uppercase"]',
            '[true, "check-lowercase", {"ignoreWords": ["TODO", "HACK"]}]',
            '[true, "check-lowercase", {"ignorePattern": "STD\\w{2,3}\\b"}]',
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static LOWERCASE_FAILURE = "comment must start with lowercase letter";
    public static UPPERCASE_FAILURE = "comment must start with uppercase letter";
    public static LEADING_SPACE_FAILURE = "comment must start with a space";
    public static IGNORE_WORDS_FAILURE_FACTORY = (words: string[]): string => ` or the word(s): ${words.join(", ")}`;
    public static IGNORE_PATTERN_FAILURE_FACTORY = (pattern: string): string => ` or its start must match the regex pattern "${pattern}"`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CommentWalker(sourceFile, this.getOptions()));
    }
}

class CommentWalker extends Lint.SkippableTokenAwareRuleWalker {
    private exceptionsRegExp: ExceptionsRegExp;
    private failureIgnorePart: string = "";

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.exceptionsRegExp = this.composeExceptionsRegExp();
    }

    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);
        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text), (scanner: ts.Scanner) => {
            const startPos = scanner.getStartPos();
            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                return;
            }

            if (scanner.getToken() === ts.SyntaxKind.SingleLineCommentTrivia) {
                const commentText = scanner.getTokenText();
                const startPosition = scanner.getTokenPos() + 2;
                const width = commentText.length - 2;
                if (this.hasOption(OPTION_SPACE)) {
                    if (!startsWithSpace(commentText)) {
                        this.addFailureAt(startPosition, width, Rule.LEADING_SPACE_FAILURE);
                    }
                }
                if (this.hasOption(OPTION_LOWERCASE)) {
                    if (!startsWithLowercase(commentText) && !this.startsWithException(commentText)) {
                        this.addFailureAt(startPosition, width, Rule.LOWERCASE_FAILURE + this.failureIgnorePart);
                    }
                }
                if (this.hasOption(OPTION_UPPERCASE)) {
                    if (!startsWithUppercase(commentText) && !isEnableDisableFlag(commentText) && !this.startsWithException(commentText)) {
                        this.addFailureAt(startPosition, width, Rule.UPPERCASE_FAILURE + this.failureIgnorePart);
                    }
                }
            }
        });
    }

    private startsWithException(commentText: string): boolean {
        if (this.exceptionsRegExp == null) {
            return false;
        }

        return this.exceptionsRegExp.test(commentText);
    }

    private composeExceptionsRegExp(): ExceptionsRegExp {
        const optionsList = this.getOptions() as Array<string | IExceptionsObject>;
        const exceptionsObject = optionsList[optionsList.length - 1];

        // early return if last element is string instead of exceptions object
        if (typeof exceptionsObject === "string" || !exceptionsObject) {
            return null;
        }

        if (exceptionsObject.ignorePattern) {
            this.failureIgnorePart = Rule.IGNORE_PATTERN_FAILURE_FACTORY(exceptionsObject.ignorePattern);
            // regex is "start of string"//"any amount of whitespace" followed by user provided ignore pattern
            return new RegExp(`^//\\s*(${exceptionsObject.ignorePattern})`);
        }

        if (exceptionsObject.ignoreWords) {
            this.failureIgnorePart = Rule.IGNORE_WORDS_FAILURE_FACTORY(exceptionsObject.ignoreWords);
            // Converts all exceptions values to strings, trim whitespace, escapes RegExp special characters and combines into alternation  
            const wordsPattern = exceptionsObject.ignoreWords
                .map(String)
                .map((str) => str.trim())
                .map(escapeRegExp)
                .join("|");

            // regex is "start of string"//"any amount of whitespace"("any word from ignore list") followed by non alphanumeric character
            return new RegExp(`^//\\s*(${wordsPattern})\\b`);
        }

        return null;
    }
}

function startsWith(commentText: string, changeCase: (str: string) => string) {
    if (commentText.length <= 2) {
        return true; // comment is "//"? Technically not a violation.
    }

    // regex is "start of string"//"any amount of whitespace"("word character")
    const firstCharacterMatch = commentText.match(/^\/\/\s*(\w)/);
    if (firstCharacterMatch != null) {
        // the first group matched, i.e. the thing in the parens, is the first non-space character, if it's alphanumeric
        const firstCharacter = firstCharacterMatch[1];
        return firstCharacter === changeCase(firstCharacter);
    } else {
        // first character isn't alphanumeric/doesn't exist? Technically not a violation
        return true;
    }
}

function startsWithLowercase(commentText: string) {
    return startsWith(commentText, (c) => c.toLowerCase());
}

function startsWithUppercase(commentText: string) {
    return startsWith(commentText, (c) => c.toUpperCase());
}

function startsWithSpace(commentText: string) {
    if (commentText.length <= 2) {
        return true; // comment is "//"? Technically not a violation.
    }

    const commentBody = commentText.substring(2);

    // whitelist //#region and //#endregion
    if ((/^#(end)?region/).test(commentBody)) {
        return true;
    }
    // whitelist JetBrains IDEs' "//noinspection ..."
    if ((/^noinspection\s/).test(commentBody)) {
        return true;
    }

    const firstCharacter = commentBody.charAt(0);
    // three slashes (///) also works, to allow for ///<reference>
    return firstCharacter === " " || firstCharacter === "/";
}

function isEnableDisableFlag(commentText: string): boolean {
    // regex is: start of string followed by "/*" or "//"
    // followed by any amount of whitespace followed by "tslint:"
    // followed by either "enable" or "disable"
    return /^(\/\*|\/\/)\s*tslint:(enable|disable)/.test(commentText);
}
