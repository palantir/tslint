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

import * as tsutils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const TAUTOLOGY_DISCOVERED_ERROR_STRING =
    "Both sides of this equality comparison are the same, so the expression is either a tautology or a contradiction.";
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: Lint.Utils.dedent`
        Enforces that relational/equality binary operators does not take two equal variables/literals as operands.
        Expression like 3 === 3, someVar === someVar, "1" > "1" are either a tautology or contradiction, and will produce an error.
        `,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: `Clean redundant code and unnecessary comparison of objects and literals.`,
        ruleName: "no-tautology-expression",
        type: "functionality",
        typescriptOnly: false,
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(context: Lint.WalkContext<void>) {
    const cb = (node: ts.Node): void => {
        if (tsutils.isBinaryExpression(node) && isRelationalOrLogicalOperator(node.operatorToken)) {
            if (isLiteral(node.left) && isLiteral(node.right)) {
                if (node.left.text === node.right.text) {
                    context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
                }
            } else if (tsutils.isIdentifier(node.left) && tsutils.isIdentifier(node.right)) {
                if (node.left.text === node.right.text) {
                    context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
                }
            } else if (
                tsutils.isPropertyAccessExpression(node.left) &&
                tsutils.isPropertyAccessExpression(node.right)
            ) {
                if (node.left.expression.getText() === node.right.expression.getText()) {
                    if (node.left.name.text === node.right.name.text) {
                        context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
                    }
                }
            }
        }
        return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(context.sourceFile, cb);
}

function isLiteral(node: ts.Node): node is ts.StringLiteral | ts.NumericLiteral {
    return tsutils.isStringLiteral(node) || tsutils.isNumericLiteral(node);
}

function isRelationalOrLogicalOperator(operator: ts.BinaryOperatorToken): boolean {
    return new Set([
        ts.SyntaxKind.LessThanToken,
        ts.SyntaxKind.GreaterThanToken,
        ts.SyntaxKind.LessThanEqualsToken,
        ts.SyntaxKind.GreaterThanEqualsToken,
        ts.SyntaxKind.EqualsEqualsToken,
        ts.SyntaxKind.EqualsEqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsToken,
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ts.SyntaxKind.AmpersandAmpersandToken,
        ts.SyntaxKind.BarBarToken,
    ]).has(operator.kind);
}
