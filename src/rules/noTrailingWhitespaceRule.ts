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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "trailing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoTrailingWhitespaceWalker(sourceFile, this.getOptions()));
    }
}

class NoTrailingWhitespaceWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile): void {
        var lastSeenWasWhitespace = false;
        var lastSeenWhitespacePosition = 0;
        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.ES5, false, node.text), (scanner: ts.Scanner) => {
            if (scanner.getToken() === ts.SyntaxKind.NewLineTrivia) {
                if (lastSeenWasWhitespace) {
                    var width = scanner.getStartPos() - lastSeenWhitespacePosition;
                    var failure = this.createFailure(lastSeenWhitespacePosition, width, Rule.FAILURE_STRING);
                    this.addFailure(failure);
                }
               lastSeenWasWhitespace = false;
            } else if (scanner.getToken() === ts.SyntaxKind.WhitespaceTrivia) {
                lastSeenWasWhitespace = true;
                lastSeenWhitespacePosition = scanner.getStartPos();
            } else {
                lastSeenWasWhitespace = false;
            }
        });
        // no need to call super to visit the rest of the nodes, so don't call super here
    }
}
