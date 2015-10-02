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
        return this.applyWithWalker(new NoDuplicateKeyWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "duplicate key '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoDuplicateKeyWalker = (function (_super) {
    __extends(NoDuplicateKeyWalker, _super);
    function NoDuplicateKeyWalker() {
        _super.apply(this, arguments);
        this.objectKeysStack = [];
    }
    NoDuplicateKeyWalker.prototype.visitObjectLiteralExpression = function (node) {
        this.objectKeysStack.push(Object.create(null));
        _super.prototype.visitObjectLiteralExpression.call(this, node);
        this.objectKeysStack.pop();
    };
    NoDuplicateKeyWalker.prototype.visitPropertyAssignment = function (node) {
        var objectKeys = this.objectKeysStack[this.objectKeysStack.length - 1];
        var keyNode = node.name;
        if (keyNode.kind === 67 /* Identifier */) {
            var key = keyNode.text;
            if (objectKeys[key]) {
                var failureString = Rule.FAILURE_STRING + key + "'";
                this.addFailure(this.createFailure(keyNode.getStart(), keyNode.getWidth(), failureString));
            }
            else {
                objectKeys[key] = true;
            }
        }
        _super.prototype.visitPropertyAssignment.call(this, node);
    };
    return NoDuplicateKeyWalker;
})(Lint.RuleWalker);
