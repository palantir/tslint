var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ruleWalker_1 = require("./ruleWalker");
var ts = require("typescript");
var ScopeAwareRuleWalker = (function (_super) {
    __extends(ScopeAwareRuleWalker, _super);
    function ScopeAwareRuleWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        // initialize stack with global scope
        this.scopeStack = [this.createScope()];
    }
    ScopeAwareRuleWalker.prototype.getCurrentScope = function () {
        return this.scopeStack[this.scopeStack.length - 1];
    };
    // get all scopes available at this depth
    ScopeAwareRuleWalker.prototype.getAllScopes = function () {
        return this.scopeStack.slice();
    };
    ScopeAwareRuleWalker.prototype.getCurrentDepth = function () {
        return this.scopeStack.length;
    };
    // callback notifier when a scope begins
    ScopeAwareRuleWalker.prototype.onScopeStart = function () {
        return;
    };
    // callback notifier when a scope ends
    ScopeAwareRuleWalker.prototype.onScopeEnd = function () {
        return;
    };
    ScopeAwareRuleWalker.prototype.visitNode = function (node) {
        var isNewScope = this.isScopeBoundary(node);
        if (isNewScope) {
            this.scopeStack.push(this.createScope());
        }
        this.onScopeStart();
        _super.prototype.visitNode.call(this, node);
        this.onScopeEnd();
        if (isNewScope) {
            this.scopeStack.pop();
        }
    };
    ScopeAwareRuleWalker.prototype.isScopeBoundary = function (node) {
        return node.kind === 211 /* FunctionDeclaration */
            || node.kind === 171 /* FunctionExpression */
            || node.kind === 243 /* PropertyAssignment */
            || node.kind === 244 /* ShorthandPropertyAssignment */
            || node.kind === 141 /* MethodDeclaration */
            || node.kind === 142 /* Constructor */
            || node.kind === 216 /* ModuleDeclaration */
            || node.kind === 172 /* ArrowFunction */
            || node.kind === 170 /* ParenthesizedExpression */
            || node.kind === 212 /* ClassDeclaration */
            || node.kind === 213 /* InterfaceDeclaration */
            || node.kind === 143 /* GetAccessor */
            || node.kind === 144 /* SetAccessor */;
    };
    return ScopeAwareRuleWalker;
})(ruleWalker_1.RuleWalker);
exports.ScopeAwareRuleWalker = ScopeAwareRuleWalker;
