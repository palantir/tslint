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
    export class SubRule extends AbstractRule {
        public static FAILURE_STRING = "object access via string literals is disallowed";

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new SubWalker(syntaxTree));
        }
      }

    class SubWalker extends Lint.RuleWalker {
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): void {
            this.handleElementAccessExpression(node);
            super.visitElementAccessExpression(node);
        }

        private handleElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax) {
            var argument = node.argumentExpression;
            var position = this.positionAfter(node.expression, node.openBracketToken);

            if (argument.kind() === TypeScript.SyntaxKind.StringLiteral) {
                this.addFailure(this.createFailure(position, argument.width(), SubRule.FAILURE_STRING));
            }
        }
    }
}
