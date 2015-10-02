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
var OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";
var OPTION_TRAILING_UNDERSCORE = "allow-trailing-underscore";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var variableNameWalker = new VariableNameWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(variableNameWalker);
    };
    Rule.FAILURE_STRING = "variable name must be in camelcase or uppercase";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var VariableNameWalker = (function (_super) {
    __extends(VariableNameWalker, _super);
    function VariableNameWalker() {
        _super.apply(this, arguments);
    }
    VariableNameWalker.prototype.visitBindingElement = function (node) {
        if (node.name.kind === 67 /* Identifier */) {
            this.handleVariableName(node.name);
        }
        _super.prototype.visitBindingElement.call(this, node);
    };
    VariableNameWalker.prototype.visitParameterDeclaration = function (node) {
        if (node.name.kind === 67 /* Identifier */) {
            this.handleVariableName(node.name);
        }
        _super.prototype.visitParameterDeclaration.call(this, node);
    };
    VariableNameWalker.prototype.visitPropertyDeclaration = function (node) {
        if (node.name != null && node.name.kind === 67 /* Identifier */) {
            this.handleVariableName(node.name);
        }
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    VariableNameWalker.prototype.visitVariableDeclaration = function (node) {
        if (node.name.kind === 67 /* Identifier */) {
            this.handleVariableName(node.name);
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    VariableNameWalker.prototype.visitVariableStatement = function (node) {
        // skip 'declare' keywords
        if (!Lint.hasModifier(node.modifiers, 120 /* DeclareKeyword */)) {
            _super.prototype.visitVariableStatement.call(this, node);
        }
    };
    VariableNameWalker.prototype.handleVariableName = function (name) {
        var variableName = name.text;
        if (!this.isCamelCase(variableName) && !this.isUpperCase(variableName)) {
            this.addFailure(this.createFailure(name.getStart(), name.getWidth(), Rule.FAILURE_STRING));
        }
    };
    VariableNameWalker.prototype.isCamelCase = function (name) {
        var firstCharacter = name.charAt(0);
        var lastCharacter = name.charAt(name.length - 1);
        var middle = name.substr(1, name.length - 2);
        if (name.length <= 0) {
            return true;
        }
        if (!this.hasOption(OPTION_LEADING_UNDERSCORE) && firstCharacter === "_") {
            return false;
        }
        if (!this.hasOption(OPTION_TRAILING_UNDERSCORE) && lastCharacter === "_") {
            return false;
        }
        return firstCharacter === firstCharacter.toLowerCase() && middle.indexOf("_") === -1;
    };
    VariableNameWalker.prototype.isUpperCase = function (name) {
        return name === name.toUpperCase();
    };
    return VariableNameWalker;
})(Lint.RuleWalker);
