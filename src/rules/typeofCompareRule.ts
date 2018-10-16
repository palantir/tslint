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

const LEGAL_TYPEOF_RESULTS = new Set([
    "undefined",
    "string",
    "boolean",
    "number",
    "function",
    "object",
    "symbol"
]);

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "typeof-compare",
        description: "Makes sure result of `typeof` is compared to correct string values",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        deprecationMessage: !/^2\.1\./.test(ts.version)
            ? "Starting from TypeScript 2.2 the compiler includes this check which makes this rule redundant."
            : ""
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = `'typeof' expression must be compared to one of: ${Array.from(
        LEGAL_TYPEOF_RESULTS
    )
        .map(x => `"${x}"`)
        .join(", ")}`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (tsutils.isBinaryExpression(node)) {
            const { operatorToken, left, right } = node;
            if (
                Lint.getEqualsKind(operatorToken) !== undefined &&
                (isFaultyTypeof(left, right) || isFaultyTypeof(right, left))
            ) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        ts.forEachChild(node, cb);
    });
}

function isFaultyTypeof(left: ts.Expression, right: ts.Expression) {
    return left.kind === ts.SyntaxKind.TypeOfExpression && isFaultyTypeofResult(right);
}

function isFaultyTypeofResult(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.StringLiteral:
            return !LEGAL_TYPEOF_RESULTS.has((node as ts.StringLiteral).text);

        case ts.SyntaxKind.Identifier:
            return (node as ts.Identifier).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword;

        case ts.SyntaxKind.NullKeyword:
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.TrueKeyword:
        case ts.SyntaxKind.FalseKeyword:
        case ts.SyntaxKind.ObjectLiteralExpression:
        case ts.SyntaxKind.ArrayLiteralExpression:
            return true;

        default:
            return false;
    }
}
