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
    public static FAILURE_STRING_PART = "function invocation disallowed: ";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var options = this.getOptions();
        var banFunctionWalker = new BanFunctionWalker(syntaxTree, options);
        var functionsToBan = options;
        functionsToBan.forEach((functionToBan) => {
            banFunctionWalker.addBannedFunction(functionToBan);
        });
        return this.applyWithWalker(banFunctionWalker);
    }
  }

export class BanFunctionWalker extends Lint.RuleWalker {

    private bannedFunctions: string[][] = [];

    public addBannedFunction(bannedFunction: string[]) {
        this.bannedFunctions.push(bannedFunction);
    }

    public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void {
        var expression = node.expression;

        if (expression.kind() === TypeScript.SyntaxKind.MemberAccessExpression &&
            expression.childCount() >= 3) {

            var firstToken = expression.firstToken();
            var secondToken = expression.childAt(1);
            var thirdToken = expression.childAt(2);

            if (secondToken.kind() === TypeScript.SyntaxKind.DotToken) {
                this.bannedFunctions.forEach((bannedFunction) => {
                    if (firstToken.text() === bannedFunction[0] && thirdToken.fullText() === bannedFunction[1]) {
                        var position = this.position() + node.leadingTriviaWidth();
                        this.addFailure(this.createFailure(position, expression.width(), Rule.FAILURE_STRING_PART +
                            firstToken.text() + "." + thirdToken.fullText()));
                    }
                });
            }
        }

        super.visitInvocationExpression(node);
    }
}
