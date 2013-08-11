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
    export class RadixRule extends AbstractRule {
        public static FAILURE_STRING = "missing radix parameter";

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new RadixWalker(syntaxTree));
        }
    }

    class RadixWalker extends Lint.RuleWalker {
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void {
            var expression = node.expression;
            if (expression.isToken() && expression.kind() === TypeScript.SyntaxKind.IdentifierName) {
                var firstToken = expression.firstToken();
                var arguments = node.argumentList.arguments;
                if (firstToken.text() === "parseInt" && arguments.childCount() < 2) {
                    var position = this.position() + node.leadingTriviaWidth();
                    this.addFailure(this.createFailure(position, node.width(), RadixRule.FAILURE_STRING));
                }
            }

            super.visitInvocationExpression(node);
        }
    }
}
