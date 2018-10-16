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

import { isCallExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-eval",
        description: "Disallows `eval` function invocations.",
        rationale: Lint.Utils.dedent`
            \`eval()\` is dangerous as it allows arbitrary code execution with full privileges. There are
            [alternatives](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
            for most of the use cases for \`eval()\`.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "forbidden eval";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.Identifier &&
            (node.expression as ts.Identifier).text === "eval"
        ) {
            ctx.addFailureAtNode(node.expression, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
