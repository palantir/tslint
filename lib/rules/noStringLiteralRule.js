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
        return this.applyWithWalker(new NoStringLiteralWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "object access via string literals is disallowed";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoStringLiteralWalker = (function (_super) {
    __extends(NoStringLiteralWalker, _super);
    function NoStringLiteralWalker() {
        _super.apply(this, arguments);
    }
    NoStringLiteralWalker.prototype.visitElementAccessExpression = function (node) {
        var argument = node.argumentExpression;
        var accessorText = argument.getText();
        if (argument.kind === 9 && accessorText.length > 2) {
            var unquotedAccessorText = accessorText.substring(1, accessorText.length - 1);
            if (this.isValidIdentifier(unquotedAccessorText)) {
                this.addFailure(this.createFailure(argument.getStart(), argument.getWidth(), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitElementAccessExpression.call(this, node);
    };
    NoStringLiteralWalker.prototype.isValidIdentifier = function (token) {
        var scanner = ts.createScanner(1, false, 0, token);
        scanner.scan();
        return scanner.getTokenText() === token && scanner.isIdentifier();
    };
    return NoStringLiteralWalker;
})(Lint.RuleWalker);
