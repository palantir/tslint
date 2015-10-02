var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 * Copyright 2015 Palantir Technologies, Inc.
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
        var walker = new NoConditionalAssignmentWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    Rule.FAILURE_STRING = "assignment in conditional: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoConditionalAssignmentWalker = (function (_super) {
    __extends(NoConditionalAssignmentWalker, _super);
    function NoConditionalAssignmentWalker() {
        _super.apply(this, arguments);
        this.isInConditional = false;
    }
    NoConditionalAssignmentWalker.prototype.visitIfStatement = function (node) {
        this.validateConditionalExpression(node.expression);
        _super.prototype.visitIfStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitWhileStatement = function (node) {
        this.validateConditionalExpression(node.expression);
        _super.prototype.visitWhileStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitDoStatement = function (node) {
        this.validateConditionalExpression(node.expression);
        _super.prototype.visitWhileStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitForStatement = function (node) {
        if (node.condition != null) {
            this.validateConditionalExpression(node.condition);
        }
        _super.prototype.visitForStatement.call(this, node);
    };
    NoConditionalAssignmentWalker.prototype.visitBinaryExpression = function (expression) {
        if (this.isInConditional) {
            this.checkForAssignment(expression);
        }
        _super.prototype.visitBinaryExpression.call(this, expression);
    };
    NoConditionalAssignmentWalker.prototype.validateConditionalExpression = function (expression) {
        this.isInConditional = true;
        if (expression.kind === 179 /* BinaryExpression */) {
            // check for simple assignment in a conditional, like `if (a = 1) {`
            this.checkForAssignment(expression);
        }
        // walk the children of the conditional expression for nested assignments, like `if ((a = 1) && (b == 1)) {`
        this.walkChildren(expression);
        this.isInConditional = false;
    };
    NoConditionalAssignmentWalker.prototype.checkForAssignment = function (expression) {
        if (this.isAssignmentToken(expression.operatorToken)) {
            this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING));
        }
    };
    NoConditionalAssignmentWalker.prototype.isAssignmentToken = function (token) {
        return token.kind >= 55 /* FirstAssignment */ && token.kind <= 66 /* LastAssignment */;
    };
    return NoConditionalAssignmentWalker;
})(Lint.RuleWalker);
