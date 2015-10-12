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
        return this.applyWithWalker(new LabelPositionWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "unexpected label on statement";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var LabelPositionWalker = (function (_super) {
    __extends(LabelPositionWalker, _super);
    function LabelPositionWalker() {
        _super.apply(this, arguments);
    }
    LabelPositionWalker.prototype.visitLabeledStatement = function (node) {
        var statement = node.statement;
        if (statement.kind !== 195
            && statement.kind !== 197
            && statement.kind !== 198
            && statement.kind !== 196
            && statement.kind !== 204) {
            var failure = this.createFailure(node.label.getStart(), node.label.getWidth(), Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
        _super.prototype.visitLabeledStatement.call(this, node);
    };
    return LabelPositionWalker;
})(Lint.RuleWalker);
