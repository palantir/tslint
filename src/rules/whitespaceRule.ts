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

// tslint:disable object-literal-sort-keys

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_BRANCH = "check-branch";
const OPTION_DECL = "check-decl";
const OPTION_OPERATOR = "check-operator";
const OPTION_MODULE = "check-module";
const OPTION_SEPARATOR = "check-separator";
const OPTION_REST_SPREAD = "check-rest-spread";
const OPTION_TYPE = "check-type";
const OPTION_TYPECAST = "check-typecast";
const OPTION_TYPE_OPERATOR = "check-type-operator";
const OPTION_PREBLOCK = "check-preblock";
const OPTION_POSTBRACE = "check-postbrace";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "whitespace",
        description: "Enforces whitespace style conventions.",
        rationale: "Helps maintain a readable, consistent style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            Ten arguments may be optionally provided:

            * \`"check-branch"\` checks branching statements (\`if\`/\`else\`/\`for\`/\`while\`) are followed by whitespace.
            * \`"check-decl"\`checks that variable declarations have whitespace around the equals token.
            * \`"check-operator"\` checks for whitespace around operator tokens.
            * \`"check-module"\` checks for whitespace in import & export statements.
            * \`"check-separator"\` checks for whitespace after separator tokens (\`,\`/\`;\`).
            * \`"check-rest-spread"\` checks that there is no whitespace after rest/spread operator (\`...\`).
            * \`"check-type"\` checks for whitespace before a variable type specification.
            * \`"check-typecast"\` checks for whitespace between a typecast and its target.
            * \`"check-type-operator"\` checks for whitespace between type operators \`|\` and \`&\`.
            * \`"check-preblock"\` checks for whitespace before the opening brace of a block.
            * \`"check-postbrace"\` checks for whitespace after an opening brace.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    "check-branch",
                    "check-decl",
                    "check-operator",
                    "check-module",
                    "check-separator",
                    "check-rest-spread",
                    "check-type",
                    "check-typecast",
                    "check-type-operator",
                    "check-preblock",
                    "check-postbrace",
                ],
            },
            minLength: 0,
            maxLength: 11,
        },
        optionExamples: [[true, "check-branch", "check-operator", "check-typecast"]],
        type: "style",
        typescriptOnly: false,
        hasFix: true,
    };

    public static FAILURE_STRING_MISSING = "missing whitespace";
    public static FAILURE_STRING_INVALID = "invalid whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

type Options = Record<
    | "branch"
    | "decl"
    | "operator"
    | "module"
    | "separator"
    | "restSpread"
    | "type"
    | "typecast"
    | "typeOperator"
    | "preblock"
    | "postbrace",
    boolean
>;

function parseOptions(ruleArguments: string[]): Options {
    return {
        branch: has(OPTION_BRANCH),
        decl: has(OPTION_DECL),
        operator: has(OPTION_OPERATOR),
        module: has(OPTION_MODULE),
        separator: has(OPTION_SEPARATOR),
        restSpread: has(OPTION_REST_SPREAD),
        type: has(OPTION_TYPE),
        typecast: has(OPTION_TYPECAST),
        typeOperator: has(OPTION_TYPE_OPERATOR),
        preblock: has(OPTION_PREBLOCK),
        postbrace: has(OPTION_POSTBRACE),
    };

    function has(option: string): boolean {
        return ruleArguments.indexOf(option) !== -1;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { sourceFile, options } = ctx;

    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ArrowFunction:
                checkEqualsGreaterThanTokenInNode(node);
                break;

            // check for spaces between the operator symbol (except in the case of comma statements)
            case ts.SyntaxKind.BinaryExpression: {
                const { left, operatorToken, right } = node as ts.BinaryExpression;
                if (options.operator && operatorToken.kind !== ts.SyntaxKind.CommaToken) {
                    checkForTrailingWhitespace(left.getEnd());
                    checkForTrailingWhitespace(right.getFullStart());
                }
                break;
            }

            case ts.SyntaxKind.Block:
                if (options.preblock) {
                    checkForTrailingWhitespace(node.getFullStart());
                }
                break;

            // check for spaces between ternary operator symbols
            case ts.SyntaxKind.ConditionalExpression:
                if (options.operator) {
                    const { condition, whenTrue } = node as ts.ConditionalExpression;
                    checkForTrailingWhitespace(condition.getEnd());
                    checkForTrailingWhitespace(whenTrue.getFullStart());
                    checkForTrailingWhitespace(whenTrue.getEnd());
                }
                break;

            case ts.SyntaxKind.ConstructorType:
                checkEqualsGreaterThanTokenInNode(node);
                break;

            case ts.SyntaxKind.ExportAssignment:
                if (options.module) {
                    const exportKeyword = node.getChildAt(0);
                    const position = exportKeyword.getEnd();
                    checkForTrailingWhitespace(position);
                }
                break;

            case ts.SyntaxKind.FunctionType:
                checkEqualsGreaterThanTokenInNode(node);
                break;

            case ts.SyntaxKind.ImportDeclaration: {
                const { importClause } = node as ts.ImportDeclaration;
                if (options.module && importClause !== undefined) {
                    // an import clause can have _both_ named bindings and a name (the latter for the default import)
                    // but the named bindings always come last, so we only need to check that for whitespace
                    let position: number | undefined;
                    const { namedBindings } = importClause;
                    if (namedBindings !== undefined) {
                        if (namedBindings.kind !== ts.SyntaxKind.NamespaceImport) {
                            namedBindings.elements.forEach((element, idx, arr) => {
                                const internalName = element.name;
                                if (internalName !== undefined) {
                                    if (idx === arr.length - 1) {
                                        const token = namedBindings.getLastToken()!;
                                        checkForTrailingWhitespace(token.getFullStart());
                                    }
                                    if (idx === 0) {
                                        const startPos = element.getStart() - 1;
                                        checkForTrailingWhitespace(startPos, startPos + 1);
                                    }
                                }
                            });
                        }
                        position = namedBindings.getEnd();
                    } else if (importClause.name !== undefined) {
                        position = importClause.name.getEnd();
                    }

                    if (position !== undefined) {
                        checkForTrailingWhitespace(position);
                    }
                }
                break;
            }

            case ts.SyntaxKind.ImportEqualsDeclaration:
                if (options.module) {
                    const position = (node as ts.ImportEqualsDeclaration).name.getEnd();
                    checkForTrailingWhitespace(position);
                }
                break;

            case ts.SyntaxKind.TypeAssertionExpression:
                if (options.typecast) {
                    const position = (node as ts.TypeAssertion).expression.getFullStart();
                    checkForTrailingWhitespace(position);
                }
                break;

            case ts.SyntaxKind.VariableDeclaration:
            case ts.SyntaxKind.PropertyDeclaration:
                const { name, type, initializer } = node as ts.VariableDeclaration;
                if (options.decl && initializer !== undefined) {
                    checkForTrailingWhitespace((type !== undefined ? type : name).getEnd());
                }
                break;

            case ts.SyntaxKind.BindingElement:
            case ts.SyntaxKind.Parameter:
                const { dotDotDotToken } = node as ts.BindingElement | ts.ParameterDeclaration;
                if (options.restSpread && dotDotDotToken !== undefined) {
                    checkForExcessiveWhitespace(dotDotDotToken.end);
                }
                break;

            case ts.SyntaxKind.SpreadAssignment:
            case ts.SyntaxKind.SpreadElement:
                if (options.restSpread) {
                    const position = (node as ts.SpreadAssignment).expression.getFullStart();
                    checkForExcessiveWhitespace(position);
                }
                break;

            case ts.SyntaxKind.UnionType:
            case ts.SyntaxKind.IntersectionType:
                if (options.typeOperator) {
                    const { types } = node as ts.UnionOrIntersectionTypeNode;
                    types.forEach((typeNode, index) => {
                        if (index > 0) {
                            checkForTrailingWhitespace(typeNode.getFullStart());
                        }
                        if (index < types.length - 1) {
                            checkForTrailingWhitespace(typeNode.getEnd());
                        }
                    });
                }
        }

        ts.forEachChild(node, cb);
    });

    let prevTokenShouldBeFollowedByWhitespace = false;
    utils.forEachTokenWithTrivia(sourceFile, (_text, tokenKind, range, parent) => {
        if (
            tokenKind === ts.SyntaxKind.WhitespaceTrivia ||
            tokenKind === ts.SyntaxKind.NewLineTrivia ||
            tokenKind === ts.SyntaxKind.EndOfFileToken
        ) {
            prevTokenShouldBeFollowedByWhitespace = false;
            return;
        } else if (prevTokenShouldBeFollowedByWhitespace) {
            addMissingWhitespaceErrorAt(range.pos);
            prevTokenShouldBeFollowedByWhitespace = false;
        }
        // check for trailing space after the given tokens
        switch (tokenKind) {
            case ts.SyntaxKind.CatchKeyword:
            case ts.SyntaxKind.ForKeyword:
            case ts.SyntaxKind.IfKeyword:
            case ts.SyntaxKind.SwitchKeyword:
            case ts.SyntaxKind.WhileKeyword:
            case ts.SyntaxKind.WithKeyword:
                if (options.branch) {
                    prevTokenShouldBeFollowedByWhitespace = true;
                }
                break;
            case ts.SyntaxKind.CommaToken:
                if (options.separator) {
                    prevTokenShouldBeFollowedByWhitespace = true;
                }
                break;
            case ts.SyntaxKind.SemicolonToken:
                if (!options.separator) {
                    break;
                }

                const nextPosition = range.pos + 1;
                const semicolonInTrivialFor =
                    parent.kind === ts.SyntaxKind.ForStatement &&
                    nextPosition !== sourceFile.end &&
                    (sourceFile.text[nextPosition] === ";" ||
                        sourceFile.text[nextPosition] === ")");

                if (!semicolonInTrivialFor) {
                    prevTokenShouldBeFollowedByWhitespace = true;
                }
                break;
            case ts.SyntaxKind.EqualsToken:
                if (options.decl && parent.kind !== ts.SyntaxKind.JsxAttribute) {
                    prevTokenShouldBeFollowedByWhitespace = true;
                }
                break;
            case ts.SyntaxKind.ColonToken:
                if (options.type) {
                    prevTokenShouldBeFollowedByWhitespace = true;
                }
                break;
            case ts.SyntaxKind.OpenBraceToken:
                const nextPos = range.pos + 1;
                if (
                    options.postbrace &&
                    (sourceFile.text[nextPos] !== " " &&
                        sourceFile.text[nextPos] !== "\r" &&
                        sourceFile.text[nextPos] !== "\t" &&
                        sourceFile.text[nextPos] !== "\n")
                ) {
                    addMissingWhitespaceErrorAt(nextPos);
                }
                break;
            case ts.SyntaxKind.ImportKeyword:
                if (
                    utils.isCallExpression(parent) &&
                    parent.expression.kind === ts.SyntaxKind.ImportKeyword
                ) {
                    return; // Don't check ImportCall
                }
                if (utils.isImportTypeNode(parent)) {
                    return; // Don't check TypeQuery
                }
            // falls through
            case ts.SyntaxKind.ExportKeyword:
            case ts.SyntaxKind.FromKeyword:
                if (options.typecast) {
                    prevTokenShouldBeFollowedByWhitespace = true;
                }
        }
    });

    function checkEqualsGreaterThanTokenInNode(node: ts.Node): void {
        if (!options.operator) {
            return;
        }

        const equalsGreaterThanToken = utils.getChildOfKind(
            node,
            ts.SyntaxKind.EqualsGreaterThanToken,
            sourceFile,
        );
        // condition so we don't crash if the arrow is somehow missing
        if (equalsGreaterThanToken === undefined) {
            return;
        }

        checkForTrailingWhitespace(equalsGreaterThanToken.getFullStart());
        checkForTrailingWhitespace(equalsGreaterThanToken.getEnd());
    }

    function checkForTrailingWhitespace(position: number, whiteSpacePos: number = position): void {
        if (
            position !== sourceFile.end &&
            !Lint.isWhiteSpace(sourceFile.text.charCodeAt(position))
        ) {
            addMissingWhitespaceErrorAt(whiteSpacePos);
        }
    }

    function addMissingWhitespaceErrorAt(position: number): void {
        // TODO: this rule occasionally adds duplicate failures.
        if (ctx.failures.some(f => f.getStartPosition().getPosition() === position)) {
            return;
        }
        const fix = Lint.Replacement.appendText(position, " ");
        ctx.addFailureAt(position, 1, Rule.FAILURE_STRING_MISSING, fix);
    }

    function checkForExcessiveWhitespace(position: number): void {
        if (
            position !== sourceFile.end &&
            Lint.isWhiteSpace(sourceFile.text.charCodeAt(position))
        ) {
            addInvalidWhitespaceErrorAt(position);
        }
    }

    function addInvalidWhitespaceErrorAt(position: number): void {
        const fix = Lint.Replacement.deleteText(position, 1);
        ctx.addFailureAt(position, 1, Rule.FAILURE_STRING_INVALID, fix);
    }
}
