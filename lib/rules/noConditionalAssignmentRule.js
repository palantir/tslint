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
        var walker = new NoConditionalAssignmentWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    Rule.FAILURE_STRING = "assignment in conditional: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoConditionalAssignmentWalker = (function (_super) {
    __extends(NoConditionalAssignmentWalker, _super);
    function NoConditionalAssignmentWalker() {
        _super.apply(this, arguments);
        this.isInConditional = false;
    }
    NoConditionalAssignmentWalker.prototype.visitIfStatement = function (node) {
        this.validateConditionalExpression(node.expression);
        _super.prototype.visitIfStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitWhileStatement = function (node) {
        this.validateConditionalExpression(node.expression);
        _super.prototype.visitWhileStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitDoStatement = function (node) {
        this.validateConditionalExpression(node.expression);
        _super.prototype.visitWhileStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitForStatement = function (node) {
        if (node.condition != null) {
            this.validateConditionalExpression(node.condition);
        }
        _super.prototype.visitForStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitBinaryExpression = function (expression) {
        if (this.isInConditional) {
            this.checkForAssignment(expression);
        }
        _super.prototype.visitBinaryExpression.call(this, expression);
    };
    NoConditionalAssignmentWalker.prototype.validateConditionalExpression = function (expression) {
        this.isInConditional = true;
        if (expression.kind === 179) {
            this.checkForAssignment(expression);
        }
        this.walkChildren(expression);
        this.isInConditional = false;
    };
    NoConditionalAssignmentWalker.prototype.checkForAssignment = function (expression) {
        if (this.isAssignmentToken(expression.operatorToken)) {
            this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING));
        }
    };
    NoConditionalAssignmentWalker.prototype.isAssignmentToken = function (token) {
        return token.kind >= 55 && token.kind <= 66;
    };
    return NoConditionalAssignmentWalker;
})(Lint.RuleWalker);
