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
import * as Lint from "../lint";

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
            type: "list",
            listType: {
                type: "enum",
                enumValues: ["check-space", "check-lowercase", "check-uppercase"],
            },
        },
        optionExamples: ['[true, "check-space", "check-lowercase"]'],
        type: "style",
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
                        const leadingSpaceFailure = this.createFailure(startPosition, width, Rule.LEADING_SPACE_FAILURE);
                        this.addFailure(leadingSpaceFailure);
                    }
                }
                if (this.hasOption(OPTION_LOWERCASE)) {
                    if (!startsWithLowercase(commentText)) {
                        const lowercaseFailure = this.createFailure(startPosition, width, Rule.LOWERCASE_FAILURE);
                        this.addFailure(lowercaseFailure);
                    }
                }
                if (this.hasOption(OPTION_UPPERCASE)) {
                    if (!startsWithUppercase(commentText)) {
                        const uppercaseFailure = this.createFailure(startPosition, width, Rule.UPPERCASE_FAILURE);
                        this.addFailure(uppercaseFailure);
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
    return startsWith(commentText, c => c.toLowerCase());
}

function startsWithUppercase(commentText: string) {
    return startsWith(commentText, c => c.toUpperCase());
}

function startsWithSpace(commentText: string) {
    if (commentText.length <= 2) {
        return true; // comment is "//"? Technically not a violation.
    }

    // whitelist //#region and //#endregion
    if ((/^#(end)?region/).test(commentText.substring(2))) {
        return true;
    }

    const firstCharacter = commentText.charAt(2); // first character after the space
    // three slashes (///) also works, to allow for ///<reference>
    return firstCharacter === " " || firstCharacter === "/";
}
