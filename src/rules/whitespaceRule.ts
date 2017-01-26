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

const OPTION_BRANCH = "check-branch";
const OPTION_DECL = "check-decl";
const OPTION_OPERATOR = "check-operator";
const OPTION_MODULE = "check-module";
const OPTION_SEPARATOR = "check-separator";
const OPTION_TYPE = "check-type";
const OPTION_TYPECAST = "check-typecast";
const OPTION_PREBLOCK = "check-preblock";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "whitespace",
        description: "Enforces whitespace style conventions.",
        rationale: "Helps maintain a readable, consistent style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            Eight arguments may be optionally provided:

            * \`"check-branch"\` checks branching statements (\`if\`/\`else\`/\`for\`/\`while\`) are followed by whitespace.
            * \`"check-decl"\`checks that variable declarations have whitespace around the equals token.
            * \`"check-operator"\` checks for whitespace around operator tokens.
            * \`"check-module"\` checks for whitespace in import & export statements.
            * \`"check-separator"\` checks for whitespace after separator tokens (\`,\`/\`;\`).
            * \`"check-type"\` checks for whitespace before a variable type specification.
            * \`"check-typecast"\` checks for whitespace between a typecast and its target.
            * \`"check-preblock"\` checks for whitespace before the opening brace of a block`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["check-branch", "check-decl", "check-operator", "check-module",
                       "check-separator", "check-type", "check-typecast", "check-preblock"],
            },
            minLength: 0,
            maxLength: 7,
        },
        optionExamples: ['[true, "check-branch", "check-operator", "check-typecast"]'],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "missing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new WhitespaceWalker(sourceFile, this.getOptions()));
    }
}

class WhitespaceWalker extends Lint.RuleWalker {
    private scanner: ts.Scanner;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, sourceFile.text);
    }

    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);

        let prevTokenShouldBeFollowedByWhitespace = false;
        Lint.forEachToken(node, false, (_text, tokenKind, pos, parent) => {
            if (tokenKind === ts.SyntaxKind.WhitespaceTrivia ||
                tokenKind === ts.SyntaxKind.NewLineTrivia ||
                tokenKind === ts.SyntaxKind.EndOfFileToken) {

                prevTokenShouldBeFollowedByWhitespace = false;
                return;
            } else if (prevTokenShouldBeFollowedByWhitespace) {
                this.addMissingWhitespaceErrorAt(pos.tokenStart);
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
                    if (this.hasOption(OPTION_BRANCH)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case ts.SyntaxKind.CommaToken:
                case ts.SyntaxKind.SemicolonToken:
                    if (this.hasOption(OPTION_SEPARATOR)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case ts.SyntaxKind.EqualsToken:
                    if (this.hasOption(OPTION_DECL) && parent.kind !== ts.SyntaxKind.JsxAttribute) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case ts.SyntaxKind.ColonToken:
                    if (this.hasOption(OPTION_TYPE)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                case ts.SyntaxKind.ImportKeyword:
                case ts.SyntaxKind.ExportKeyword:
                case ts.SyntaxKind.FromKeyword:
                    if (this.hasOption(OPTION_MODULE)) {
                        prevTokenShouldBeFollowedByWhitespace = true;
                    }
                    break;
                default:
                    break;
            }
        });
    }

    public visitArrowFunction(node: ts.ArrowFunction) {
        this.checkEqualsGreaterThanTokenInNode(node);
        super.visitArrowFunction(node);
    }

    // check for spaces between the operator symbol (except in the case of comma statements)
    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (this.hasOption(OPTION_OPERATOR) && node.operatorToken.kind !== ts.SyntaxKind.CommaToken) {
            this.checkForTrailingWhitespace(node.left.getEnd());
            this.checkForTrailingWhitespace(node.right.getFullStart());
        }
        super.visitBinaryExpression(node);
    }

    protected visitBlock(block: ts.Block) {
        if (this.hasOption(OPTION_PREBLOCK)) {
            this.checkForTrailingWhitespace(block.getFullStart());
        }
        super.visitBlock(block);
    }

    // check for spaces between ternary operator symbols
    public visitConditionalExpression(node: ts.ConditionalExpression) {
        if (this.hasOption(OPTION_OPERATOR)) {
            this.checkForTrailingWhitespace(node.condition.getEnd());
            this.checkForTrailingWhitespace(node.whenTrue.getFullStart());
            this.checkForTrailingWhitespace(node.whenTrue.getEnd());
        }
        super.visitConditionalExpression(node);
    }

    public visitConstructorType(node: ts.FunctionOrConstructorTypeNode) {
        this.checkEqualsGreaterThanTokenInNode(node);
        super.visitConstructorType(node);
    }

    public visitExportAssignment(node: ts.ExportAssignment) {
        if (this.hasOption(OPTION_MODULE)) {
            const exportKeyword = node.getChildAt(0);
            const position = exportKeyword.getEnd();
            this.checkForTrailingWhitespace(position);
        }
        super.visitExportAssignment(node);
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        this.checkEqualsGreaterThanTokenInNode(node);
        super.visitFunctionType(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const importClause = node.importClause;
        if (this.hasOption(OPTION_MODULE) && importClause != null) {
            // an import clause can have _both_ named bindings and a name (the latter for the default import)
            // but the named bindings always come last, so we only need to check that for whitespace
            let position: number | undefined;
            if (importClause.namedBindings !== undefined) {
                position = importClause.namedBindings.getEnd();
            } else if (importClause.name !== undefined) {
                position = importClause.name.getEnd();
            }

            if (position !== undefined) {
                this.checkForTrailingWhitespace(position);
            }
        }
        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        if (this.hasOption(OPTION_MODULE)) {
            const position = node.name.getEnd();
            this.checkForTrailingWhitespace(position);
        }
        super.visitImportEqualsDeclaration(node);
    }

    public visitTypeAssertionExpression(node: ts.TypeAssertion) {
        if (this.hasOption(OPTION_TYPECAST)) {
            const position = node.expression.getFullStart();
            this.checkForTrailingWhitespace(position);
        }
        super.visitTypeAssertionExpression(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        if (this.hasOption(OPTION_DECL) && node.initializer != null) {
            if (node.type != null) {
                this.checkForTrailingWhitespace(node.type.getEnd());
            } else {
                this.checkForTrailingWhitespace(node.name.getEnd());
            }
        }
        super.visitVariableDeclaration(node);
    }

    private checkEqualsGreaterThanTokenInNode(node: ts.Node) {
        if (!this.hasOption(OPTION_OPERATOR)) {
            return;
        }

        const equalsGreaterThanToken = Lint.childOfKind(node, ts.SyntaxKind.EqualsGreaterThanToken);
        // condition so we don't crash if the arrow is somehow missing
        if (equalsGreaterThanToken === undefined) {
            return;
        }

        this.checkForTrailingWhitespace(equalsGreaterThanToken.getFullStart());
        this.checkForTrailingWhitespace(equalsGreaterThanToken.getEnd());
    }

    private checkForTrailingWhitespace(position: number) {
        this.scanner.setTextPos(position);
        const nextTokenType = this.scanner.scan();

        if (nextTokenType !== ts.SyntaxKind.WhitespaceTrivia
                && nextTokenType !== ts.SyntaxKind.NewLineTrivia
                && nextTokenType !== ts.SyntaxKind.EndOfFileToken) {
            this.addMissingWhitespaceErrorAt(position);
        }
    }

    private addMissingWhitespaceErrorAt(position: number) {
        const fix = this.createFix(this.appendText(position, " "));
        this.addFailureAt(position, 1, Rule.FAILURE_STRING, fix);
    }
}
