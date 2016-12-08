/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import { IOptions } from "../language/rule/rule";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-magic-numbers",
        description: Lint.Utils.dedent`
            Disallows the use constant number values outside of variable assignments.
            When no list of allowed values is specified, 0 and 1 are allowed by default.`,
        rationale: Lint.Utils.dedent`
            Magic numbers should be avoided as they often lack documentation, forcing
            them to be stored in variables gives them implicit documentation.`,
        optionsDescription: "A list of allowed numbers.",
        options: {
            type: "array",
            items: {
                type: "number",
            },
            minLength: 1,
        },
        optionExamples: ["true", "[true, 1, 2, 3]"],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "'magic numbers' are no allowed";

    public static ALLOWED_NODES = {
        [ts.SyntaxKind.ExportAssignment]: true,
        [ts.SyntaxKind.FirstAssignment]: true,
        [ts.SyntaxKind.LastAssignment]: true,
        [ts.SyntaxKind.PropertyAssignment]: true,
        [ts.SyntaxKind.ShorthandPropertyAssignment]: true,
        [ts.SyntaxKind.VariableDeclaration]: true,
        [ts.SyntaxKind.VariableDeclarationList]: true,
        [ts.SyntaxKind.EnumMember]: true,
        [ts.SyntaxKind.PropertyDeclaration]: true,
    };

    public static DEFAULT_ALLOWED = [
        -1,
        0,
        1,
    ];

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.getOptions()));
    }
}

class NoMagicNumbersWalker extends Lint.RuleWalker {
    private allowed: { [prop: string]: boolean };
    constructor (sourceFile: ts.SourceFile, options: IOptions) {
        super(sourceFile, options);

        const configOptions = this.getOptions();
        const allowedArray: number[] = configOptions.length > 0 ? configOptions : Rule.DEFAULT_ALLOWED;

        const allowed: { [prop: string]: boolean } = {};
        allowedArray.forEach((value) => {
            allowed[value] = true;
        });
        this.allowed = allowed;
    }

    public visitNode(node: ts.Node) {
        const isUnary = this.isUnaryNumericExpression(node)
        if (node.kind === ts.SyntaxKind.NumericLiteral && !Rule.ALLOWED_NODES[node.parent.kind] || isUnary) {
            let text = node.getText();
            if (!this.allowed[text]) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        if (!isUnary) {
            super.visitNode(node);
        }
    }

    /**
     * Checks if a node is an unary expression with on a numeric operand.
     */
    private isUnaryNumericExpression(node: ts.Node): boolean {
        if (node.kind !== ts.SyntaxKind.PrefixUnaryExpression) {
            return false;
        }
        const unaryNode = (<ts.PrefixUnaryExpression>node);
        return unaryNode.operator === ts.SyntaxKind.MinusToken && unaryNode.operand.kind === ts.SyntaxKind.NumericLiteral;
    }
}
