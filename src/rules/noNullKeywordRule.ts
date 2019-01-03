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

// with due reference to https://github.com/Microsoft/TypeScript/blob/7813121c4d77e50aad0eed3152ef1f1156c7b574/scripts/tslint/noNullRule.ts

import { isBinaryExpression, isTypeNodeKind } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-null-keyword",
        description: "Disallows use of the `null` keyword literal.",
        rationale: Lint.Utils.dedent`
            Instead of having the dual concepts of \`null\` and\`undefined\` in a codebase,
            this rule ensures that only \`undefined\` is used.

            JavaScript originally intended \`undefined\` to refer to a value that doesn't yet exist,
            while \`null\` was meant to refer to a value that does exist but points to nothing.
            That's confusing.
            \`undefined\` is the default value when object members don't exist, and is the return value
            for newer native collection APIs such as \`Map.get\` when collection values don't exist.

            \`\`\`
            const myObject = {};
            myObject.doesNotExist; // undefined
            \`\`\`

            \`\`\`
            const myMap = new Map<string, number>();
            myMap.get("doesNotExist"); // undefined
            \`\`\`

            To remove confusion over the two similar values, it's better to stick with just \`undefined\`.
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use 'undefined' instead of 'null'";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, cb);
    function cb(node: ts.Node): void {
        if (isTypeNodeKind(node.kind)) {
            return; // skip type nodes
        }
        if (node.kind !== ts.SyntaxKind.NullKeyword) {
            return ts.forEachChild(node, cb);
        }
        const parent = node.parent;
        let eq: Lint.EqualsKind | undefined;
        if (isBinaryExpression(parent)) {
            eq = Lint.getEqualsKind(parent.operatorToken);
        }
        if (eq === undefined) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        } else if (!eq.isStrict) {
            ctx.addFailureAtNode(
                node,
                Rule.FAILURE_STRING,
                Lint.Replacement.replaceNode(node, "undefined", ctx.sourceFile),
            );
        }
    }
}
