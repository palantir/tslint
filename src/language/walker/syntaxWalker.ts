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

module Lint {
    // TODO: rename this class
    export class SyntaxWalker {
        public visitAnyKeyword(node: ts.Node) {
            //
        }

        public visitBinaryExpression(node: ts.BinaryExpression) {
            //
        }

        public visitBreakStatement(node: ts.BreakOrContinueStatement) {
            //
        }

        public visitCallExpression(node: ts.CallExpression) {
            //
        }

        public visitClassDeclaration(node: ts.ClassDeclaration) {
            //
        }

        public visitContinueStatement(node: ts.BreakOrContinueStatement) {
            //
        }

        public visitDebuggerStatement(node: ts.Statement) {
            //
        }

        public visitDoStatement(node: ts.DoStatement) {
            //
        }

        public visitExpressionStatement(node: ts.ExpressionStatement) {
            //
        }

        public visitForStatement(node: ts.ForStatement) {
            //
        }

        public visitForInStatement(node: ts.ForInStatement) {
            //
        }

        public visitIfStatement(node: ts.IfStatement) {
            //
        }

        public visitImportDeclaration(node: ts.ImportDeclaration) {
            //
        }

        public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
            //
        }

        public visitLabeledStatement(node: ts.LabeledStatement) {
            //
        }

        public visitMethodDeclaration(node: ts.MethodDeclaration) {
            //
        }

        public visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
            //
        }

        public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
            //
        }

        public visitReturnStatement(node: ts.ReturnStatement) {
            //
        }

        public visitThrowStatement(node: ts.ThrowStatement) {
            //
        }

        public visitVariableStatement(node: ts.VariableStatement) {
            //
        }

        public visitWhileStatement(node: ts.WhileStatement) {
            //
        }

        public walk(node: ts.Node) {
            this.visitNode(node);
        }

        public visitNode(node: ts.Node) {
            switch (node.kind) {
                case ts.SyntaxKind.AnyKeyword:
                    this.visitAnyKeyword(node);
                    break;

                case ts.SyntaxKind.BinaryExpression:
                    this.visitBinaryExpression(<ts.BinaryExpression> node);
                    break;

                case ts.SyntaxKind.BreakStatement:
                    this.visitBreakStatement(<ts.BreakOrContinueStatement> node);
                    break;

                case ts.SyntaxKind.CallExpression:
                    this.visitCallExpression(<ts.CallExpression> node);
                    break;

                case ts.SyntaxKind.ClassDeclaration:
                    this.visitClassDeclaration(<ts.ClassDeclaration> node);
                    break;

                case ts.SyntaxKind.ContinueStatement:
                    this.visitContinueStatement(<ts.BreakOrContinueStatement> node);
                    break;

                case ts.SyntaxKind.DebuggerStatement:
                    this.visitDebuggerStatement(<ts.Statement> node);
                    break;

                case ts.SyntaxKind.DoStatement:
                    this.visitDoStatement(<ts.DoStatement> node);
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

                case ts.SyntaxKind.PropertyAccessExpression:
                    this.visitPropertyAccessExpression(<ts.PropertyAccessExpression> node);
                    break;

                case ts.SyntaxKind.Property:
                    this.visitPropertyDeclaration(<ts.PropertyDeclaration> node);
                    break;

                case ts.SyntaxKind.ReturnStatement:
                    this.visitReturnStatement(<ts.ReturnStatement> node);
                    break;

                case ts.SyntaxKind.ThrowStatement:
                    this.visitThrowStatement(<ts.ThrowStatement> node);
                    break;

                case ts.SyntaxKind.VariableStatement:
                    this.visitVariableStatement(<ts.VariableStatement> node);
                    break;

                case ts.SyntaxKind.WhileStatement:
                    this.visitWhileStatement(<ts.WhileStatement> node);
                    break;
            }

            ts.forEachChild(node, (child) => this.walk(child));
        }
    }
}
