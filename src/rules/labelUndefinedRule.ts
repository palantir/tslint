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
    export class LabelUndefinedRule extends AbstractRule {
        public static FAILURE_STRING = "undefined label: '";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new LabelUndefinedWalker(syntaxTree));
        }
    }

    class LabelUndefinedWalker extends Lint.RuleWalker {
        private functionLabels: any[];

        constructor(syntaxTree: TypeScript.SyntaxTree) {
            super(syntaxTree);
            this.functionLabels = [{}];
        }

        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void {
            this.functionLabels.push({});
            super.visitFunctionDeclaration(node);
            this.functionLabels.pop();
        }

        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): void {
            this.functionLabels.push({});
            super.visitFunctionExpression(node);
            this.functionLabels.pop();
        }

        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): void {
            this.functionLabels.push({});
            super.visitSimpleArrowFunctionExpression(node);
            this.functionLabels.pop();
        }

        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): void {
            this.functionLabels.push({});
            super.visitParenthesizedArrowFunctionExpression(node);
            this.functionLabels.pop();
        }

        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): void {
            var label = node.identifier.text();
            var scopedLabels = this.functionLabels[this.functionLabels.length - 1];

            scopedLabels[label] = true;
            super.visitLabeledStatement(node);
        }

        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): void {
            var position = this.position() + node.leadingTriviaWidth();
            this.validateLabelAt(node.identifier, position, node.breakKeyword.width());
            super.visitBreakStatement(node);
        }

        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): void {
            var position = this.position() + node.leadingTriviaWidth();
            this.validateLabelAt(node.identifier, position, node.continueKeyword.width());
            super.visitContinueStatement(node);
        }

        private validateLabelAt(label: TypeScript.ISyntaxToken, position: number, width: number): void {
            var scopedLabels = this.functionLabels[this.functionLabels.length - 1];

            if (label !== null && !scopedLabels[label.text()]) {
                var failureString = LabelUndefinedRule.FAILURE_STRING + label.text() + "'";
                var failure = this.createFailure(position, width, failureString);
                this.addFailure(failure);
            }            
        }
    }
}
