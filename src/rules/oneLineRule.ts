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

const OPTION_BRACE = "open-brace";
const OPTION_CATCH = "catch";
const OPTION_ELSE = "else";
const OPTION_FINALLY = "finally";
const OPTION_WHITESPACE = "check-whitespace";

type BraceSetting = "same-line" | "next-line";
const OPTION_SAME_LINE: BraceSetting = "same-line";
const OPTION_NEXT_LINE: BraceSetting = "next-line";

const optionSchema = {
    enum: [OPTION_SAME_LINE, OPTION_NEXT_LINE],
    type: "string",
};

interface Options {
    catch?: BraceSetting;
    finally?: BraceSetting;
    else?: BraceSetting;
    "open-brace"?: BraceSetting;
    "check-whitespace"?: boolean;
}

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
        optionExamples: [
            [
                true,
                {
                    [OPTION_BRACE]: OPTION_SAME_LINE,
                    [OPTION_CATCH]: OPTION_NEXT_LINE,
                    [OPTION_ELSE]: OPTION_NEXT_LINE,
                    [OPTION_FINALLY]: OPTION_NEXT_LINE,
                    [OPTION_WHITESPACE]: true,
                },
            ],
        ],
        type: "style",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static WHITESPACE_FAILURE_STRING = "Expected a space.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new OneLineWalker(sourceFile, this.ruleName, parseOptions(this.ruleArguments)));
    }
}

function parseOptions(ruleArguments: any[]): Options {
    if (ruleArguments.length === 0) {
        throw new Error("'one-line' rule expects options");
    }

    if (typeof ruleArguments[0] === "object") {
        return ruleArguments[0] as Options;
    }

    const options: Options = {};
    for (const arg of ruleArguments) {
        switch (arg) {
            case "check-catch":
                options.catch = "same-line";
                break;
            case "check-finally":
                options.finally = "same-line";
                break;
            case "check-else":
                options.else = "same-line";
                break;
            case "check-open-brace":
                options[OPTION_BRACE] = "same-line";
                break;
            case "check-whitespace":
                options[OPTION_WHITESPACE] = true;
                break;
            default:
                throw new Error(`bad option: ${arg}`);
        }
    }
    return options;
}

class OneLineWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.Block:
                    if (!isBlockLike(node.parent!)) {
                        this.check({pos: node.pos, end: (node as ts.Block).statements.pos});
                    }
                    break;
                case ts.SyntaxKind.CaseBlock:
                    this.check({pos: node.pos, end: (node as ts.CaseBlock).clauses.pos});
                    break;
                case ts.SyntaxKind.ModuleBlock:
                    this.check({pos: node.pos, end: (node as ts.ModuleBlock).statements.pos});
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    this.check({pos: (node as ts.EnumDeclaration).name.end, end: (node as ts.EnumDeclaration).members.pos});
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.ClassExpression: {
                    const openBrace = getChildOfKind(node, ts.SyntaxKind.OpenBraceToken, sourceFile);
                    if (openBrace !== undefined) {
                        this.check(openBrace);
                    }
                    break;
                }
                case ts.SyntaxKind.IfStatement: {
                    const { thenStatement, elseStatement } = node as ts.IfStatement;
                    if (elseStatement !== undefined && thenStatement.kind === ts.SyntaxKind.Block) {
                        this.check({pos: thenStatement.end, end: elseStatement.pos}, "else");
                    }
                    break;
                }
                case ts.SyntaxKind.TryStatement: {
                    const { finallyBlock, catchClause, tryBlock } = node as ts.TryStatement;
                    if (catchClause !== undefined) {
                        this.check(catchClause.getChildAt(0, sourceFile), "catch");
                        if (finallyBlock !== undefined) {
                            this.check({pos: catchClause.end, end: finallyBlock.pos}, "finally");
                        }
                    } else if (finallyBlock !== undefined) {
                        this.check({pos: tryBlock.end, end: finallyBlock.pos}, "finally");
                    }
                    break;
                }
                case ts.SyntaxKind.BinaryExpression: {
                    const { operatorToken, right } = node as ts.BinaryExpression;
                    if (operatorToken.kind === ts.SyntaxKind.EqualsToken && isObjectLiteralExpression(right)) {
                        this.check({pos: right.pos, end: right.properties.pos});
                    }
                    break;
                }
                case ts.SyntaxKind.VariableDeclaration: {
                    const { initializer } = node as ts.VariableDeclaration;
                    if (initializer !== undefined && isObjectLiteralExpression(initializer)) {
                        this.check({pos: initializer.pos, end: initializer.properties.pos});
                    }
                    break;
                }
                case ts.SyntaxKind.TypeAliasDeclaration: {
                    const { type } = node as ts.TypeAliasDeclaration;
                    if (type.kind === ts.SyntaxKind.MappedType || type.kind === ts.SyntaxKind.TypeLiteral) {
                        this.check(type.getChildAt(0, sourceFile));
                    }
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private check(range: ts.TextRange, kind?: "catch" | "else" | "finally") {
        const option = this.options[kind === undefined ? OPTION_BRACE : kind];
        if (option === undefined) {
            return;
        }

        const tokenStart = range.end - (kind === undefined ? 1 : kind.length);
        if (isSameLine(this.sourceFile, range.pos, tokenStart) !== (option === "same-line")) {
            const expected = option === "next-line" ? "line after" : "same line as";
            this.addFailure(
                tokenStart,
                range.end,
                `Expected '${kind === undefined ? "{" : kind}' to go on the ${expected} the preceding token.`,
                Lint.Replacement.replaceFromTo(range.pos, tokenStart, this.options[OPTION_WHITESPACE] ? " " : ""),
            );
        } else if (this.options[OPTION_WHITESPACE] && range.pos === tokenStart) {
            this.addFailure(tokenStart, range.end, Rule.WHITESPACE_FAILURE_STRING, Lint.Replacement.appendText(range.pos, " "));
        }
    }
}
