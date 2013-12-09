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
    static FAILURE_STRING = "this jsdoc is not formatted correctly";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new JsdocWalker(syntaxTree, this.getOptions()));
    }
}

class JsdocWalker extends Lint.RuleWalker {
    public visitToken(token: TypeScript.ISyntaxToken): void {
        this.findFailuresForTrivia(token.leadingTrivia().toArray(), this.position());
        this.findFailuresForTrivia(token.trailingTrivia().toArray(), this.position() + token.leadingTriviaWidth() + token.width());

        super.visitToken(token);
    }

    private findFailuresForTrivia(triviaList: TypeScript.ISyntaxTrivia[], startingPosition: number) {
        var currentPosition = startingPosition;
        var lastTriviaItem: TypeScript.ISyntaxTrivia = null;
        triviaList.forEach((triviaItem) => {
            if (triviaItem.kind() === TypeScript.SyntaxKind.MultiLineCommentTrivia) {
                var commentText = triviaItem.fullText();
                var lines = commentText.split("\n");

                var firstLine = lines[0];
                // regex is: start of string, followed by any amount of whitespace, followed by /**
                var isJsdocMatch = firstLine.match(/^\s*\/\*\*/);
                if (isJsdocMatch != null) {
                    var lastTriviaItemLines = lastTriviaItem.fullText().split("\n");
                    var lastTriviaItemLineLength = lastTriviaItemLines[lastTriviaItemLines.length - 1].length;
                    var indexToMatch = firstLine.indexOf("**") + lastTriviaItemLineLength;
                    // all lines but the first and last
                    var otherLines = lines.splice(1, lines.length - 2);
                    otherLines.forEach((line) => {
                        // regex is: start of string, followed by any amount of whitespace, followed by *,
                        // followed by either a space or the end of the string
                        var asteriskMatch = line.match(/^\s*\*( |$)/);
                        if (asteriskMatch == null) {
                            this.addFailureAt(currentPosition, triviaItem.fullWidth());
                        }
                        var asteriskIndex = line.indexOf("*");
                        if (asteriskIndex !== indexToMatch) {
                            this.addFailureAt(currentPosition, triviaItem.fullWidth());
                        }
                    });
                    var lastLine = lines[lines.length - 1];
                    // regex is: start of string, followed by any amount of whitespace, followed by */,
                    // followed by the end of the string
                    var endBlockCommentMatch = lastLine.match(/^\s*\*\/$/);
                    if (endBlockCommentMatch == null) {
                        this.addFailureAt(currentPosition, triviaItem.fullWidth());
                    }
                    var lastAsteriskIndex = lastLine.indexOf("*");
                    if (lastAsteriskIndex !== indexToMatch) {
                        this.addFailureAt(currentPosition, triviaItem.fullWidth());
                    }
                }

            }
            currentPosition += triviaItem.fullWidth();
            lastTriviaItem = triviaItem;
        });
    }

    private addFailureAt(currentPosition: number, width: number) {
        var failure = this.createFailure(currentPosition, width, Rule.FAILURE_STRING);
        this.addFailure(failure);
    }
}
