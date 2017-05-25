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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ban",
        description: "Bans the use of specific functions or global methods.",
        optionsDescription: Lint.Utils.dedent`
            A list of \`['object', 'method', 'optional explanation here']\` or \`['globalMethod']\` which ban \`object.method()\`
            or respectively \`globalMethod()\`.`,
        options: {
            type: "list",
            listType: {
                type: "array",
                items: {type: "string"},
                minLength: 1,
                maxLength: 3,
            },
        },
        optionExamples: [
            [
                true,
                ["someGlobalMethod"],
                ["someObject", "someFunction"],
                ["someObject", "otherFunction", "Optional explanation"],
            ],
        ],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(expression: string, messageAddition?: string) {
        return `Calls to '${expression}' are not allowed.${messageAddition !== undefined ? ` ${messageAddition}` : ""}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.getOptions();
        const banFunctionWalker = new BanFunctionWalker(sourceFile, options);
        const functionsToBan = options.ruleArguments as string[][];
        if (functionsToBan !== undefined) {
            functionsToBan.forEach((f) => banFunctionWalker.addBannedFunction(f));
        }
        return this.applyWithWalker(banFunctionWalker);
    }
}

export class BanFunctionWalker extends Lint.RuleWalker {
    private bannedGlobalFunctions: string[] = [];
    private bannedFunctions: string[][] = [];

    public addBannedFunction(bannedFunction: string[]) {
        if (bannedFunction.length === 1) {
            this.bannedGlobalFunctions.push(bannedFunction[0]);
        } else if (bannedFunction.length >= 2) {
            this.bannedFunctions.push(bannedFunction);
        }
    }

    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;

        this.checkForObjectMethodBan(expression);
        this.checkForGlobalBan(expression);

        super.visitCallExpression(node);
    }

    private checkForObjectMethodBan(expression: ts.LeftHandSideExpression) {
        if (expression.kind === ts.SyntaxKind.PropertyAccessExpression
            && expression.getChildCount() >= 3) {

            const firstToken = expression.getFirstToken();
            const firstChild = expression.getChildAt(0);
            const secondChild = expression.getChildAt(1);
            const thirdChild = expression.getChildAt(2);

            const rightSideExpression = thirdChild.getFullText();
            const leftSideExpression = firstChild.getChildCount() > 0
                ? firstChild.getLastToken().getText()
                : firstToken.getText();

            if (secondChild.kind === ts.SyntaxKind.DotToken) {
                for (const bannedFunction of this.bannedFunctions) {
                    if (leftSideExpression === bannedFunction[0] && rightSideExpression === bannedFunction[1]) {
                        const failure = Rule.FAILURE_STRING_FACTORY(`${leftSideExpression}.${rightSideExpression}`, bannedFunction[2]);
                        this.addFailureAtNode(expression, failure);
                    }
                }
            }
        }
    }

    private checkForGlobalBan(expression: ts.LeftHandSideExpression) {
        if (expression.kind === ts.SyntaxKind.Identifier) {
            const identifierName = (expression as ts.Identifier).text;
            if (this.bannedGlobalFunctions.indexOf(identifierName) !== -1) {
                this.addFailureAtNode(expression, Rule.FAILURE_STRING_FACTORY(`${identifierName}`));
            }

        }
    }
}
