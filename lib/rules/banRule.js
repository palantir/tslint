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
        var options = this.getOptions();
        var banFunctionWalker = new BanFunctionWalker(sourceFile, options);
        var functionsToBan = options.ruleArguments;
        functionsToBan.forEach(function (functionToBan) {
            banFunctionWalker.addBannedFunction(functionToBan);
        });
        return this.applyWithWalker(banFunctionWalker);
    };
    Rule.FAILURE_STRING_PART = "function invocation disallowed: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var BanFunctionWalker = (function (_super) {
    __extends(BanFunctionWalker, _super);
    function BanFunctionWalker() {
        _super.apply(this, arguments);
        this.bannedFunctions = [];
    }
    BanFunctionWalker.prototype.addBannedFunction = function (bannedFunction) {
        this.bannedFunctions.push(bannedFunction);
    };
    BanFunctionWalker.prototype.visitCallExpression = function (node) {
        var _this = this;
        var expression = node.expression;
        if (expression.kind === 164 /* PropertyAccessExpression */ &&
            expression.getChildCount() >= 3) {
            var firstToken = expression.getFirstToken();
            var secondToken = expression.getChildAt(1);
            var thirdToken = expression.getChildAt(2);
            var firstText = firstToken.getText();
            var thirdText = thirdToken.getFullText();
            if (secondToken.kind === 21 /* DotToken */) {
                this.bannedFunctions.forEach(function (bannedFunction) {
                    if (firstText === bannedFunction[0] && thirdText === bannedFunction[1]) {
                        var failure = _this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING_PART + firstText + "." + thirdText);
                        _this.addFailure(failure);
                    }
                });
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return BanFunctionWalker;
})(Lint.RuleWalker);
exports.BanFunctionWalker = BanFunctionWalker;
