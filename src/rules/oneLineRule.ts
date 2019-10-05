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

import { getChildOfKind, isBlockLike, isObjectLiteralExpression, isSameLine } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_BRACE = "check-open-brace";
const OPTION_CATCH = "check-catch";
const OPTION_ELSE = "check-else";
const OPTION_FINALLY = "check-finally";
const OPTION_WHITESPACE = "check-whitespace";

interface Options {
    brace: boolean;
    catch: boolean;
    else: boolean;
    finally: boolean;
    whitespace: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "one-line",
        description:
            "Requires the specified tokens to be on the same line as the expression preceding them.",
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"${OPTION_CATCH}"\` checks that \`catch\` is on the same line as the closing brace for \`try\`.
            * \`"${OPTION_FINALLY}"\` checks that \`finally\` is on the same line as the closing brace for \`catch\`.
            * \`"${OPTION_ELSE}"\` checks that \`else\` is on the same line as the closing brace for \`if\`.
            * \`"${OPTION_BRACE}"\` checks that an open brace falls on the same line as its preceding expression.
            * \`"${OPTION_WHITESPACE}"\` checks preceding whitespace for the specified tokens.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_CATCH, OPTION_FINALLY, OPTION_ELSE, OPTION_BRACE, OPTION_WHITESPACE],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [[true, OPTION_CATCH, OPTION_FINALLY, OPTION_ELSE]],
        type: "style",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static WHITESPACE_FAILURE_STRING = "missing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new OneLineWalker(sourceFile, this.ruleName, {
                brace: this.ruleArguments.indexOf(OPTION_BRACE) !== -1,
                catch: this.ruleArguments.indexOf(OPTION_CATCH) !== -1,
                else: this.ruleArguments.indexOf(OPTION_ELSE) !== -1,
                finally: this.ruleArguments.indexOf(OPTION_FINALLY) !== -1,
                whitespace: this.ruleArguments.indexOf(OPTION_WHITESPACE) !== -1,
            }),
        );
    }
}

class OneLineWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.Block:
                    if (
                        !isBlockLike(node.parent) ||
                        (node.parent.kind === ts.SyntaxKind.CaseClause &&
                            (node.parent as ts.CaseClause).statements.length === 1)
                    ) {
                        this.check({ pos: node.pos, end: (node as ts.Block).statements.pos });
                    }
                    break;
                case ts.SyntaxKind.CaseBlock:
                    this.check({ pos: node.pos, end: (node as ts.CaseBlock).clauses.pos });
                    break;
                case ts.SyntaxKind.ModuleBlock:
                    this.check({ pos: node.pos, end: (node as ts.ModuleBlock).statements.pos });
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    this.check({
                        end: (node as ts.EnumDeclaration).members.pos,
                        pos: (node as ts.EnumDeclaration).name.end,
                    });
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.ClassExpression: {
                    const openBrace = getChildOfKind(
                        node,
                        ts.SyntaxKind.OpenBraceToken,
                        sourceFile,
                    );
                    if (openBrace !== undefined) {
                        this.check(openBrace);
                    }
                    break;
                }
                case ts.SyntaxKind.IfStatement: {
                    const { thenStatement, elseStatement } = node as ts.IfStatement;
                    if (elseStatement !== undefined && thenStatement.kind === ts.SyntaxKind.Block) {
                        this.check({ pos: thenStatement.end, end: elseStatement.pos }, "else");
                    }
                    break;
                }
                case ts.SyntaxKind.TryStatement: {
                    const { finallyBlock, catchClause, tryBlock } = node as ts.TryStatement;
                    if (catchClause !== undefined) {
                        this.check(catchClause.getChildAt(0, sourceFile), "catch");
                        if (finallyBlock !== undefined) {
                            this.check({ pos: catchClause.end, end: finallyBlock.pos }, "finally");
                        }
                    } else if (finallyBlock !== undefined) {
                        this.check({ pos: tryBlock.end, end: finallyBlock.pos }, "finally");
                    }
                    break;
                }
                case ts.SyntaxKind.BinaryExpression: {
                    const { operatorToken, right } = node as ts.BinaryExpression;
                    if (
                        operatorToken.kind === ts.SyntaxKind.EqualsToken &&
                        isObjectLiteralExpression(right)
                    ) {
                        this.check({ pos: right.pos, end: right.properties.pos });
                    }
                    break;
                }
                case ts.SyntaxKind.VariableDeclaration: {
                    const { initializer } = node as ts.VariableDeclaration;
                    if (initializer !== undefined && isObjectLiteralExpression(initializer)) {
                        this.check({ pos: initializer.pos, end: initializer.properties.pos });
                    }
                    break;
                }
                case ts.SyntaxKind.TypeAliasDeclaration: {
                    const { type } = node as ts.TypeAliasDeclaration;
                    if (
                        type.kind === ts.SyntaxKind.MappedType ||
                        type.kind === ts.SyntaxKind.TypeLiteral
                    ) {
                        this.check(type.getChildAt(0, sourceFile));
                    }
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private check(range: ts.TextRange, kind?: "catch" | "else" | "finally") {
        const tokenStart = range.end - (kind === undefined ? 1 : kind.length);
        if (
            this.options[kind === undefined ? "brace" : kind] &&
            !isSameLine(this.sourceFile, range.pos, tokenStart)
        ) {
            this.addFailure(
                tokenStart,
                range.end,
                `misplaced ${kind === undefined ? "opening brace" : `'${kind}'`}`,
                Lint.Replacement.replaceFromTo(
                    range.pos,
                    tokenStart,
                    this.options.whitespace ? " " : "",
                ),
            );
        } else if (this.options.whitespace && range.pos === tokenStart) {
            this.addFailure(
                tokenStart,
                range.end,
                Rule.WHITESPACE_FAILURE_STRING,
                Lint.Replacement.appendText(range.pos, " "),
            );
        }
    }
}
