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

/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class IndentRule extends AbstractRule {
        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            var tabWidth = parseInt(this.getValue());
            return this.applyWithWalker(new IndentWalker(syntaxTree, tabWidth));
        }
    }

    class IndentWalker extends Lint.RuleWalker {
        static FAILURE_STRING = "unexpected tab width: ";

        private tabWidth: number;
        private currentLevel;

        constructor(syntaxTree: TypeScript.SyntaxTree, tabWidth: number) {
            super(syntaxTree);
            this.currentLevel = 0;
            this.tabWidth = tabWidth;
        }

        // block indentation
        public visitBlock(node: TypeScript.BlockSyntax): void {
            this.visitToken(node.openBraceToken);
            this.checkAndVisitList(node.statements);
            this.visitToken(node.closeBraceToken);
        }

        // class indentation
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void {
            this.currentLevel += 1;
            super.visitClassDeclaration(node);
            this.currentLevel -= 1;
        }

        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void {
            var firstElement;
            if (node.modifiers.childCount() > 0) {
                firstElement = node.modifiers.childAt(0);
            } else {
                firstElement = node.variableDeclarator;
            }

            this.checkNodeOrToken(firstElement);
            super.visitMemberVariableDeclaration(node);
        }

        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void {
            var firstElement;
            if (node.modifiers.childCount() > 0) {
                firstElement = node.modifiers.childAt(0);
            } else {
                firstElement = node.propertyName;
            }

            this.checkNodeOrToken(firstElement);
            super.visitMemberFunctionDeclaration(node);
        }

        // enum declaration
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): void {
            this.visitToken(node.openBraceToken);
            this.checkAndVisitSeparatedList(node.typeMembers);
            this.visitToken(node.closeBraceToken);
        }

        // object literal
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): void {
            this.visitToken(node.openBraceToken);
            this.checkAndVisitSeparatedList(node.propertyAssignments);
            this.visitToken(node.closeBraceToken);
        }

        // module indentation
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): void {
            this.visitList(node.modifiers);
            this.visitToken(node.moduleKeyword);
            this.visitOptionalNodeOrToken(node.moduleName);
            if (node.stringLiteral !== null) {
                this.visitToken(node.stringLiteral);
            }
            this.visitToken(node.openBraceToken);
            this.checkAndVisitList(node.moduleElements);
            this.visitToken(node.closeBraceToken);
        }

        // enum indentation
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): void {
            this.visitList(node.modifiers);
            this.visitToken(node.enumKeyword);
            this.visitToken(node.identifier);
            this.visitToken(node.openBraceToken);
            this.checkAndVisitSeparatedList(node.enumElements);
            this.visitToken(node.closeBraceToken);
        }

        // switch indentation
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): void {
            this.currentLevel += 1;
            super.visitSwitchStatement(node);
            this.currentLevel -= 1;
        }

        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): void {
            this.checkAndVisitNodeOrToken(node.caseKeyword);
            this.visitNodeOrToken(node.expression);
            this.visitToken(node.colonToken);
            this.checkAndVisitList(node.statements);
        }

        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): void {
            this.checkAndVisitNodeOrToken(node.defaultKeyword);
            this.visitToken(node.colonToken);
            this.checkAndVisitList(node.statements);
        }

        private checkAndVisitList(list: TypeScript.ISyntaxList): void {
            this.currentLevel += 1;
            for (var i = 0 ; i < list.childCount(); i++) {
                this.checkAndVisitNodeOrToken(list.childAt(i));
            }
            this.currentLevel -= 1;
        }

        private checkAndVisitSeparatedList(list: TypeScript.ISeparatedSyntaxList): void {
            this.currentLevel += 1;
            for (var i = 0, n = list.childCount(); i < n; i++) {
                var element = list.childAt(i);
                // do not check separator tokens
                if (element.kind() === TypeScript.SyntaxKind.CommaToken ||
                    element.kind() === TypeScript.SyntaxKind.SemicolonToken) {
                    this.visitNodeOrToken(element);
                } else {
                    this.checkAndVisitNodeOrToken(element);
                }
              }
            this.currentLevel -= 1;
        }

        private checkAndVisitNodeOrToken(nodeOrToken: TypeScript.ISyntaxNodeOrToken) {
            this.checkNodeOrToken(nodeOrToken);
            this.visitNodeOrToken(nodeOrToken);
        }

        private checkNodeOrToken(nodeOrToken: TypeScript.ISyntaxNodeOrToken) {
            var expectedIndentation = this.currentLevel * this.tabWidth;
            var actualIndentation = this.getImmediateIndentation(nodeOrToken);

            if (expectedIndentation !== actualIndentation) {
                var position = this.position() + nodeOrToken.leadingTriviaWidth();
                var error = IndentWalker.FAILURE_STRING +
                            "expected " + expectedIndentation + ", " +
                            "got " + actualIndentation;

                this.addFailure(this.createFailure(position, nodeOrToken.width(), error));
            }
        }

        private getImmediateIndentation(element: TypeScript.ISyntaxNodeOrToken): number {
            var indentationCount = 0;
            var triviaList = element.leadingTrivia();

            var listCount = triviaList.count();
            if (listCount > 0) {
                var trivia = triviaList.syntaxTriviaAt(listCount - 1);
                if (trivia.kind() === TypeScript.SyntaxKind.WhitespaceTrivia) {
                    indentationCount = this.getWhitespaceWidth(trivia.fullText());
                }
            }

            return indentationCount;
        }

        private getWhitespaceWidth(whitespace: string): number {
            var width = 0;
            for (var i = 0; i < whitespace.length; ++i) {
                var charCode = whitespace.charCodeAt(i);
                if (charCode === TypeScript.CharacterCodes.tab) {
                    width += 4;
                } else {
                    width += 1;
                }
            }

            return width;
        }
    }

}
