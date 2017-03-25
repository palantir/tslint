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

import * as Lint from "../index";

const OPTION_BRACE = "open-brace";
const OPTION_CATCH = "catch";
const OPTION_ELSE = "else";
const OPTION_FINALLY = "finally";
const OPTION_WHITESPACE = "check-whitespace";

type BraceSetting = "same-line" | "next-line";
const OPTION_SAME_LINE = "same-line";
const OPTION_NEXT_LINE = "next-line";

const optionSchema = {
    enum: ["same-line", "next-line"] as BraceSetting[],
    type: "string",
};

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "one-line",
        description: "Requires the specified tokens to be on the same line as the expression preceding them.",
        optionsDescription: Lint.Utils.dedent`
            The options should be an object with the following keys (all optional):

            * \`"${OPTION_CATCH}"\` for the \`catch\` keyword.
            * \`"${OPTION_FINALLY}"\` for the \`finally\` keyword.
            * \`"${OPTION_ELSE}"\` for the \`else\` keyword.
            * \`"${OPTION_BRACE}"\` for any open brace.

            The value for each option may be one of:

            * \`"${OPTION_SAME_LINE}"\`: The token must be on the same line as the preceding token.
            * \`"${OPTION_NEXT_LINE}"\`: The token must be on a different line than the preceding token.

            Also, you may specify \`"${OPTION_WHITESPACE}": true\` to check for a space between a token and the preceding token.
            (This is ignored in the case of \`"${OPTION_NEXT_LINE}"\`.)`,
        options: {
            type: "object",
            properties: {
                [OPTION_CATCH]: optionSchema,
                [OPTION_FINALLY]: optionSchema,
                [OPTION_ELSE]: optionSchema,
                [OPTION_BRACE]: optionSchema,
                [OPTION_WHITESPACE]: { type: "boolean" },
            },
            additionalProperties: false,
        },
        optionExamples: [JSON.stringify([true, {
            "open-brace": "same-line",
            "catch": "same-line",
            "else": "same-line",
            "finally": "same-line",
            "check-whitespace": true,
        }], undefined, 2)],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static WHITESPACE_FAILURE_STRING = "Expected a space.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

interface Options {
    catch?: BraceSetting;
    finally?: BraceSetting;
    else?: BraceSetting;
    "open-brace"?: BraceSetting;
    "check-whitespace"?: boolean;
}

function parseOptions(options: any[]): Options {
    if (options.length !== 1 || typeof options[0] !== "object") {
        throw new Error(`Expected an options object, got: ${options[0]}`);
    }

    return options[0];
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.IfStatement: {
                const { thenStatement, elseStatement } = node as ts.IfStatement;
                const thenIsBlock = thenStatement.kind === ts.SyntaxKind.Block;
                if (thenIsBlock) {
                    const expressionCloseParen = node.getChildAt(3);
                    const thenOpeningBrace = thenStatement.getChildAt(0);
                    checkBrace(expressionCloseParen, thenOpeningBrace);
                }

                if (elseStatement !== undefined) {
                    // find the else keyword
                    const elseKeyword = Lint.childOfKind(node, ts.SyntaxKind.ElseKeyword)!;
                    if (elseStatement.kind === ts.SyntaxKind.Block) {
                        const elseOpeningBrace = elseStatement.getChildAt(0);
                        checkBrace(elseKeyword, elseOpeningBrace);
                    }
                    if (thenIsBlock) {
                        check(options.else, thenStatement, elseKeyword);
                    }
                }
                break;
            }
            case ts.SyntaxKind.CatchClause: {
                const { block } = node as ts.CatchClause;
                const catchClosingParen = Lint.childOfKind(node, ts.SyntaxKind.CloseParenToken)!;
                const catchOpeningBrace = block.getChildAt(0);
                checkBrace(catchClosingParen, catchOpeningBrace);
                break;
            }
            case ts.SyntaxKind.TryStatement: {
                const { tryBlock, catchClause, finallyBlock } = node as ts.TryStatement;
                const finallyKeyword = Lint.childOfKind(node, ts.SyntaxKind.FinallyKeyword);

                // "visit" try block
                const tryKeyword = node.getChildAt(0);
                const tryOpeningBrace = tryBlock.getChildAt(0);
                checkBrace(tryKeyword, tryOpeningBrace);

                if (catchClause !== undefined) {
                    const tryClosingBrace = tryBlock.getChildAt(tryBlock.getChildCount() - 1);
                    const catchKeyword = catchClause.getChildAt(0);
                    check(options.catch, tryClosingBrace, catchKeyword);
                }

                if (finallyBlock !== undefined && finallyKeyword !== undefined) {
                    const finallyOpeningBrace = finallyBlock.getChildAt(0);
                    checkBrace(finallyKeyword, finallyOpeningBrace);

                    const previousBlock = catchClause !== undefined ? catchClause.block : tryBlock;
                    const closingBrace = previousBlock.getChildAt(previousBlock.getChildCount() - 1);
                    check(options.finally, closingBrace, finallyKeyword);
                }
                break;
            }

            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.WhileStatement: {
                const { statement } = node as ts.IterationStatement;
                // last child is the statement, second to last child is the close paren
                const closeParenToken = node.getChildAt(node.getChildCount() - 2);
                if (statement.kind === ts.SyntaxKind.Block) {
                    const openBraceToken = statement.getChildAt(0);
                    checkBrace(closeParenToken, openBraceToken);
                }
                break;
            }

            case ts.SyntaxKind.BinaryExpression:
                const { operatorToken, right } = node as ts.BinaryExpression;
                if (operatorToken.kind === ts.SyntaxKind.EqualsToken && right.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                    const equalsToken = node.getChildAt(1);
                    const openBraceToken = right.getChildAt(0);
                    checkBrace(equalsToken, openBraceToken);
                }
                break;

            case ts.SyntaxKind.VariableDeclaration:
                const { initializer } = node as ts.VariableDeclaration;
                if (initializer !== undefined && initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                    const equalsToken = Lint.childOfKind(node, ts.SyntaxKind.EqualsToken)!;
                    const openBraceToken = initializer.getChildAt(0);
                    checkBrace(equalsToken, openBraceToken);
                }
                break;

            case ts.SyntaxKind.DoStatement:
                const doKeyword = node.getChildAt(0);
                const { statement } = node as ts.DoStatement;
                if (statement.kind === ts.SyntaxKind.Block) {
                    const openBraceToken = statement.getChildAt(0);
                    checkBrace(doKeyword, openBraceToken);
                }
                break;

            case ts.SyntaxKind.ModuleDeclaration: {
                const { name, body } = node as ts.ModuleDeclaration;
                if (body !== undefined && body.kind === ts.SyntaxKind.ModuleBlock) {
                    const openBraceToken = body.getChildAt(0);
                    checkBrace(name, openBraceToken);
                }
                break;
            }

            case ts.SyntaxKind.EnumDeclaration: {
                const { name } = node as ts.EnumDeclaration;
                const openBraceToken = Lint.childOfKind(node, ts.SyntaxKind.OpenBraceToken)!;
                checkBrace(name, openBraceToken);
                break;
            }

            case ts.SyntaxKind.SwitchStatement: {
                const closeParenToken = node.getChildAt(3);
                const openBraceToken = (node as ts.SwitchStatement).caseBlock.getChildAt(0);
                checkBrace(closeParenToken, openBraceToken);
                break;
            }

            case ts.SyntaxKind.CaseClause: {
                const { statements } = node as ts.CaseClause;
                const block = statements[0];
                if (block !== undefined && block.kind === ts.SyntaxKind.Block) {
                    checkBrace(Lint.childOfKind(node, ts.SyntaxKind.ColonToken)!, Lint.childOfKind(block, ts.SyntaxKind.OpenBraceToken)!);
                }
                break;
            }

            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression: {
                const { heritageClauses, typeParameters, name } = node as ts.ClassLikeDeclaration | ts.InterfaceDeclaration;

                let lastNodeOfDeclaration: ts.Node;
                const openBraceToken = Lint.childOfKind(node, ts.SyntaxKind.OpenBraceToken)!;

                if (heritageClauses !== undefined) {
                    lastNodeOfDeclaration = heritageClauses[heritageClauses.length - 1];
                } else if (typeParameters !== undefined) {
                    lastNodeOfDeclaration = typeParameters[typeParameters.length - 1];
                } else if (name !== undefined) {
                    lastNodeOfDeclaration = name;
                } else {
                    lastNodeOfDeclaration = Lint.childOfKind(node, ts.SyntaxKind.ClassKeyword)!;
                    if (lastNodeOfDeclaration === undefined) {
                        lastNodeOfDeclaration = Lint.childOfKind(node, ts.SyntaxKind.InterfaceKeyword)!;
                    }
                }

                checkBrace(lastNodeOfDeclaration, openBraceToken);
                break;
            }

            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.Constructor: {
                const { body, type } = node as ts.FunctionLikeDeclaration;
                if (body !== undefined && body.kind === ts.SyntaxKind.Block) {
                    const openBraceToken = body.getChildAt(0);
                    const tokenBefore = type !== undefined ? type : Lint.childOfKind(node, ts.SyntaxKind.CloseParenToken)!;
                    checkBrace(tokenBefore, openBraceToken);
                }
                break;
            }

            case ts.SyntaxKind.ArrowFunction: {
                const { body } = node as ts.ArrowFunction;
                if (body !== undefined && body.kind === ts.SyntaxKind.Block) {
                    const arrowToken = Lint.childOfKind(node, ts.SyntaxKind.EqualsGreaterThanToken)!;
                    const openBraceToken = body.getChildAt(0);
                    checkBrace(arrowToken, openBraceToken);
                }
                break;
            }
        }
        return ts.forEachChild(node, cb);
    });

    function checkBrace(previousNode: ts.Node, openBraceToken: ts.Node): void {
        check(options["open-brace"], previousNode, openBraceToken);
    }

    function check(braces: BraceSetting | undefined, preceding: ts.Node, token: ts.Node): void {
        if (braces === undefined) {
            return;
        }

        const aEnd = preceding.getEnd();
        const bStart = token.getStart(sourceFile);
        const nl = sourceFile.text.slice(aEnd, bStart).includes("\n");
        if (nl !== (braces === "next-line")) {
            const expected = braces === "next-line" ? "line after" : "same line as";
            ctx.addFailureAtNode(token, `Expected '${ts.tokenToString(token.kind)}' to go on the ${expected} the preceding token.`);
        } else if (braces === "same-line" && options["check-whitespace"] && aEnd === bStart) {
            ctx.addFailureAtNode(token, Rule.WHITESPACE_FAILURE_STRING);
        }
    }
}
