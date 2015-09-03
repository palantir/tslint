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
    static FAILURE_STRING = "consecutive blank lines are disallowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new BlankLinesWalker(sourceFile, this.getOptions()));
    }
}

class BlankLinesWalker extends Lint.SkippableTokenAwareRuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);

        // starting with 1 to cover the case where the file starts with two blank lines
        let newLinesInARowSeenSoFar = 1;
        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text), (scanner: ts.Scanner) => {
            const startPos = scanner.getStartPos();
            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                newLinesInARowSeenSoFar = 0;
                return;
            }

            if (scanner.getToken() === ts.SyntaxKind.NewLineTrivia) {
                newLinesInARowSeenSoFar += 1;
                if (newLinesInARowSeenSoFar >= 3) {
                    const failure = this.createFailure(scanner.getStartPos(), 1, Rule.FAILURE_STRING);
                    this.addFailure(failure);
                }
            } else {
                newLinesInARowSeenSoFar = 0;
            }
        });
    }
}
