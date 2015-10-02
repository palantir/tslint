var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Lint = require("../lint");
var ts = require("typescript");
var QuoteMark;
(function (QuoteMark) {
    QuoteMark[QuoteMark["SINGLE_QUOTES"] = 0] = "SINGLE_QUOTES";
    QuoteMark[QuoteMark["DOUBLE_QUOTES"] = 1] = "DOUBLE_QUOTES";
})(QuoteMark || (QuoteMark = {}));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.isEnabled = function () {
        if (_super.prototype.isEnabled.call(this)) {
            var quoteMarkString = this.getOptions().ruleArguments[0];
            return (quoteMarkString === "single" || quoteMarkString === "double");
        }
        return false;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new QuoteWalker(sourceFile, this.getOptions()));
    };
    Rule.SINGLE_QUOTE_FAILURE = "\" should be '";
    Rule.DOUBLE_QUOTE_FAILURE = "' should be \"";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var QuoteWalker = (function (_super) {
    __extends(QuoteWalker, _super);
    function QuoteWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.quoteMark = QuoteMark.DOUBLE_QUOTES;
        var ruleArguments = this.getOptions();
        var quoteMarkString = ruleArguments[0];
        if (quoteMarkString === "single") {
            this.quoteMark = QuoteMark.SINGLE_QUOTES;
        }
        else {
            this.quoteMark = QuoteMark.DOUBLE_QUOTES;
        }
        this.avoidEscape = ruleArguments.indexOf("avoid-escape") > 0;
    }
    QuoteWalker.prototype.visitNode = function (node) {
        this.handleNode(node);
        _super.prototype.visitNode.call(this, node);
    };
    QuoteWalker.prototype.handleNode = function (node) {
        if (node.kind === 9 /* StringLiteral */) {
            var text = node.getText();
            var width = node.getWidth();
            var position = node.getStart();
            var firstCharacter = text.charAt(0);
            var lastCharacter = text.charAt(text.length - 1);
            var expectedQuoteMark = (this.quoteMark === QuoteMark.SINGLE_QUOTES) ? "'" : "\"";
            if (firstCharacter !== expectedQuoteMark || lastCharacter !== expectedQuoteMark) {
                // allow the "other" quote mark to be used, but only to avoid having to escape
                var includesOtherQuoteMark = text.slice(1, -1).indexOf(expectedQuoteMark) !== -1;
                if (!(this.avoidEscape && includesOtherQuoteMark)) {
                    var failureMessage = (this.quoteMark === QuoteMark.SINGLE_QUOTES)
                        ? Rule.SINGLE_QUOTE_FAILURE
                        : Rule.DOUBLE_QUOTE_FAILURE;
                    this.addFailure(this.createFailure(position, width, failureMessage));
                }
            }
        }
    };
    return QuoteWalker;
})(Lint.RuleWalker);
