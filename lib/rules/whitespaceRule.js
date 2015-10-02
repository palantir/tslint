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
var OPTION_BRANCH = "check-branch";
var OPTION_DECL = "check-decl";
var OPTION_OPERATOR = "check-operator";
var OPTION_MODULE = "check-module";
var OPTION_SEPARATOR = "check-separator";
var OPTION_TYPE = "check-type";
var OPTION_TYPECAST = "check-typecast";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new WhitespaceWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "missing whitespace";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var WhitespaceWalker = (function (_super) {
    __extends(WhitespaceWalker, _super);
    function WhitespaceWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.scanner = ts.createScanner(1 /* ES5 */, false, 0 /* Standard */, sourceFile.text);
    }
    WhitespaceWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        _super.prototype.visitSourceFile.call(this, node);
        var prevTokenShouldBeFollowedByWhitespace = false;
        this.scanner.setTextPos(0);
        Lint.scanAllTokens(this.scanner, function (scanner) {
            var startPos = scanner.getStartPos();
            var tokenKind = scanner.getToken();
            if (tokenKind === 5 /* WhitespaceTrivia */ || tokenKind === 4 /* NewLineTrivia */) {
                prevTokenShouldBeFollowedByWhitespace = false;
            }
            else if (prevTokenShouldBeFollowedByWhitespace) {
                var failure = _this.createFailure(startPos, 1, Rule.FAILURE_STRING);
                _this.addFailure(failure);
                prevTokenShouldBeFollowedByWhitespace = false;
            }
            if (_this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(_this.tokensToSkipStartEndMap[startPos]);
                return;
            }
            // check for trailing space after the given tokens
            switch (tokenKind) {
                case 70 /* CatchKeyword */:
                case 84 /* ForKeyword */:
                case 86 /* IfKeyword */:
                case 94 /* SwitchKeyword */:
                case 102 /* WhileKeyword */:
                case 103 /* WithKeyword */:
                    if (_this.hasOption(OPTION_BRANCH)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 24 /* CommaToken */:
                case 23 /* SemicolonToken */:
                    if (_this.hasOption(OPTION_SEPARATOR)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 55 /* EqualsToken */:
                    if (_this.hasOption(OPTION_DECL)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 53 /* ColonToken */:
                    if (_this.hasOption(OPTION_TYPE)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 87 /* ImportKeyword */:
                case 80 /* ExportKeyword */:
                case 131 /* FromKeyword */:
                    if (_this.hasOption(OPTION_MODULE)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
            }
        });
    };
    WhitespaceWalker.prototype.visitArrowFunction = function (node) {
        this.checkEqualsGreaterThanTokenInNode(node);
        _super.prototype.visitArrowFunction.call(this, node);
    };
    // check for spaces between the operator symbol (except in the case of comma statements)
    WhitespaceWalker.prototype.visitBinaryExpression = function (node) {
        if (this.hasOption(OPTION_OPERATOR) && node.operatorToken.kind !== 24 /* CommaToken */) {
            this.checkForTrailingWhitespace(node.left.getEnd());
            this.checkForTrailingWhitespace(node.right.getFullStart());
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    // check for spaces between ternary operator symbols
    WhitespaceWalker.prototype.visitConditionalExpression = function (node) {
        if (this.hasOption(OPTION_OPERATOR)) {
            this.checkForTrailingWhitespace(node.condition.getEnd());
            this.checkForTrailingWhitespace(node.whenTrue.getFullStart());
            this.checkForTrailingWhitespace(node.whenTrue.getEnd());
        }
        _super.prototype.visitConditionalExpression.call(this, node);
    };
    WhitespaceWalker.prototype.visitConstructorType = function (node) {
        this.checkEqualsGreaterThanTokenInNode(node);
        _super.prototype.visitConstructorType.call(this, node);
    };
    WhitespaceWalker.prototype.visitExportAssignment = function (node) {
        if (this.hasOption(OPTION_MODULE)) {
            var exportKeyword = node.getChildAt(0);
            var position = exportKeyword.getEnd();
            this.checkForTrailingWhitespace(position);
        }
        _super.prototype.visitExportAssignment.call(this, node);
    };
    WhitespaceWalker.prototype.visitFunctionType = function (node) {
        this.checkEqualsGreaterThanTokenInNode(node);
        _super.prototype.visitFunctionType.call(this, node);
    };
    WhitespaceWalker.prototype.visitImportDeclaration = function (node) {
        var importClause = node.importClause;
        if (this.hasOption(OPTION_MODULE) && importClause != null) {
            // an import clause can have _both_ named bindings and a name (the latter for the default import)
            // but the named bindings always come last, so we only need to check that for whitespace
            var position = (importClause.namedBindings == null) ? importClause.name.getEnd()
                : importClause.namedBindings.getEnd();
            this.checkForTrailingWhitespace(position);
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    WhitespaceWalker.prototype.visitImportEqualsDeclaration = function (node) {
        if (this.hasOption(OPTION_MODULE)) {
            var position = node.name.getEnd();
            this.checkForTrailingWhitespace(position);
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    WhitespaceWalker.prototype.visitJsxElement = function (node) {
        this.addTokenToSkipFromNode(node);
        _super.prototype.visitJsxElement.call(this, node);
    };
    WhitespaceWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.addTokenToSkipFromNode(node);
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    WhitespaceWalker.prototype.visitTypeAssertionExpression = function (node) {
        if (this.hasOption(OPTION_TYPECAST)) {
            var position = node.expression.getFullStart();
            this.checkForTrailingWhitespace(position);
        }
        _super.prototype.visitTypeAssertionExpression.call(this, node);
    };
    WhitespaceWalker.prototype.visitVariableDeclaration = function (node) {
        if (this.hasOption(OPTION_DECL) && node.initializer != null) {
            if (node.type != null) {
                this.checkForTrailingWhitespace(node.type.getEnd());
            }
            else {
                this.checkForTrailingWhitespace(node.name.getEnd());
            }
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    WhitespaceWalker.prototype.checkEqualsGreaterThanTokenInNode = function (node) {
        var arrowChildNumber = -1;
        node.getChildren().forEach(function (child, i) {
            if (child.kind === 34 /* EqualsGreaterThanToken */) {
                arrowChildNumber = i;
            }
        });
        // condition so we don't crash if the arrow is somehow missing
        if (arrowChildNumber !== -1) {
            var equalsGreaterThanToken = node.getChildAt(arrowChildNumber);
            if (this.hasOption(OPTION_OPERATOR)) {
                var position = equalsGreaterThanToken.getFullStart();
                this.checkForTrailingWhitespace(position);
                position = equalsGreaterThanToken.getEnd();
                this.checkForTrailingWhitespace(position);
            }
        }
    };
    WhitespaceWalker.prototype.checkForTrailingWhitespace = function (position) {
        this.scanner.setTextPos(position);
        var nextTokenType = this.scanner.scan();
        if (nextTokenType !== 5 /* WhitespaceTrivia */
            && nextTokenType !== 4 /* NewLineTrivia */
            && nextTokenType !== 1 /* EndOfFileToken */) {
            this.addFailure(this.createFailure(position, 1, Rule.FAILURE_STRING));
        }
    };
    return WhitespaceWalker;
})(Lint.SkippableTokenAwareRuleWalker);
