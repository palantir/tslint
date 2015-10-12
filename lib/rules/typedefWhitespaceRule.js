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
        return this.applyWithWalker(new TypedefWhitespaceWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "missing type declaration";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var TypedefWhitespaceWalker = (function (_super) {
    __extends(TypedefWhitespaceWalker, _super);
    function TypedefWhitespaceWalker() {
        _super.apply(this, arguments);
    }
    TypedefWhitespaceWalker.prototype.visitFunctionDeclaration = function (node) {
        this.checkSpace("call-signature", node, node.type, node.parameters.end + 1);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitFunctionExpression = function (node) {
        this.checkSpace("call-signature", node, node.type, node.parameters.end + 1);
        _super.prototype.visitFunctionExpression.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitGetAccessor = function (node) {
        this.checkSpace("call-signature", node, node.type, node.parameters.end + 1);
        _super.prototype.visitGetAccessor.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitIndexSignatureDeclaration = function (node) {
        var indexParameter = node.parameters[0];
        if (indexParameter != null) {
            this.checkSpace("index-signature", indexParameter, indexParameter.type, indexParameter.name.getEnd());
        }
        _super.prototype.visitIndexSignatureDeclaration.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkSpace("call-signature", node, node.type, node.parameters.end + 1);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitMethodSignature = function (node) {
        this.checkSpace("call-signature", node, node.type, node.parameters.end + 1);
        _super.prototype.visitMethodSignature.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitParameterDeclaration = function (node) {
        this.checkSpace("parameter", node, node.type, node.name.getEnd());
        _super.prototype.visitParameterDeclaration.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitPropertyDeclaration = function (node) {
        this.checkSpace("property-declaration", node, node.type, node.name.getEnd());
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitPropertySignature = function (node) {
        this.checkSpace("property-declaration", node, node.type, node.name.getEnd());
        _super.prototype.visitPropertySignature.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitSetAccessor = function (node) {
        this.checkSpace("call-signature", node, node.type, node.parameters.end + 1);
        _super.prototype.visitSetAccessor.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitVariableDeclaration = function (node) {
        this.checkSpace("variable-declaration", node, node.type, node.name.getEnd());
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.checkSpace = function (option, node, typeNode, positionBeforeColon) {
        if (this.hasOption(option) && typeNode != null && positionBeforeColon != null) {
            var scanner = ts.createScanner(1, false, 0, node.getText());
            var hasLeadingWhitespace;
            scanner.setTextPos(positionBeforeColon - node.getStart());
            hasLeadingWhitespace = scanner.scan() === 5;
            if (hasLeadingWhitespace !== (this.getOption(option) === "space")) {
                var message = "expected " + this.getOption(option) + " in " + option;
                this.addFailure(this.createFailure(positionBeforeColon, 1, message));
            }
        }
    };
    TypedefWhitespaceWalker.prototype.hasOption = function (option) {
        var allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return false;
        }
        var options = allOptions[0];
        return options == null || options[option] != null;
    };
    TypedefWhitespaceWalker.prototype.getOption = function (option) {
        var allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return null;
        }
        var options = allOptions[0];
        return options[option];
    };
    return TypedefWhitespaceWalker;
})(Lint.RuleWalker);
