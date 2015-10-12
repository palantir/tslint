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
            case 115:
                this.visitAnyKeyword(node);
                break;
            case 161:
                this.visitBindingElement(node);
                break;
            case 172:
                this.visitArrowFunction(node);
                break;
            case 179:
                this.visitBinaryExpression(node);
                break;
            case 161:
                this.visitBindingElement(node);
                break;
            case 190:
                this.visitBlock(node);
                break;
            case 201:
                this.visitBreakStatement(node);
                break;
            case 166:
                this.visitCallExpression(node);
                break;
            case 145:
                this.visitCallSignature(node);
                break;
            case 239:
                this.visitCaseClause(node);
                break;
            case 212:
                this.visitClassDeclaration(node);
                break;
            case 242:
                this.visitCatchClause(node);
                break;
            case 180:
                this.visitConditionalExpression(node);
                break;
            case 142:
                this.visitConstructorDeclaration(node);
                break;
            case 151:
                this.visitConstructorType(node);
                break;
            case 200:
                this.visitContinueStatement(node);
                break;
            case 208:
                this.visitDebuggerStatement(node);
                break;
            case 240:
                this.visitDefaultClause(node);
                break;
            case 195:
                this.visitDoStatement(node);
                break;
            case 165:
                this.visitElementAccessExpression(node);
                break;
            case 215:
                this.visitEnumDeclaration(node);
                break;
            case 225:
                this.visitExportAssignment(node);
                break;
            case 193:
                this.visitExpressionStatement(node);
                break;
            case 197:
                this.visitForStatement(node);
                break;
            case 198:
                this.visitForInStatement(node);
                break;
            case 199:
                this.visitForOfStatement(node);
                break;
            case 211:
                this.visitFunctionDeclaration(node);
                break;
            case 171:
                this.visitFunctionExpression(node);
                break;
            case 150:
                this.visitFunctionType(node);
                break;
            case 143:
                this.visitGetAccessor(node);
                break;
            case 67:
                this.visitIdentifier(node);
                break;
            case 194:
                this.visitIfStatement(node);
                break;
            case 220:
                this.visitImportDeclaration(node);
                break;
            case 219:
                this.visitImportEqualsDeclaration(node);
                break;
            case 147:
                this.visitIndexSignatureDeclaration(node);
                break;
            case 213:
                this.visitInterfaceDeclaration(node);
                break;
            case 231:
                this.visitJsxElement(node);
                break;
            case 232:
                this.visitJsxSelfClosingElement(node);
                break;
            case 205:
                this.visitLabeledStatement(node);
                break;
            case 141:
                this.visitMethodDeclaration(node);
                break;
            case 140:
                this.visitMethodSignature(node);
                break;
            case 216:
                this.visitModuleDeclaration(node);
                break;
            case 223:
                this.visitNamedImports(node);
                break;
            case 222:
                this.visitNamespaceImport(node);
                break;
            case 167:
                this.visitNewExpression(node);
                break;
            case 163:
                this.visitObjectLiteralExpression(node);
                break;
            case 136:
                this.visitParameterDeclaration(node);
                break;
            case 178:
                this.visitPostfixUnaryExpression(node);
                break;
            case 177:
                this.visitPrefixUnaryExpression(node);
                break;
            case 164:
                this.visitPropertyAccessExpression(node);
                break;
            case 243:
                this.visitPropertyAssignment(node);
                break;
            case 139:
                this.visitPropertyDeclaration(node);
                break;
            case 138:
                this.visitPropertySignature(node);
                break;
            case 10:
                this.visitRegularExpressionLiteral(node);
                break;
            case 202:
                this.visitReturnStatement(node);
                break;
            case 144:
                this.visitSetAccessor(node);
                break;
            case 246:
                this.visitSourceFile(node);
                break;
            case 204:
                this.visitSwitchStatement(node);
                break;
            case 181:
                this.visitTemplateExpression(node);
                break;
            case 206:
                this.visitThrowStatement(node);
                break;
            case 207:
                this.visitTryStatement(node);
                break;
            case 169:
                this.visitTypeAssertionExpression(node);
                break;
            case 153:
                this.visitTypeLiteral(node);
                break;
            case 209:
                this.visitVariableDeclaration(node);
                break;
            case 191:
                this.visitVariableStatement(node);
                break;
            case 196:
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
