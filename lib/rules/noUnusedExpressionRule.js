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
var Lint = require("../lint");
var ts = require("typescript");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UnusedExpressionWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "expected an assignment or function call";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var UnusedExpressionWalker = (function (_super) {
    __extends(UnusedExpressionWalker, _super);
    function UnusedExpressionWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.expressionIsUnused = true;
    }
    UnusedExpressionWalker.prototype.visitExpressionStatement = function (node) {
        this.expressionIsUnused = true;
        _super.prototype.visitExpressionStatement.call(this, node);
        if (this.expressionIsUnused) {
            // ignore valid unused expressions
            if (node.expression.kind === 9 /* StringLiteral */) {
                var expressionText = node.expression.getText();
                if (expressionText === "\"use strict\"" || expressionText === "'use strict'") {
                    return;
                }
            }
            else if (node.expression.kind === 173 /* DeleteExpression */) {
                return;
            }
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    };
    UnusedExpressionWalker.prototype.visitBinaryExpression = function (node) {
        _super.prototype.visitBinaryExpression.call(this, node);
        switch (node.operatorToken.kind) {
            case 55 /* EqualsToken */:
            case 56 /* PlusEqualsToken */:
            case 57 /* MinusEqualsToken */:
            case 58 /* AsteriskEqualsToken */:
            case 59 /* SlashEqualsToken */:
            case 60 /* PercentEqualsToken */:
            case 64 /* AmpersandEqualsToken */:
            case 66 /* CaretEqualsToken */:
            case 65 /* BarEqualsToken */:
            case 61 /* LessThanLessThanEqualsToken */:
            case 62 /* GreaterThanGreaterThanEqualsToken */:
            case 63 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    };
    UnusedExpressionWalker.prototype.visitPrefixUnaryExpression = function (node) {
        _super.prototype.visitPrefixUnaryExpression.call(this, node);
        switch (node.operator) {
            case 40 /* PlusPlusToken */:
            case 41 /* MinusMinusToken */:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    };
    UnusedExpressionWalker.prototype.visitPostfixUnaryExpression = function (node) {
        _super.prototype.visitPostfixUnaryExpression.call(this, node);
        this.expressionIsUnused = false; // the only kinds of postfix expressions are postincrement and postdecrement
    };
    UnusedExpressionWalker.prototype.visitBlock = function (node) {
        _super.prototype.visitBlock.call(this, node);
        this.expressionIsUnused = true;
    };
    UnusedExpressionWalker.prototype.visitArrowFunction = function (node) {
        _super.prototype.visitArrowFunction.call(this, node);
        this.expressionIsUnused = true;
    };
    UnusedExpressionWalker.prototype.visitCallExpression = function (node) {
        _super.prototype.visitCallExpression.call(this, node);
        this.expressionIsUnused = false;
    };
    UnusedExpressionWalker.prototype.visitConditionalExpression = function (node) {
        this.visitNode(node.condition);
        this.expressionIsUnused = true;
        this.visitNode(node.whenTrue);
        var firstExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = true;
        this.visitNode(node.whenFalse);
        var secondExpressionIsUnused = this.expressionIsUnused;
        // if either expression is unused, then that expression's branch is a no-op unless it's
        // being assigned to something or passed to a function, so consider the entire expression unused
        this.expressionIsUnused = firstExpressionIsUnused || secondExpressionIsUnused;
    };
    return UnusedExpressionWalker;
})(Lint.RuleWalker);
