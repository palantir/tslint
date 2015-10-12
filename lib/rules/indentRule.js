var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../lint");
var ts = require("typescript");
var OPTION_USE_TABS = "tabs";
var OPTION_USE_SPACES = "spaces";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new IndentWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING_TABS = "tab indentation expected";
    Rule.FAILURE_STRING_SPACES = "space indentation expected";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var IndentWalker = (function (_super) {
    __extends(IndentWalker, _super);
    function IndentWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        if (this.hasOption(OPTION_USE_TABS)) {
            this.regExp = new RegExp(" ");
            this.failureString = Rule.FAILURE_STRING_TABS;
        }
        else if (this.hasOption(OPTION_USE_SPACES)) {
            this.regExp = new RegExp("\t");
            this.failureString = Rule.FAILURE_STRING_SPACES;
        }
    }
    IndentWalker.prototype.visitSourceFile = function (node) {
        if (!this.hasOption(OPTION_USE_TABS) && !this.hasOption(OPTION_USE_SPACES)) {
            return;
        }
        var endOfComment = -1;
        var scanner = ts.createScanner(1, false, 0, node.text);
        for (var _i = 0, _a = node.getLineStarts(); _i < _a.length; _i++) {
            var lineStart = _a[_i];
            if (lineStart < endOfComment) {
                continue;
            }
            scanner.setTextPos(lineStart);
            var currentScannedType = scanner.scan();
            var fullLeadingWhitespace = "";
            var lastStartPos = -1;
            while (currentScannedType === 5) {
                var startPos = scanner.getStartPos();
                if (startPos === lastStartPos) {
                    break;
                }
                lastStartPos = startPos;
                fullLeadingWhitespace += scanner.getTokenText();
                currentScannedType = scanner.scan();
            }
            var commentRanges = ts.getTrailingCommentRanges(node.text, lineStart);
            if (commentRanges) {
                endOfComment = commentRanges[commentRanges.length - 1].end;
            }
            if (currentScannedType === 2
                || currentScannedType === 3
                || currentScannedType === 4) {
                continue;
            }
            if (fullLeadingWhitespace.match(this.regExp)) {
                this.addFailure(this.createFailure(lineStart, fullLeadingWhitespace.length, this.failureString));
            }
        }
    };
    return IndentWalker;
})(Lint.RuleWalker);
