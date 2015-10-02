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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoTrailingWhitespaceWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "trailing whitespace";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoTrailingWhitespaceWalker = (function (_super) {
    __extends(NoTrailingWhitespaceWalker, _super);
    function NoTrailingWhitespaceWalker() {
        _super.apply(this, arguments);
    }
    NoTrailingWhitespaceWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        _super.prototype.visitSourceFile.call(this, node);
        var lastSeenWasWhitespace = false;
        var lastSeenWhitespacePosition = 0;
        Lint.scanAllTokens(ts.createScanner(1 /* ES5 */, false, 0 /* Standard */, node.text), function (scanner) {
            var startPos = scanner.getStartPos();
            if (_this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(_this.tokensToSkipStartEndMap[startPos]);
                lastSeenWasWhitespace = false;
                return;
            }
            if (scanner.getToken() === 4 /* NewLineTrivia */) {
                if (lastSeenWasWhitespace) {
                    var width = scanner.getStartPos() - lastSeenWhitespacePosition;
                    var failure = _this.createFailure(lastSeenWhitespacePosition, width, Rule.FAILURE_STRING);
                    _this.addFailure(failure);
                }
                lastSeenWasWhitespace = false;
            }
            else if (scanner.getToken() === 5 /* WhitespaceTrivia */) {
                lastSeenWasWhitespace = true;
                lastSeenWhitespacePosition = scanner.getStartPos();
            }
            else {
                lastSeenWasWhitespace = false;
            }
        });
    };
    return NoTrailingWhitespaceWalker;
})(Lint.SkippableTokenAwareRuleWalker);
