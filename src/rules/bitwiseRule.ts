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

/// <reference path='../language/rule/rule.ts'/>
/// <reference path='../language/rule/abstractRule.ts'/>

module Lint.Rules {
    export class BitwiseRule extends AbstractRule {
        public static FAILURE_STRING = "forbidden bitwise operation";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new BitwiseWalker(syntaxTree));
        }
    }

    class BitwiseWalker extends Lint.RuleWalker {
        public visitNode(node: TypeScript.SyntaxNode): void {
            if (node.kind() === TypeScript.SyntaxKind.BitwiseAndExpression ||
                node.kind() === TypeScript.SyntaxKind.AndAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.BitwiseOrExpression ||
                node.kind() === TypeScript.SyntaxKind.OrAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.BitwiseExclusiveOrExpression ||
                node.kind() === TypeScript.SyntaxKind.ExclusiveOrAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.LeftShiftExpression ||
                node.kind() === TypeScript.SyntaxKind.LeftShiftAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.SignedRightShiftExpression ||
                node.kind() === TypeScript.SyntaxKind.SignedRightShiftAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.UnsignedRightShiftExpression ||
                node.kind() === TypeScript.SyntaxKind.UnsignedRightShiftAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.BitwiseNotExpression) {

                this.addFailure(this.createFailure(
                    this.position() + node.leadingTriviaWidth(),
                    node.width(),
                    BitwiseRule.FAILURE_STRING));
            }

            super.visitNode(node);
        }
    }
}
