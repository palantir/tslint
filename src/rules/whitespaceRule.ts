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

var OPTION_BRANCH = "check-branch";
var OPTION_DECL = "check-decl";
var OPTION_OPERATOR = "check-operator";
var OPTION_SEPARATOR = "check-separator";
var OPTION_TYPE = "check-type";
var OPTION_TYPECAST = "check-typecast";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new WhitespaceWalker(sourceFile, this.getOptions()));
    }
}

class WhitespaceWalker extends Lint.RuleWalker {
    private scanner: ts.Scanner;
    private tokensToSkipStartEndMap: {[start: number]: number};

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.scanner = ts.createScanner(ts.ScriptTarget.ES5, false, sourceFile.text);
        this.tokensToSkipStartEndMap = {};
    }

    public visitSourceFile(node: ts.SourceFile): void {
        super.visitSourceFile(node);

        var lastShouldBeFollowedByWhitespace = false;
        this.scanner.setTextPos(0);
        Lint.scanAllTokens(this.scanner, (scanner: ts.Scanner) => {
            var startPos = scanner.getStartPos();
            var tokenKind = scanner.getToken();
            if (tokenKind === ts.SyntaxKind.WhitespaceTrivia || tokenKind === ts.SyntaxKind.NewLineTrivia) {
                lastShouldBeFollowedByWhitespace = false;
            } else if (lastShouldBeFollowedByWhitespace) {
                var failure = this.createFailure(startPos, 1, Rule.FAILURE_STRING);
                this.addFailure(failure);
                lastShouldBeFollowedByWhitespace = false;
            }

            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex and identifiers). So skip those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                return;
            }

            // check for trailing space after the given tokens
            switch (tokenKind) {
                case ts.SyntaxKind.CatchKeyword:
                case ts.SyntaxKind.ForKeyword:
                case ts.SyntaxKind.IfKeyword:
                case ts.SyntaxKind.SwitchKeyword:
                case ts.SyntaxKind.WhileKeyword:
                case ts.SyntaxKind.WithKeyword:
                    if (this.hasOption(OPTION_BRANCH)) {
                        lastShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case ts.SyntaxKind.CommaToken:
                case ts.SyntaxKind.SemicolonToken:
                    if (this.hasOption(OPTION_SEPARATOR)) {
                        lastShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case ts.SyntaxKind.EqualsToken:
                    if (this.hasOption(OPTION_DECL)) {
                        lastShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case ts.SyntaxKind.ColonToken:
                    if (this.hasOption(OPTION_TYPE)) {
                        lastShouldBeFollowedByWhitespace = true;
                    }
                    break;

            }
        });
    }

    public visitRegularExpressionLiteral(node: ts.Node) {
        this.tokensToSkipStartEndMap[node.getStart()] = node.getEnd();
        super.visitRegularExpressionLiteral(node);
    }

    public visitIdentifier(node: ts.Identifier) {
        this.tokensToSkipStartEndMap[node.getStart()] = node.getEnd();
        super.visitIdentifier(node);
    }

    // check for spaces between the operator symbol (except in the case of comma statements)
    public visitBinaryExpression(node: ts.BinaryExpression): void {
        var operatorKind = node.operator;
        if (this.hasOption(OPTION_OPERATOR) && operatorKind !== ts.SyntaxKind.CommaToken) {
            var position = node.left.getEnd();
            this.checkForTrailingWhitespace(position);

            position = node.right.getFullStart();
            this.checkForTrailingWhitespace(position);
        }

        super.visitBinaryExpression(node);
    }

    // check for spaces between the => symbol
    public visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        this.checkEqualsGreaterThanTokenInNode(node);
        super.visitArrowFunction(node);
    }

    public visitConstructorType(node: ts.Node): void {
        this.checkEqualsGreaterThanTokenInNode(node);
        super.visitConstructorType(node);
    }

    public visitFunctionType(node: ts.Node): void {
        this.checkEqualsGreaterThanTokenInNode(node);
        super.visitFunctionType(node);
    }

    // check for spaces between ternary operator symbols
    public visitConditionalExpression(node: ts.ConditionalExpression): void {
        if (this.hasOption(OPTION_OPERATOR)) {
            var position = node.condition.getEnd();
            this.checkForTrailingWhitespace(position);

            position = node.whenTrue.getFullStart();
            this.checkForTrailingWhitespace(position);

            position = node.whenTrue.getEnd();
            this.checkForTrailingWhitespace(position);
        }

        super.visitConditionalExpression(node);
    }

    // check for spaces in variable declarations
    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (this.hasOption(OPTION_DECL) && node.initializer != null) {
            if (node.type != null) {
                this.checkForTrailingWhitespace(node.type.getEnd());
            } else {
                this.checkForTrailingWhitespace(node.name.getEnd());
            }
        }

        super.visitVariableDeclaration(node);
    }

    // check for spaces within imports
    public visitImportDeclaration(node: ts.ImportDeclaration): void {
        if (this.hasOption(OPTION_DECL)) {
            var position = node.name.getEnd();
            this.checkForTrailingWhitespace(position);
        }

        super.visitImportDeclaration(node);
    }

    // check for spaces within exports
    public visitExportAssignment(node: ts.ExportAssignment): void {
        if (this.hasOption(OPTION_DECL)) {
            var exportKeyword = node.getChildAt(0);
            var position = exportKeyword.getEnd();
            this.checkForTrailingWhitespace(position);
        }

        super.visitExportAssignment(node);
    }

    public visitTypeAssertionExpression(node: ts.TypeAssertion): void {
        if (this.hasOption(OPTION_TYPECAST)) {
            var position = node.expression.getFullStart();
            this.checkForTrailingWhitespace(position);
        }
        super.visitTypeAssertionExpression(node);
    }

    private checkEqualsGreaterThanTokenInNode(node: ts.Node) {
        var arrowChildNumber = -1;
        node.getChildren().forEach((child, i) => {
            if (child.kind === ts.SyntaxKind.EqualsGreaterThanToken) {
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
    }

    private checkForTrailingWhitespace(position: number) {
        this.scanner.setTextPos(position);
        var nextTokenType = this.scanner.scan();
        if (nextTokenType !== ts.SyntaxKind.WhitespaceTrivia &&
            nextTokenType !== ts.SyntaxKind.NewLineTrivia &&
            nextTokenType !== ts.SyntaxKind.EndOfFileToken) {

            var failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
    }
}
