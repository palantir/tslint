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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoConstructorVariableDeclarationsWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING_PART = " cannot be declared in the constructor";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoConstructorVariableDeclarationsWalker = (function (_super) {
    __extends(NoConstructorVariableDeclarationsWalker, _super);
    function NoConstructorVariableDeclarationsWalker() {
        _super.apply(this, arguments);
    }
    NoConstructorVariableDeclarationsWalker.prototype.visitConstructorDeclaration = function (node) {
        var parameters = node.parameters;
        for (var _i = 0; _i < parameters.length; _i++) {
            var parameter = parameters[_i];
            if (parameter.modifiers != null && parameter.modifiers.length > 0) {
                var name_1 = parameter.name;
                var errorMessage = "'" + name_1.text + "'" + Rule.FAILURE_STRING_PART;
                var lastModifier = parameter.modifiers[parameter.modifiers.length - 1];
                var position = lastModifier.getEnd() - parameter.getStart();
                this.addFailure(this.createFailure(parameter.getStart(), position, errorMessage));
            }
        }
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    return NoConstructorVariableDeclarationsWalker;
})(Lint.RuleWalker);
exports.NoConstructorVariableDeclarationsWalker = NoConstructorVariableDeclarationsWalker;
