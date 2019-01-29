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

import { isCallExpression, isIdentifier, isPropertyAccessExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/radix.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "radix",
        description: "Requires the radix parameter to be specified when calling `parseInt`.",
        rationale: Lint.Utils.dedent`
            From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt):
            > Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior.
            > Different implementations produce different results when a radix is not specified, usually defaulting the value to 10.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Missing radix parameter";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function isParseInt(expression: ts.LeftHandSideExpression) {
    return isIdentifier(expression) && expression.text === "parseInt";
}

function isPropertyAccessParseInt(
    expression: ts.LeftHandSideExpression,
): expression is ts.PropertyAccessExpression {
    return isPropertyAccessExpression(expression) && expression.name.text === "parseInt";
}

function isPropertyAccessOfIdentifier(
    expression: ts.LeftHandSideExpression,
    identifers: string[],
): expression is ts.PropertyAccessExpression {
    return (
        isPropertyAccessExpression(expression) &&
        isIdentifier(expression.expression) &&
        identifers.some(identifer => (expression.expression as ts.Identifier).text === identifer)
    );
}

function isPropertyAccessOfProperty(
    expression: ts.LeftHandSideExpression,
    identifers: string[],
): expression is ts.PropertyAccessExpression {
    return (
        isPropertyAccessExpression(expression) &&
        isPropertyAccessExpression(expression.expression) &&
        identifers.some(
            identifer =>
                (expression.expression as ts.PropertyAccessExpression).name.text === identifer,
        )
    );
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            isCallExpression(node) &&
            node.arguments.length === 1 &&
            // parseInt("123")
            (isParseInt(node.expression) ||
                // window.parseInt("123") || global.parseInt("123") || Number.parseInt("123")
                (isPropertyAccessParseInt(node.expression) &&
                    isPropertyAccessOfIdentifier(node.expression, [
                        "global",
                        "window",
                        "Number",
                    ])) ||
                // window.Number.parseInt("123") || global.Number.parseInt("123")
                (isPropertyAccessParseInt(node.expression) &&
                    isPropertyAccessOfProperty(node.expression, ["Number"]) &&
                    isPropertyAccessOfIdentifier(node.expression.expression, ["global", "window"])))
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
