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
var OPTION_ALLOW_NULL_CHECK = "allow-null-check";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var comparisonWalker = new ComparisonWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(comparisonWalker);
    };
    Rule.EQ_FAILURE_STRING = "== should be ===";
    Rule.NEQ_FAILURE_STRING = "!= should be !==";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var ComparisonWalker = (function (_super) {
    __extends(ComparisonWalker, _super);
    function ComparisonWalker() {
        _super.apply(this, arguments);
    }
    ComparisonWalker.prototype.visitBinaryExpression = function (node) {
        if (!this.isExpressionAllowed(node)) {
            var position = node.getChildAt(1).getStart();
            this.handleOperatorToken(position, node.operatorToken.kind);
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    ComparisonWalker.prototype.handleOperatorToken = function (position, operator) {
        switch (operator) {
            case 30 /* EqualsEqualsToken */:
                this.addFailure(this.createFailure(position, ComparisonWalker.COMPARISON_OPERATOR_WIDTH, Rule.EQ_FAILURE_STRING));
                break;
            case 31 /* ExclamationEqualsToken */:
                this.addFailure(this.createFailure(position, ComparisonWalker.COMPARISON_OPERATOR_WIDTH, Rule.NEQ_FAILURE_STRING));
                break;
        }
    };
    ComparisonWalker.prototype.isExpressionAllowed = function (node) {
        var nullKeyword = 91 /* NullKeyword */;
        return this.hasOption(OPTION_ALLOW_NULL_CHECK)
            && (node.left.kind === nullKeyword || node.right.kind === nullKeyword);
    };
    ComparisonWalker.COMPARISON_OPERATOR_WIDTH = 2;
    return ComparisonWalker;
})(Lint.RuleWalker);
