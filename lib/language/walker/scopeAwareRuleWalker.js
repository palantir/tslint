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
        this.scopeStack = [this.createScope()];
    }
    ScopeAwareRuleWalker.prototype.getCurrentScope = function () {
        return this.scopeStack[this.scopeStack.length - 1];
    };
    ScopeAwareRuleWalker.prototype.getAllScopes = function () {
        return this.scopeStack.slice();
    };
    ScopeAwareRuleWalker.prototype.getCurrentDepth = function () {
        return this.scopeStack.length;
    };
    ScopeAwareRuleWalker.prototype.onScopeStart = function () {
        return;
    };
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
        return node.kind === 211
            || node.kind === 171
            || node.kind === 243
            || node.kind === 244
            || node.kind === 141
            || node.kind === 142
            || node.kind === 216
            || node.kind === 172
            || node.kind === 170
            || node.kind === 212
            || node.kind === 213
            || node.kind === 143
            || node.kind === 144;
    };
    return ScopeAwareRuleWalker;
})(ruleWalker_1.RuleWalker);
exports.ScopeAwareRuleWalker = ScopeAwareRuleWalker;
