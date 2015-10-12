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
        var typedefWalker = new TypedefWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(typedefWalker);
    };
    Rule.FAILURE_STRING = "missing type declaration";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var TypedefWalker = (function (_super) {
    __extends(TypedefWalker, _super);
    function TypedefWalker() {
        _super.apply(this, arguments);
    }
    TypedefWalker.prototype.visitFunctionDeclaration = function (node) {
        this.handleCallSignature(node);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    TypedefWalker.prototype.visitFunctionExpression = function (node) {
        this.handleCallSignature(node);
        _super.prototype.visitFunctionExpression.call(this, node);
    };
    TypedefWalker.prototype.visitGetAccessor = function (node) {
        this.handleCallSignature(node);
        _super.prototype.visitGetAccessor.call(this, node);
    };
    TypedefWalker.prototype.visitMethodDeclaration = function (node) {
        this.handleCallSignature(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    TypedefWalker.prototype.visitMethodSignature = function (node) {
        this.handleCallSignature(node);
        _super.prototype.visitMethodSignature.call(this, node);
    };
    TypedefWalker.prototype.visitObjectLiteralExpression = function (node) {
        for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
            var property = _a[_i];
            switch (property.kind) {
                case 243:
                    this.visitPropertyAssignment(property);
                    break;
                case 141:
                    this.visitMethodDeclaration(property);
                    break;
                case 143:
                    this.visitGetAccessor(property);
                    break;
                case 144:
                    this.visitSetAccessor(property);
                    break;
            }
        }
    };
    TypedefWalker.prototype.visitParameterDeclaration = function (node) {
        if (node.type == null || node.type.kind !== 9) {
            this.checkTypeAnnotation("parameter", node.getEnd(), node.type, node.name);
        }
        _super.prototype.visitParameterDeclaration.call(this, node);
    };
    TypedefWalker.prototype.visitPropertyAssignment = function (node) {
        switch (node.initializer.kind) {
            case 172:
            case 171:
                this.handleCallSignature(node.initializer);
                break;
        }
        _super.prototype.visitPropertyAssignment.call(this, node);
    };
    TypedefWalker.prototype.visitPropertyDeclaration = function (node) {
        var optionName = "member-variable-declaration";
        this.checkTypeAnnotation(optionName, node.name.getEnd(), node.type, node.name);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    TypedefWalker.prototype.visitPropertySignature = function (node) {
        var optionName = "property-declaration";
        this.checkTypeAnnotation(optionName, node.name.getEnd(), node.type, node.name);
        _super.prototype.visitPropertySignature.call(this, node);
    };
    TypedefWalker.prototype.visitSetAccessor = function (node) {
        this.handleCallSignature(node);
        _super.prototype.visitSetAccessor.call(this, node);
    };
    TypedefWalker.prototype.visitVariableDeclaration = function (node) {
        if (node.parent.parent.kind !== 198
            && node.parent.kind !== 242) {
            this.checkTypeAnnotation("variable-declaration", node.name.getEnd(), node.type, node.name);
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    TypedefWalker.prototype.handleCallSignature = function (node) {
        var location = (node.parameters != null) ? node.parameters.end : null;
        if (node.kind !== 144) {
            this.checkTypeAnnotation("call-signature", location, node.type, node.name);
        }
    };
    TypedefWalker.prototype.checkTypeAnnotation = function (option, location, typeAnnotation, name) {
        if (this.hasOption(option) && typeAnnotation == null) {
            var ns = "";
            if (name != null && name.kind === 67) {
                ns = ": '" + name.text + "'";
            }
            var failure = this.createFailure(location, 1, "expected " + option + ns + " to have a typedef");
            this.addFailure(failure);
        }
    };
    return TypedefWalker;
})(Lint.RuleWalker);
