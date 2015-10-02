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
        var requiresWalker = new RequiresWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(requiresWalker);
    };
    Rule.FAILURE_STRING = "require statement not part of an import statement";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var RequiresWalker = (function (_super) {
    __extends(RequiresWalker, _super);
    function RequiresWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
    }
    RequiresWalker.prototype.createScope = function () {
        return {};
    };
    RequiresWalker.prototype.visitCallExpression = function (node) {
        var expression = node.expression;
        if (this.getCurrentDepth() <= 1 && expression.kind === 67 /* Identifier */) {
            var identifierName = expression.text;
            if (identifierName === "require") {
                // if we're calling (invoking) require, then it's not part of an import statement
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return RequiresWalker;
})(Lint.ScopeAwareRuleWalker);
