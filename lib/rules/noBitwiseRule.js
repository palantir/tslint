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
        return this.applyWithWalker(new NoBitwiseWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "forbidden bitwise operation";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoBitwiseWalker = (function (_super) {
    __extends(NoBitwiseWalker, _super);
    function NoBitwiseWalker() {
        _super.apply(this, arguments);
    }
    NoBitwiseWalker.prototype.visitBinaryExpression = function (node) {
        switch (node.operatorToken.kind) {
            case 45 /* AmpersandToken */:
            case 64 /* AmpersandEqualsToken */:
            case 46 /* BarToken */:
            case 65 /* BarEqualsToken */:
            case 47 /* CaretToken */:
            case 66 /* CaretEqualsToken */:
            case 42 /* LessThanLessThanToken */:
            case 61 /* LessThanLessThanEqualsToken */:
            case 43 /* GreaterThanGreaterThanToken */:
            case 62 /* GreaterThanGreaterThanEqualsToken */:
            case 44 /* GreaterThanGreaterThanGreaterThanToken */:
            case 63 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                break;
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    NoBitwiseWalker.prototype.visitPrefixUnaryExpression = function (node) {
        if (node.operator === 49 /* TildeToken */) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitPrefixUnaryExpression.call(this, node);
    };
    return NoBitwiseWalker;
})(Lint.RuleWalker);
