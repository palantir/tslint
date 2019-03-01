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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/noSparseArrays.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-sparse-arrays",
        description: "Forbids array literals to contain missing elements.",
        rationale: "Missing elements are probably an accidentally duplicated comma.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Array has a missing element.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (!utils.isArrayLiteralExpression(node)) {
            if (
                utils.isBinaryExpression(node) &&
                node.operatorToken.kind === ts.SyntaxKind.EqualsToken
            ) {
                // Ignore LHS of assignments.
                traverseExpressionsInLHS(node.left, cb);
                return cb(node.right);
            } else {
                return ts.forEachChild(node, cb);
            }
        }

        for (const element of node.elements) {
            if (utils.isOmittedExpression(element)) {
                // Node has an empty range, so just use range starting at `element.pos`.
                ctx.addFailureAt(element.pos, 1, Rule.FAILURE_STRING);
            } else {
                ts.forEachChild(element, cb);
            }
        }
    });
}

/** Traverse the LHS of an `=` expression, calling `cb` embedded default value, but ignoring binding patterns. */
function traverseExpressionsInLHS(node: ts.Node, cb: (node: ts.Expression) => void): void {
    switch (node.kind) {
        case ts.SyntaxKind.ParenthesizedExpression:
            traverseExpressionsInLHS((node as ts.ParenthesizedExpression).expression, cb);
            break;

        case ts.SyntaxKind.ArrayLiteralExpression:
            for (const e of (node as ts.ArrayLiteralExpression).elements) {
                traverseExpressionsInLHS(e, cb);
            }
            break;

        case ts.SyntaxKind.ObjectLiteralExpression:
            for (const o of (node as ts.ObjectLiteralExpression).properties) {
                traverseExpressionsInLHS(o, cb);
            }
            break;

        case ts.SyntaxKind.BinaryExpression: {
            const { left, operatorToken, right } = node as ts.BinaryExpression;
            if (operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                traverseExpressionsInLHS(left, cb);
                cb(right);
            }
        }
    }
}
