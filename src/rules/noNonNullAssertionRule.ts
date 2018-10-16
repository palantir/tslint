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
        ruleName: "no-non-null-assertion",
        description: "Disallows non-null assertions using the `!` postfix operator.",
        rationale: Lint.Utils.dedent`
            Using non-null assertion cancels the benefits of the strict null checking mode.

            Instead of assuming objects exist:

            \`\`\`
            function foo(instance: MyClass | undefined) {
                instance!.doWork();
            }
            \`\`\`

            Either inform the strict type system that the object must exist:

            \`\`\`
            function foo(instance: MyClass) {
                instance.doWork();
            }
            \`\`\`

            Or verify that the instance exists, which will inform the type checker:

            \`\`\`
            function foo(instance: MyClass | undefined) {
                if (instance !== undefined) {
                    instance.doWork();
                }
            }
            \`\`\`
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Forbidden non null assertion";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (node.kind === ts.SyntaxKind.NonNullExpression) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
