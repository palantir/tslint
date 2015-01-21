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
    public static FAILURE_STRING_PART = "function invocation disallowed: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var options = this.getOptions();
        var banFunctionWalker = new BanFunctionWalker(sourceFile, options);
        var functionsToBan = options.ruleArguments;
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

    public visitCallExpression(node: ts.CallExpression): void {
        var expression = node.expression;

        if (expression.kind === ts.SyntaxKind.PropertyAccessExpression &&
            expression.getChildCount() >= 3) {

            var firstToken = expression.getFirstToken();
            var secondToken = expression.getChildAt(1);
            var thirdToken = expression.getChildAt(2);

            var firstText = firstToken.getText();
            var thirdText = thirdToken.getFullText();

            if (secondToken.kind === ts.SyntaxKind.DotToken) {
                this.bannedFunctions.forEach((bannedFunction) => {
                    if (firstText === bannedFunction[0] && thirdText === bannedFunction[1]) {
                        var failure = this.createFailure(expression.getStart(),
                                                         expression.getWidth(),
                                                         Rule.FAILURE_STRING_PART + firstText + "." + thirdText);
                        this.addFailure(failure);
                    }
                });
            }
        }

        super.visitCallExpression(node);
    }
}
