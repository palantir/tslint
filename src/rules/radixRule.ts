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
        codeExamples: [
            {
                description: "Requires the radix parameter to be specified when calling `parseInt`.",
                config: Lint.Utils.dedent`
                    "rules": { "radix": true }
                `,
                pass: Lint.Utils.dedent`
                    const x: string = '11';
                    const dec: number = parseInt(x, 10);
                    const bin: number = parseInt(x, 2);
                    const hex: number = parseInt(x, 16);
                `,
                fail: Lint.Utils.dedent`
                    const x: string = '11';
                    const dec: number = parseInt(x);
                    const bin: number = parseInt(x, 2);
                    const hex: number = parseInt(x, 16);
                `,
            },
        ],
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Missing radix parameter";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isCallExpression(node) && node.arguments.length === 1 &&
            (
                // parseInt("123")
                isIdentifier(node.expression) && node.expression.text === "parseInt" ||
                // window.parseInt("123") || global.parseInt("123")
                isPropertyAccessExpression(node.expression) &&
                node.expression.name.text === "parseInt" &&
                isIdentifier(node.expression.expression) &&
                (
                    node.expression.expression.text === "global" ||
                    node.expression.expression.text === "window"
                )
            )) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
