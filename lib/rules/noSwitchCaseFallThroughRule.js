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
        return this.applyWithWalker(new NoSwitchCaseFallThroughWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING_PART = "expected a 'break' before ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoSwitchCaseFallThroughWalker = (function (_super) {
    __extends(NoSwitchCaseFallThroughWalker, _super);
    function NoSwitchCaseFallThroughWalker() {
        _super.apply(this, arguments);
    }
    NoSwitchCaseFallThroughWalker.prototype.visitSwitchStatement = function (node) {
        var _this = this;
        var isFallingThrough = false;
        // get the position for the first case statement
        var switchClauses = node.caseBlock.clauses;
        switchClauses.forEach(function (child, i) {
            var kind = child.kind;
            if (kind === 239 /* CaseClause */) {
                var switchClause = child;
                isFallingThrough = _this.fallsThrough(switchClause.statements);
                // no break statements and no statements means the fallthrough is expected.
                // last item doesn't need a break
                if (isFallingThrough && switchClause.statements.length > 0 && ((switchClauses.length - 1) > i)) {
                    if (!_this.fallThroughAllowed(switchClauses[i + 1])) {
                        _this.addFailure(_this.createFailure(child.getEnd(), 1, Rule.FAILURE_STRING_PART + "'case'"));
                    }
                }
            }
            else {
                // case statement falling through a default
                if (isFallingThrough && !_this.fallThroughAllowed(child)) {
                    var failureString = Rule.FAILURE_STRING_PART + "'default'";
                    _this.addFailure(_this.createFailure(switchClauses[i - 1].getEnd(), 1, failureString));
                }
            }
        });
        _super.prototype.visitSwitchStatement.call(this, node);
    };
    NoSwitchCaseFallThroughWalker.prototype.fallThroughAllowed = function (nextCaseOrDefaultStatement) {
        var sourceFileText = nextCaseOrDefaultStatement.getSourceFile().text;
        var firstChild = nextCaseOrDefaultStatement.getChildAt(0);
        var commentRanges = ts.getLeadingCommentRanges(sourceFileText, firstChild.getFullStart());
        if (commentRanges != null) {
            for (var _i = 0; _i < commentRanges.length; _i++) {
                var commentRange = commentRanges[_i];
                var commentText = sourceFileText.substring(commentRange.pos, commentRange.end);
                if (commentText === "/* falls through */") {
                    return true;
                }
            }
        }
        return false;
    };
    NoSwitchCaseFallThroughWalker.prototype.fallsThrough = function (statements) {
        return !statements.some(function (statement) {
            return statement.kind === 201 /* BreakStatement */
                || statement.kind === 206 /* ThrowStatement */
                || statement.kind === 202 /* ReturnStatement */
                || statement.kind === 200 /* ContinueStatement */;
        });
    };
    return NoSwitchCaseFallThroughWalker;
})(Lint.RuleWalker);
exports.NoSwitchCaseFallThroughWalker = NoSwitchCaseFallThroughWalker;
