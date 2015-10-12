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
        var noVarKeywordWalker = new NoVarKeywordWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(noVarKeywordWalker);
    };
    Rule.FAILURE_STRING = "forbidden var keyword";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoVarKeywordWalker = (function (_super) {
    __extends(NoVarKeywordWalker, _super);
    function NoVarKeywordWalker() {
        _super.apply(this, arguments);
    }
    NoVarKeywordWalker.prototype.visitVariableStatement = function (node) {
        if (!Lint.hasModifier(node.modifiers, 80, 120)
            && !Lint.isBlockScopedVariable(node)) {
            this.addFailure(this.createFailure(node.getStart(), "var".length, Rule.FAILURE_STRING));
        }
        _super.prototype.visitVariableStatement.call(this, node);
    };
    return NoVarKeywordWalker;
})(Lint.RuleWalker);
