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
        return this.applyWithWalker(new NoBitwiseWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "forbidden bitwise operation";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoBitwiseWalker = (function (_super) {
    __extends(NoBitwiseWalker, _super);
    function NoBitwiseWalker() {
        _super.apply(this, arguments);
    }
    NoBitwiseWalker.prototype.visitBinaryExpression = function (node) {
        switch (node.operatorToken.kind) {
            case 45:
            case 64:
            case 46:
            case 65:
            case 47:
            case 66:
            case 42:
            case 61:
            case 43:
            case 62:
            case 44:
            case 63:
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                break;
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    NoBitwiseWalker.prototype.visitPrefixUnaryExpression = function (node) {
        if (node.operator === 49) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitPrefixUnaryExpression.call(this, node);
    };
    return NoBitwiseWalker;
})(Lint.RuleWalker);
