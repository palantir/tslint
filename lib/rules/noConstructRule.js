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
        return this.applyWithWalker(new NoConstructWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "undesirable constructor use";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoConstructWalker = (function (_super) {
    __extends(NoConstructWalker, _super);
    function NoConstructWalker() {
        _super.apply(this, arguments);
    }
    NoConstructWalker.prototype.visitNewExpression = function (node) {
        if (node.expression.kind === 67) {
            var identifier = node.expression;
            var constructorName = identifier.text;
            if (NoConstructWalker.FORBIDDEN_CONSTRUCTORS.indexOf(constructorName) !== -1) {
                var failure = this.createFailure(node.getStart(), identifier.getEnd() - node.getStart(), Rule.FAILURE_STRING);
                this.addFailure(failure);
            }
        }
        _super.prototype.visitNewExpression.call(this, node);
    };
    NoConstructWalker.FORBIDDEN_CONSTRUCTORS = [
        "Boolean",
        "Number",
        "String"
    ];
    return NoConstructWalker;
})(Lint.RuleWalker);
