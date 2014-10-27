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

export class Rule extends Lint.Rules.AbstractRule {
    public static ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
    public static FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new JsdocWalker(syntaxTree, this.getOptions()));
    }
}

class JsdocWalker extends Lint.RuleWalker {
    public visitToken(token: TypeScript.ISyntaxToken): void {
        var tokenWidth = TypeScript.width(token);
        this.findFailuresForTrivia(token.leadingTrivia().toArray(), this.getPosition());
        this.findFailuresForTrivia(token.trailingTrivia().toArray(), this.getPosition() + token.leadingTriviaWidth() + tokenWidth);

        super.visitToken(token);
    }

    private findFailuresForTrivia(triviaList: TypeScript.ISyntaxTrivia[], startingPosition: number) {
        var currentPosition = startingPosition;
        triviaList.forEach((triviaItem) => {
            if (triviaItem.kind() === TypeScript.SyntaxKind.MultiLineCommentTrivia) {
                var commentText = triviaItem.fullText();
                var lines = commentText.split("\n");
                var jsdocPosition = currentPosition;
                var firstLine = lines[0];

                // regex is: start of string, followed by any amount of whitespace, followed by /**
                var isJsdocMatch = firstLine.match(/^\s*\/\*\*/);
                if (isJsdocMatch != null) {
                    var lineMap = this.getSyntaxTree().lineMap();

                    if (lines.length === 1) {
                        var firstLineMatch = firstLine.match(/^\s*\/\*\* (.* )?\*\/$/);
                        if (firstLineMatch == null) {
                            this.addFailureAt(jsdocPosition, firstLine.length, Rule.FORMAT_FAILURE_STRING);
                        }
                        currentPosition += triviaItem.fullWidth();
                        return;
                    }
                    var indexToMatch = firstLine.indexOf("**") + lineMap.getLineAndCharacterFromPosition(currentPosition).character();
                    // all lines but the first and last
                    var otherLines = lines.splice(1, lines.length - 2);
                    jsdocPosition += firstLine.length + 1; // + 1 for the splitted-out newline
                    otherLines.forEach((line) => {
                        // regex is: start of string, followed by any amount of whitespace, followed by *,
                        // followed by either a space or the end of the string
                        var asteriskMatch = line.match(/^\s*\*( |$)/);
                        if (asteriskMatch == null) {
                            this.addFailureAt(jsdocPosition, line.length, Rule.FORMAT_FAILURE_STRING);
                        }
                        var asteriskIndex = line.indexOf("*");
                        if (asteriskIndex !== indexToMatch) {
                            this.addFailureAt(jsdocPosition, line.length, Rule.ALIGNMENT_FAILURE_STRING);
                        }
                        jsdocPosition += line.length + 1; // + 1 for the splitted-out newline
                    });
                    var lastLine = lines[lines.length - 1];
                    // regex is: start of string, followed by any amount of whitespace, followed by */,
                    // followed by the end of the string
                    var endBlockCommentMatch = lastLine.match(/^\s*\*\/$/);
                    if (endBlockCommentMatch == null) {
                        this.addFailureAt(jsdocPosition, lastLine.length,  Rule.FORMAT_FAILURE_STRING);
                    }
                    var lastAsteriskIndex = lastLine.indexOf("*");
                    if (lastAsteriskIndex !== indexToMatch) {
                        this.addFailureAt(jsdocPosition, lastLine.length, Rule.ALIGNMENT_FAILURE_STRING);
                    }
                }

            }
            currentPosition += triviaItem.fullWidth();
        });
    }

    private addFailureAt(currentPosition: number, width: number, failureString: string) {
        var failure = this.createFailure(currentPosition, width, failureString);
        this.addFailure(failure);
    }
}
