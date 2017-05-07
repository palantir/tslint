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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-object-literal-type-assertion",
        description: Lint.Utils.dedent`
            Forbids an object literal to appear in a type assertion expression.
            Casting to \`any\` is still allowed.`,
        rationale: Lint.Utils.dedent`
            Always prefer \`const x: T = { ... };\` to \`const x = { ... } as T;\`.
            The type assertion in the latter case is either unnecessary or hides an error.
            \`const x: { foo: number } = {}\` will fail, but \`const x = {} as { foo: number }\` succeeds.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Type assertion applied to object literal.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isTypeAssertionLike(node) && isObjectLiteral(node.expression) && node.type.kind !== ts.SyntaxKind.AnyKeyword) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}

function isTypeAssertionLike(node: ts.Node): node is ts.TypeAssertion | ts.AsExpression {
    switch (node.kind) {
        case ts.SyntaxKind.TypeAssertionExpression:
        case ts.SyntaxKind.AsExpression:
            return true;
        default:
            return false;
    }
}

function isObjectLiteral(node: ts.Expression): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.ParenthesizedExpression:
            return isObjectLiteral((node as ts.ParenthesizedExpression).expression);
        case ts.SyntaxKind.ObjectLiteralExpression:
            return true;
        default:
            return false;
    }
}
