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
        return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "interface name must be a capitalized I";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NameWalker = (function (_super) {
    __extends(NameWalker, _super);
    function NameWalker() {
        _super.apply(this, arguments);
    }
    NameWalker.prototype.visitInterfaceDeclaration = function (node) {
        var interfaceName = node.name.text;
        if (!this.startsWithI(interfaceName)) {
            this.addFailureAt(node.name.getStart(), node.name.getWidth());
        }
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    NameWalker.prototype.startsWithI = function (name) {
        if (name.length <= 0) {
            return true;
        }
        var firstCharacter = name.charAt(0);
        return (firstCharacter === "I");
    };
    NameWalker.prototype.addFailureAt = function (position, width) {
        var failure = this.createFailure(position, width, Rule.FAILURE_STRING);
        this.addFailure(failure);
    };
    return NameWalker;
})(Lint.RuleWalker);
