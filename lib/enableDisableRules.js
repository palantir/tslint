var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("./lint");
var ts = require("typescript");
var EnableDisableRulesWalker = (function (_super) {
    __extends(EnableDisableRulesWalker, _super);
    function EnableDisableRulesWalker() {
        _super.apply(this, arguments);
        this.enableDisableRuleMap = {};
    }
    EnableDisableRulesWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        _super.prototype.visitSourceFile.call(this, node);
        var scan = ts.createScanner(1, false, 0, node.text);
        Lint.scanAllTokens(scan, function (scanner) {
            var startPos = scanner.getStartPos();
            if (_this.tokensToSkipStartEndMap[startPos] != null) {
                scanner.setTextPos(_this.tokensToSkipStartEndMap[startPos]);
                return;
            }
            if (scanner.getToken() === 3) {
                var commentText = scanner.getTokenText();
                var startPosition = scanner.getTokenPos();
                _this.handlePossibleTslintSwitch(commentText, startPosition);
            }
        });
    };
    EnableDisableRulesWalker.prototype.handlePossibleTslintSwitch = function (commentText, startingPosition) {
        var _this = this;
        var currentPosition = startingPosition;
        if (commentText.match(/^\/\*\s*tslint:/)) {
            var commentTextParts = commentText.split(":");
            var enableOrDisableMatch = commentTextParts[1].match(/^(enable|disable)(\s|$)/);
            if (enableOrDisableMatch != null) {
                var isEnabled = enableOrDisableMatch[1] === "enable";
                var position = currentPosition;
                var rulesList = ["all"];
                if (commentTextParts.length > 2) {
                    rulesList = commentTextParts[2].split(/\s+/);
                }
                rulesList.forEach(function (ruleToAdd) {
                    if (!(ruleToAdd in _this.enableDisableRuleMap)) {
                        _this.enableDisableRuleMap[ruleToAdd] = [];
                    }
                    _this.enableDisableRuleMap[ruleToAdd].push({
                        isEnabled: isEnabled,
                        position: position
                    });
                });
            }
        }
    };
    return EnableDisableRulesWalker;
})(Lint.SkippableTokenAwareRuleWalker);
exports.EnableDisableRulesWalker = EnableDisableRulesWalker;
