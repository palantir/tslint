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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static DO_FAILURE_STRING = "do statements must be braced";
    public static ELSE_FAILURE_STRING = "else statements must be braced";
    public static FOR_FAILURE_STRING = "for statements must be braced";
    public static IF_FAILURE_STRING = "if statements must be braced";
    public static WHILE_FAILURE_STRING = "while statements must be braced";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CurlyWalker(sourceFile, this.getOptions()));
    }
}

class CurlyWalker extends Lint.RuleWalker {
    public visitForInStatement(node: ts.ForInStatement) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForInStatement(node);
    }

    public visitForOfStatement(node: ts.ForInStatement) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForInStatement(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForStatement(node);
    }

    public visitIfStatement(node: ts.IfStatement) {
        if (!this.isStatementBraced(node.thenStatement)) {
            this.addFailure(this.createFailure(
                node.getStart(),
                node.thenStatement.getEnd() - node.getStart(),
                Rule.IF_FAILURE_STRING
            ));
        }

        if (node.elseStatement != null
                && node.elseStatement.kind !== ts.SyntaxKind.IfStatement
                && !this.isStatementBraced(node.elseStatement)) {

            // find the else keyword to place the error appropriately
            const elseKeywordNode = node.getChildren().filter((child) => child.kind === ts.SyntaxKind.ElseKeyword)[0];

            this.addFailure(this.createFailure(
                elseKeywordNode.getStart(),
                node.elseStatement.getEnd() - elseKeywordNode.getStart(),
                Rule.ELSE_FAILURE_STRING
            ));
        }

        super.visitIfStatement(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.DO_FAILURE_STRING);
        }

        super.visitDoStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.WHILE_FAILURE_STRING);
        }

        super.visitWhileStatement(node);
    }

    private isStatementBraced(node: ts.Statement) {
        return node.kind === ts.SyntaxKind.Block;
    }

    private addFailureForNode(node: ts.Node, failure: string) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), failure));
    }
}
