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
    export class NoConstructRule extends AbstractRule {
        public static FAILURE_STRING = "undesirable constructor use";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new NoConstructWalker(syntaxTree));
        }
    }

    class NoConstructWalker extends Lint.RuleWalker {
        private static FORBIDDEN_CONSTRUCTORS = [
            "Boolean",
            "Number",
            "String"
        ];

        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): void {
            var constructorName = node.expression.fullText().trim();
            if (NoConstructWalker.FORBIDDEN_CONSTRUCTORS.indexOf(constructorName) !== -1) {
                var position = this.position() + node.leadingTriviaWidth();
                var width = node.newKeyword.fullWidth() + node.expression.fullWidth();
                var failure = this.createFailure(position, width, NoConstructRule.FAILURE_STRING);
                this.addFailure(failure);
            }

            super.visitObjectCreationExpression(node);
        }
    }
}
