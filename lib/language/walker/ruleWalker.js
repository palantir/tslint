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
var Lint = require("../../lint");
var syntaxWalker_1 = require("./syntaxWalker");
var RuleWalker = (function (_super) {
    __extends(RuleWalker, _super);
    function RuleWalker(sourceFile, options) {
        _super.call(this);
        this.position = 0;
        this.failures = [];
        this.options = options.ruleArguments;
        this.sourceFile = sourceFile;
        this.limit = this.sourceFile.getFullWidth();
        this.disabledIntervals = options.disabledIntervals;
        this.ruleName = options.ruleName;
    }
    RuleWalker.prototype.getSourceFile = function () {
        return this.sourceFile;
    };
    RuleWalker.prototype.getFailures = function () {
        return this.failures;
    };
    RuleWalker.prototype.getLimit = function () {
        return this.limit;
    };
    RuleWalker.prototype.getOptions = function () {
        return this.options;
    };
    RuleWalker.prototype.hasOption = function (option) {
        if (this.options) {
            return this.options.indexOf(option) !== -1;
        }
        else {
            return false;
        }
    };
    RuleWalker.prototype.skip = function (node) {
        this.position += node.getFullWidth();
    };
    RuleWalker.prototype.createFailure = function (start, width, failure) {
        var from = (start > this.limit) ? this.limit : start;
        var to = ((start + width) > this.limit) ? this.limit : (start + width);
        return new Lint.RuleFailure(this.sourceFile, from, to, failure, this.ruleName);
    };
    RuleWalker.prototype.addFailure = function (failure) {
        // don't add failures for a rule if the failure intersects an interval where that rule is disabled
        if (!this.existsFailure(failure) && !Lint.doesIntersect(failure, this.disabledIntervals)) {
            this.failures.push(failure);
        }
    };
    RuleWalker.prototype.existsFailure = function (failure) {
        return this.failures.some(function (f) { return f.equals(failure); });
    };
    return RuleWalker;
})(syntaxWalker_1.SyntaxWalker);
exports.RuleWalker = RuleWalker;
