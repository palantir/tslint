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
        if (sourceFile.text === "") {
            return [];
        }
        var eofToken = sourceFile.endOfFileToken;
        var eofTokenFullText = eofToken.getFullText();
        if (eofTokenFullText.length === 0 || eofTokenFullText.charAt(eofTokenFullText.length - 1) !== "\n") {
            var start = eofToken.getStart();
            return [
                new Lint.RuleFailure(sourceFile, start, start, Rule.FAILURE_STRING, this.getOptions().ruleName)
            ];
        }
        return [];
    };
    Rule.FAILURE_STRING = "file should end with a newline";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
