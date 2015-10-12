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
        return this.applyWithWalker(new BlankLinesWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "consecutive blank lines are disallowed";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var BlankLinesWalker = (function (_super) {
    __extends(BlankLinesWalker, _super);
    function BlankLinesWalker() {
        _super.apply(this, arguments);
    }
    BlankLinesWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        _super.prototype.visitSourceFile.call(this, node);
        var newLinesInARowSeenSoFar = 1;
        Lint.scanAllTokens(ts.createScanner(1, false, 0, node.text), function (scanner) {
            var startPos = scanner.getStartPos();
            if (_this.tokensToSkipStartEndMap[startPos] != null) {
                scanner.setTextPos(_this.tokensToSkipStartEndMap[startPos]);
                newLinesInARowSeenSoFar = 0;
                return;
            }
            if (scanner.getToken() === 4) {
                newLinesInARowSeenSoFar += 1;
                if (newLinesInARowSeenSoFar >= 3) {
                    var failure = _this.createFailure(scanner.getStartPos(), 1, Rule.FAILURE_STRING);
                    _this.addFailure(failure);
                }
            }
            else {
                newLinesInARowSeenSoFar = 0;
            }
        });
    };
    return BlankLinesWalker;
})(Lint.SkippableTokenAwareRuleWalker);
