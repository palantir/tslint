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

/// <reference path='../language/rule/rule.ts'/>
/// <reference path='../language/rule/abstractRule.ts'/>

module Lint.Rules {
    var OPTION_BRANCH = "check-branch";
    var OPTION_DECL = "check-decl";
    var OPTION_OPERATOR = "check-operator";
    var OPTION_SEPARATOR = "check-separator";
    var OPTION_TYPE = "check-type";

    export class WhitespaceRule extends AbstractRule {
        public static FAILURE_STRING = "missing whitespace";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new WhitespaceWalker(syntaxTree, this.getOptions()));
        }
    }

    class WhitespaceWalker extends Lint.RuleWalker {
        // check for trailing space after the given tokens
        public visitToken(token: TypeScript.ISyntaxToken): void {
            super.visitToken(token);

            var kind = token.kind();
            if ((this.hasOption(OPTION_BRANCH) && this.isBranchKind(kind)) ||
                (this.hasOption(OPTION_SEPARATOR) && this.isSeparatorKind(kind)) ||
                (this.hasOption(OPTION_DECL) && kind === TypeScript.SyntaxKind.EqualsToken) ||
                (this.hasOption(OPTION_TYPE) && kind === TypeScript.SyntaxKind.ColonToken)) {

                this.checkForLeadingSpace(this.position(), token.trailingTrivia());
            }
        }

        // check for spaces between the operator symbol (except in the case of comma statements)
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void {
            var operator = node.operatorToken;
            if (this.hasOption(OPTION_OPERATOR) && operator.kind() !== TypeScript.SyntaxKind.CommaToken) {
                var position = this.positionAfter(node.left);
                this.checkForLeadingSpace(position, node.left.trailingTrivia());

                position += operator.fullWidth();
                this.checkForLeadingSpace(position, operator.trailingTrivia());
            }

            super.visitBinaryExpression(node);
        }

        // check for spaces between ternary operator symbols
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): void {
            if (this.hasOption(OPTION_OPERATOR)) {
                var position = this.positionAfter(node.condition);
                this.checkForLeadingSpace(position, node.condition.trailingTrivia());

                position += node.questionToken.fullWidth();
                this.checkForLeadingSpace(position, node.questionToken.trailingTrivia());

                position += node.whenTrue.fullWidth();
                this.checkForLeadingSpace(position, node.whenTrue.trailingTrivia());
            }

            super.visitConditionalExpression(node);
        }

        // check for spaces in variable declarations
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
            var position = this.positionAfter(node.identifier, node.typeAnnotation);

            if (this.hasOption(OPTION_DECL) && node.equalsValueClause !== null) {
                if (node.typeAnnotation !== null) {
                    this.checkForLeadingSpace(position, node.typeAnnotation.trailingTrivia());
                } else {
                    this.checkForLeadingSpace(position, node.identifier.trailingTrivia());
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
            var failure = null;

            if (trivia.count() < 1) {
                failure = this.createFailure(position, 1, WhitespaceRule.FAILURE_STRING);
            } else {
                var kind = trivia.syntaxTriviaAt(0).kind();
                if (kind !== TypeScript.SyntaxKind.WhitespaceTrivia && kind !== TypeScript.SyntaxKind.NewLineTrivia) {
                    failure = this.createFailure(position, 1, WhitespaceRule.FAILURE_STRING);
                }
            }

            if (failure) {
                this.addFailure(failure);
            }
        }
    }

}
