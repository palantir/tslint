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
        return this.applyWithWalker(new LabelPositionWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "unexpected label on statement";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var LabelPositionWalker = (function (_super) {
    __extends(LabelPositionWalker, _super);
    function LabelPositionWalker() {
        _super.apply(this, arguments);
    }
    LabelPositionWalker.prototype.visitLabeledStatement = function (node) {
        var statement = node.statement;
        if (statement.kind !== 195 /* DoStatement */
            && statement.kind !== 197 /* ForStatement */
            && statement.kind !== 198 /* ForInStatement */
            && statement.kind !== 196 /* WhileStatement */
            && statement.kind !== 204 /* SwitchStatement */) {
            var failure = this.createFailure(node.label.getStart(), node.label.getWidth(), Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
        _super.prototype.visitLabeledStatement.call(this, node);
    };
    return LabelPositionWalker;
})(Lint.RuleWalker);
