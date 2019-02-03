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

import { isTryStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isFunctionScopeBoundary } from "../utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-return-await",
        description: "Disallows unnecessary `return await`.",
        rationale: Lint.Utils.dedent`
            An async function always wraps the return value in a Promise.
            Using \`return await\` just adds extra time before the overreaching promise is resolved without changing the semantics.
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unnecessary 'await'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (node.kind === ts.SyntaxKind.AwaitExpression && isUnnecessaryAwait(node)) {
            const { expression } = node as ts.AwaitExpression;
            const keywordStart = expression.pos - "await".length;
            ctx.addFailure(
                keywordStart,
                expression.pos,
                Rule.FAILURE_STRING,
                Lint.Replacement.deleteFromTo(keywordStart, expression.getStart(ctx.sourceFile)),
            );
        }
        return ts.forEachChild(node, cb);
    });
}

function isUnnecessaryAwait(node: ts.Node): boolean {
    while (true) {
        const parent = node.parent;
        outer: switch (parent.kind) {
            case ts.SyntaxKind.ArrowFunction:
                return true;
            case ts.SyntaxKind.ReturnStatement:
                return !isInsideTryBlock(parent.parent);
            case ts.SyntaxKind.ParenthesizedExpression:
                break;
            case ts.SyntaxKind.ConditionalExpression:
                if ((parent as ts.ConditionalExpression).condition === node) {
                    return false;
                }
                break;
            case ts.SyntaxKind.BinaryExpression:
                if ((parent as ts.BinaryExpression).right === node) {
                    switch ((parent as ts.BinaryExpression).operatorToken.kind) {
                        case ts.SyntaxKind.AmpersandAmpersandToken:
                        case ts.SyntaxKind.BarBarToken:
                        case ts.SyntaxKind.CommaToken:
                            break outer;
                    }
                }
                return false;
            default:
                return false;
        }
        node = parent;
    }
}

function isInsideTryBlock(node: ts.Node): boolean {
    while (node.parent !== undefined) {
        // tslint:disable:deprecation This is needed for https://github.com/palantir/tslint/pull/4274 and will be fixed once TSLint
        // requires tsutils > 3.0.
        if (isFunctionScopeBoundary(node)) {
            // tslint:enable:deprecation
            return false;
        }
        if (isTryStatement(node.parent)) {
            if (
                // statements inside the try block always have an error handler, either catch or finally
                node.parent.tryBlock === node ||
                // statement inside the catch block only have an error handler if there is a finally block
                (node.parent.finallyBlock !== undefined && node.parent.catchClause === node)
            ) {
                return true;
            }
            node = node.parent.parent;
        } else {
            node = node.parent;
        }
    }
    return false;
}
