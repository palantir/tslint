/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { isCallExpression, isIdentifier } from "tsutils";
import * as Lint from "../index";
import { isNegativeNumberLiteral } from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-magic-numbers",
        description: Lint.Utils.dedent`
            Disallows the use constant number values outside of variable assignments.
            When no list of allowed values is specified, -1, 0 and 1 are allowed by default.`,
        rationale: Lint.Utils.dedent`
            Magic numbers should be avoided as they often lack documentation.
            Forcing them to be stored in variables gives them implicit documentation.
        `,
        optionsDescription: "A list of allowed numbers.",
        options: {
            type: "array",
            items: {
                type: "number",
            },
            minLength: 1,
        },
        optionExamples: [true, [true, 1, 2, 3]],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

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

    public static DEFAULT_ALLOWED = [-1, 0, 1];

    public static FAILURE_STRING(num: string): string {
        return `'magic numbers' are not allowed: ${num}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoMagicNumbersWalker(
                sourceFile,
                this.ruleName,
                this.ruleArguments.length > 0 ? this.ruleArguments : Rule.DEFAULT_ALLOWED,
            ),
        );
    }
}

class NoMagicNumbersWalker extends Lint.AbstractWalker<number[]> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (
                isCallExpression(node) &&
                isIdentifier(node.expression) &&
                node.expression.text === "parseInt"
            ) {
                return node.arguments.length === 0 ? undefined : cb(node.arguments[0]);
            }

            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return this.checkNumericLiteral(node, (node as ts.NumericLiteral).text);
            }
            if (isNegativeNumberLiteral(node)) {
                return this.checkNumericLiteral(
                    node,
                    `-${(node.operand as ts.NumericLiteral).text}`,
                );
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkNumericLiteral(node: ts.Node, num: string) {
        /* Using Object.is() to differentiate between pos/neg zero */
        if (
            !Rule.ALLOWED_NODES.has(node.parent.kind) &&
            !this.options.some(allowedNum => Object.is(allowedNum, parseFloat(num)))
        ) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING(num));
        }
    }
}
