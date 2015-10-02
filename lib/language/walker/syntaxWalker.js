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
var ts = require("typescript");
var SyntaxWalker = (function () {
    function SyntaxWalker() {
    }
    SyntaxWalker.prototype.walk = function (node) {
        this.visitNode(node);
    };
    SyntaxWalker.prototype.visitAnyKeyword = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitArrowFunction = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitBinaryExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitBindingElement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitBlock = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitBreakStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitCallExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitCallSignature = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitCaseClause = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitClassDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitCatchClause = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitConditionalExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitConstructorDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitConstructorType = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitContinueStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitDebuggerStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitDefaultClause = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitDoStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitElementAccessExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitEnumDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitExportAssignment = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitExpressionStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitForStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitForInStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitForOfStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitFunctionDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitFunctionExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitFunctionType = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitGetAccessor = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitIdentifier = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitIfStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitImportDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitImportEqualsDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitIndexSignatureDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitInterfaceDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitJsxElement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitLabeledStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitMethodDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitMethodSignature = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitModuleDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitNamedImports = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitNamespaceImport = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitNewExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitObjectLiteralExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitParameterDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitPostfixUnaryExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitPrefixUnaryExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitPropertyAccessExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitPropertyAssignment = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitPropertyDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitPropertySignature = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitRegularExpressionLiteral = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitReturnStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitSetAccessor = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitSourceFile = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitSwitchStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitTemplateExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitThrowStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitTryStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitTypeAssertionExpression = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitTypeLiteral = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitVariableDeclaration = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitVariableStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitWhileStatement = function (node) {
        this.walkChildren(node);
    };
    SyntaxWalker.prototype.visitNode = function (node) {
        switch (node.kind) {
            case 115 /* AnyKeyword */:
                this.visitAnyKeyword(node);
                break;
            case 161 /* BindingElement */:
                this.visitBindingElement(node);
                break;
            case 172 /* ArrowFunction */:
                this.visitArrowFunction(node);
                break;
            case 179 /* BinaryExpression */:
                this.visitBinaryExpression(node);
                break;
            case 161 /* BindingElement */:
                this.visitBindingElement(node);
                break;
            case 190 /* Block */:
                this.visitBlock(node);
                break;
            case 201 /* BreakStatement */:
                this.visitBreakStatement(node);
                break;
            case 166 /* CallExpression */:
                this.visitCallExpression(node);
                break;
            case 145 /* CallSignature */:
                this.visitCallSignature(node);
                break;
            case 239 /* CaseClause */:
                this.visitCaseClause(node);
                break;
            case 212 /* ClassDeclaration */:
                this.visitClassDeclaration(node);
                break;
            case 242 /* CatchClause */:
                this.visitCatchClause(node);
                break;
            case 180 /* ConditionalExpression */:
                this.visitConditionalExpression(node);
                break;
            case 142 /* Constructor */:
                this.visitConstructorDeclaration(node);
                break;
            case 151 /* ConstructorType */:
                this.visitConstructorType(node);
                break;
            case 200 /* ContinueStatement */:
                this.visitContinueStatement(node);
                break;
            case 208 /* DebuggerStatement */:
                this.visitDebuggerStatement(node);
                break;
            case 240 /* DefaultClause */:
                this.visitDefaultClause(node);
                break;
            case 195 /* DoStatement */:
                this.visitDoStatement(node);
                break;
            case 165 /* ElementAccessExpression */:
                this.visitElementAccessExpression(node);
                break;
            case 215 /* EnumDeclaration */:
                this.visitEnumDeclaration(node);
                break;
            case 225 /* ExportAssignment */:
                this.visitExportAssignment(node);
                break;
            case 193 /* ExpressionStatement */:
                this.visitExpressionStatement(node);
                break;
            case 197 /* ForStatement */:
                this.visitForStatement(node);
                break;
            case 198 /* ForInStatement */:
                this.visitForInStatement(node);
                break;
            case 199 /* ForOfStatement */:
                this.visitForOfStatement(node);
                break;
            case 211 /* FunctionDeclaration */:
                this.visitFunctionDeclaration(node);
                break;
            case 171 /* FunctionExpression */:
                this.visitFunctionExpression(node);
                break;
            case 150 /* FunctionType */:
                this.visitFunctionType(node);
                break;
            case 143 /* GetAccessor */:
                this.visitGetAccessor(node);
                break;
            case 67 /* Identifier */:
                this.visitIdentifier(node);
                break;
            case 194 /* IfStatement */:
                this.visitIfStatement(node);
                break;
            case 220 /* ImportDeclaration */:
                this.visitImportDeclaration(node);
                break;
            case 219 /* ImportEqualsDeclaration */:
                this.visitImportEqualsDeclaration(node);
                break;
            case 147 /* IndexSignature */:
                this.visitIndexSignatureDeclaration(node);
                break;
            case 213 /* InterfaceDeclaration */:
                this.visitInterfaceDeclaration(node);
                break;
            case 231 /* JsxElement */:
                this.visitJsxElement(node);
                break;
            case 232 /* JsxSelfClosingElement */:
                this.visitJsxSelfClosingElement(node);
                break;
            case 205 /* LabeledStatement */:
                this.visitLabeledStatement(node);
                break;
            case 141 /* MethodDeclaration */:
                this.visitMethodDeclaration(node);
                break;
            case 140 /* MethodSignature */:
                this.visitMethodSignature(node);
                break;
            case 216 /* ModuleDeclaration */:
                this.visitModuleDeclaration(node);
                break;
            case 223 /* NamedImports */:
                this.visitNamedImports(node);
                break;
            case 222 /* NamespaceImport */:
                this.visitNamespaceImport(node);
                break;
            case 167 /* NewExpression */:
                this.visitNewExpression(node);
                break;
            case 163 /* ObjectLiteralExpression */:
                this.visitObjectLiteralExpression(node);
                break;
            case 136 /* Parameter */:
                this.visitParameterDeclaration(node);
                break;
            case 178 /* PostfixUnaryExpression */:
                this.visitPostfixUnaryExpression(node);
                break;
            case 177 /* PrefixUnaryExpression */:
                this.visitPrefixUnaryExpression(node);
                break;
            case 164 /* PropertyAccessExpression */:
                this.visitPropertyAccessExpression(node);
                break;
            case 243 /* PropertyAssignment */:
                this.visitPropertyAssignment(node);
                break;
            case 139 /* PropertyDeclaration */:
                this.visitPropertyDeclaration(node);
                break;
            case 138 /* PropertySignature */:
                this.visitPropertySignature(node);
                break;
            case 10 /* RegularExpressionLiteral */:
                this.visitRegularExpressionLiteral(node);
                break;
            case 202 /* ReturnStatement */:
                this.visitReturnStatement(node);
                break;
            case 144 /* SetAccessor */:
                this.visitSetAccessor(node);
                break;
            case 246 /* SourceFile */:
                this.visitSourceFile(node);
                break;
            case 204 /* SwitchStatement */:
                this.visitSwitchStatement(node);
                break;
            case 181 /* TemplateExpression */:
                this.visitTemplateExpression(node);
                break;
            case 206 /* ThrowStatement */:
                this.visitThrowStatement(node);
                break;
            case 207 /* TryStatement */:
                this.visitTryStatement(node);
                break;
            case 169 /* TypeAssertionExpression */:
                this.visitTypeAssertionExpression(node);
                break;
            case 153 /* TypeLiteral */:
                this.visitTypeLiteral(node);
                break;
            case 209 /* VariableDeclaration */:
                this.visitVariableDeclaration(node);
                break;
            case 191 /* VariableStatement */:
                this.visitVariableStatement(node);
                break;
            case 196 /* WhileStatement */:
                this.visitWhileStatement(node);
                break;
            default:
                this.walkChildren(node);
                break;
        }
    };
    SyntaxWalker.prototype.walkChildren = function (node) {
        var _this = this;
        ts.forEachChild(node, function (child) { return _this.visitNode(child); });
    };
    return SyntaxWalker;
})();
exports.SyntaxWalker = SyntaxWalker;
