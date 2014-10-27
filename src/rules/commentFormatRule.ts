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

/// <reference path='../../lib/tslint.d.ts' />

var OPTION_SPACE = "check-space";
var OPTION_LOWERCASE = "check-lowercase";

export class Rule extends Lint.Rules.AbstractRule {
    static LOWERCASE_FAILURE = "comment must start with lowercase letter";
    static LEADING_SPACE_FAILURE = "comment must start with a space";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new CommentWalker(syntaxTree, this.getOptions()));
    }
}

class CommentWalker extends Lint.RuleWalker {
    public visitToken(token: TypeScript.ISyntaxToken): void {
        var tokenWidth = TypeScript.width(token);
        this.findFailuresForTrivia(token.leadingTrivia().toArray(), this.getPosition());
        this.findFailuresForTrivia(token.trailingTrivia().toArray(), this.getPosition() + token.leadingTriviaWidth() + tokenWidth);

        super.visitToken(token);
    }

    private findFailuresForTrivia(triviaList: TypeScript.ISyntaxTrivia[], startingPosition: number) {
        var currentPosition = startingPosition;
        triviaList.forEach((triviaItem) => {
            if (triviaItem.kind() === TypeScript.SyntaxKind.SingleLineCommentTrivia) {
                var commentText = triviaItem.fullText();
                var startPosition = currentPosition + 2;
                var endPosition = triviaItem.fullWidth() - 2;
                if (this.hasOption(OPTION_SPACE)) {
                    if (!this.startsWithSpace(commentText)) {
                        var leadingSpaceFailure = this.createFailure(startPosition, endPosition, Rule.LEADING_SPACE_FAILURE);
                        this.addFailure(leadingSpaceFailure);
                    }
                }
                if (this.hasOption(OPTION_LOWERCASE)) {
                    if (!this.startsWithLowercase(commentText)) {
                        var lowercaseFailure = this.createFailure(startPosition, endPosition, Rule.LOWERCASE_FAILURE);
                        this.addFailure(lowercaseFailure);
                    }
                }
            }
            currentPosition += triviaItem.fullWidth();
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
        if (commentText.length <= 2) {
            return true; // comment is "//"? Technically not a violation.
        }

        // regex is "start of string"//"any amount of whitespace"("word character")
        var firstCharacterMatch = commentText.match(/^\/\/\s*(\w)/);
        if (firstCharacterMatch != null) {
            // the first group matched, i.e. the thing in the parens, is the first non-space character, if it's alphanumeric
            var firstCharacter = firstCharacterMatch[1];
            return firstCharacter === firstCharacter.toLowerCase();
        } else {
            // first character isn't alphanumeric/doesn't exist? Technically not a violation
            return true;
        }
    }

}
