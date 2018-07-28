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

import { isArrayLiteralExpression, isObjectLiteralExpression, isPropertyAssignment } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-contextual-type",
        description: "Requires that every object literal has a contextual type.",
        rationale: Lint.Utils.dedent`
            An object literal with no type does not have excess properties checked.

            For example:

                interface I { x: number; }
                function f(): I {
                    const res = { x: 0, y: 0 };
                    return res;
                }

            This has no compile error, but an excess property \`y\`.
            The excess property can be detected by writing a type annotation \`const res: I = { x: 0, y: 0 };\`.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Object literal has no contextual type.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, program.getTypeChecker()));
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (isObjectLiteralExpression(node)) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });

    function check(node: ts.ObjectLiteralExpression): void {
        // Allow `{}`, because obviously it does not have excess properties.
        if (node.properties.length === 0) {
            return;
        }

        // Allow an object literal inside another object literal or array literal (recursively) typed as 'any'.
        // Normally the nested objects will not have a contextual type, so must traverse upwards to look for it.
        let contextualNode: ts.Expression = node;

        do {
            if (checker.getContextualType(contextualNode) !== undefined) {
                return;
            }

            const parent = contextualNode.parent!;
            if (isPropertyAssignment(parent)) {
                contextualNode = parent.parent;
            } else if (isArrayLiteralExpression(parent)) {
                contextualNode = parent;
            } else {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
                return;
            }
        } while (true);
    }
}
