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
        return this.applyWithWalker(new SortedKeyWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "unsorted key '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var SortedKeyWalker = (function (_super) {
    __extends(SortedKeyWalker, _super);
    function SortedKeyWalker() {
        _super.apply(this, arguments);
        // stacks are used to maintain state while recursing through nested object literals
        this.lastSortedKeyStack = [];
        this.sortedStateStack = [];
    }
    SortedKeyWalker.prototype.visitObjectLiteralExpression = function (node) {
        // char code 0; every string should be >= to this
        this.lastSortedKeyStack.push("");
        // sorted state is always initially true
        this.sortedStateStack.push(true);
        _super.prototype.visitObjectLiteralExpression.call(this, node);
        this.lastSortedKeyStack.pop();
        this.sortedStateStack.pop();
    };
    SortedKeyWalker.prototype.visitPropertyAssignment = function (node) {
        var sortedState = this.sortedStateStack[this.sortedStateStack.length - 1];
        // skip remainder of object literal scan if a previous key was found
        // in an unsorted position. This ensures only one error is thrown at
        // a time and keeps error output clean.
        if (sortedState) {
            var lastSortedKey = this.lastSortedKeyStack[this.lastSortedKeyStack.length - 1];
            var keyNode = node.name;
            if (keyNode.kind === 67 /* Identifier */) {
                var key = keyNode.text;
                if (key < lastSortedKey) {
                    var failureString = Rule.FAILURE_STRING + key + "'";
                    this.addFailure(this.createFailure(keyNode.getStart(), keyNode.getWidth(), failureString));
                    this.sortedStateStack[this.sortedStateStack.length - 1] = false;
                }
                else {
                    this.lastSortedKeyStack[this.lastSortedKeyStack.length - 1] = key;
                }
            }
        }
        _super.prototype.visitPropertyAssignment.call(this, node);
    };
    return SortedKeyWalker;
})(Lint.RuleWalker);
