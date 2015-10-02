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
        return this.applyWithWalker(new NoDuplicateVariableWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "duplicate variable: '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoDuplicateVariableWalker = (function (_super) {
    __extends(NoDuplicateVariableWalker, _super);
    function NoDuplicateVariableWalker() {
        _super.apply(this, arguments);
    }
    NoDuplicateVariableWalker.prototype.createScope = function () {
        return null;
    };
    NoDuplicateVariableWalker.prototype.createBlockScope = function () {
        return new ScopeInfo();
    };
    NoDuplicateVariableWalker.prototype.visitBindingElement = function (node) {
        var isSingleVariable = node.name.kind === 67 /* Identifier */;
        var isBlockScoped = Lint.isBlockScopedBindingElement(node);
        // duplicate-variable errors for block-scoped vars are caught by tsc
        if (isSingleVariable && !isBlockScoped) {
            this.handleSingleVariableIdentifier(node.name);
        }
        _super.prototype.visitBindingElement.call(this, node);
    };
    NoDuplicateVariableWalker.prototype.visitCatchClause = function (node) {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration has its own special scoping rules
        this.visitBlock(node.block);
    };
    NoDuplicateVariableWalker.prototype.visitMethodSignature = function (node) {
        // don't call super, we don't want to walk method signatures either
    };
    NoDuplicateVariableWalker.prototype.visitTypeLiteral = function (node) {
        // don't call super, we don't want to walk the inside of type nodes
    };
    NoDuplicateVariableWalker.prototype.visitVariableDeclaration = function (node) {
        var isSingleVariable = node.name.kind === 67 /* Identifier */;
        // destructuring is handled by this.visitBindingElement()
        if (isSingleVariable && !Lint.isBlockScopedVariable(node)) {
            this.handleSingleVariableIdentifier(node.name);
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    NoDuplicateVariableWalker.prototype.handleSingleVariableIdentifier = function (variableIdentifier) {
        var variableName = variableIdentifier.text;
        var currentBlockScope = this.getCurrentBlockScope();
        if (currentBlockScope.varNames.indexOf(variableName) >= 0) {
            this.addFailureOnIdentifier(variableIdentifier);
        }
        else {
            currentBlockScope.varNames.push(variableName);
        }
    };
    NoDuplicateVariableWalker.prototype.addFailureOnIdentifier = function (ident) {
        var failureString = "" + Rule.FAILURE_STRING + ident.text + "'";
        this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), failureString));
    };
    return NoDuplicateVariableWalker;
})(Lint.BlockScopeAwareRuleWalker);
var ScopeInfo = (function () {
    function ScopeInfo() {
        this.varNames = [];
    }
    return ScopeInfo;
})();
