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

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "for (... in ...) statements must be filtered with an if statement";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new ForInWalker(syntaxTree, this.getOptions()));
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

        // if there is a block, verify that it has a single if statement or starts with if (..) continue;
        if (statementKind === TypeScript.SyntaxKind.Block) {
            var blockNode = <TypeScript.BlockSyntax> statement;
            var blockStatements = blockNode.statements;
            if (TypeScript.childCount(blockStatements) >= 1) {
                var firstBlockStatement = TypeScript.childAt(blockStatements, 0);
                if (firstBlockStatement.kind() === TypeScript.SyntaxKind.IfStatement) {
                    // if this "if" statement is the only statement within the block
                    if (TypeScript.childCount(blockStatements) === 1) {
                        return;
                    }

                    // if this "if" statement has a single continue block
                    var ifStatement = (<TypeScript.IfStatementSyntax> firstBlockStatement).statement;
                    if (this.nodeIsContinue(ifStatement)) {
                        return;
                    }
                }
            }
        }

        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        var failure = this.createFailure(position, TypeScript.width(node), Rule.FAILURE_STRING);
        this.addFailure(failure);
    }

    private nodeIsContinue(node: TypeScript.ISyntaxElement): boolean {
        var kind = node.kind();

        if (kind === TypeScript.SyntaxKind.ContinueStatement) {
            return true;
        }

        if (kind === TypeScript.SyntaxKind.Block) {
            var blockStatements = (<TypeScript.BlockSyntax>node).statements;
            if (TypeScript.childCount(blockStatements) === 1 &&
                TypeScript.childAt(blockStatements, 0).kind() === TypeScript.SyntaxKind.ContinueStatement) {
                return true;
            }
        }

        return false;
    }
}
