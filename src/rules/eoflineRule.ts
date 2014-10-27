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
    public static FAILURE_STRING = "file should end with a newline";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new EofWalker(syntaxTree, this.getOptions()));
    }
}

class EofWalker extends Lint.StateAwareRuleWalker {
    public visitToken(token: TypeScript.ISyntaxToken): void {
        this.handleToken(token);
        super.visitToken(token);
    }

    private handleToken(token: TypeScript.ISyntaxToken) {
        var lastState = this.getLastState();
        if (lastState !== undefined && token.kind() === TypeScript.SyntaxKind.EndOfFileToken) {
            var endsWithNewLine = false;

            // look at the penultimate token to see if it contains a newline at the end
            var previousToken = lastState.token;
            if (previousToken !== null && this.hasNewLineAtEnd(previousToken.trailingTrivia())) {
                endsWithNewLine = true;
            }

            // if the EOF token has any leading trivia, then it has to end with a newline
            if (token.hasLeadingTrivia() && !this.hasNewLineAtEnd(token.leadingTrivia())) {
                endsWithNewLine = false;
            }

            if (!endsWithNewLine) {
                this.addFailure(this.createFailure(this.getPosition(), 1, Rule.FAILURE_STRING));
            }
        }
    }

    private hasNewLineAtEnd(triviaList: TypeScript.ISyntaxTriviaList) {
        if (triviaList.count() <= 0 || !triviaList.hasNewLine()) {
            return false;
        }

        return triviaList.last().isNewLine();
    }
}
