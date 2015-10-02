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
        return this.applyWithWalker(new ForInWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "for (... in ...) statements must be filtered with an if statement";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var ForInWalker = (function (_super) {
    __extends(ForInWalker, _super);
    function ForInWalker() {
        _super.apply(this, arguments);
    }
    ForInWalker.prototype.visitForInStatement = function (node) {
        this.handleForInStatement(node);
        _super.prototype.visitForInStatement.call(this, node);
    };
    ForInWalker.prototype.handleForInStatement = function (node) {
        var statement = node.statement;
        var statementKind = node.statement.kind;
        // a direct if statement under a for...in is valid
        if (statementKind === 194 /* IfStatement */) {
            return;
        }
        // if there is a block, verify that it has a single if statement or starts with if (..) continue;
        if (statementKind === 190 /* Block */) {
            var blockNode = statement;
            var blockStatements = blockNode.statements;
            if (blockStatements.length >= 1) {
                var firstBlockStatement = blockStatements[0];
                if (firstBlockStatement.kind === 194 /* IfStatement */) {
                    // if this "if" statement is the only statement within the block
                    if (blockStatements.length === 1) {
                        return;
                    }
                    // if this "if" statement has a single continue block
                    var ifStatement = firstBlockStatement.thenStatement;
                    if (nodeIsContinue(ifStatement)) {
                        return;
                    }
                }
            }
        }
        var failure = this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        this.addFailure(failure);
    };
    return ForInWalker;
})(Lint.RuleWalker);
function nodeIsContinue(node) {
    var kind = node.kind;
    if (kind === 200 /* ContinueStatement */) {
        return true;
    }
    if (kind === 190 /* Block */) {
        var blockStatements = node.statements;
        if (blockStatements.length === 1 && blockStatements[0].kind === 200 /* ContinueStatement */) {
            return true;
        }
    }
    return false;
}
