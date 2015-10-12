var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../lint");
var ts = require("typescript");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoInternalModuleWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "forbidden internal module";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoInternalModuleWalker = (function (_super) {
    __extends(NoInternalModuleWalker, _super);
    function NoInternalModuleWalker() {
        _super.apply(this, arguments);
    }
    NoInternalModuleWalker.prototype.visitModuleDeclaration = function (node) {
        if (this.isInternalModuleDeclaration(node)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    NoInternalModuleWalker.prototype.isInternalModuleDeclaration = function (node) {
        return !Lint.isNodeFlagSet(node, 131072)
            && !this.isNestedDeclaration(node)
            && node.name.kind === 67;
    };
    NoInternalModuleWalker.prototype.isNestedDeclaration = function (node) {
        return node.name.pos === node.pos;
    };
    return NoInternalModuleWalker;
})(Lint.RuleWalker);
