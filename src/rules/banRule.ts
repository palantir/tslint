/**
 * @license
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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ban",
        description: "Bans the use of specific functions.",
        descriptionDetails: "At this time, there is no way to disable global methods with this rule.",
        optionsDescription: "A list of `['object', 'method']` pairs which ban `object.method()`.",
        options: {
            type: "list",
            listType: {
                type: "array",
                arrayMembers: [
                    { type: "string" },
                    { type: "string" },
                ],
            },
        },
        optionExamples: [`[true, ["console", "log"], ["someObject", "someFunction"]]`],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_PART = "function invocation disallowed: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.getOptions();
        const banFunctionWalker = new BanFunctionWalker(sourceFile, options);
        const functionsToBan = options.ruleArguments;
        functionsToBan.forEach((f) => banFunctionWalker.addBannedFunction(f));
        return this.applyWithWalker(banFunctionWalker);
    }
}

export class BanFunctionWalker extends Lint.RuleWalker {
    private bannedFunctions: string[][] = [];

    public addBannedFunction(bannedFunction: string[]) {
        this.bannedFunctions.push(bannedFunction);
    }

    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;

        if (expression.kind === ts.SyntaxKind.PropertyAccessExpression
                && expression.getChildCount() >= 3) {

            const firstToken = expression.getFirstToken();
            const firstChild = expression.getChildAt(0);
            const secondChild = expression.getChildAt(1);
            const thirdChild = expression.getChildAt(2);

            const rightSideExpression = thirdChild.getFullText();

            let leftSideExpression: string;

            if (firstChild.getChildCount() > 0) {
                leftSideExpression = firstChild.getLastToken().getText();
            } else {
                leftSideExpression = firstToken.getText();
            }

            if (secondChild.kind === ts.SyntaxKind.DotToken) {
                for (const bannedFunction of this.bannedFunctions) {
                    if (leftSideExpression === bannedFunction[0] && rightSideExpression === bannedFunction[1]) {
                        const failure = this.createFailure(
                            expression.getStart(),
                            expression.getWidth(),
                            `${Rule.FAILURE_STRING_PART}${leftSideExpression}.${rightSideExpression}`
                        );
                        this.addFailure(failure);
                    }
                }
            }
        }

        super.visitCallExpression(node);
    }
}
