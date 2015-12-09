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

/* tslint:disable:object-literal-sort-keys */
const SPACE_OPTIONS: Lint.IRuleOption = {
    type: "enum",
    enumValues: ["nospace", "onespace", "space"],
};

const SPACE_OBJECT: Lint.IRuleOption = {
    type: "object",
    properties: {
        "call-signature": SPACE_OPTIONS,
        "index-signature": SPACE_OPTIONS,
        "parameter": SPACE_OPTIONS,
        "property-declaration": SPACE_OPTIONS,
        "variable-declaration": SPACE_OPTIONS,
    },
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "typedef-whitespace",
        description: "Requires or disallows whitespace for type definitions.",
        descriptionDetails: "Determines if a space is required or not before the colon in a type specifier.",
        optionsDescription: Lint.Utils.dedent`
            Two arguments which are both objects.
            The first argument specifies how much space should be to the _left_ of a typedef colon.
            The second argument specifies how much space should be to the _right_ of a typedef colon.
            Each key should have a value of \`"space"\` or \`"nospace"\`.
            Possible keys are:

            * \`"call-signature"\` checks return type of functions.
            * \`"index-signature"\` checks index type specifier of indexers.
            * \`"parameter"\` checks function parameters.
            * \`"property-declaration"\` checks object property declarations.
            * \`"variable-declaration"\` checks variable declaration.`,
        options: {
            type: "array",
            arrayMembers: [SPACE_OBJECT, SPACE_OBJECT],
        },
        optionExamples: [Lint.Utils.dedent`
            [
              true,
              {
                "call-signature": "nospace",
                "index-signature": "nospace",
                "parameter": "nospace",
                "property-declaration": "nospace",
                "variable-declaration": "nospace"
              },
              {
                "call-signature": "onespace",
                "index-signature": "onespace",
                "parameter": "onespace",
                "property-declaration": "onespace",
                "variable-declaration": "onespace"
              }
            ]`,
        ],
        type: "typescript",
    };
    /* tslint:enable:object-literal-sort-keys */

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TypedefWhitespaceWalker(sourceFile, this.getOptions()));
    }
}

class TypedefWhitespaceWalker extends Lint.RuleWalker {
    private static getColonPosition(node: ts.Node) {
        const colon = node.getChildren().filter((child) =>
            child.kind === ts.SyntaxKind.ColonToken
        )[0];

        return colon == null ? -1 : colon.getStart();
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.checkSpace("call-signature", node, node.type);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        this.checkSpace("call-signature", node, node.type);
        super.visitFunctionExpression(node);
    }

    public visitGetAccessor(node: ts.AccessorDeclaration) {
        this.checkSpace("call-signature", node, node.type);
        super.visitGetAccessor(node);
    }

    public visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration) {
        this.checkSpace("index-signature", node, node.type);
        super.visitIndexSignatureDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.checkSpace("call-signature", node, node.type);
        super.visitMethodDeclaration(node);
    }

    public visitMethodSignature(node: ts.SignatureDeclaration) {
        this.checkSpace("call-signature", node, node.type);
        super.visitMethodSignature(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        this.checkSpace("parameter", node, node.type);
        super.visitParameterDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this.checkSpace("property-declaration", node, node.type);
        super.visitPropertyDeclaration(node);
    }

    public visitPropertySignature(node: ts.PropertyDeclaration) {
        this.checkSpace("property-declaration", node, node.type);
        super.visitPropertySignature(node);
    }

    public visitSetAccessor(node: ts.AccessorDeclaration) {
        this.checkSpace("call-signature", node, node.type);
        super.visitSetAccessor(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        this.checkSpace("variable-declaration", node, node.type);
        super.visitVariableDeclaration(node);
    }

    public checkSpace(option: string, node: ts.Node, typeNode: ts.TypeNode | ts.StringLiteral) {
        if (this.hasOption(option) && typeNode != null) {
            const colonPosition = TypedefWhitespaceWalker.getColonPosition(node);

            if (colonPosition != null) {
                const scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.getText());

                this.checkLeft(option, node, scanner, colonPosition);
                this.checkRight(option, node, scanner, colonPosition);
            }
        }
    }

    public hasOption(option: string) {
        return this.hasLeftOption(option) || this.hasRightOption(option);
    }

    private hasLeftOption(option: string) {
        const allOptions = this.getOptions();

        if (allOptions == null || allOptions.length === 0) {
            return false;
        }

        const options = allOptions[0];
        return options != null && options[option] != null;
    }

    private hasRightOption(option: string) {
        const allOptions = this.getOptions();

        if (allOptions == null || allOptions.length < 2) {
            return false;
        }

        const options = allOptions[1];
        return options != null && options[option] != null;
    }

    private getLeftOption(option: string) {
        if (!this.hasLeftOption(option)) {
            return null;
        }

        const allOptions = this.getOptions();
        const options = allOptions[0];
        return options[option];
    }

    private getRightOption(option: string) {
        if (!this.hasRightOption(option)) {
            return null;
        }

        const allOptions = this.getOptions();
        const options = allOptions[1];
        return options[option];
    }

    private checkLeft(option: string, node: ts.Node, scanner: ts.Scanner, colonPosition: number) {
        if (this.hasLeftOption(option)) {
            let positionToCheck = colonPosition - 1 - node.getStart();

            let hasLeadingWhitespace: boolean;
            if (positionToCheck < 0) {
                hasLeadingWhitespace = false;
            } else {
                scanner.setTextPos(positionToCheck);
                hasLeadingWhitespace = scanner.scan() === ts.SyntaxKind.WhitespaceTrivia;
            }

            positionToCheck = colonPosition - 2 - node.getStart();

            let hasSeveralLeadingWhitespaces: boolean;
            if (positionToCheck < 0) {
                hasSeveralLeadingWhitespaces = false;
            } else {
                scanner.setTextPos(positionToCheck);
                hasSeveralLeadingWhitespaces = hasLeadingWhitespace &&
                    scanner.scan() === ts.SyntaxKind.WhitespaceTrivia;
            }

            const optionValue = this.getLeftOption(option);
            const message = "expected " + optionValue + " before colon in " + option;
            this.performFailureCheck(
                optionValue,
                hasLeadingWhitespace,
                hasSeveralLeadingWhitespaces,
                colonPosition - 1,
                message
            );
        }
    }

    private checkRight(option: string, node: ts.Node, scanner: ts.Scanner, colonPosition: number) {
        if (this.hasRightOption(option)) {
            let positionToCheck = colonPosition + 1 - node.getStart();

            let hasTrailingWhitespace: boolean;
            if (positionToCheck >= node.getWidth()) {
                hasTrailingWhitespace = false;
            } else {
                scanner.setTextPos(positionToCheck);
                hasTrailingWhitespace = scanner.scan() === ts.SyntaxKind.WhitespaceTrivia;
            }

            positionToCheck = colonPosition + 2 - node.getStart();

            let hasSeveralTrailingWhitespaces: boolean;
            if (positionToCheck >= node.getWidth()) {
                hasSeveralTrailingWhitespaces = false;
            } else {
                scanner.setTextPos(positionToCheck);
                hasSeveralTrailingWhitespaces = hasTrailingWhitespace &&
                    scanner.scan() === ts.SyntaxKind.WhitespaceTrivia;
            }

            const optionValue = this.getRightOption(option);
            const message = "expected " + optionValue + " after colon in " + option;
            this.performFailureCheck(
                optionValue,
                hasTrailingWhitespace,
                hasSeveralTrailingWhitespaces,
                colonPosition + 1,
                message
            );
        }
    }

    private performFailureCheck(optionValue: string, hasWS: boolean, hasSeveralWS: boolean, failurePos: number, message: string) {
        // has several spaces but should have one or none
        let isFailure = hasSeveralWS &&
            (optionValue === "onespace" || optionValue === "nospace");
        // has at least one space but should have none
        isFailure = isFailure || hasWS && optionValue === "nospace";
        // has no space but should have at least one
        isFailure = isFailure || !hasWS &&
            (optionValue === "onespace" || optionValue === "space");

        if (isFailure) {
            this.addFailure(this.createFailure(failurePos, 1, message));
        }
    }
}
