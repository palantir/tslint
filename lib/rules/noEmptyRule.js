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
        return this.applyWithWalker(new BlockWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "block is empty";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var BlockWalker = (function (_super) {
    __extends(BlockWalker, _super);
    function BlockWalker() {
        _super.apply(this, arguments);
        this.ignoredBlocks = [];
    }
    BlockWalker.prototype.visitBlock = function (node) {
        var openBrace = node.getChildAt(0);
        var closeBrace = node.getChildAt(node.getChildCount() - 1);
        var sourceFileText = node.getSourceFile().text;
        var hasCommentAfter = ts.getTrailingCommentRanges(sourceFileText, openBrace.getEnd()) != null;
        var hasCommentBefore = ts.getLeadingCommentRanges(sourceFileText, closeBrace.getFullStart()) != null;
        var isSkipped = this.ignoredBlocks.indexOf(node) !== -1;
        if (node.statements.length <= 0 && !hasCommentAfter && !hasCommentBefore && !isSkipped) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitBlock.call(this, node);
    };
    BlockWalker.prototype.visitConstructorDeclaration = function (node) {
        var parameters = node.parameters;
        var isSkipped = false;
        for (var _i = 0; _i < parameters.length; _i++) {
            var param = parameters[_i];
            var hasPropertyAccessModifier = Lint.hasModifier(param.modifiers, 108, 109, 110);
            if (hasPropertyAccessModifier) {
                isSkipped = true;
                this.ignoredBlocks.push(node.body);
                break;
            }
            if (isSkipped) {
                break;
            }
        }
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    return BlockWalker;
})(Lint.RuleWalker);
