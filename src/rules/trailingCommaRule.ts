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
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_NEVER = "Unnecessary trailing comma";
    public static FAILURE_STRING_ALWAYS = "Missing trailing comma";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TrailingCommaWalker(sourceFile, this.getOptions()));
    }
}

class TrailingCommaWalker extends Lint.RuleWalker {
    public visitArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        this.lintNode(node, 1);
        super.visitArrayLiteralExpression(node);
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        this.lintNode(node, 1);
        super.visitArrowFunction(node);
    }

    public visitBindingPattern(node: ts.BindingPattern) {
        if (node.kind === ts.SyntaxKind.ArrayBindingPattern || node.kind === ts.SyntaxKind.ObjectBindingPattern) {
            this.lintNode(node, 1);
        }
        super.visitBindingPattern(node);
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        this.lintNode(node, 1);
        super.visitFunctionType(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.visitFunctionLikeNode(node);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        this.visitFunctionLikeNode(node);
        super.visitFunctionExpression(node);
    }

    public visitNamedImports(node: ts.NamedImports) {
        this.lintNode(node, 1);
        super.visitNamedImports(node);
    }

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        this.lintNode(node, 1);
        super.visitObjectLiteralExpression(node);
    }

    public visitTupleType(node: ts.TupleTypeNode) {
        this.lintNode(node, 1);
        super.visitTupleType(node);
    }

    private visitFunctionLikeNode(node: ts.Node) {
        const children = node.getChildren();
        for (let i = 0; i < children.length - 2; i++) {
            if (children[i].kind === ts.SyntaxKind.OpenParenToken &&
                children[i + 1].kind === ts.SyntaxKind.SyntaxList &&
                children[i + 2].kind === ts.SyntaxKind.CloseParenToken) {
                this.lintNode(node, i + 1);
            }
        }
    }

    private lintNode(node: ts.Node, childNodeIndex: number) {
        const child = node.getChildAt(childNodeIndex);
        if (child != null && child.kind === ts.SyntaxKind.SyntaxList) {
            const grandChildren = child.getChildren();

            if (grandChildren.length > 0) {
                const lastGrandChild = grandChildren[grandChildren.length - 1];
                const hasTrailingComma = lastGrandChild.kind === ts.SyntaxKind.CommaToken;

                const endLineOfLastElement = this.getSourceFile().getLineAndCharacterOfPosition(lastGrandChild.getEnd()).line;
                let closingElementNode = node.getChildAt(childNodeIndex + 1);
                if (closingElementNode == null) {
                    closingElementNode = node;
                }
                const endLineOfClosingElement = this.getSourceFile().getLineAndCharacterOfPosition(closingElementNode.getEnd()).line;
                const isMultiline = endLineOfClosingElement !== endLineOfLastElement;
                const option = this.getOption(isMultiline ? "multiline" : "singleline");

                if (hasTrailingComma && option === "never") {
                    this.addFailure(this.createFailure(lastGrandChild.getStart(), 1, Rule.FAILURE_STRING_NEVER));
                } else if (!hasTrailingComma && option === "always") {
                    this.addFailure(this.createFailure(lastGrandChild.getEnd() - 1, 1, Rule.FAILURE_STRING_ALWAYS));
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
