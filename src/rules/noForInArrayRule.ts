/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-for-in-array",
        description: "Disallows iterating over an array with a for-in loop.",
        descriptionDetails: Lint.Utils.dedent`
            A for-in loop (\`for (var k in o)\`) iterates over the properties of an Object.

            While it is legal to use for-in loops with array types, it is not common.
            for-in will iterate over the indices of the array as strings, omitting any "holes" in
            the array.

            More common is to use for-of, which iterates over the values of an array.
            If you want to iterate over the indices, alternatives include:

            array.forEach((value, index) => { ... });
            for (const [index, value] of array.entries()) { ... }
            for (let i = 0; i < array.length; i++) { ... }
            `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        requiresTypeInfo: true,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "for-in loops over arrays are forbidden. Use for-of or array.forEach instead.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.ForInStatement) {
            const type = checker.getTypeAtLocation((node as ts.ForInStatement).expression);
            if (
                (type.symbol !== undefined && type.symbol.name === "Array") ||
                // tslint:disable-next-line:no-bitwise
                (type.flags & ts.TypeFlags.StringLike) !== 0
            ) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
