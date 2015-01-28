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

///<reference path="../../../typings/typescriptServices.d.ts" />

module Lint {
    // TODO: rename this class
    export class SyntaxWalker {
        public visitAnyKeyword(node: ts.Node) {
            this.walkChildren(node);
        }

        public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
            this.walkChildren(node);
        }

        public visitBinaryExpression(node: ts.BinaryExpression) {
            this.walkChildren(node);
        }

        public visitBlock(node: ts.Block) {
            this.walkChildren(node);
        }

        public visitBreakStatement(node: ts.BreakOrContinueStatement) {
            this.walkChildren(node);
        }

        public visitCallExpression(node: ts.CallExpression) {
            this.walkChildren(node);
        }

        public visitCaseClause(node: ts.CaseClause) {
            this.walkChildren(node);
        }

        public visitClassDeclaration(node: ts.ClassDeclaration) {
            this.walkChildren(node);
        }

        public visitCatchClause(node: ts.CatchClause) {
            this.walkChildren(node);
        }

        public visitConditionalExpression(node: ts.ConditionalExpression) {
            this.walkChildren(node);
        }

        public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
            this.walkChildren(node);
        }

        public visitConstructorType(node: ts.Node) {
            this.walkChildren(node);
        }

        public visitContinueStatement(node: ts.BreakOrContinueStatement) {
            this.walkChildren(node);
        }

        public visitDebuggerStatement(node: ts.Statement) {
            this.walkChildren(node);
        }

        public visitDefaultClause(node: ts.DefaultClause) {
            this.walkChildren(node);
        }

        public visitDoStatement(node: ts.DoStatement) {
            this.walkChildren(node);
        }

        public visitElementAccessExpression(node: ts.ElementAccessExpression) {
            this.walkChildren(node);
        }

        public visitEnumDeclaration(node: ts.EnumDeclaration) {
            this.walkChildren(node);
        }

        public visitExportAssignment(node: ts.ExportAssignment) {
            this.walkChildren(node);
        }

        public visitExpressionStatement(node: ts.ExpressionStatement) {
            this.walkChildren(node);
        }

        public visitForStatement(node: ts.ForStatement) {
            this.walkChildren(node);
        }

        public visitForInStatement(node: ts.ForInStatement) {
            this.walkChildren(node);
        }

        public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
            this.walkChildren(node);
        }

        public visitFunctionExpression(node: ts.FunctionExpression) {
            this.walkChildren(node);
        }

        public visitFunctionType(node: ts.Node) {
            this.walkChildren(node);
        }

        public visitGetAccessor(node: ts.AccessorDeclaration) {
            this.walkChildren(node);
        }

        public visitIfStatement(node: ts.IfStatement) {
            this.walkChildren(node);
        }

        public visitImportDeclaration(node: ts.ImportDeclaration) {
            this.walkChildren(node);
        }

        public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
            this.walkChildren(node);
        }

        public visitLabeledStatement(node: ts.LabeledStatement) {
            this.walkChildren(node);
        }

        public visitMethodDeclaration(node: ts.MethodDeclaration) {
            this.walkChildren(node);
        }

        public visitModuleDeclaration(node: ts.ModuleDeclaration) {
            this.walkChildren(node);
        }

        public visitNewExpression(node: ts.NewExpression) {
            this.walkChildren(node);
        }

        public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
            this.walkChildren(node);
        }

        public visitParameterDeclaration(node: ts.ParameterDeclaration) {
            this.walkChildren(node);
        }

        public visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
            this.walkChildren(node);
        }

        public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
            this.walkChildren(node);
        }

        public visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
            this.walkChildren(node);
        }

        public visitPropertyAssignment(node: ts.PropertyAssignment) {
            this.walkChildren(node);
        }

        public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
            this.walkChildren(node);
        }

        public visitReturnStatement(node: ts.ReturnStatement) {
            this.walkChildren(node);
        }

        public visitSetAccessor(node: ts.AccessorDeclaration) {
            this.walkChildren(node);
        }

        public visitSourceFile(node: ts.SourceFile) {
            this.walkChildren(node);
        }

        public visitSwitchStatement(node: ts.SwitchStatement) {
            this.walkChildren(node);
        }

        public visitThrowStatement(node: ts.ThrowStatement) {
            this.walkChildren(node);
        }

        public visitTryBlock(node: ts.Block) {
            this.walkChildren(node);
        }

        public visitTryStatement(node: ts.TryStatement) {
            this.walkChildren(node);
        }

        public visitTypeAssertionExpression(node: ts.TypeAssertion) {
            this.walkChildren(node);
        }

        public visitVariableDeclaration(node: ts.VariableDeclaration) {
            this.walkChildren(node);
        }

        public visitVariableStatement(node: ts.VariableStatement) {
            this.walkChildren(node);
        }

        public visitWhileStatement(node: ts.WhileStatement) {
            this.walkChildren(node);
        }

        public walk(node: ts.Node) {
            this.visitNode(node);
        }

        public walkChildren(node: ts.Node) {
            ts.forEachChild(node, (child) => this.visitNode(child));
        }

        public visitNode(node: ts.Node) {
            switch (node.kind) {
                case ts.SyntaxKind.AnyKeyword:
                    this.visitAnyKeyword(node);
                    break;

                case ts.SyntaxKind.ArrowFunction:
                    this.visitArrowFunction(<ts.FunctionLikeDeclaration> node);
                    break;

                case ts.SyntaxKind.BinaryExpression:
                    this.visitBinaryExpression(<ts.BinaryExpression> node);
                    break;

                case ts.SyntaxKind.Block:
                    this.visitBlock(<ts.Block> node);
                    break;

                case ts.SyntaxKind.BreakStatement:
                    this.visitBreakStatement(<ts.BreakOrContinueStatement> node);
                    break;

                case ts.SyntaxKind.CallExpression:
                    this.visitCallExpression(<ts.CallExpression> node);
                    break;

                case ts.SyntaxKind.CaseClause:
                    this.visitCaseClause(<ts.CaseClause> node);
                    break;

                case ts.SyntaxKind.ClassDeclaration:
                    this.visitClassDeclaration(<ts.ClassDeclaration> node);
                    break;

                case ts.SyntaxKind.CatchClause:
                    this.visitCatchClause(<ts.CatchClause> node);
                    break;

                case ts.SyntaxKind.ConditionalExpression:
                    this.visitConditionalExpression(<ts.ConditionalExpression> node);
                    break;

                case ts.SyntaxKind.Constructor:
                    this.visitConstructorDeclaration(<ts.ConstructorDeclaration> node);
                    break;

                case ts.SyntaxKind.ConstructorType:
                    this.visitConstructorType(node);
                    break;

                case ts.SyntaxKind.ContinueStatement:
                    this.visitContinueStatement(<ts.BreakOrContinueStatement> node);
                    break;

                case ts.SyntaxKind.DebuggerStatement:
                    this.visitDebuggerStatement(<ts.Statement> node);
                    break;

                case ts.SyntaxKind.DefaultClause:
                    this.visitDefaultClause(<ts.DefaultClause> node);
                    break;

                case ts.SyntaxKind.DoStatement:
                    this.visitDoStatement(<ts.DoStatement> node);
                    break;

                case ts.SyntaxKind.ElementAccessExpression:
                    this.visitElementAccessExpression(<ts.ElementAccessExpression> node);
                    break;

                case ts.SyntaxKind.EnumDeclaration:
                    this.visitEnumDeclaration(<ts.EnumDeclaration> node);
                    break;

                case ts.SyntaxKind.ExportAssignment:
                    this.visitExportAssignment(<ts.ExportAssignment> node);
                    break;

                case ts.SyntaxKind.ExpressionStatement:
                    this.visitExpressionStatement(<ts.ExpressionStatement> node);
                    break;

                case ts.SyntaxKind.ForStatement:
                    this.visitForStatement(<ts.ForStatement> node);
                    break;

                case ts.SyntaxKind.ForInStatement:
                    this.visitForInStatement(<ts.ForInStatement> node);
                    break;

                case ts.SyntaxKind.FunctionDeclaration:
                    this.visitFunctionDeclaration(<ts.FunctionDeclaration> node);
                    break;

                case ts.SyntaxKind.FunctionExpression:
                    this.visitFunctionExpression(<ts.FunctionExpression> node);
                    break;

                case ts.SyntaxKind.FunctionType:
                    this.visitFunctionType(node);
                    break;

                case ts.SyntaxKind.GetAccessor:
                    this.visitGetAccessor(<ts.AccessorDeclaration> node);
                    break;

                case ts.SyntaxKind.IfStatement:
                    this.visitIfStatement(<ts.IfStatement> node);
                    break;

                case ts.SyntaxKind.ImportDeclaration:
                    this.visitImportDeclaration(<ts.ImportDeclaration> node);
                    break;

                case ts.SyntaxKind.InterfaceDeclaration:
                    this.visitInterfaceDeclaration(<ts.InterfaceDeclaration> node);
                    break;

                case ts.SyntaxKind.LabeledStatement:
                    this.visitLabeledStatement(<ts.LabeledStatement> node);
                    break;

                case ts.SyntaxKind.Method:
                    this.visitMethodDeclaration(<ts.MethodDeclaration> node);
                    break;

                case ts.SyntaxKind.ModuleDeclaration:
                    this.visitModuleDeclaration(<ts.ModuleDeclaration> node);
                    break;

                case ts.SyntaxKind.NewExpression:
                    this.visitNewExpression(<ts.NewExpression> node);
                    break;

                case ts.SyntaxKind.ObjectLiteralExpression:
                    this.visitObjectLiteralExpression(<ts.ObjectLiteralExpression> node);
                    break;

                case ts.SyntaxKind.Parameter:
                    this.visitParameterDeclaration(<ts.ParameterDeclaration> node);
                    break;

                case ts.SyntaxKind.PostfixUnaryExpression:
                    this.visitPostfixUnaryExpression(<ts.PostfixUnaryExpression> node);
                    break;

                case ts.SyntaxKind.PrefixUnaryExpression:
                    this.visitPrefixUnaryExpression(<ts.PrefixUnaryExpression> node);
                    break;

                case ts.SyntaxKind.PropertyAccessExpression:
                    this.visitPropertyAccessExpression(<ts.PropertyAccessExpression> node);
                    break;

                case ts.SyntaxKind.PropertyAssignment:
                    this.visitPropertyAssignment(<ts.PropertyAssignment> node);
                    break;

                case ts.SyntaxKind.Property:
                    this.visitPropertyDeclaration(<ts.PropertyDeclaration> node);
                    break;

                case ts.SyntaxKind.ReturnStatement:
                    this.visitReturnStatement(<ts.ReturnStatement> node);
                    break;

                case ts.SyntaxKind.SetAccessor:
                    this.visitSetAccessor(<ts.AccessorDeclaration> node);
                    break;

                case ts.SyntaxKind.SourceFile:
                    this.visitSourceFile(<ts.SourceFile> node);
                    break;

                case ts.SyntaxKind.SwitchStatement:
                    this.visitSwitchStatement(<ts.SwitchStatement> node);
                    break;

                case ts.SyntaxKind.ThrowStatement:
                    this.visitThrowStatement(<ts.ThrowStatement> node);
                    break;

                case ts.SyntaxKind.TryBlock:
                    this.visitTryBlock(<ts.Block> node);
                    break;

                case ts.SyntaxKind.TryStatement:
                    this.visitTryStatement(<ts.TryStatement> node);
                    break;

                case ts.SyntaxKind.TypeAssertionExpression:
                    this.visitTypeAssertionExpression(<ts.TypeAssertion> node);
                    break;

                case ts.SyntaxKind.VariableDeclaration:
                    this.visitVariableDeclaration(<ts.VariableDeclaration> node);
                    break;

                case ts.SyntaxKind.VariableStatement:
                    this.visitVariableStatement(<ts.VariableStatement> node);
                    break;

                case ts.SyntaxKind.WhileStatement:
                    this.visitWhileStatement(<ts.WhileStatement> node);
                    break;

                default:
                    this.walkChildren(node);
                    break;
            }
        }
    }
}
