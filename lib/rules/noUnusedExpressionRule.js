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
        return this.applyWithWalker(new UnusedExpressionWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "expected an assignment or function call";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var UnusedExpressionWalker = (function (_super) {
    __extends(UnusedExpressionWalker, _super);
    function UnusedExpressionWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.expressionIsUnused = true;
    }
    UnusedExpressionWalker.prototype.visitExpressionStatement = function (node) {
        this.expressionIsUnused = true;
        _super.prototype.visitExpressionStatement.call(this, node);
        if (this.expressionIsUnused) {
            if (node.expression.kind === 9) {
                var expressionText = node.expression.getText();
                if (expressionText === "\"use strict\"" || expressionText === "'use strict'") {
                    return;
                }
            }
            else if (node.expression.kind === 173 || node.expression.kind === 182) {
                return;
            }
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    };
    UnusedExpressionWalker.prototype.visitBinaryExpression = function (node) {
        _super.prototype.visitBinaryExpression.call(this, node);
        switch (node.operatorToken.kind) {
            case 55:
            case 56:
            case 57:
            case 58:
            case 59:
            case 60:
            case 64:
            case 66:
            case 65:
            case 61:
            case 62:
            case 63:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    };
    UnusedExpressionWalker.prototype.visitPrefixUnaryExpression = function (node) {
        _super.prototype.visitPrefixUnaryExpression.call(this, node);
        switch (node.operator) {
            case 40:
            case 41:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    };
    UnusedExpressionWalker.prototype.visitPostfixUnaryExpression = function (node) {
        _super.prototype.visitPostfixUnaryExpression.call(this, node);
        this.expressionIsUnused = false;
    };
    UnusedExpressionWalker.prototype.visitBlock = function (node) {
        _super.prototype.visitBlock.call(this, node);
        this.expressionIsUnused = true;
    };
    UnusedExpressionWalker.prototype.visitArrowFunction = function (node) {
        _super.prototype.visitArrowFunction.call(this, node);
        this.expressionIsUnused = true;
    };
    UnusedExpressionWalker.prototype.visitCallExpression = function (node) {
        _super.prototype.visitCallExpression.call(this, node);
        this.expressionIsUnused = false;
    };
    UnusedExpressionWalker.prototype.visitConditionalExpression = function (node) {
        this.visitNode(node.condition);
        this.expressionIsUnused = true;
        this.visitNode(node.whenTrue);
        var firstExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = true;
        this.visitNode(node.whenFalse);
        var secondExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = firstExpressionIsUnused || secondExpressionIsUnused;
    };
    return UnusedExpressionWalker;
})(Lint.RuleWalker);
