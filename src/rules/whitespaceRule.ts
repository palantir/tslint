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

/// <reference path='../../lib/tslint.d.ts' />

var OPTION_BRANCH = "check-branch";
var OPTION_DECL = "check-decl";
var OPTION_OPERATOR = "check-operator";
var OPTION_SEPARATOR = "check-separator";
var OPTION_TYPE = "check-type";
var OPTION_TYPECAST = "check-typecast";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing whitespace";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new WhitespaceWalker(syntaxTree, this.getOptions()));
    }
}

class WhitespaceWalker extends Lint.RuleWalker {
    private lastPosition: number;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);
        this.lastPosition = TypeScript.fullWidth(this.getSyntaxTree().sourceUnit());
    }

    // check for trailing space after the given tokens
    public visitToken(token: TypeScript.ISyntaxToken): void {
        super.visitToken(token);

        var kind = token.kind();
        if ((this.hasOption(OPTION_BRANCH) && this.isBranchKind(kind)) ||
            (this.hasOption(OPTION_SEPARATOR) && this.isSeparatorKind(kind)) ||
            (this.hasOption(OPTION_DECL) && kind === TypeScript.SyntaxKind.EqualsToken) ||
            (this.hasOption(OPTION_TYPE) && kind === TypeScript.SyntaxKind.ColonToken)) {

            this.checkForLeadingSpace(this.getPosition(), token.trailingTrivia());
        }
    }

    // check for spaces between the operator symbol (except in the case of comma statements)
    public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void {
        var operator = node.operatorToken;
        if (this.hasOption(OPTION_OPERATOR) && operator.kind() !== TypeScript.SyntaxKind.CommaToken) {
            var position = this.positionAfter(node.left);
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.left));

            position += operator.fullWidth();
            this.checkForLeadingSpace(position, operator.trailingTrivia());
        }

        super.visitBinaryExpression(node);
    }

    // check for spaces between the => symbol
    public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): void {
        var position = this.positionAfter(node.parameter);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.parameter, position);

        super.visitSimpleArrowFunctionExpression(node);
    }

    public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): void {
        var position = this.positionAfter(node.callSignature);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.callSignature, position);

        super.visitParenthesizedArrowFunctionExpression(node);
    }

    public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): void {
        var position = this.positionAfter(node.newKeyword, node.typeParameterList, node.parameterList);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.parameterList, position);

        super.visitConstructorType(node);
    }

    public visitFunctionType(node: TypeScript.FunctionTypeSyntax): void {
        var position = this.positionAfter(node.typeParameterList, node.parameterList);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.parameterList, position);

        super.visitFunctionType(node);
    }

    private checkEqualsGreaterThan(equalsGreaterThanToken: TypeScript.ISyntaxToken,
        previousNode: TypeScript.ISyntaxNodeOrToken, position: number) {

        if (this.hasOption(OPTION_OPERATOR)) {
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(previousNode));

            position += equalsGreaterThanToken.fullWidth();
            this.checkForLeadingSpace(position, equalsGreaterThanToken.trailingTrivia());
        }
    }

    // check for spaces between ternary operator symbols
    public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): void {
        if (this.hasOption(OPTION_OPERATOR)) {
            var position = this.positionAfter(node.condition);
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.condition));

            position += node.questionToken.fullWidth();
            this.checkForLeadingSpace(position, node.questionToken.trailingTrivia());

            position += TypeScript.fullWidth(node.whenTrue);
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.whenTrue));
        }

        super.visitConditionalExpression(node);
    }

    // check for spaces in variable declarations
    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        var position = this.positionAfter(node.propertyName, node.typeAnnotation);

        if (this.hasOption(OPTION_DECL) && node.equalsValueClause !== null) {
            if (node.typeAnnotation !== null) {
                this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.typeAnnotation));
            } else {
                this.checkForLeadingSpace(position, node.propertyName.trailingTrivia());
            }
        }

        super.visitVariableDeclarator(node);
    }

    // check for spaces within imports
    public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void {
        if (this.hasOption(OPTION_DECL)) {
            var position = this.positionAfter(node.importKeyword, node.identifier);
            this.checkForLeadingSpace(position, node.identifier.trailingTrivia());
        }

        super.visitImportDeclaration(node);
    }

    // check for spaces within exports
    public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): void {
        if (this.hasOption(OPTION_DECL)) {
            var position = this.positionAfter(node.exportKeyword);
            this.checkForLeadingSpace(position, node.exportKeyword.trailingTrivia());
        }

        super.visitExportAssignment(node);
    }

    public visitCastExpression(node: TypeScript.CastExpressionSyntax): void {
        if (this.hasOption(OPTION_TYPECAST)) {
            var typeWidth = TypeScript.fullWidth(node.type);
            var position = this.getPosition() + node.lessThanToken.fullWidth() + typeWidth + node.greaterThanToken.fullWidth();
            this.checkForLeadingSpace(position, node.greaterThanToken.trailingTrivia());
        }
        super.visitCastExpression(node);
    }

    private isBranchKind(kind: TypeScript.SyntaxKind): boolean {
        return (kind === TypeScript.SyntaxKind.CatchKeyword ||
                kind === TypeScript.SyntaxKind.ForKeyword ||
                kind === TypeScript.SyntaxKind.IfKeyword ||
                kind === TypeScript.SyntaxKind.SwitchKeyword ||
                kind === TypeScript.SyntaxKind.WhileKeyword ||
                kind === TypeScript.SyntaxKind.WithKeyword);
    }

    private isSeparatorKind(kind: TypeScript.SyntaxKind): boolean {
        return (kind === TypeScript.SyntaxKind.CommaToken ||
                kind === TypeScript.SyntaxKind.SemicolonToken);
    }

    private checkForLeadingSpace(position: number, trivia: TypeScript.ISyntaxTriviaList) {
        var failure: Lint.RuleFailure = null;
        if (position === this.lastPosition) {
            // don't check for trailing whitespace if we're the last character in the file. There won't be any.
            return;
        }

        if (trivia.count() < 1) {
            failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
        } else {
            var kind = trivia.syntaxTriviaAt(0).kind();
            if (kind !== TypeScript.SyntaxKind.WhitespaceTrivia && kind !== TypeScript.SyntaxKind.NewLineTrivia) {
                failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
            }
        }

        if (failure) {
            this.addFailure(failure);
        }
    }
}
