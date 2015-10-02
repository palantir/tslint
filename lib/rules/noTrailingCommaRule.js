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
        return this.applyWithWalker(new NoTrailingCommaWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "trailing comma";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoTrailingCommaWalker = (function (_super) {
    __extends(NoTrailingCommaWalker, _super);
    function NoTrailingCommaWalker() {
        _super.apply(this, arguments);
    }
    NoTrailingCommaWalker.prototype.visitObjectLiteralExpression = function (node) {
        var child = node.getChildAt(1);
        if (child != null && child.kind === 269 /* SyntaxList */) {
            var grandChildren = child.getChildren();
            if (grandChildren.length > 0) {
                var lastGrandChild = grandChildren[grandChildren.length - 1];
                if (lastGrandChild.kind === 24 /* CommaToken */) {
                    this.addFailure(this.createFailure(lastGrandChild.getStart(), 1, Rule.FAILURE_STRING));
                }
            }
        }
        _super.prototype.visitObjectLiteralExpression.call(this, node);
    };
    return NoTrailingCommaWalker;
})(Lint.RuleWalker);
