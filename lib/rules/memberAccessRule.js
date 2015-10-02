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
        return this.applyWithWalker(new MemberAccessWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "default access modifier on member/method not allowed";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var MemberAccessWalker = (function (_super) {
    __extends(MemberAccessWalker, _super);
    function MemberAccessWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
    }
    MemberAccessWalker.prototype.visitMethodDeclaration = function (node) {
        this.validateVisibilityModifiers(node);
    };
    MemberAccessWalker.prototype.visitPropertyDeclaration = function (node) {
        this.validateVisibilityModifiers(node);
    };
    MemberAccessWalker.prototype.validateVisibilityModifiers = function (node) {
        var hasAnyVisibilityModifiers = Lint.hasModifier(node.modifiers, 110 /* PublicKeyword */, 108 /* PrivateKeyword */, 109 /* ProtectedKeyword */);
        if (!hasAnyVisibilityModifiers) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    };
    return MemberAccessWalker;
})(Lint.RuleWalker);
exports.MemberAccessWalker = MemberAccessWalker;
