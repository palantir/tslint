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

    export class ForInRule extends AbstractRule {
        public static FAILURE_STRING = "for (... in ...) statements must be filtered with an if statement";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new ForInWalker(syntaxTree));
        }
    }

    class ForInWalker extends Lint.RuleWalker {
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): void {
            this.handleForInStatement(node);
            super.visitForInStatement(node);
        }

        private handleForInStatement(node: TypeScript.ForInStatementSyntax) {
            var statement = node.statement;
            var statementKind = node.statement.kind();

            // a direct if statement under a for...in is valid
            if (statementKind === TypeScript.SyntaxKind.IfStatement) {
                return;
            }

            // if there is a block, verify that it has a single if statement
            if (statementKind === TypeScript.SyntaxKind.Block) {
                var blockNode = <TypeScript.BlockSyntax> statement;
                var blockStatements = blockNode.statements;
                if (blockStatements.childCount() === 1 &&
                    blockStatements.childAt(0).kind() === TypeScript.SyntaxKind.IfStatement) {
                    return;
                }
            }

            var position = this.position() + node.leadingTriviaWidth();
            var failure = this.createFailure(position, node.width(), ForInRule.FAILURE_STRING);
            this.addFailure(failure);
        }
    }

}
