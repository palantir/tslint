var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scopeAwareRuleWalker_1 = require("./scopeAwareRuleWalker");
var ts = require("typescript");
/**
    * An AST walker that is aware of block scopes in addition to regular scopes. Block scopes
    * are a superset of regular scopes (new block scopes are created more frequently in a program).
    */
var BlockScopeAwareRuleWalker = (function (_super) {
    __extends(BlockScopeAwareRuleWalker, _super);
    function BlockScopeAwareRuleWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        // initialize stack with global scope
        this.blockScopeStack = [this.createBlockScope()];
    }
    BlockScopeAwareRuleWalker.prototype.getCurrentBlockScope = function () {
        return this.blockScopeStack[this.blockScopeStack.length - 1];
    };
    // callback notifier when a block scope begins
    BlockScopeAwareRuleWalker.prototype.onBlockScopeStart = function () {
        return;
    };
    BlockScopeAwareRuleWalker.prototype.getCurrentBlockDepth = function () {
        return this.blockScopeStack.length;
    };
    // callback notifier when a block scope ends
    BlockScopeAwareRuleWalker.prototype.onBlockScopeEnd = function () {
        return;
    };
    BlockScopeAwareRuleWalker.prototype.visitNode = function (node) {
        var isNewBlockScope = this.isBlockScopeBoundary(node);
        if (isNewBlockScope) {
            this.blockScopeStack.push(this.createBlockScope());
        }
        this.onBlockScopeStart();
        _super.prototype.visitNode.call(this, node);
        this.onBlockScopeEnd();
        if (isNewBlockScope) {
            this.blockScopeStack.pop();
        }
    };
    BlockScopeAwareRuleWalker.prototype.isBlockScopeBoundary = function (node) {
        return _super.prototype.isScopeBoundary.call(this, node)
            || node.kind === 195 /* DoStatement */
            || node.kind === 196 /* WhileStatement */
            || node.kind === 197 /* ForStatement */
            || node.kind === 198 /* ForInStatement */
            || node.kind === 199 /* ForOfStatement */
            || node.kind === 203 /* WithStatement */
            || node.kind === 204 /* SwitchStatement */
            || (node.parent != null
                && (node.parent.kind === 207 /* TryStatement */
                    || node.parent.kind === 194 /* IfStatement */));
    };
    return BlockScopeAwareRuleWalker;
})(scopeAwareRuleWalker_1.ScopeAwareRuleWalker);
exports.BlockScopeAwareRuleWalker = BlockScopeAwareRuleWalker;
