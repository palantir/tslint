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
var OPTION_BRACE = "check-open-brace";
var OPTION_CATCH = "check-catch";
var OPTION_ELSE = "check-else";
var OPTION_WHITESPACE = "check-whitespace";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var oneLineWalker = new OneLineWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(oneLineWalker);
    };
    Rule.BRACE_FAILURE_STRING = "misplaced opening brace";
    Rule.CATCH_FAILURE_STRING = "misplaced 'catch'";
    Rule.ELSE_FAILURE_STRING = "misplaced 'else'";
    Rule.WHITESPACE_FAILURE_STRING = "missing whitespace";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var OneLineWalker = (function (_super) {
    __extends(OneLineWalker, _super);
    function OneLineWalker() {
        _super.apply(this, arguments);
    }
    OneLineWalker.prototype.visitIfStatement = function (node) {
        var sourceFile = node.getSourceFile();
        var thenStatement = node.thenStatement;
        if (thenStatement.kind === 190 /* Block */) {
            var expressionCloseParen = node.getChildAt(3);
            var thenOpeningBrace = thenStatement.getChildAt(0);
            this.handleOpeningBrace(expressionCloseParen, thenOpeningBrace);
        }
        var elseStatement = node.elseStatement;
        if (elseStatement != null) {
            // find the else keyword
            var elseKeyword = getFirstChildOfKind(node, 78 /* ElseKeyword */);
            if (elseStatement.kind === 190 /* Block */) {
                var elseOpeningBrace = elseStatement.getChildAt(0);
                this.handleOpeningBrace(elseKeyword, elseOpeningBrace);
            }
            if (this.hasOption(OPTION_ELSE)) {
                var thenStatementEndLine = sourceFile.getLineAndCharacterOfPosition(thenStatement.getEnd()).line;
                var elseKeywordLine = sourceFile.getLineAndCharacterOfPosition(elseKeyword.getStart()).line;
                if (thenStatementEndLine !== elseKeywordLine) {
                    var failure = this.createFailure(elseKeyword.getStart(), elseKeyword.getWidth(), Rule.ELSE_FAILURE_STRING);
                    this.addFailure(failure);
                }
            }
        }
        _super.prototype.visitIfStatement.call(this, node);
    };
    OneLineWalker.prototype.visitCatchClause = function (node) {
        var catchKeyword = node.getChildAt(0);
        var catchOpeningBrace = node.block.getChildAt(0);
        this.handleOpeningBrace(catchKeyword, catchOpeningBrace);
        _super.prototype.visitCatchClause.call(this, node);
    };
    OneLineWalker.prototype.visitTryStatement = function (node) {
        var sourceFile = node.getSourceFile();
        var catchClause = node.catchClause;
        // "visit" try block
        var tryKeyword = node.getChildAt(0);
        var tryBlock = node.tryBlock;
        var tryOpeningBrace = tryBlock.getChildAt(0);
        this.handleOpeningBrace(tryKeyword, tryOpeningBrace);
        if (this.hasOption(OPTION_CATCH) && catchClause != null) {
            var tryClosingBrace = node.tryBlock.getChildAt(node.tryBlock.getChildCount() - 1);
            var catchKeyword = catchClause.getChildAt(0);
            var tryClosingBraceLine = sourceFile.getLineAndCharacterOfPosition(tryClosingBrace.getEnd()).line;
            var catchKeywordLine = sourceFile.getLineAndCharacterOfPosition(catchKeyword.getStart()).line;
            if (tryClosingBraceLine !== catchKeywordLine) {
                var failure = this.createFailure(catchKeyword.getStart(), catchKeyword.getWidth(), Rule.CATCH_FAILURE_STRING);
                this.addFailure(failure);
            }
        }
        _super.prototype.visitTryStatement.call(this, node);
    };
    OneLineWalker.prototype.visitForStatement = function (node) {
        this.handleIterationStatement(node);
        _super.prototype.visitForStatement.call(this, node);
    };
    OneLineWalker.prototype.visitForInStatement = function (node) {
        this.handleIterationStatement(node);
        _super.prototype.visitForInStatement.call(this, node);
    };
    OneLineWalker.prototype.visitWhileStatement = function (node) {
        this.handleIterationStatement(node);
        _super.prototype.visitWhileStatement.call(this, node);
    };
    OneLineWalker.prototype.visitBinaryExpression = function (node) {
        var rightkind = node.right.kind;
        var opkind = node.operatorToken.kind;
        if (opkind === 55 /* EqualsToken */ && rightkind === 163 /* ObjectLiteralExpression */) {
            var equalsToken = node.getChildAt(1);
            var openBraceToken = node.right.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    OneLineWalker.prototype.visitVariableDeclaration = function (node) {
        var initializer = node.initializer;
        if (initializer != null && initializer.kind === 163 /* ObjectLiteralExpression */) {
            var equalsToken = node.getChildAt(1);
            var openBraceToken = initializer.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitDoStatement = function (node) {
        var doKeyword = node.getChildAt(0);
        var statement = node.statement;
        if (statement.kind === 190 /* Block */) {
            var openBraceToken = statement.getChildAt(0);
            this.handleOpeningBrace(doKeyword, openBraceToken);
        }
        _super.prototype.visitDoStatement.call(this, node);
    };
    OneLineWalker.prototype.visitModuleDeclaration = function (node) {
        var nameNode = node.name;
        var body = node.body;
        if (body.kind === 217 /* ModuleBlock */) {
            var openBraceToken = body.getChildAt(0);
            this.handleOpeningBrace(nameNode, openBraceToken);
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitEnumDeclaration = function (node) {
        var nameNode = node.name;
        var openBraceToken = getFirstChildOfKind(node, 15 /* OpenBraceToken */);
        this.handleOpeningBrace(nameNode, openBraceToken);
        _super.prototype.visitEnumDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitSwitchStatement = function (node) {
        var closeParenToken = node.getChildAt(3);
        var openBraceToken = node.caseBlock.getChildAt(0);
        this.handleOpeningBrace(closeParenToken, openBraceToken);
        _super.prototype.visitSwitchStatement.call(this, node);
    };
    OneLineWalker.prototype.visitInterfaceDeclaration = function (node) {
        this.handleClassLikeDeclaration(node);
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitClassDeclaration = function (node) {
        this.handleClassLikeDeclaration(node);
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitFunctionDeclaration = function (node) {
        this.handleFunctionLikeDeclaration(node);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitMethodDeclaration = function (node) {
        this.handleFunctionLikeDeclaration(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitConstructorDeclaration = function (node) {
        this.handleFunctionLikeDeclaration(node);
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitArrowFunction = function (node) {
        var body = node.body;
        if (body != null && body.kind === 190 /* Block */) {
            var arrowToken = getFirstChildOfKind(node, 34 /* EqualsGreaterThanToken */);
            var openBraceToken = node.body.getChildAt(0);
            this.handleOpeningBrace(arrowToken, openBraceToken);
        }
        _super.prototype.visitArrowFunction.call(this, node);
    };
    OneLineWalker.prototype.handleFunctionLikeDeclaration = function (node) {
        var body = node.body;
        if (body != null && body.kind === 190 /* Block */) {
            var openBraceToken = node.body.getChildAt(0);
            if (node.type != null) {
                this.handleOpeningBrace(node.type, openBraceToken);
            }
            else {
                var closeParenToken = getFirstChildOfKind(node, 18 /* CloseParenToken */);
                this.handleOpeningBrace(closeParenToken, openBraceToken);
            }
        }
    };
    OneLineWalker.prototype.handleClassLikeDeclaration = function (node) {
        var lastNodeOfDeclaration = node.name;
        var openBraceToken = getFirstChildOfKind(node, 15 /* OpenBraceToken */);
        if (node.heritageClauses != null) {
            lastNodeOfDeclaration = node.heritageClauses[node.heritageClauses.length - 1];
        }
        else if (node.typeParameters != null) {
            lastNodeOfDeclaration = node.typeParameters[node.typeParameters.length - 1];
        }
        this.handleOpeningBrace(lastNodeOfDeclaration, openBraceToken);
    };
    OneLineWalker.prototype.handleIterationStatement = function (node) {
        // last child is the statement, second to last child is the close paren
        var closeParenToken = node.getChildAt(node.getChildCount() - 2);
        var statement = node.statement;
        if (statement.kind === 190 /* Block */) {
            var openBraceToken = statement.getChildAt(0);
            this.handleOpeningBrace(closeParenToken, openBraceToken);
        }
    };
    OneLineWalker.prototype.handleOpeningBrace = function (previousNode, openBraceToken) {
        if (previousNode == null || openBraceToken == null) {
            return;
        }
        var sourceFile = previousNode.getSourceFile();
        var previousNodeLine = sourceFile.getLineAndCharacterOfPosition(previousNode.getEnd()).line;
        var openBraceLine = sourceFile.getLineAndCharacterOfPosition(openBraceToken.getStart()).line;
        var failure;
        if (this.hasOption(OPTION_BRACE) && previousNodeLine !== openBraceLine) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.BRACE_FAILURE_STRING);
        }
        else if (this.hasOption(OPTION_WHITESPACE) && previousNode.getEnd() === openBraceToken.getStart()) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.WHITESPACE_FAILURE_STRING);
        }
        if (failure) {
            this.addFailure(failure);
        }
    };
    return OneLineWalker;
})(Lint.RuleWalker);
function getFirstChildOfKind(node, kind) {
    return node.getChildren().filter(function (child) { return child.kind === kind; })[0];
}
