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
        return this.applyWithWalker(new NoDuplicateVariableWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "duplicate variable: '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoDuplicateVariableWalker = (function (_super) {
    __extends(NoDuplicateVariableWalker, _super);
    function NoDuplicateVariableWalker() {
        _super.apply(this, arguments);
    }
    NoDuplicateVariableWalker.prototype.createScope = function () {
        return null;
    };
    NoDuplicateVariableWalker.prototype.createBlockScope = function () {
        return new ScopeInfo();
    };
    NoDuplicateVariableWalker.prototype.visitBindingElement = function (node) {
        var isSingleVariable = node.name.kind === 67;
        var isBlockScoped = Lint.isBlockScopedBindingElement(node);
        if (isSingleVariable && !isBlockScoped) {
            this.handleSingleVariableIdentifier(node.name);
        }
        _super.prototype.visitBindingElement.call(this, node);
    };
    NoDuplicateVariableWalker.prototype.visitCatchClause = function (node) {
        this.visitBlock(node.block);
    };
    NoDuplicateVariableWalker.prototype.visitMethodSignature = function (node) {
    };
    NoDuplicateVariableWalker.prototype.visitTypeLiteral = function (node) {
    };
    NoDuplicateVariableWalker.prototype.visitVariableDeclaration = function (node) {
        var isSingleVariable = node.name.kind === 67;
        if (isSingleVariable && !Lint.isBlockScopedVariable(node)) {
            this.handleSingleVariableIdentifier(node.name);
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    NoDuplicateVariableWalker.prototype.handleSingleVariableIdentifier = function (variableIdentifier) {
        var variableName = variableIdentifier.text;
        var currentBlockScope = this.getCurrentBlockScope();
        if (currentBlockScope.varNames.indexOf(variableName) >= 0) {
            this.addFailureOnIdentifier(variableIdentifier);
        }
        else {
            currentBlockScope.varNames.push(variableName);
        }
    };
    NoDuplicateVariableWalker.prototype.addFailureOnIdentifier = function (ident) {
        var failureString = "" + Rule.FAILURE_STRING + ident.text + "'";
        this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), failureString));
    };
    return NoDuplicateVariableWalker;
})(Lint.BlockScopeAwareRuleWalker);
var ScopeInfo = (function () {
    function ScopeInfo() {
        this.varNames = [];
    }
    return ScopeInfo;
})();
