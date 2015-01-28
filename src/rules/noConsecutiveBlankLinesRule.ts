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

class BlankLinesWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile): void {
        var scanner = ts.createScanner(ts.ScriptTarget.ES5, false, node.text);
        // starting with 1 to cover the case where the file starts with two blank lines
        var newLinesInARowSeenSoFar = 1;
        while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
            if (scanner.getToken() === ts.SyntaxKind.NewLineTrivia) {
                newLinesInARowSeenSoFar += 1;
                if (newLinesInARowSeenSoFar >= 3) {
                    var failure = this.createFailure(scanner.getStartPos(), 1, Rule.FAILURE_STRING);
                    this.addFailure(failure);
                }
            } else {
                newLinesInARowSeenSoFar = 0;
            }
        }
        // no need to call super to visit the rest of the nodes, so don't call super here
    }
}
