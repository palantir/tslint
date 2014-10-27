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
    static FAILURE_STRING = "consecutive blank lines are disallowed";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new BlankLinesWalker(syntaxTree, this.getOptions()));
    }
}

class BlankLinesWalker extends Lint.RuleWalker {
    // starting with 1 to cover the case where the file starts with two blank lines
    private newLinesInARowSeenSoFar = 1;

    public visitToken(token: TypeScript.ISyntaxToken): void {
        this.findConsecutiveBlankLinesFromTriva(token.leadingTrivia().toArray(), this.getPosition());
        this.newLinesInARowSeenSoFar = 0;
        this.findConsecutiveBlankLinesFromTriva(token.trailingTrivia().toArray(),
            this.getPosition() + TypeScript.leadingTriviaWidth(token) + TypeScript.width(token));

        super.visitToken(token);
    }

    private findConsecutiveBlankLinesFromTriva(triviaList: TypeScript.ISyntaxTrivia[], currentPosition: number) {
        triviaList.forEach((triviaItem) => {
            if (triviaItem.isNewLine()) {
                this.newLinesInARowSeenSoFar += 1;
                if (this.newLinesInARowSeenSoFar >= 3) {
                    var failure = this.createFailure(currentPosition, 1, Rule.FAILURE_STRING);
                    this.addFailure(failure);
                }
            } else {
                this.newLinesInARowSeenSoFar = 0;
            }
            currentPosition += triviaItem.fullWidth();
        });
    }

}
