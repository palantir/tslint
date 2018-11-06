/**
 * @license
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

export class SyntaxWalker {
    public walk(node: ts.Node) {
        this.visitNode(node);
    }

    protected visitAnyKeyword(node: ts.Node) {
        this.walkChildren(node);
    }

    protected visitArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        this.walkChildren(node);
    }

    protected visitArrayType(node: ts.ArrayTypeNode) {
        this.walkChildren(node);
    }

    protected visitArrowFunction(node: ts.ArrowFunction) {
        this.walkChildren(node);
    }

    protected visitBinaryExpression(node: ts.BinaryExpression) {
        this.walkChildren(node);
    }

    protected visitBindingElement(node: ts.BindingElement) {
        this.walkChildren(node);
    }

    protected visitBindingPattern(node: ts.BindingPattern) {
        this.walkChildren(node);
    }

    protected visitBlock(node: ts.Block) {
        this.walkChildren(node);
    }

    protected visitBreakStatement(node: ts.BreakOrContinueStatement) {
        this.walkChildren(node);
    }

    protected visitCallExpression(node: ts.CallExpression) {
        this.walkChildren(node);
    }

    protected visitCallSignature(node: ts.SignatureDeclaration) {
        this.walkChildren(node);
    }

    protected visitCaseClause(node: ts.CaseClause) {
        this.walkChildren(node);
    }

    protected visitClassDeclaration(node: ts.ClassDeclaration) {
        this.walkChildren(node);
    }

    protected visitClassExpression(node: ts.ClassExpression) {
        this.walkChildren(node);
    }

    protected visitCatchClause(node: ts.CatchClause) {
        this.walkChildren(node);
    }

    protected visitConditionalExpression(node: ts.ConditionalExpression) {
        this.walkChildren(node);
    }

    protected visitConstructSignature(node: ts.ConstructSignatureDeclaration) {
        this.walkChildren(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.walkChildren(node);
    }

    protected visitConstructorType(node: ts.FunctionOrConstructorTypeNode) {
        this.walkChildren(node);
    }

    protected visitContinueStatement(node: ts.BreakOrContinueStatement) {
        this.walkChildren(node);
    }

    protected visitDebuggerStatement(node: ts.Statement) {
        this.walkChildren(node);
    }

    protected visitDefaultClause(node: ts.DefaultClause) {
        this.walkChildren(node);
    }

    protected visitDoStatement(node: ts.DoStatement) {
        this.walkChildren(node);
    }

    protected visitElementAccessExpression(node: ts.ElementAccessExpression) {
        this.walkChildren(node);
    }

    protected visitEndOfFileToken(node: ts.Node) {
        this.walkChildren(node);
    }

    protected visitEnumDeclaration(node: ts.EnumDeclaration) {
        this.walkChildren(node);
    }

    protected visitEnumMember(node: ts.EnumMember) {
        this.walkChildren(node);
    }

    protected visitExportAssignment(node: ts.ExportAssignment) {
        this.walkChildren(node);
    }

    protected visitExpressionStatement(node: ts.ExpressionStatement) {
        this.walkChildren(node);
    }

    protected visitForStatement(node: ts.ForStatement) {
        this.walkChildren(node);
    }

    protected visitForInStatement(node: ts.ForInStatement) {
        this.walkChildren(node);
    }

    protected visitForOfStatement(node: ts.ForOfStatement) {
        this.walkChildren(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.walkChildren(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression) {
        this.walkChildren(node);
    }

    protected visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        this.walkChildren(node);
    }

    protected visitGetAccessor(node: ts.AccessorDeclaration) {
        this.walkChildren(node);
    }

    protected visitIdentifier(node: ts.Identifier) {
        this.walkChildren(node);
    }

    protected visitIfStatement(node: ts.IfStatement) {
        this.walkChildren(node);
    }

    protected visitImportDeclaration(node: ts.ImportDeclaration) {
        this.walkChildren(node);
    }

    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        this.walkChildren(node);
    }

    protected visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration) {
        this.walkChildren(node);
    }

    protected visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.walkChildren(node);
    }

    protected visitJsxAttribute(node: ts.JsxAttribute) {
        this.walkChildren(node);
    }

    protected visitJsxElement(node: ts.JsxElement) {
        this.walkChildren(node);
    }

    protected visitJsxExpression(node: ts.JsxExpression) {
        this.walkChildren(node);
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
        this.walkChildren(node);
    }

    protected visitJsxSpreadAttribute(node: ts.JsxSpreadAttribute) {
        this.walkChildren(node);
    }

    protected visitLabeledStatement(node: ts.LabeledStatement) {
        this.walkChildren(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.walkChildren(node);
    }

    protected visitMethodSignature(node: ts.SignatureDeclaration) {
        this.walkChildren(node);
    }

    protected visitModuleDeclaration(node: ts.ModuleDeclaration) {
        this.walkChildren(node);
    }

    protected visitNamedImports(node: ts.NamedImports) {
        this.walkChildren(node);
    }

    protected visitNamespaceImport(node: ts.NamespaceImport) {
        this.walkChildren(node);
    }

    protected visitNewExpression(node: ts.NewExpression) {
        this.walkChildren(node);
    }

    protected visitNonNullExpression(node: ts.NonNullExpression) {
        this.walkChildren(node);
    }

    protected visitNumericLiteral(node: ts.NumericLiteral) {
        this.walkChildren(node);
    }

    protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        this.walkChildren(node);
    }

    protected visitParameterDeclaration(node: ts.ParameterDeclaration) {
        this.walkChildren(node);
    }

    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        this.walkChildren(node);
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        this.walkChildren(node);
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
        this.walkChildren(node);
    }

    protected visitPropertyAssignment(node: ts.PropertyAssignment) {
        this.walkChildren(node);
    }

    protected visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this.walkChildren(node);
    }

    protected visitPropertySignature(node: ts.Node) {
        this.walkChildren(node);
    }

    protected visitRegularExpressionLiteral(node: ts.Node) {
        this.walkChildren(node);
    }

    protected visitReturnStatement(node: ts.ReturnStatement) {
        this.walkChildren(node);
    }

    protected visitSetAccessor(node: ts.AccessorDeclaration) {
        this.walkChildren(node);
    }

    protected visitSourceFile(node: ts.SourceFile) {
        this.walkChildren(node);
    }

    protected visitStringLiteral(node: ts.StringLiteral) {
        this.walkChildren(node);
    }

    protected visitSwitchStatement(node: ts.SwitchStatement) {
        this.walkChildren(node);
    }

    protected visitTemplateExpression(node: ts.TemplateExpression) {
        this.walkChildren(node);
    }

    protected visitThrowStatement(node: ts.ThrowStatement) {
        this.walkChildren(node);
    }

    protected visitTryStatement(node: ts.TryStatement) {
        this.walkChildren(node);
    }

    protected visitTupleType(node: ts.TupleTypeNode) {
        this.walkChildren(node);
    }

    protected visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
        this.walkChildren(node);
    }

    protected visitTypeAssertionExpression(node: ts.TypeAssertion) {
        this.walkChildren(node);
    }

    protected visitTypeLiteral(node: ts.TypeLiteralNode) {
        this.walkChildren(node);
    }

    protected visitTypeReference(node: ts.TypeReferenceNode) {
        this.walkChildren(node);
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration) {
        this.walkChildren(node);
    }

    protected visitVariableDeclarationList(node: ts.VariableDeclarationList) {
        this.walkChildren(node);
    }

    protected visitVariableStatement(node: ts.VariableStatement) {
        this.walkChildren(node);
    }

    protected visitWhileStatement(node: ts.WhileStatement) {
        this.walkChildren(node);
    }

    protected visitWithStatement(node: ts.WithStatement) {
        this.walkChildren(node);
    }

    protected visitNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.AnyKeyword:
                this.visitAnyKeyword(node);
                break;

            case ts.SyntaxKind.ArrayBindingPattern:
                this.visitBindingPattern(node as ts.BindingPattern);
                break;

            case ts.SyntaxKind.ArrayLiteralExpression:
                this.visitArrayLiteralExpression(node as ts.ArrayLiteralExpression);
                break;

            case ts.SyntaxKind.ArrayType:
                this.visitArrayType(node as ts.ArrayTypeNode);
                break;

            case ts.SyntaxKind.ArrowFunction:
                this.visitArrowFunction(node as ts.ArrowFunction);
                break;

            case ts.SyntaxKind.BinaryExpression:
                this.visitBinaryExpression(node as ts.BinaryExpression);
                break;

            case ts.SyntaxKind.BindingElement:
                this.visitBindingElement(node as ts.BindingElement);
                break;

            case ts.SyntaxKind.Block:
                this.visitBlock(node as ts.Block);
                break;

            case ts.SyntaxKind.BreakStatement:
                this.visitBreakStatement(node as ts.BreakOrContinueStatement);
                break;

            case ts.SyntaxKind.CallExpression:
                this.visitCallExpression(node as ts.CallExpression);
                break;

            case ts.SyntaxKind.CallSignature:
                this.visitCallSignature(node as ts.SignatureDeclaration);
                break;

            case ts.SyntaxKind.CaseClause:
                this.visitCaseClause(node as ts.CaseClause);
                break;

            case ts.SyntaxKind.ClassDeclaration:
                this.visitClassDeclaration(node as ts.ClassDeclaration);
                break;

            case ts.SyntaxKind.ClassExpression:
                this.visitClassExpression(node as ts.ClassExpression);
                break;

            case ts.SyntaxKind.CatchClause:
                this.visitCatchClause(node as ts.CatchClause);
                break;

            case ts.SyntaxKind.ConditionalExpression:
                this.visitConditionalExpression(node as ts.ConditionalExpression);
                break;

            case ts.SyntaxKind.ConstructSignature:
                this.visitConstructSignature(node as ts.ConstructSignatureDeclaration);
                break;

            case ts.SyntaxKind.Constructor:
                this.visitConstructorDeclaration(node as ts.ConstructorDeclaration);
                break;

            case ts.SyntaxKind.ConstructorType:
                this.visitConstructorType(node as ts.FunctionOrConstructorTypeNode);
                break;

            case ts.SyntaxKind.ContinueStatement:
                this.visitContinueStatement(node as ts.BreakOrContinueStatement);
                break;

            case ts.SyntaxKind.DebuggerStatement:
                this.visitDebuggerStatement(node as ts.Statement);
                break;

            case ts.SyntaxKind.DefaultClause:
                this.visitDefaultClause(node as ts.DefaultClause);
                break;

            case ts.SyntaxKind.DoStatement:
                this.visitDoStatement(node as ts.DoStatement);
                break;

            case ts.SyntaxKind.ElementAccessExpression:
                this.visitElementAccessExpression(node as ts.ElementAccessExpression);
                break;

            case ts.SyntaxKind.EndOfFileToken:
                this.visitEndOfFileToken(node);
                break;

            case ts.SyntaxKind.EnumDeclaration:
                this.visitEnumDeclaration(node as ts.EnumDeclaration);
                break;

            case ts.SyntaxKind.EnumMember:
                this.visitEnumMember(node as ts.EnumMember);
                break;

            case ts.SyntaxKind.ExportAssignment:
                this.visitExportAssignment(node as ts.ExportAssignment);
                break;

            case ts.SyntaxKind.ExpressionStatement:
                this.visitExpressionStatement(node as ts.ExpressionStatement);
                break;

            case ts.SyntaxKind.ForStatement:
                this.visitForStatement(node as ts.ForStatement);
                break;

            case ts.SyntaxKind.ForInStatement:
                this.visitForInStatement(node as ts.ForInStatement);
                break;

            case ts.SyntaxKind.ForOfStatement:
                this.visitForOfStatement(node as ts.ForOfStatement);
                break;

            case ts.SyntaxKind.FunctionDeclaration:
                this.visitFunctionDeclaration(node as ts.FunctionDeclaration);
                break;

            case ts.SyntaxKind.FunctionExpression:
                this.visitFunctionExpression(node as ts.FunctionExpression);
                break;

            case ts.SyntaxKind.FunctionType:
                this.visitFunctionType(node as ts.FunctionOrConstructorTypeNode);
                break;

            case ts.SyntaxKind.GetAccessor:
                this.visitGetAccessor(node as ts.AccessorDeclaration);
                break;

            case ts.SyntaxKind.Identifier:
                this.visitIdentifier(node as ts.Identifier);
                break;

            case ts.SyntaxKind.IfStatement:
                this.visitIfStatement(node as ts.IfStatement);
                break;

            case ts.SyntaxKind.ImportDeclaration:
                this.visitImportDeclaration(node as ts.ImportDeclaration);
                break;

            case ts.SyntaxKind.ImportEqualsDeclaration:
                this.visitImportEqualsDeclaration(node as ts.ImportEqualsDeclaration);
                break;

            case ts.SyntaxKind.IndexSignature:
                this.visitIndexSignatureDeclaration(node as ts.IndexSignatureDeclaration);
                break;

            case ts.SyntaxKind.InterfaceDeclaration:
                this.visitInterfaceDeclaration(node as ts.InterfaceDeclaration);
                break;

            case ts.SyntaxKind.JsxAttribute:
                this.visitJsxAttribute(node as ts.JsxAttribute);
                break;

            case ts.SyntaxKind.JsxElement:
                this.visitJsxElement(node as ts.JsxElement);
                break;

            case ts.SyntaxKind.JsxExpression:
                this.visitJsxExpression(node as ts.JsxExpression);
                break;

            case ts.SyntaxKind.JsxSelfClosingElement:
                this.visitJsxSelfClosingElement(node as ts.JsxSelfClosingElement);
                break;

            case ts.SyntaxKind.JsxSpreadAttribute:
                this.visitJsxSpreadAttribute(node as ts.JsxSpreadAttribute);
                break;

            case ts.SyntaxKind.LabeledStatement:
                this.visitLabeledStatement(node as ts.LabeledStatement);
                break;

            case ts.SyntaxKind.MethodDeclaration:
                this.visitMethodDeclaration(node as ts.MethodDeclaration);
                break;

            case ts.SyntaxKind.MethodSignature:
                this.visitMethodSignature(node as ts.SignatureDeclaration);
                break;

            case ts.SyntaxKind.ModuleDeclaration:
                this.visitModuleDeclaration(node as ts.ModuleDeclaration);
                break;

            case ts.SyntaxKind.NamedImports:
                this.visitNamedImports(node as ts.NamedImports);
                break;

            case ts.SyntaxKind.NamespaceImport:
                this.visitNamespaceImport(node as ts.NamespaceImport);
                break;

            case ts.SyntaxKind.NewExpression:
                this.visitNewExpression(node as ts.NewExpression);
                break;

            case ts.SyntaxKind.NonNullExpression:
                this.visitNonNullExpression(node as ts.NonNullExpression);
                break;

            case ts.SyntaxKind.NumericLiteral:
                this.visitNumericLiteral(node as ts.NumericLiteral);
                break;

            case ts.SyntaxKind.ObjectBindingPattern:
                this.visitBindingPattern(node as ts.BindingPattern);
                break;

            case ts.SyntaxKind.ObjectLiteralExpression:
                this.visitObjectLiteralExpression(node as ts.ObjectLiteralExpression);
                break;

            case ts.SyntaxKind.Parameter:
                this.visitParameterDeclaration(node as ts.ParameterDeclaration);
                break;

            case ts.SyntaxKind.PostfixUnaryExpression:
                this.visitPostfixUnaryExpression(node as ts.PostfixUnaryExpression);
                break;

            case ts.SyntaxKind.PrefixUnaryExpression:
                this.visitPrefixUnaryExpression(node as ts.PrefixUnaryExpression);
                break;

            case ts.SyntaxKind.PropertyAccessExpression:
                this.visitPropertyAccessExpression(node as ts.PropertyAccessExpression);
                break;

            case ts.SyntaxKind.PropertyAssignment:
                this.visitPropertyAssignment(node as ts.PropertyAssignment);
                break;

            case ts.SyntaxKind.PropertyDeclaration:
                this.visitPropertyDeclaration(node as ts.PropertyDeclaration);
                break;

            case ts.SyntaxKind.PropertySignature:
                this.visitPropertySignature(node);
                break;

            case ts.SyntaxKind.RegularExpressionLiteral:
                this.visitRegularExpressionLiteral(node);
                break;

            case ts.SyntaxKind.ReturnStatement:
                this.visitReturnStatement(node as ts.ReturnStatement);
                break;

            case ts.SyntaxKind.SetAccessor:
                this.visitSetAccessor(node as ts.AccessorDeclaration);
                break;

            case ts.SyntaxKind.SourceFile:
                this.visitSourceFile(node as ts.SourceFile);
                break;

            case ts.SyntaxKind.StringLiteral:
                this.visitStringLiteral(node as ts.StringLiteral);
                break;

            case ts.SyntaxKind.SwitchStatement:
                this.visitSwitchStatement(node as ts.SwitchStatement);
                break;

            case ts.SyntaxKind.TemplateExpression:
                this.visitTemplateExpression(node as ts.TemplateExpression);
                break;

            case ts.SyntaxKind.ThrowStatement:
                this.visitThrowStatement(node as ts.ThrowStatement);
                break;

            case ts.SyntaxKind.TryStatement:
                this.visitTryStatement(node as ts.TryStatement);
                break;

            case ts.SyntaxKind.TupleType:
                this.visitTupleType(node as ts.TupleTypeNode);
                break;

            case ts.SyntaxKind.TypeAliasDeclaration:
                this.visitTypeAliasDeclaration(node as ts.TypeAliasDeclaration);
                break;

            case ts.SyntaxKind.TypeAssertionExpression:
                this.visitTypeAssertionExpression(node as ts.TypeAssertion);
                break;

            case ts.SyntaxKind.TypeLiteral:
                this.visitTypeLiteral(node as ts.TypeLiteralNode);
                break;

            case ts.SyntaxKind.TypeReference:
                this.visitTypeReference(node as ts.TypeReferenceNode);
                break;

            case ts.SyntaxKind.VariableDeclaration:
                this.visitVariableDeclaration(node as ts.VariableDeclaration);
                break;

            case ts.SyntaxKind.VariableDeclarationList:
                this.visitVariableDeclarationList(node as ts.VariableDeclarationList);
                break;

            case ts.SyntaxKind.VariableStatement:
                this.visitVariableStatement(node as ts.VariableStatement);
                break;

            case ts.SyntaxKind.WhileStatement:
                this.visitWhileStatement(node as ts.WhileStatement);
                break;

            case ts.SyntaxKind.WithStatement:
                this.visitWithStatement(node as ts.WithStatement);
                break;

            default:
                this.walkChildren(node);
        }
    }

    protected walkChildren(node: ts.Node) {
        ts.forEachChild(node, child => this.visitNode(child));
    }
}
