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
        return this.applyWithWalker(new NoRequireImportsWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "require() style import is forbidden";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoRequireImportsWalker = (function (_super) {
    __extends(NoRequireImportsWalker, _super);
    function NoRequireImportsWalker() {
        _super.apply(this, arguments);
    }
    NoRequireImportsWalker.prototype.visitVariableStatement = function (node) {
        var declarations = node.declarationList.declarations;
        for (var _i = 0; _i < declarations.length; _i++) {
            var decl = declarations[_i];
            this.handleDeclaration(decl);
        }
        _super.prototype.visitVariableStatement.call(this, node);
    };
    NoRequireImportsWalker.prototype.visitImportEqualsDeclaration = function (node) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    NoRequireImportsWalker.prototype.handleDeclaration = function (decl) {
        var call = (decl.initializer);
        if (call && call.arguments && call.expression) {
            var callExpressionText = call.expression.getText(this.getSourceFile());
            if (callExpressionText === "require") {
                this.addFailure(this.createFailure(decl.getStart(), decl.getWidth(), Rule.FAILURE_STRING));
            }
        }
    };
    return NoRequireImportsWalker;
})(Lint.RuleWalker);
