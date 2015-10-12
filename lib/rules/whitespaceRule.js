var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        this.scanner = ts.createScanner(1, false, 0, sourceFile.text);
    }
    WhitespaceWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        _super.prototype.visitSourceFile.call(this, node);
        var prevTokenShouldBeFollowedByWhitespace = false;
        this.scanner.setTextPos(0);
        Lint.scanAllTokens(this.scanner, function (scanner) {
            var startPos = scanner.getStartPos();
            var tokenKind = scanner.getToken();
            if (tokenKind === 5 || tokenKind === 4) {
                prevTokenShouldBeFollowedByWhitespace = false;
            }
            else if (prevTokenShouldBeFollowedByWhitespace) {
                var failure = _this.createFailure(startPos, 1, Rule.FAILURE_STRING);
                _this.addFailure(failure);
                prevTokenShouldBeFollowedByWhitespace = false;
            }
            if (_this.tokensToSkipStartEndMap[startPos] != null) {
                scanner.setTextPos(_this.tokensToSkipStartEndMap[startPos]);
                return;
            }
            switch (tokenKind) {
                case 70:
                case 84:
                case 86:
                case 94:
                case 102:
                case 103:
                    if (_this.hasOption(OPTION_BRANCH)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 24:
                case 23:
                    if (_this.hasOption(OPTION_SEPARATOR)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 55:
                    if (_this.hasOption(OPTION_DECL)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 53:
                    if (_this.hasOption(OPTION_TYPE)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case 87:
                case 80:
                case 131:
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
    WhitespaceWalker.prototype.visitBinaryExpression = function (node) {
        if (this.hasOption(OPTION_OPERATOR) && node.operatorToken.kind !== 24) {
            this.checkForTrailingWhitespace(node.left.getEnd());
            this.checkForTrailingWhitespace(node.right.getFullStart());
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
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
            if (child.kind === 34) {
                arrowChildNumber = i;
            }
        });
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
        if (nextTokenType !== 5
            && nextTokenType !== 4
            && nextTokenType !== 1) {
            this.addFailure(this.createFailure(position, 1, Rule.FAILURE_STRING));
        }
    };
    return WhitespaceWalker;
})(Lint.SkippableTokenAwareRuleWalker);
