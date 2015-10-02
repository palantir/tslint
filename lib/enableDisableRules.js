var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
* Copyright 2014 Palantir Technologies, Inc.
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
        var scan = ts.createScanner(1 /* ES5 */, false, 0 /* Standard */, node.text);
        Lint.scanAllTokens(scan, function (scanner) {
            var startPos = scanner.getStartPos();
            if (_this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(_this.tokensToSkipStartEndMap[startPos]);
                return;
            }
            if (scanner.getToken() === 3 /* MultiLineCommentTrivia */) {
                var commentText = scanner.getTokenText();
                var startPosition = scanner.getTokenPos();
                _this.handlePossibleTslintSwitch(commentText, startPosition);
            }
        });
    };
    EnableDisableRulesWalker.prototype.handlePossibleTslintSwitch = function (commentText, startingPosition) {
        var _this = this;
        var currentPosition = startingPosition;
        // regex is: start of string followed by "/*" followed by any amount of whitespace followed by "tslint:"
        if (commentText.match(/^\/\*\s*tslint:/)) {
            var commentTextParts = commentText.split(":");
            // regex is: start of string followed by either "enable" or "disable"
            // followed by either whitespace or end of string
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
