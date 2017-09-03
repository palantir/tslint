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
        description: "Requires the specified tokens to be on the same line as the expression preceding them.",
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
    };
    /* tslint:enable:object-literal-sort-keys */

    public static BRACE_FAILURE_STRING = "misplaced opening brace";
    public static CATCH_FAILURE_STRING = "misplaced 'catch'";
    public static ELSE_FAILURE_STRING = "misplaced 'else'";
    public static FINALLY_FAILURE_STRING = "misplaced 'finally'";
    public static WHITESPACE_FAILURE_STRING = "missing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new OneLineWalker(sourceFile, this.ruleName, {
            brace: this.ruleArguments.indexOf(OPTION_BRACE) !== -1,
            catch: this.ruleArguments.indexOf(OPTION_CATCH) !== -1,
            else: this.ruleArguments.indexOf(OPTION_ELSE) !== -1,
            finally: this.ruleArguments.indexOf(OPTION_FINALLY) !== -1,
            whitespace: this.ruleArguments.indexOf(OPTION_WHITESPACE) !== -1,
        }));
    }
}

class OneLineWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.Block:
                    if (!isBlockLike(node.parent!)) {
                        this.check(node.pos, (node as ts.Block).statements.pos);
                    }
                    break;
                case ts.SyntaxKind.CaseBlock:
                    this.check(node.pos, (node as ts.CaseBlock).clauses.pos);
                    break;
                case ts.SyntaxKind.ModuleBlock:
                    this.check(node.pos, (node as ts.ModuleBlock).statements.pos);
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    this.check((node as ts.EnumDeclaration).name.end, (node as ts.EnumDeclaration).members.pos);
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.ClassExpression: {
                    const openBraceToken = getChildOfKind(node, ts.SyntaxKind.OpenBraceToken, sourceFile)!;
                    this.check(openBraceToken.pos, openBraceToken.end);
                    break;
                }
                case ts.SyntaxKind.IfStatement:
                    if (this.options.else) {
                        const { thenStatement, elseStatement } = node as ts.IfStatement;
                        if (elseStatement !== undefined && thenStatement.kind === ts.SyntaxKind.Block) {
                            this.check(thenStatement.end, elseStatement.pos, "else");
                        }
                    }
                    break;
                case ts.SyntaxKind.TryStatement: {
                    const { finallyBlock, catchClause, tryBlock } = node as ts.TryStatement;
                    if (this.options.catch && catchClause !== undefined) {
                        this.check(catchClause.pos, catchClause.getStart(this.sourceFile) + "catch".length, "catch");
                    }
                    if (this.options.finally && finallyBlock !== undefined) {
                        this.check((catchClause === undefined ? tryBlock : catchClause).end, finallyBlock.pos, "finally");
                    }
                    break;
                }
                case ts.SyntaxKind.BinaryExpression:
                    this.checkBinaryExpression(node as ts.BinaryExpression);
                    break;
                case ts.SyntaxKind.VariableDeclaration:
                    this.checkVariableDeclaration(node as ts.VariableDeclaration);
                    break;
                case ts.SyntaxKind.TypeAliasDeclaration:
                    this.checkTypeAliasDeclaration(node as ts.TypeAliasDeclaration);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkBinaryExpression(node: ts.BinaryExpression) {
        if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken && isObjectLiteralExpression(node.right)) {
            this.check(node.right.pos, node.right.properties.pos);
        }
    }

    private checkVariableDeclaration(node: ts.VariableDeclaration) {
        if (node.initializer !== undefined && isObjectLiteralExpression(node.initializer)) {
            this.check(node.initializer.pos, node.initializer.properties.pos);
        }
    }

    private checkTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
        if (node.type.kind === ts.SyntaxKind.MappedType || node.type.kind === ts.SyntaxKind.TypeLiteral) {
            this.check(node.type.pos, node.type.getStart(this.sourceFile) + 1);
        }
    }

    private check(preceding: number, current: number, kind?: "catch" | "else" | "finally") {
        if (kind === undefined && !this.options.brace) {
            return;
        }
        const length = kind === undefined ? 1 : kind.length;
        current -= length;
        if (!isSameLine(this.sourceFile, preceding, current)) {
            this.addFailureAt(current, length, `misplaced ${kind === undefined ? "opening brace" : `'${kind}'`}`);
        } else if (preceding === current && this.options.whitespace) {
            this.addFailureAt(current, length, Rule.WHITESPACE_FAILURE_STRING);
        }
    }
}
