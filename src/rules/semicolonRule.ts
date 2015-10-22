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
import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing semicolon";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new SemicolonWalker(sourceFile, this.getOptions()));
    }
}

class SemicolonWalker extends Lint.RuleWalker {
    public visitVariableStatement(node: ts.VariableStatement) {
        this.checkSemicolonAt(node);
        super.visitVariableStatement(node);
    }

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        this.checkSemicolonAt(node);
        super.visitExpressionStatement(node);
    }

    public visitReturnStatement(node: ts.ReturnStatement) {
        this.checkSemicolonAt(node);
        super.visitReturnStatement(node);
    }

    public visitBreakStatement(node: ts.BreakOrContinueStatement) {
        this.checkSemicolonAt(node);
        super.visitBreakStatement(node);
    }

    public visitContinueStatement(node: ts.BreakOrContinueStatement) {
        this.checkSemicolonAt(node);
        super.visitContinueStatement(node);
    }

    public visitThrowStatement(node: ts.ThrowStatement) {
        this.checkSemicolonAt(node);
        super.visitThrowStatement(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        this.checkSemicolonAt(node);
        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        this.checkSemicolonAt(node);
        super.visitImportEqualsDeclaration(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        this.checkSemicolonAt(node);
        super.visitDoStatement(node);
    }

    public visitDebuggerStatement(node: ts.Statement) {
        this.checkSemicolonAt(node);
        super.visitDebuggerStatement(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this.checkSemicolonAt(node);
        super.visitPropertyDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        for (let member of node.members) {
            this.checkSemicolonAt(member);
        }
        super.visitInterfaceDeclaration(node);
    }

    private checkSemicolonAt(node: ts.Node) {
        const children = node.getChildren(this.getSourceFile());
        for (let child of children) {
            if (child.kind === ts.SyntaxKind.SemicolonToken) {
                return;
            }
        }

        // no semicolon token was found, so add a failure at the given position
        const sourceFile = this.getSourceFile();
        const position = node.getStart(sourceFile) + node.getWidth(sourceFile);
        this.addFailure(this.createFailure(Math.min(position, this.getLimit()), 0, Rule.FAILURE_STRING));
    }
}
