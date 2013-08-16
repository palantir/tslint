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

/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class NoConsoleRule extends AbstractRule {
        public static FAILURE_STRING = "access forbidden to console property";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new NoConsoleWalker(this.getOptions(), syntaxTree));
        }
      }

    class NoConsoleWalker extends Lint.RuleWalker {
        private options: any;

        constructor(options: any, syntaxTree: TypeScript.SyntaxTree) {
            super(syntaxTree);
            this.options = options;
        }

        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void {
            var expression = node.expression;
            if (expression.kind() === TypeScript.SyntaxKind.MemberAccessExpression &&
                expression.childCount() >= 3) {

                var firstToken = expression.firstToken();
                var secondToken = expression.childAt(1);
                var thirdToken = expression.childAt(2);

                if (firstToken.text() === "console" &&
                    secondToken.kind() === TypeScript.SyntaxKind.DotToken &&
                    this.options.indexOf(thirdToken.fullText()) !== -1) {

                    var position = this.position() + node.leadingTriviaWidth();
                    this.addFailure(this.createFailure(position, expression.width(), NoConsoleRule.FAILURE_STRING));
                }
            }

            super.visitInvocationExpression(node);
        }
    }

}
