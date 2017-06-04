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
const OPTION_PREBLOCK = "check-preblock";
const OPTION_SEPARATOR = "check-separator";
const OPTION_TYPE = "check-type";
const OPTION_TYPECAST = "check-typecast";
const OPTION_TYPE_LIST = "check-type-list";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "whitespace",
        description: "Enforces whitespace style conventions.",
        rationale: "Helps maintain a readable, consistent style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            Nine arguments may be optionally provided:

            * \`"${OPTION_BRANCH}"\` checks branching statements (\`if\`/\`else\`/\`for\`/\`while\`) are followed by whitespace.
            * \`"${OPTION_DECL}"\`checks that variable declarations have whitespace around the equals token.
            * \`"${OPTION_OPERATOR}"\` checks for whitespace around operator tokens.
            * \`"${OPTION_MODULE}"\` checks for whitespace in import & export statements.
            * \`"${OPTION_PREBLOCK}"\` checks for whitespace before the opening brace of a block
            * \`"${OPTION_SEPARATOR}"\` checks for whitespace after separator tokens (\`,\`/\`;\`).
            * \`"${OPTION_TYPE}"\` checks for whitespace before a variable type specification.
            * \`"${OPTION_TYPECAST}"\` checks for whitespace between a typecast and its target.
            * \`"${OPTION_TYPE_LIST}"\` checks for whitespace around the operators in intersection and union types.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_BRANCH, OPTION_DECL, OPTION_OPERATOR, OPTION_MODULE, OPTION_PREBLOCK,
                    OPTION_SEPARATOR, OPTION_TYPE, OPTION_TYPECAST, OPTION_TYPE_LIST,
                ],
            },
            minLength: 0,
            maxLength: 9,
        },
        optionExamples: [[true, OPTION_BRANCH, OPTION_OPERATOR, OPTION_TYPECAST]],
        type: "style",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "missing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

type Options = Record<"branch" | "decl" | "operator" | "module" | "separator" | "type" | "typecast" | "preblock", boolean>;
function parseOptions(ruleArguments: string[]): Options {
    return {
        branch: has(OPTION_BRANCH),
        decl: has(OPTION_DECL),
        operator: has(OPTION_OPERATOR),
        module: has(OPTION_MODULE),
        separator: has(OPTION_SEPARATOR),
        type: has(OPTION_TYPE),
        typecast: has(OPTION_TYPECAST),
        preblock: has(OPTION_PREBLOCK),
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

            case ts.SyntaxKind.IntersectionType:
            case ts.SyntaxKind.UnionType:
                checkTypeJoin(node.getChildren()[0] as ts.SyntaxList);
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
                    const { name, namedBindings } = importClause;
                    if (namedBindings !== undefined) {
                        position = namedBindings.getEnd();
                    } else if (name !== undefined) {
                        position = name.getEnd();
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
                const { name, type, initializer } = node as ts.VariableDeclaration;
                if (options.decl && initializer !== undefined) {
                    checkForTrailingWhitespace((type !== undefined ? type :  name).getEnd());
                }
        }

        ts.forEachChild(node, cb);
    });

    let prevTokenShouldBeFollowedByWhitespace = false;
    utils.forEachTokenWithTrivia(sourceFile, (_text, tokenKind, range, parent) => {
        if (tokenKind === ts.SyntaxKind.WhitespaceTrivia ||
            tokenKind === ts.SyntaxKind.NewLineTrivia ||
            tokenKind === ts.SyntaxKind.EndOfFileToken) {

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
            case ts.SyntaxKind.SemicolonToken:
                if (options.separator) {
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
            case ts.SyntaxKind.ImportKeyword:
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

        const equalsGreaterThanToken = Lint.childOfKind(node, ts.SyntaxKind.EqualsGreaterThanToken);
        // condition so we don't crash if the arrow is somehow missing
        if (equalsGreaterThanToken === undefined) {
            return;
        }

        checkForTrailingWhitespace(equalsGreaterThanToken.getFullStart());
        checkForTrailingWhitespace(equalsGreaterThanToken.getEnd());
    }

    function checkTypeJoin(node: ts.SyntaxList): void {
        const children = node.getChildren();

        for (let i = 1; i < children.length - 1; i += 2) {
            if (children[i - 1].end === children[i].getStart()) {
                addMissingWhitespaceErrorAt(children[i - 1].end);
            }

            if (children[i].end === children[i + 1].getStart()) {
                addMissingWhitespaceErrorAt(children[i].end);
            }
        }
    }

    function checkForTrailingWhitespace(position: number): void {
        if (position !== sourceFile.end && !ts.isWhiteSpaceLike(sourceFile.text.charCodeAt(position))) {
            addMissingWhitespaceErrorAt(position);
        }
    }

    function addMissingWhitespaceErrorAt(position: number): void {
        // TODO: this rule occasionally adds duplicate failures.
        if (ctx.failures.some((f) => f.getStartPosition().getPosition() === position)) {
            return;
        }
        const fix = Lint.Replacement.appendText(position, " ");
        ctx.addFailureAt(position, 1, Rule.FAILURE_STRING, fix);
    }
}
