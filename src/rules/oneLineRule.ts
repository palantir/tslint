/**
 * @license
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

import * as ts from "typescript";
import * as Lint from "../lint";

const OPTION_BRACE = "check-open-brace";
const OPTION_CATCH = "check-catch";
const OPTION_ELSE = "check-else";
const OPTION_FINALLY = "check-finally";
const OPTION_WHITESPACE = "check-whitespace";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "one-line",
        description: "Requires the specified tokens to be on the same line as the expression preceding them.",
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"check-catch"\` checks that \`catch\` is on the same line as the closing brace for \`try\`.
            * \`"check-finally"\` checks that \`finally\` is on the same line as the closing brace for \`catch\`.
            * \`"check-else"\` checks that \`else\` is on the same line as the closing brace for \`if\`.
            * \`"check-open-brace"\` checks that an open brace falls on the same line as its preceding expression.
            * \`"check-whitespace"\` checks preceding whitespace for the specified tokens.`,
        options: {
            type: "list",
            listType: {
                type: "enum",
                enumValues: ["check-catch", "check-finally", "check-else", "check-open-brace", "check-whitespace"],
            },
        },
        optionExamples: ['[true, "check-catch", "check-finally", "check-else"]'],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static BRACE_FAILURE_STRING = "misplaced opening brace";
    public static CATCH_FAILURE_STRING = "misplaced 'catch'";
    public static ELSE_FAILURE_STRING = "misplaced 'else'";
    public static FINALLY_FAILURE_STRING = "misplaced 'finally'";
    public static WHITESPACE_FAILURE_STRING = "missing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const oneLineWalker = new OneLineWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(oneLineWalker);
    }
}

class OneLineWalker extends Lint.RuleWalker {
    public visitIfStatement(node: ts.IfStatement) {
        const sourceFile = node.getSourceFile();
        const thenStatement = node.thenStatement;
        if (thenStatement.kind === ts.SyntaxKind.Block) {
            const expressionCloseParen = node.getChildAt(3);
            const thenOpeningBrace = thenStatement.getChildAt(0);
            this.handleOpeningBrace(expressionCloseParen, thenOpeningBrace);
        }

        const elseStatement = node.elseStatement;
        if (elseStatement != null) {
            // find the else keyword
            const elseKeyword = getFirstChildOfKind(node, ts.SyntaxKind.ElseKeyword);
            if (elseStatement.kind === ts.SyntaxKind.Block) {
                const elseOpeningBrace = elseStatement.getChildAt(0);
                this.handleOpeningBrace(elseKeyword, elseOpeningBrace);
            }
            if (this.hasOption(OPTION_ELSE)) {
                const thenStatementEndLine = sourceFile.getLineAndCharacterOfPosition(thenStatement.getEnd()).line;
                const elseKeywordLine = sourceFile.getLineAndCharacterOfPosition(elseKeyword.getStart()).line;
                if (thenStatementEndLine !== elseKeywordLine) {
                    const failure = this.createFailure(elseKeyword.getStart(), elseKeyword.getWidth(), Rule.ELSE_FAILURE_STRING);
                    this.addFailure(failure);
                }
            }
        }

        super.visitIfStatement(node);
    }

    public visitCatchClause(node: ts.CatchClause) {
        const catchClosingParen = node.getChildren().filter((n) => n.kind === ts.SyntaxKind.CloseParenToken)[0];
        const catchOpeningBrace = node.block.getChildAt(0);
        this.handleOpeningBrace(catchClosingParen, catchOpeningBrace);
        super.visitCatchClause(node);
    }

    public visitTryStatement(node: ts.TryStatement) {
        const sourceFile = node.getSourceFile();
        const catchClause = node.catchClause;
        const finallyBlock = node.finallyBlock;
        const finallyKeyword = node.getChildren().filter((n) => n.kind === ts.SyntaxKind.FinallyKeyword)[0];

        // "visit" try block
        const tryKeyword = node.getChildAt(0);
        const tryBlock = node.tryBlock;
        const tryOpeningBrace = tryBlock.getChildAt(0);
        this.handleOpeningBrace(tryKeyword, tryOpeningBrace);

        if (this.hasOption(OPTION_CATCH) && catchClause != null) {
            const tryClosingBrace = node.tryBlock.getChildAt(node.tryBlock.getChildCount() - 1);
            const catchKeyword = catchClause.getChildAt(0);
            const tryClosingBraceLine = sourceFile.getLineAndCharacterOfPosition(tryClosingBrace.getEnd()).line;
            const catchKeywordLine = sourceFile.getLineAndCharacterOfPosition(catchKeyword.getStart()).line;
            if (tryClosingBraceLine !== catchKeywordLine) {
                const failure = this.createFailure(catchKeyword.getStart(), catchKeyword.getWidth(), Rule.CATCH_FAILURE_STRING);
                this.addFailure(failure);
            }
        }

        if (finallyBlock != null && finallyKeyword != null) {
            const finallyOpeningBrace = finallyBlock.getChildAt(0);
            this.handleOpeningBrace(finallyKeyword, finallyOpeningBrace);

            if (this.hasOption(OPTION_FINALLY)) {
                const previousBlock = catchClause != null ? catchClause.block : node.tryBlock;
                const closingBrace = previousBlock.getChildAt(previousBlock.getChildCount() - 1);
                const closingBraceLine = sourceFile.getLineAndCharacterOfPosition(closingBrace.getEnd()).line;
                const finallyKeywordLine = sourceFile.getLineAndCharacterOfPosition(finallyKeyword.getStart()).line;
                if (closingBraceLine !== finallyKeywordLine) {
                    const failure = this.createFailure(finallyKeyword.getStart(), finallyKeyword.getWidth(), Rule.FINALLY_FAILURE_STRING);
                    this.addFailure(failure);
                }
            }
        }

        super.visitTryStatement(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        this.handleIterationStatement(node);
        super.visitForStatement(node);
    }

    public visitForInStatement(node: ts.ForInStatement) {
        this.handleIterationStatement(node);
        super.visitForInStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement) {
        this.handleIterationStatement(node);
        super.visitWhileStatement(node);
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        const rightkind = node.right.kind;
        const opkind = node.operatorToken.kind;

        if (opkind === ts.SyntaxKind.EqualsToken && rightkind === ts.SyntaxKind.ObjectLiteralExpression) {
            const equalsToken = node.getChildAt(1);
            const openBraceToken = node.right.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }

        super.visitBinaryExpression(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const initializer = node.initializer;
        if (initializer != null && initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const equalsToken = node.getChildren().filter((n) => n.kind === ts.SyntaxKind.EqualsToken)[0];
            const openBraceToken = initializer.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }
        super.visitVariableDeclaration(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        const doKeyword = node.getChildAt(0);
        const statement = node.statement;
        if (statement.kind === ts.SyntaxKind.Block) {
            const openBraceToken = statement.getChildAt(0);
            this.handleOpeningBrace(doKeyword, openBraceToken);
        }
        super.visitDoStatement(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        const nameNode = node.name;
        const body = node.body;
        if (body.kind === ts.SyntaxKind.ModuleBlock) {
            const openBraceToken = body.getChildAt(0);
            this.handleOpeningBrace(nameNode, openBraceToken);
        }
        super.visitModuleDeclaration(node);
    }

    public visitEnumDeclaration(node: ts.EnumDeclaration) {
        const nameNode = node.name;
        const openBraceToken = getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        this.handleOpeningBrace(nameNode, openBraceToken);
        super.visitEnumDeclaration(node);
    }

    public visitSwitchStatement(node: ts.SwitchStatement) {
        const closeParenToken = node.getChildAt(3);
        const openBraceToken = node.caseBlock.getChildAt(0);
        this.handleOpeningBrace(closeParenToken, openBraceToken);
        super.visitSwitchStatement(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.handleClassLikeDeclaration(node);
        super.visitInterfaceDeclaration(node);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.handleClassLikeDeclaration(node);
        super.visitClassDeclaration(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.handleFunctionLikeDeclaration(node);
        super.visitFunctionDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.handleFunctionLikeDeclaration(node);
        super.visitMethodDeclaration(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.handleFunctionLikeDeclaration(node);
        super.visitConstructorDeclaration(node);
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        const body = node.body;
        if (body != null && body.kind === ts.SyntaxKind.Block) {
            const arrowToken = getFirstChildOfKind(node, ts.SyntaxKind.EqualsGreaterThanToken);
            const openBraceToken = node.body.getChildAt(0);
            this.handleOpeningBrace(arrowToken, openBraceToken);
        }
        super.visitArrowFunction(node);
    }

    private handleFunctionLikeDeclaration(node: ts.FunctionLikeDeclaration) {
        const body = node.body;
        if (body != null && body.kind === ts.SyntaxKind.Block) {
            const openBraceToken = node.body.getChildAt(0);
            if (node.type != null) {
                this.handleOpeningBrace(node.type, openBraceToken);
            } else {
                const closeParenToken = getFirstChildOfKind(node, ts.SyntaxKind.CloseParenToken);
                this.handleOpeningBrace(closeParenToken, openBraceToken);
            }
        }
    }

    private handleClassLikeDeclaration(node: ts.ClassDeclaration | ts.InterfaceDeclaration) {
        let lastNodeOfDeclaration: ts.Node = node.name;
        const openBraceToken = getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);

        if (node.heritageClauses != null) {
            lastNodeOfDeclaration = node.heritageClauses[node.heritageClauses.length - 1];
        } else if (node.typeParameters != null) {
            lastNodeOfDeclaration = node.typeParameters[node.typeParameters.length - 1];
        }

        this.handleOpeningBrace(lastNodeOfDeclaration, openBraceToken);
    }

    private handleIterationStatement(node: ts.IterationStatement) {
        // last child is the statement, second to last child is the close paren
        const closeParenToken = node.getChildAt(node.getChildCount() - 2);
        const statement = node.statement;
        if (statement.kind === ts.SyntaxKind.Block) {
            const openBraceToken = statement.getChildAt(0);
            this.handleOpeningBrace(closeParenToken, openBraceToken);
        }
    }

    private handleOpeningBrace(previousNode: ts.Node, openBraceToken: ts.Node) {
        if (previousNode == null || openBraceToken == null) {
            return;
        }

        const sourceFile = previousNode.getSourceFile();
        const previousNodeLine = sourceFile.getLineAndCharacterOfPosition(previousNode.getEnd()).line;
        const openBraceLine = sourceFile.getLineAndCharacterOfPosition(openBraceToken.getStart()).line;
        let failure: Lint.RuleFailure;

        if (this.hasOption(OPTION_BRACE) && previousNodeLine !== openBraceLine) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.BRACE_FAILURE_STRING);
        } else if (this.hasOption(OPTION_WHITESPACE) && previousNode.getEnd() === openBraceToken.getStart()) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.WHITESPACE_FAILURE_STRING);
        }

        if (failure) {
            this.addFailure(failure);
        }
    }
}

function getFirstChildOfKind(node: ts.Node, kind: ts.SyntaxKind) {
    return node.getChildren().filter((child) => child.kind === kind)[0];
}
