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
        return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "shadowed variable: '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoShadowedVariableWalker = (function (_super) {
    __extends(NoShadowedVariableWalker, _super);
    function NoShadowedVariableWalker() {
        _super.apply(this, arguments);
    }
    NoShadowedVariableWalker.prototype.createScope = function () {
        return new ScopeInfo();
    };
    NoShadowedVariableWalker.prototype.createBlockScope = function () {
        return new ScopeInfo();
    };
    NoShadowedVariableWalker.prototype.visitBindingElement = function (node) {
        var isSingleVariable = node.name.kind === 67 /* Identifier */;
        var isBlockScoped = Lint.isBlockScopedBindingElement(node);
        if (isSingleVariable) {
            this.handleSingleVariableIdentifier(node.name, isBlockScoped);
        }
        _super.prototype.visitBindingElement.call(this, node);
    };
    NoShadowedVariableWalker.prototype.visitCatchClause = function (node) {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration has its own special scoping rules
        this.visitBlock(node.block);
    };
    NoShadowedVariableWalker.prototype.visitCallSignature = function (node) {
        // don't call super, we don't need to check parameter names in call signatures
    };
    NoShadowedVariableWalker.prototype.visitFunctionType = function (node) {
        // don't call super, we don't need to check names in function types
    };
    NoShadowedVariableWalker.prototype.visitMethodSignature = function (node) {
        // don't call super, we don't want to walk method signatures either
    };
    NoShadowedVariableWalker.prototype.visitParameterDeclaration = function (node) {
        // treat parameters as block-scoped variables
        var variableIdentifier = node.name;
        var variableName = variableIdentifier.text;
        var currentScope = this.getCurrentScope();
        if (this.isVarInAnyScope(variableName)) {
            this.addFailureOnIdentifier(variableIdentifier);
        }
        currentScope.varNames.push(variableName);
        _super.prototype.visitParameterDeclaration.call(this, node);
    };
    NoShadowedVariableWalker.prototype.visitTypeLiteral = function (node) {
        // don't call super, we don't want to walk the inside of type nodes
    };
    NoShadowedVariableWalker.prototype.visitVariableDeclaration = function (node) {
        var isSingleVariable = node.name.kind === 67 /* Identifier */;
        if (isSingleVariable) {
            this.handleSingleVariableIdentifier(node.name, Lint.isBlockScopedVariable(node));
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    NoShadowedVariableWalker.prototype.handleSingleVariableIdentifier = function (variableIdentifier, isBlockScoped) {
        var variableName = variableIdentifier.text;
        var currentScope = this.getCurrentScope();
        var currentBlockScope = this.getCurrentBlockScope();
        // this var is shadowing if there's already a var of the same name in any available scope AND
        // it is not in the current block (those are handled by the 'no-duplicate-variable' rule)
        if (this.isVarInAnyScope(variableName) && currentBlockScope.varNames.indexOf(variableName) < 0) {
            this.addFailureOnIdentifier(variableIdentifier);
        }
        // regular vars should always be added to the scope; block-scoped vars should be added iff
        // the current scope is same as current block scope
        if (!isBlockScoped
            || this.getCurrentBlockDepth() === 1
            || this.getCurrentBlockDepth() === this.getCurrentDepth()) {
            currentScope.varNames.push(variableName);
        }
        currentBlockScope.varNames.push(variableName);
    };
    NoShadowedVariableWalker.prototype.isVarInAnyScope = function (varName) {
        return this.getAllScopes().some(function (scopeInfo) { return scopeInfo.varNames.indexOf(varName) >= 0; });
    };
    NoShadowedVariableWalker.prototype.addFailureOnIdentifier = function (ident) {
        var failureString = Rule.FAILURE_STRING + ident.text + "'";
        this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), failureString));
    };
    return NoShadowedVariableWalker;
})(Lint.BlockScopeAwareRuleWalker);
var ScopeInfo = (function () {
    function ScopeInfo() {
        this.varNames = [];
    }
    return ScopeInfo;
})();
