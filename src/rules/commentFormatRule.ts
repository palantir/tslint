/*
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

var OPTION_SPACE = "check-space";
var OPTION_LOWERCASE = "check-lowercase";
var OPTION_UPPERCASE = "check-uppercase";

export class Rule extends Lint.Rules.AbstractRule {
    static LOWERCASE_FAILURE = "comment must start with lowercase letter";
    static UPPERCASE_FAILURE = "comment must start with uppercase letter";
    static LEADING_SPACE_FAILURE = "comment must start with a space";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CommentWalker(sourceFile, this.getOptions()));
    }
}

class CommentWalker extends Lint.SkipableTokenAwareRuleWalker {
    public visitSourceFile(node: ts.SourceFile): void {
        super.visitSourceFile(node);
        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.ES5, false, node.text), (scanner: ts.Scanner) => {
            var startPos = scanner.getStartPos();
            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                return;
            }

            if (scanner.getToken() === ts.SyntaxKind.SingleLineCommentTrivia) {
                var commentText = scanner.getTokenText();
                var startPosition = scanner.getTokenPos() + 2;
                var width = commentText.length - 2;
                if (this.hasOption(OPTION_SPACE)) {
                    if (!this.startsWithSpace(commentText)) {
                        var leadingSpaceFailure = this.createFailure(startPosition, width, Rule.LEADING_SPACE_FAILURE);
                        this.addFailure(leadingSpaceFailure);
                    }
                }
                if (this.hasOption(OPTION_LOWERCASE)) {
                    if (!this.startsWithLowercase(commentText)) {
                        var lowercaseFailure = this.createFailure(startPosition, width, Rule.LOWERCASE_FAILURE);
                        this.addFailure(lowercaseFailure);
                    }
                }
                if (this.hasOption(OPTION_UPPERCASE)) {
                    if (!this.startsWithUppercase(commentText)) {
                        var uppercaseFailure = this.createFailure(startPosition, width, Rule.UPPERCASE_FAILURE);
                        this.addFailure(uppercaseFailure);
                    }
                }
            }
        });
    }

    private startsWithSpace(commentText: string): boolean {
        if (commentText.length <= 2) {
            return true; // comment is "//"? Technically not a violation.
        }

        // whitelist //#region and //#endregion
        if ((/^#(end)?region/).test(commentText.substring(2))) {
            return true;
        }

        var firstCharacter = commentText.charAt(2); // first character after the space
        // three slashes (///) also works, to allow for ///<reference>
        return firstCharacter === " " || firstCharacter === "/";
    }

    private startsWithLowercase(commentText: string): boolean {
        return this.startsWith(commentText, c => c.toLowerCase());
    }

    private startsWithUppercase(commentText: string): boolean {
        return this.startsWith(commentText, c => c.toUpperCase());
    }

    private startsWith(commentText: string, changeCase: (str: string) => string): boolean {
        if (commentText.length <= 2) {
            return true; // comment is "//"? Technically not a violation.
        }

        // regex is "start of string"//"any amount of whitespace"("word character")
        var firstCharacterMatch = commentText.match(/^\/\/\s*(\w)/);
        if (firstCharacterMatch != null) {
            // the first group matched, i.e. the thing in the parens, is the first non-space character, if it's alphanumeric
            var firstCharacter = firstCharacterMatch[1];
            return firstCharacter === changeCase(firstCharacter);
        } else {
            // first character isn't alphanumeric/doesn't exist? Technically not a violation
            return true;
        }
    }
}
