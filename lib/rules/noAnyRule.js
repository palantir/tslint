var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../lint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker((new NoAnyWalker(sourceFile, this.getOptions())));
    };
    Rule.FAILURE_STRING = "type decoration of 'any' is forbidden";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoAnyWalker = (function (_super) {
    __extends(NoAnyWalker, _super);
    function NoAnyWalker() {
        _super.apply(this, arguments);
    }
    NoAnyWalker.prototype.visitAnyKeyword = function (node) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        _super.prototype.visitAnyKeyword.call(this, node);
    };
    return NoAnyWalker;
})(Lint.RuleWalker);
