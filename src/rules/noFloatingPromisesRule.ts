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

import { isCallExpression, isExpressionStatement, isPropertyAccessExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-floating-promises",
        description: "Promises returned by functions must be handled appropriately.",
        descriptionDetails: "Use `no-unused-expression` in addition to this rule to reveal even more floating promises.",
        optionsDescription: Lint.Utils.dedent`
            A list of \'string\' names of any additional classes that should also be handled as Promises.
        `,
        options: {
            type: "list",
            listType: {
                type: "array",
                items: {type: "string"},
            },
        },
        optionExamples: [true, [true, "JQueryPromise"]],
        rationale: "Unhandled Promises can cause unexpected behavior, such as resolving at unexpected times.",
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Promises must be handled appropriately";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            (ctx: Lint.WalkContext<string[]>) => walk(ctx, program.getTypeChecker()),
            ["Promise", ...this.ruleArguments as string[]],
        );
    }
}

function walk(ctx: Lint.WalkContext<string[]>, tc: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isExpressionStatement(node)) {
            const { expression } = node;
            if (isCallExpression(expression) &&
                !isPromiseCatchCall(expression) &&
                !isPromiseThenCallWithRejectionHandler(expression)) {
                const { symbol } = tc.getTypeAtLocation(expression);
                if (symbol !== undefined && ctx.options.indexOf(symbol.name) !== -1) {
                    ctx.addFailureAtNode(expression, Rule.FAILURE_STRING);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function isPromiseCatchCall(expression: ts.CallExpression): boolean {
    return isPropertyAccessExpression(expression.expression) && expression.expression.name.text === "catch";
}

function isPromiseThenCallWithRejectionHandler(expression: ts.CallExpression): boolean {
    return isPropertyAccessExpression(expression.expression) &&
        expression.expression.name.text === "then" &&
        expression.arguments.length >= 2;
}
