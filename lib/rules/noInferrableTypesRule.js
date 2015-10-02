var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 * Copyright 2015 Palantir Technologies, Inc.
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
        return this.applyWithWalker(new InferrableTypeWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING_FACTORY = function (type) { return ("LHS type (" + type + ") inferred by RHS expression, remove type annotation"); };
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var InferrableTypeWalker = (function (_super) {
    __extends(InferrableTypeWalker, _super);
    function InferrableTypeWalker() {
        _super.apply(this, arguments);
    }
    InferrableTypeWalker.prototype.visitVariableDeclaration = function (node) {
        this.checkDeclaration(node);
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    InferrableTypeWalker.prototype.visitParameterDeclaration = function (node) {
        this.checkDeclaration(node);
        _super.prototype.visitParameterDeclaration.call(this, node);
    };
    InferrableTypeWalker.prototype.checkDeclaration = function (node) {
        if (node.type != null && node.initializer != null) {
            var failure;
            switch (node.type.kind) {
                case 118 /* BooleanKeyword */:
                    if (node.initializer.kind === 97 /* TrueKeyword */ || node.initializer.kind === 82 /* FalseKeyword */) {
                        failure = "boolean";
                    }
                    break;
                case 126 /* NumberKeyword */:
                    if (node.initializer.kind === 8 /* NumericLiteral */) {
                        failure = "number";
                    }
                    break;
                case 128 /* StringKeyword */:
                    switch (node.initializer.kind) {
                        case 9 /* StringLiteral */:
                        case 11 /* NoSubstitutionTemplateLiteral */:
                        case 181 /* TemplateExpression */:
                            failure = "string";
                            break;
                        default:
                            break;
                    }
                    break;
            }
            if (failure) {
                this.addFailure(this.createFailure(node.type.getStart(), node.type.getWidth(), Rule.FAILURE_STRING_FACTORY(failure)));
            }
        }
    };
    return InferrableTypeWalker;
})(Lint.RuleWalker);
