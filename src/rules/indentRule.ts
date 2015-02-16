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

var OPTION_USE_TABS = "tabs";
var OPTION_USE_SPACES = "spaces";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_TABS = "tab indentation expected";
    public static FAILURE_STRING_SPACES = "space indentation expected";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new IndentWalker(sourceFile, this.getOptions()));
    }
}

// Visit every token and enforce that only the right character is used for indentation
class IndentWalker extends Lint.RuleWalker {
    private failureString: string;
    private regExp: RegExp;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        if (this.hasOption(OPTION_USE_TABS)) {
            this.regExp = new RegExp(" ");
            this.failureString = Rule.FAILURE_STRING_TABS;
        } else if (this.hasOption(OPTION_USE_SPACES)) {
            this.regExp = new RegExp("\t");
            this.failureString = Rule.FAILURE_STRING_SPACES;
        }
    }

    public visitSourceFile(node: ts.SourceFile): void {
        if (!this.hasOption(OPTION_USE_TABS) && !this.hasOption(OPTION_USE_SPACES)) {
            // if we don't have either option, no need to check anything, and no need to call super, so just return
            return;
        }
        var scanner = ts.createScanner(ts.ScriptTarget.ES5, false, node.text);
        var lineStarts = node.getLineStarts();
        var endOfComment = -1;
        lineStarts.forEach((lineStart) => {
            if (lineStart < endOfComment) {
                // Skip checking lines inside multi-line comments
                return;
            }

            scanner.setTextPos(lineStart);
            var currentScannedType = scanner.scan();
            var fullLeadingWhitespace = "";
            var lastStartPos = -1;
            while (currentScannedType === ts.SyntaxKind.WhitespaceTrivia) {
                var startPos = scanner.getStartPos();
                if (startPos === lastStartPos) {
                    break;
                }
                lastStartPos = startPos;

                fullLeadingWhitespace += scanner.getTokenText();
                currentScannedType = scanner.scan();
            }

            var commentRanges = ts.getTrailingCommentRanges(node.text, lineStart);
            if (commentRanges) {
                endOfComment = commentRanges[commentRanges.length - 1].end;
            }

            if (currentScannedType === ts.SyntaxKind.SingleLineCommentTrivia ||
                currentScannedType === ts.SyntaxKind.MultiLineCommentTrivia ||
                currentScannedType === ts.SyntaxKind.NewLineTrivia) {

                // ignore lines that have comments before the first token

                return;
            }

            if (fullLeadingWhitespace.match(this.regExp)) {
                this.addFailure(this.createFailure(lineStart, fullLeadingWhitespace.length, this.failureString));
            }
        });
        // no need to call super to visit the rest of the nodes, so don't call super here
    }
}
