/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import { hasModifier } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "promise-function-async",
        description: "Requires any function or method that returns a promise to be marked async.",
        rationale: Lint.Utils.dedent`
            Ensures that each function is only capable of 1) returning a rejected promise, or 2)
            throwing an Error object. In contrast, non-\`async\` \`Promise\`-returning functions
            are technically capable of either. This practice removes a requirement for consuming
            code to handle both cases.
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "functions that return promises must be async";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, tc: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        switch (node.kind) {
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
                if ((node as ts.FunctionLikeDeclaration).body === undefined) {
                    break;
                }
                // falls through
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ArrowFunction:
                if (!hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword) && returnsPromise(node as ts.FunctionLikeDeclaration, tc)) {
                    ctx.addFailure(node.getStart(ctx.sourceFile), (node as ts.FunctionLikeDeclaration).body!.pos, Rule.FAILURE_STRING);
                }
        }
        return ts.forEachChild(node, cb);
    });
}

function returnsPromise(node: ts.FunctionLikeDeclaration, tc: ts.TypeChecker): boolean {
    const type = tc.getReturnTypeOfSignature(tc.getTypeAtLocation(node).getCallSignatures()[0]);
    return type.symbol !== undefined && type.symbol.name === "Promise";
}
