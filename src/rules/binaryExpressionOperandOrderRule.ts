/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import { isBinaryExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isNegativeNumberLiteral } from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "binary-expression-operand-order",
        description: Lint.Utils.dedent`
            In a binary expression, a literal should always be on the right-hand side if possible.
            For example, prefer 'x + 1' over '1 + x'.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Expressions like \`1 + x\` are sometimes referred to as "Yoda" expressions because they read
            opposite to how we would normally speak the expression.

            Sticking to a consistent grammar for conditions helps keep code readable and understandable.
        `,
        type: "style",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Literal expression should be on the right-hand side of a binary expression.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (
            isBinaryExpression(node) &&
            isLiteral(node.left) &&
            !isLiteral(node.right) &&
            !isAllowedOrderedOperator(node)
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        ts.forEachChild(node, cb);
    });
}

/** Allows certain inherently ordered operators that can't easily be written with the literal on the right. */
function isAllowedOrderedOperator(node: ts.BinaryExpression): boolean {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.PlusToken:
            // Allow `"foo" + x` but not `1 + x`.
            return node.left.kind === ts.SyntaxKind.StringLiteral;
        case ts.SyntaxKind.MinusToken:
        case ts.SyntaxKind.SlashToken:
        case ts.SyntaxKind.PercentToken:
        case ts.SyntaxKind.LessThanLessThanToken:
        case ts.SyntaxKind.GreaterThanGreaterThanToken:
        case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
        case ts.SyntaxKind.AsteriskAsteriskToken:
        case ts.SyntaxKind.InKeyword:
        case ts.SyntaxKind.CommaToken:
            return true;
        default:
            return false;
    }
}

function isLiteral(node: ts.Expression): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.TrueKeyword:
        case ts.SyntaxKind.FalseKeyword:
        case ts.SyntaxKind.NullKeyword:
            return true;
        case ts.SyntaxKind.Identifier:
            return (node as ts.Identifier).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword;
        case ts.SyntaxKind.PrefixUnaryExpression:
            return isNegativeNumberLiteral(node);
        case ts.SyntaxKind.ParenthesizedExpression:
            return isLiteral((node as ts.ParenthesizedExpression).expression);
        default:
            return false;
    }
}
