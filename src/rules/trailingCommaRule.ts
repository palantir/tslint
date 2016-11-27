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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "trailing-comma",
        description: Lint.Utils.dedent`
            Requires or disallows trailing commas in array and object literals, destructuring assignments, function and tuple typings,
            named imports and function parameters.`,
        optionsDescription: Lint.Utils.dedent`
            One argument which is an object with the keys \`multiline\` and \`singleline\`.
            Both should be set to either \`"always"\` or \`"never"\`.

            * \`"multiline"\` checks multi-line object literals.
            * \`"singleline"\` checks single-line object literals.

            A array is considered "multiline" if its closing bracket is on a line
            after the last array element. The same general logic is followed for
            object literals, function and tuple typings, named import statements
            and function parameters.`,
        options: {
            type: "object",
            properties: {
                multiline: {
                    type: "string",
                    enum: ["always", "never"],
                },
                singleline: {
                    type: "string",
                    enum: ["always", "never"],
                },
            },
            additionalProperties: false,
        },
        optionExamples: ['[true, {"multiline": "always", "singleline": "never"}]'],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_NEVER = "Unnecessary trailing comma";
    public static FAILURE_STRING_ALWAYS = "Missing trailing comma";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TrailingCommaWalker(sourceFile, this.getOptions()));
    }
}

class TrailingCommaWalker extends Lint.RuleWalker {
    private static SYNTAX_LIST_WRAPPER_TOKENS: Array<[ts.SyntaxKind, ts.SyntaxKind]> = [
        [ts.SyntaxKind.OpenBraceToken, ts.SyntaxKind.CloseBraceToken],
        [ts.SyntaxKind.OpenBracketToken, ts.SyntaxKind.CloseBracketToken],
        [ts.SyntaxKind.OpenParenToken, ts.SyntaxKind.CloseParenToken],
        [ts.SyntaxKind.LessThanToken, ts.SyntaxKind.GreaterThanToken],
    ];

    public visitArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        this.lintChildNodeWithIndex(node, 1);
        super.visitArrayLiteralExpression(node);
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        this.lintChildNodeWithIndex(node, 1);
        super.visitArrowFunction(node);
    }

    public visitBindingPattern(node: ts.BindingPattern) {
        if (node.kind === ts.SyntaxKind.ArrayBindingPattern || node.kind === ts.SyntaxKind.ObjectBindingPattern) {
            this.lintChildNodeWithIndex(node, 1);
        }
        super.visitBindingPattern(node);
    }

    public visitCallExpression(node: ts.CallExpression) {
        this.lintNode(node);
        super.visitCallExpression(node);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.lintNode(node);
        super.visitClassDeclaration(node);
    }

    public visitConstructSignature(node: ts.ConstructSignatureDeclaration) {
        this.lintNode(node);
        super.visitConstructSignature(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.lintNode(node);
        super.visitConstructorDeclaration(node);
    }

    public visitConstructorType(node: ts.FunctionOrConstructorTypeNode) {
        this.lintNode(node);
        super.visitConstructorType(node);
    }

    public visitEnumDeclaration(node: ts.EnumDeclaration) {
        this.lintNode(node, true);
        super.visitEnumDeclaration(node);
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        this.lintChildNodeWithIndex(node, 1);
        super.visitFunctionType(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.lintNode(node);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        this.lintNode(node);
        super.visitFunctionExpression(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.lintNode(node);
        super.visitInterfaceDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.lintNode(node);
        super.visitMethodDeclaration(node);
    }

    public visitMethodSignature(node: ts.SignatureDeclaration) {
        this.lintNode(node);
        super.visitMethodSignature(node);
    }

    public visitNamedImports(node: ts.NamedImports) {
        this.lintChildNodeWithIndex(node, 1);
        super.visitNamedImports(node);
    }

    public visitNewExpression(node: ts.NewExpression) {
        this.lintNode(node);
        super.visitNewExpression(node);
    }

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        this.lintChildNodeWithIndex(node, 1);
        super.visitObjectLiteralExpression(node);
    }

    public visitSetAccessor(node: ts.AccessorDeclaration) {
        this.lintNode(node);
        super.visitSetAccessor(node);
    }

    public visitTupleType(node: ts.TupleTypeNode) {
        this.lintChildNodeWithIndex(node, 1);
        super.visitTupleType(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        this.lintNode(node);
        // object type literals need to be inspected separately because they
        // have a different syntax list wrapper token, and they can be semicolon delimited
        const children = node.getChildren();
        for (let i = 0; i < children.length - 2; i++) {
            if (children[i].kind === ts.SyntaxKind.OpenBraceToken &&
                children[i + 1].kind === ts.SyntaxKind.SyntaxList &&
                children[i + 2].kind === ts.SyntaxKind.CloseBraceToken) {
                const grandChildren = children[i + 1].getChildren();
                // the AST is different from the grammar spec. The semicolons are included as tokens as part of *Signature,
                // as opposed to optionals alongside it. So instead of children[i + 1] having
                // [ PropertySignature, Semicolon, PropertySignature, Semicolon ], the AST is
                // [ PropertySignature, PropertySignature], where the Semicolons are under PropertySignature
                const hasSemicolon = grandChildren.some((grandChild) => {
                    return grandChild.getChildren().some((ggc) => ggc.kind === ts.SyntaxKind.SemicolonToken);
                });

                if (!hasSemicolon) {
                    const endLineOfClosingElement = this.getSourceFile().getLineAndCharacterOfPosition(children[i + 2].getEnd()).line;
                    this.lintChildNodeWithIndex(children[i + 1], grandChildren.length - 1, endLineOfClosingElement);
                }
            }
        }
        super.visitTypeLiteral(node);
    }

    public visitTypeReference(node: ts.TypeReferenceNode) {
        this.lintNode(node);
        super.visitTypeReference(node);
    }

    private lintNode(node: ts.Node, includeBraces?: boolean) {
        const children = node.getChildren();
        const syntaxListWrapperTokens = (includeBraces === true) ?
            TrailingCommaWalker.SYNTAX_LIST_WRAPPER_TOKENS : TrailingCommaWalker.SYNTAX_LIST_WRAPPER_TOKENS.slice(1);

        for (let i = 0; i < children.length - 2; i++) {
            syntaxListWrapperTokens.forEach(([openToken, closeToken]) => {
                if (children[i].kind === openToken &&
                    children[i + 1].kind === ts.SyntaxKind.SyntaxList &&
                    children[i + 2].kind === closeToken) {
                    this.lintChildNodeWithIndex(node, i + 1);
                }
            });
        }
    }

    private lintChildNodeWithIndex(node: ts.Node, childNodeIndex: number, endLineOfClosingElement?: number) {
        const child = node.getChildAt(childNodeIndex);
        if (child != null) {
            const grandChildren = child.getChildren();

            if (grandChildren.length > 0) {
                const lastGrandChild = grandChildren[grandChildren.length - 1];
                const hasTrailingComma = lastGrandChild.kind === ts.SyntaxKind.CommaToken;

                const endLineOfLastElement = this.getSourceFile().getLineAndCharacterOfPosition(lastGrandChild.getEnd()).line;
                if (endLineOfClosingElement === undefined) {
                    let closingElementNode = node.getChildAt(childNodeIndex + 1);
                    if (closingElementNode == null) {
                        closingElementNode = node;
                    }
                    endLineOfClosingElement = this.getSourceFile().getLineAndCharacterOfPosition(closingElementNode.getEnd()).line;
                }
                const isMultiline = endLineOfClosingElement !== endLineOfLastElement;
                const option = this.getOption(isMultiline ? "multiline" : "singleline");

                if (hasTrailingComma && option === "never") {
                    const failureStart = lastGrandChild.getStart();
                    const fix = new Lint.Fix(Rule.metadata.ruleName, [
                        this.deleteText(failureStart, 1),
                    ]);
                    this.addFailure(this.createFailure(failureStart, 1, Rule.FAILURE_STRING_NEVER, fix));
                } else if (!hasTrailingComma && option === "always") {
                    const failureStart = lastGrandChild.getEnd();
                    const fix = new Lint.Fix(Rule.metadata.ruleName, [
                        this.appendText(failureStart, ","),
                    ]);
                    this.addFailure(this.createFailure(failureStart - 1, 1, Rule.FAILURE_STRING_ALWAYS, fix));
                }
            }
        }
    }

    private getOption(option: string) {
        const allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return null;
        }

        return allOptions[0][option];
    }
}
