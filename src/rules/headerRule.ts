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
    public static NOT_FOUND_FAILURE_STRING = "no header found at the start of the file"
    public static WHITESPACE_FAILURE_STRING = "whitespace found at the start of the file instead of a header"
    public static PATTERN_FAILURE_STRING = "header must match expression provided";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var options = this.getOptions();
        return this.applyWithWalker(new HeaderWalker(syntaxTree, this.getOptions()));
    }
}

class HeaderWalker extends Lint.RuleWalker {
    private firstToken = true;
    private firstTrivia = true;
    private pattern: RegExp;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options)
        this.pattern = new RegExp(options.ruleArguments[0]);
    }

    public visitToken(token: TypeScript.ISyntaxToken): void {
        var options = this.getOptions();
        if (this.firstToken) {
            this.firstToken = false;
            var trivia = token.leadingTrivia().toArray();
            trivia.forEach((triviaItem) => {
                if (!this.firstTrivia) { return; }
                this.firstTrivia = false;
                switch (triviaItem.kind()) {
                    case TypeScript.SyntaxKind.WhitespaceTrivia:
                    case TypeScript.SyntaxKind.NewLineTrivia:
                        this.addFailureAt(0, 0, Rule.WHITESPACE_FAILURE_STRING);
                        break;
                    case TypeScript.SyntaxKind.MultiLineCommentTrivia:
                        var fullText = triviaItem.fullText();
                        var text = fullText.replace(/\n\s*\*\/$|^(\/\*\n|\s*\* ?)/gm, '');
                        if (!this.pattern.test(text)) {
                            this.addFailureAt(this.position(), fullText.length, Rule.PATTERN_FAILURE_STRING);
                        }
                        break;
                    default:
                        this.addFailureAt(0, 0, Rule.NOT_FOUND_FAILURE_STRING);
                }
            });
            if (!trivia.length) {
                this.addFailureAt(0, 0, Rule.NOT_FOUND_FAILURE_STRING);
            }
        }
        super.visitToken(token);
    }

    private addFailureAt(currentPosition: number, width: number, failureString: string) {
        var failure = this.createFailure(currentPosition, width, failureString);
        this.addFailure(failure);
    }
}
