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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys max-line-length */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ban-comma-operator",
        description: "Disallows the comma operator to be used.",
        descriptionDetails:
            "[Read more about the comma operator here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator).",
        rationale: Lint.Utils.dedent`
            Using the comma operator can create a potential for many non-obvious bugs or lead to misunderstanding of code.

            ### Examples
            \`\`\`
            foo((bar, baz)); // evaluates to 'foo(baz)' because of the extra parens - confusing and not obvious
            \`\`\`

            \`\`\`
            switch (foo) {
                case 1, 2: // equals 'case 2' - probably intended 'case 1: case2:'
                    return true;
                case 3:
                    return false;
            }
            \`\`\`

            \`\`\`
            let x = (y = 1, z = 2); // x is equal to 2 - this may not be immediately obvious.
            \`\`\`
        `,
        options: null,
        optionsDescription: "",
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys max-line-length */

    public static FAILURE_STRING =
        "Do not use comma operator here because it can be easily misunderstood or lead to unintended bugs.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            isBinaryExpression(node) &&
            node.operatorToken.kind === ts.SyntaxKind.CommaToken &&
            !isForLoopIncrementor(node)
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}

function isForLoopIncrementor(node: ts.Node) {
    const parent = node.parent;
    return (
        parent.kind === ts.SyntaxKind.ForStatement &&
        (parent as ts.ForStatement).incrementor === node
    );
}
