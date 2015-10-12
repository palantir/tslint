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
        return this.applyWithWalker(new NoEvalWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "forbidden eval";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoEvalWalker = (function (_super) {
    __extends(NoEvalWalker, _super);
    function NoEvalWalker() {
        _super.apply(this, arguments);
    }
    NoEvalWalker.prototype.visitCallExpression = function (node) {
        var expression = node.expression;
        if (expression.kind === 67) {
            var expressionName = expression.text;
            if (expressionName === "eval") {
                this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoEvalWalker;
})(Lint.RuleWalker);
