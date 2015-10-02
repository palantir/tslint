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
        return this.applyWithWalker(new SemicolonWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "missing semicolon";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var SemicolonWalker = (function (_super) {
    __extends(SemicolonWalker, _super);
    function SemicolonWalker() {
        _super.apply(this, arguments);
    }
    SemicolonWalker.prototype.visitVariableStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitVariableStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitExpressionStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitExpressionStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitReturnStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitReturnStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitBreakStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitBreakStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitContinueStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitContinueStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitThrowStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitThrowStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitImportDeclaration = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    SemicolonWalker.prototype.visitImportEqualsDeclaration = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    SemicolonWalker.prototype.visitDoStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitDoStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitDebuggerStatement = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitDebuggerStatement.call(this, node);
    };
    SemicolonWalker.prototype.visitPropertyDeclaration = function (node) {
        this.checkSemicolonAt(node);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    SemicolonWalker.prototype.visitInterfaceDeclaration = function (node) {
        for (var _i = 0, _a = node.members; _i < _a.length; _i++) {
            var member = _a[_i];
            this.checkSemicolonAt(member);
        }
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    SemicolonWalker.prototype.checkSemicolonAt = function (node) {
        var children = node.getChildren(this.getSourceFile());
        for (var _i = 0; _i < children.length; _i++) {
            var child = children[_i];
            if (child.kind === 23 /* SemicolonToken */) {
                return;
            }
        }
        // no semicolon token was found, so add a failure at the given position
        var sourceFile = this.getSourceFile();
        var position = node.getStart(sourceFile) + node.getWidth(sourceFile);
        this.addFailure(this.createFailure(Math.min(position, this.getLimit()), 0, Rule.FAILURE_STRING));
    };
    return SemicolonWalker;
})(Lint.RuleWalker);
