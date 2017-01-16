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
            When no list of allowed values is specified, -1, 0 and 1 are allowed by default.`,
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

    public static FAILURE_STRING = "'magic numbers' are not allowed";

    public static ALLOWED_NODES = new Set<ts.SyntaxKind>([
        ts.SyntaxKind.ExportAssignment,
        ts.SyntaxKind.FirstAssignment,
        ts.SyntaxKind.LastAssignment,
        ts.SyntaxKind.PropertyAssignment,
        ts.SyntaxKind.ShorthandPropertyAssignment,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.VariableDeclarationList,
        ts.SyntaxKind.EnumMember,
        ts.SyntaxKind.PropertyDeclaration,
        ts.SyntaxKind.Parameter,
    ]);

    public static DEFAULT_ALLOWED = [ -1, 0, 1 ];

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.getOptions()));
    }
}

class NoMagicNumbersWalker extends Lint.RuleWalker {
    // allowed magic numbers
    private allowed: Set<string>;
    constructor(sourceFile: ts.SourceFile, options: IOptions) {
        super(sourceFile, options);

        const configOptions = this.getOptions();
        const allowedNumbers: number[] = configOptions.length > 0 ? configOptions : Rule.DEFAULT_ALLOWED;
        this.allowed = new Set(allowedNumbers.map(String));
    }

    public visitNode(node: ts.Node) {
        const num = getLiteralNumber(node);
        if (num !== undefined) {
            if (!Rule.ALLOWED_NODES.has(node.parent!.kind) && !this.allowed.has(num)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        } else {
            super.visitNode(node);
        }
    }
}

/** If node is a number literal, return a string representation of that number. */
function getLiteralNumber(node: ts.Node): string | undefined {
    if (node.kind === ts.SyntaxKind.NumericLiteral) {
        return (node as ts.NumericLiteral).text;
    }
    if (node.kind !== ts.SyntaxKind.PrefixUnaryExpression) {
        return undefined;
    }
    const { operator, operand } = node as ts.PrefixUnaryExpression;
    if (operator === ts.SyntaxKind.MinusToken && operand.kind === ts.SyntaxKind.NumericLiteral) {
        return "-" + (operand as ts.NumericLiteral).text;
    }
    return undefined;
}
