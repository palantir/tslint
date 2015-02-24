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

var OPTION_BRACE = "check-open-brace";
var OPTION_CATCH = "check-catch";
var OPTION_ELSE = "check-else";
var OPTION_WHITESPACE = "check-whitespace";

export class Rule extends Lint.Rules.AbstractRule {
    public static BRACE_FAILURE_STRING = "misplaced opening brace";
    public static CATCH_FAILURE_STRING = "misplaced 'catch'";
    public static ELSE_FAILURE_STRING = "misplaced 'else'";
    public static WHITESPACE_FAILURE_STRING = "missing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var oneLineWalker = new OneLineWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(oneLineWalker);
    }
}

class OneLineWalker extends Lint.RuleWalker {
    public visitIfStatement(node: ts.IfStatement) {
        var sourceFile = node.getSourceFile();
        var thenStatement = node.thenStatement;
        if (thenStatement.kind === ts.SyntaxKind.Block) {
            var expressionCloseParen = node.getChildAt(3);
            var thenOpeningBrace = thenStatement.getChildAt(0);
            if (!this.multilineAndAlignedBrace(node,
                                               expressionCloseParen,
                                               thenOpeningBrace)) {
                this.handleOpeningBrace(expressionCloseParen, thenOpeningBrace);
            }
        }

        var elseStatement = node.elseStatement;
        if (elseStatement != null) {
            // find the else keyword
            var elseKeyword = OneLineWalker.getFirstChildOfKind(node, ts.SyntaxKind.ElseKeyword);
            if (elseStatement.kind === ts.SyntaxKind.Block) {
                var elseOpeningBrace = elseStatement.getChildAt(0);
                this.handleOpeningBrace(elseKeyword, elseOpeningBrace);
            }
            if (this.hasOption(OPTION_ELSE)) {
                var thenStatementEndLine = sourceFile.getLineAndCharacterFromPosition(thenStatement.getEnd()).line;
                var elseKeywordLine = sourceFile.getLineAndCharacterFromPosition(elseKeyword.getStart()).line;
                if (thenStatementEndLine !== elseKeywordLine) {
                    var failure = this.createFailure(elseKeyword.getStart(), elseKeyword.getWidth(), Rule.ELSE_FAILURE_STRING);
                    this.addFailure(failure);
                }
            }
        }

        super.visitIfStatement(node);
    }

    public visitTryBlock(node: ts.Block) {
        var tryKeyword = node.getChildAt(0);
        var tryOpeningBrace = node.getChildAt(1);
        this.handleOpeningBrace(tryKeyword, tryOpeningBrace);
        super.visitTryBlock(node);
    }

    public visitCatchClause(node: ts.CatchClause) {
        var catchKeyword = node.getChildAt(0);
        var catchOpeningBrace = node.block.getChildAt(0);
        this.handleOpeningBrace(catchKeyword, catchOpeningBrace);
        super.visitCatchClause(node);
    }

    public visitTryStatement(node: ts.TryStatement) {
        var sourceFile = node.getSourceFile();
        var catchClause = node.catchClause;
        if (this.hasOption(OPTION_CATCH) && catchClause != null) {
            var tryClosingBrace = node.tryBlock.getChildAt(node.tryBlock.getChildCount() - 1);
            var catchKeyword = catchClause.getChildAt(0);
            var tryClosingBraceLine = sourceFile.getLineAndCharacterFromPosition(tryClosingBrace.getEnd()).line;
            var catchKeywordLine = sourceFile.getLineAndCharacterFromPosition(catchKeyword.getStart()).line;
            if (tryClosingBraceLine !== catchKeywordLine) {
                var failure = this.createFailure(catchKeyword.getStart(), catchKeyword.getWidth(), Rule.CATCH_FAILURE_STRING);
                this.addFailure(failure);
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
        if (node.operator === ts.SyntaxKind.EqualsToken && node.right.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            var equalsToken = node.getChildAt(1);
            var openBraceToken = node.right.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }
        super.visitBinaryExpression(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        var initializer = node.initializer;
        if (initializer != null && initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            var equalsToken = node.getChildAt(1);
            var openBraceToken = initializer.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }
        super.visitVariableDeclaration(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        var doKeyword = node.getChildAt(0);
        var statement = node.statement;
        if (statement.kind === ts.SyntaxKind.Block) {
            var openBraceToken = statement.getChildAt(0);
            this.handleOpeningBrace(doKeyword, openBraceToken);
        }
        super.visitDoStatement(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        var nameNode = node.name;
        var body = node.body;
        if (body.kind === ts.SyntaxKind.ModuleBlock) {
            var openBraceToken = body.getChildAt(0);
            this.handleOpeningBrace(nameNode, openBraceToken);
        }
        super.visitModuleDeclaration(node);
    }

    public visitEnumDeclaration(node: ts.EnumDeclaration) {
        var nameNode = node.name;
        var openBraceToken = OneLineWalker.getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        this.handleOpeningBrace(nameNode, openBraceToken);
        super.visitEnumDeclaration(node);
    }

    public visitSwitchStatement(node: ts.SwitchStatement) {
        var closeParenToken = node.getChildAt(3);
        var openBraceToken = node.getChildAt(4);
        this.handleOpeningBrace(closeParenToken, openBraceToken);
        super.visitSwitchStatement(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        var nameNode = node.name;
        var openBraceToken = OneLineWalker.getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        this.handleOpeningBrace(nameNode, openBraceToken);
        super.visitInterfaceDeclaration(node);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        var nameNode = node.name;
        var openBraceToken = OneLineWalker.getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        this.handleOpeningBrace(nameNode, openBraceToken);
        super.visitInterfaceDeclaration(node);
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
        var body = node.body;
        if (body != null && body.kind === ts.SyntaxKind.Block) {
            var arrowToken = OneLineWalker.getFirstChildOfKind(node, ts.SyntaxKind.EqualsGreaterThanToken);
            var openBraceToken = node.body.getChildAt(0);
            this.handleOpeningBrace(arrowToken, openBraceToken);
        }
        super.visitArrowFunction(node);
    }

    private handleFunctionLikeDeclaration(node: ts.FunctionLikeDeclaration) {
        var body = node.body;
        if (body != null && body.kind === ts.SyntaxKind.Block) {
            var openBraceToken = node.body.getChildAt(0);
            if (node.type != null) {
                this.handleOpeningBrace(node.type, openBraceToken);
            } else {
                var closeParenToken = OneLineWalker.getFirstChildOfKind(node, ts.SyntaxKind.CloseParenToken);
                this.handleOpeningBrace(closeParenToken, openBraceToken);
            }
        }
    }

    private handleIterationStatement(node: ts.IterationStatement) {
        // last child is the statement, second to last child is the close paren
        var closeParenToken = node.getChildAt(node.getChildCount() - 2);
        var statement = node.statement;
        if (statement.kind === ts.SyntaxKind.Block) {
            var openBraceToken = statement.getChildAt(0);
            if (!this.multilineAndAlignedBrace(node,
                                               closeParenToken,
                                               openBraceToken)) {
                this.handleOpeningBrace(closeParenToken, openBraceToken);
            }
        }
    }

    private handleOpeningBrace(previousNode: ts.Node, openBraceToken: ts.Node) {
        if (previousNode == null || openBraceToken == null) {
            return;
        }
        var failure: Lint.RuleFailure;

        if (this.hasOption(OPTION_BRACE) && !this.sameLine(previousNode, openBraceToken)) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.BRACE_FAILURE_STRING);
        } else if (this.hasOption(OPTION_WHITESPACE) && previousNode.getEnd() === openBraceToken.getStart()) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.WHITESPACE_FAILURE_STRING);
        }
        if (failure) {
            this.addFailure(failure);
        }
    }

    private static getFirstChildOfKind(node: ts.Node, kind: ts.SyntaxKind) {
        return node.getChildren().filter((child) => child.kind === kind)[0];
    }

    private sameLine(node1: ts.Node, node2: ts.Node): boolean {
        var sourceFile = node1.getSourceFile();
        var line1 = sourceFile.getLineAndCharacterFromPosition(node1.getEnd()).line;
        var line2 = sourceFile.getLineAndCharacterFromPosition(node2.getStart()).line;
        return line1 === line2;
    }

    private sameColumn(node1: ts.Node, node2: ts.Node): boolean {
        var sourceFile = node1.getSourceFile();
        var col1 = sourceFile.getLineAndCharacterFromPosition(node1.getStart()).character;
        var col2 = sourceFile.getLineAndCharacterFromPosition(node2.getStart()).character;
        return col1 === col2;
    }

    // Return true if the expression seems to span over more than 1 line and
    // the opening curly brace is vertically aligned with the statement start.
    // e.g:
    // if (aa &&
    //     bb)
    // {
    //     ...
    // }
    private multilineAndAlignedBrace(parentStmt: ts.Node,
                                     closeParen: ts.Node,
                                     openBrace: ts.Node): boolean {
        return !this.sameLine(parentStmt.getChildAt(0), closeParen) &&
               this.sameColumn(parentStmt, openBrace);
    }
}
