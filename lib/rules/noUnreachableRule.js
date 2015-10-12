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
        return this.applyWithWalker(new UnreachableWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "unreachable code";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var UnreachableWalker = (function (_super) {
    __extends(UnreachableWalker, _super);
    function UnreachableWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.hasReturned = false;
    }
    UnreachableWalker.prototype.visitNode = function (node) {
        var previousReturned = this.hasReturned;
        if (node.kind === 211) {
            this.hasReturned = false;
        }
        if (this.hasReturned) {
            this.hasReturned = false;
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitNode.call(this, node);
        if (node.kind === 211) {
            this.hasReturned = previousReturned;
        }
    };
    UnreachableWalker.prototype.visitBlock = function (node) {
        _super.prototype.visitBlock.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitCaseClause = function (node) {
        _super.prototype.visitCaseClause.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitDefaultClause = function (node) {
        _super.prototype.visitDefaultClause.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitIfStatement = function (node) {
        this.visitNode(node.expression);
        this.visitNode(node.thenStatement);
        this.hasReturned = false;
        if (node.elseStatement != null) {
            this.visitNode(node.elseStatement);
            this.hasReturned = false;
        }
    };
    UnreachableWalker.prototype.visitBreakStatement = function (node) {
        _super.prototype.visitBreakStatement.call(this, node);
        this.hasReturned = true;
    };
    UnreachableWalker.prototype.visitContinueStatement = function (node) {
        _super.prototype.visitContinueStatement.call(this, node);
        this.hasReturned = true;
    };
    UnreachableWalker.prototype.visitReturnStatement = function (node) {
        _super.prototype.visitReturnStatement.call(this, node);
        this.hasReturned = true;
    };
    UnreachableWalker.prototype.visitThrowStatement = function (node) {
        _super.prototype.visitThrowStatement.call(this, node);
        this.hasReturned = true;
    };
    return UnreachableWalker;
})(Lint.RuleWalker);
