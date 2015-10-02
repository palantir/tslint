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
        var useStrictWalker = new UseStrictWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(useStrictWalker);
    };
    Rule.FAILURE_STRING = "missing 'use strict'";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var UseStrictWalker = (function (_super) {
    __extends(UseStrictWalker, _super);
    function UseStrictWalker() {
        _super.apply(this, arguments);
    }
    UseStrictWalker.prototype.createScope = function () {
        return {};
    };
    UseStrictWalker.prototype.visitModuleDeclaration = function (node) {
        // current depth is 2: global scope and the scope created by this module
        if (this.getCurrentDepth() === 2
            && !Lint.hasModifier(node.modifiers, 120 /* DeclareKeyword */)
            && this.hasOption(UseStrictWalker.OPTION_CHECK_MODULE)
            && node.body != null
            && node.body.kind === 217 /* ModuleBlock */) {
            this.handleBlock(node, node.body);
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    UseStrictWalker.prototype.visitFunctionDeclaration = function (node) {
        // current depth is 2: global scope and the scope created by this function
        if (this.getCurrentDepth() === 2 &&
            this.hasOption(UseStrictWalker.OPTION_CHECK_FUNCTION) &&
            node.body != null) {
            this.handleBlock(node, node.body);
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    UseStrictWalker.prototype.handleBlock = function (node, block) {
        var isFailure = true;
        if (block.statements != null && block.statements.length > 0) {
            var firstStatement = block.statements[0];
            if (firstStatement.kind === 193 /* ExpressionStatement */) {
                var firstChild = firstStatement.getChildAt(0);
                if (firstChild.kind === 9 /* StringLiteral */
                    && firstChild.text === UseStrictWalker.USE_STRICT_STRING) {
                    isFailure = false;
                }
            }
        }
        if (isFailure) {
            this.addFailure(this.createFailure(node.getStart(), node.getFirstToken().getWidth(), Rule.FAILURE_STRING));
        }
    };
    UseStrictWalker.OPTION_CHECK_FUNCTION = "check-function";
    UseStrictWalker.OPTION_CHECK_MODULE = "check-module";
    UseStrictWalker.USE_STRICT_STRING = "use strict";
    return UseStrictWalker;
})(Lint.ScopeAwareRuleWalker);
