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
            * \`"check-uppercase"\` requires that the first non-whitespace character of a comment must be uppercase, if applicable.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["check-space", "check-lowercase", "check-uppercase"],
            },
            minLength: 1,
            maxLength: 3,
        },
        optionExamples: ['[true, "check-space", "check-lowercase"]'],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static LOWERCASE_FAILURE = "comment must start with lowercase letter";
    public static UPPERCASE_FAILURE = "comment must start with uppercase letter";
    public static LEADING_SPACE_FAILURE = "comment must start with a space";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CommentWalker(sourceFile, this.getOptions()));
    }
}

class CommentWalker extends Lint.SkippableTokenAwareRuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);
        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text), (scanner: ts.Scanner) => {
            const skip = this.getSkipEndFromStart(scanner.getStartPos());
            if (skip !== undefined) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(skip);
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
                    if (!startsWithLowercase(commentText)) {
                        this.addFailureAt(startPosition, width, Rule.LOWERCASE_FAILURE);
                    }
                }
                if (this.hasOption(OPTION_UPPERCASE)) {
                    if (!startsWithUppercase(commentText) && !isEnableDisableFlag(commentText)) {
                        this.addFailureAt(startPosition, width, Rule.UPPERCASE_FAILURE);
                    }
                }
            }
        });
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
