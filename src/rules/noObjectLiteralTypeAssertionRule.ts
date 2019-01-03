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

import {
    isAssertionExpression,
    isObjectLiteralExpression,
    isParenthesizedExpression,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-object-literal-type-assertion",
        description: Lint.Utils.dedent`
            Forbids an object literal to appear in a type assertion expression.
            Casting to \`any\` or to \`unknown\` is still allowed.`,
        rationale: Lint.Utils.dedent`
            Always prefer \`const x: T = { ... };\` to \`const x = { ... } as T;\`.
            The type assertion in the latter case is either unnecessary or hides an error.
            The compiler will warn for excess properties with this syntax, but not missing required fields.
            For example: \`const x: { foo: number } = {}\` will fail to compile, but
            \`const x = {} as { foo: number }\` will succeed.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Type assertion on object literals is forbidden, use a type annotation instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            isAssertionExpression(node) &&
            node.type.kind !== ts.SyntaxKind.AnyKeyword &&
            // Compare with UnknownKeyword if using TS 3.0 or above
            (!!(ts.SyntaxKind as any).UnknownKeyword
                ? node.type.kind !== (ts.SyntaxKind as any).UnknownKeyword
                : node.type.getText(ctx.sourceFile) !== "unknown") &&
            isObjectLiteralExpression(
                isParenthesizedExpression(node.expression)
                    ? node.expression.expression
                    : node.expression,
            )
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
