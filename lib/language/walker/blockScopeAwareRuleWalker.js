var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scopeAwareRuleWalker_1 = require("./scopeAwareRuleWalker");
var ts = require("typescript");
var BlockScopeAwareRuleWalker = (function (_super) {
    __extends(BlockScopeAwareRuleWalker, _super);
    function BlockScopeAwareRuleWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.blockScopeStack = [this.createBlockScope()];
    }
    BlockScopeAwareRuleWalker.prototype.getCurrentBlockScope = function () {
        return this.blockScopeStack[this.blockScopeStack.length - 1];
    };
    BlockScopeAwareRuleWalker.prototype.onBlockScopeStart = function () {
        return;
    };
    BlockScopeAwareRuleWalker.prototype.getCurrentBlockDepth = function () {
        return this.blockScopeStack.length;
    };
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
            || node.kind === 195
            || node.kind === 196
            || node.kind === 197
            || node.kind === 198
            || node.kind === 199
            || node.kind === 203
            || node.kind === 204
            || (node.parent != null
                && (node.parent.kind === 207
                    || node.parent.kind === 194));
    };
    return BlockScopeAwareRuleWalker;
})(scopeAwareRuleWalker_1.ScopeAwareRuleWalker);
exports.BlockScopeAwareRuleWalker = BlockScopeAwareRuleWalker;
