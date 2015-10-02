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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new LabelUndefinedWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "undefined label: '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var LabelUndefinedWalker = (function (_super) {
    __extends(LabelUndefinedWalker, _super);
    function LabelUndefinedWalker() {
        _super.apply(this, arguments);
    }
    LabelUndefinedWalker.prototype.createScope = function () {
        return {};
    };
    LabelUndefinedWalker.prototype.visitLabeledStatement = function (node) {
        var label = node.label.text;
        var currentScope = this.getCurrentScope();
        currentScope[label] = true;
        _super.prototype.visitLabeledStatement.call(this, node);
    };
    LabelUndefinedWalker.prototype.visitBreakStatement = function (node) {
        this.validateLabelAt(node.label, node.getStart(), node.getChildAt(0).getWidth());
        _super.prototype.visitBreakStatement.call(this, node);
    };
    LabelUndefinedWalker.prototype.visitContinueStatement = function (node) {
        this.validateLabelAt(node.label, node.getStart(), node.getChildAt(0).getWidth());
        _super.prototype.visitContinueStatement.call(this, node);
    };
    LabelUndefinedWalker.prototype.validateLabelAt = function (label, position, width) {
        var currentScope = this.getCurrentScope();
        if (label != null && !currentScope[label.text]) {
            var failureString = Rule.FAILURE_STRING + label.text + "'";
            var failure = this.createFailure(position, width, failureString);
            this.addFailure(failure);
        }
    };
    return LabelUndefinedWalker;
})(Lint.ScopeAwareRuleWalker);
