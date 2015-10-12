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
        return this.applyWithWalker(new NoArgWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "access forbidden to arguments property";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoArgWalker = (function (_super) {
    __extends(NoArgWalker, _super);
    function NoArgWalker() {
        _super.apply(this, arguments);
    }
    NoArgWalker.prototype.visitPropertyAccessExpression = function (node) {
        var expression = node.expression;
        var name = node.name;
        if (expression.kind === 67 && name.text === "callee") {
            var identifierExpression = expression;
            if (identifierExpression.text === "arguments") {
                this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitPropertyAccessExpression.call(this, node);
    };
    return NoArgWalker;
})(Lint.RuleWalker);
