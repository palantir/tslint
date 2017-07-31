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

import { isAwaitExpression, isUnionOrIntersectionType } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "await-promise",
        description: "Warns for an awaited value that is not a Promise.",
        optionsDescription: Lint.Utils.dedent`
            A list of 'string' names of any additional classes that should also be handled as Promises.
        `,
        options: {
            type: "list",
            listType: {
                type: "array",
                items: {type: "string"},
            },
        },
        optionExamples: [true, [true, "Thenable"]],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "'await' of non-Promise.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const promiseTypes = new Set(["Promise", ...this.ruleArguments as string[]]);
        const tc = program.getTypeChecker();
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, tc, promiseTypes));
    }
}

function walk(ctx: Lint.WalkContext<void>, tc: ts.TypeChecker, promiseTypes: Set<string>) {
    return ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): void {
        if (isAwaitExpression(node) && !couldBePromise(tc.getTypeAtLocation(node.expression))) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    }

    function couldBePromise(type: ts.Type): boolean {
        if (Lint.isTypeFlagSet(type, ts.TypeFlags.Any) || isPromiseType(type)) {
            return true;
        }

        if (isUnionOrIntersectionType(type)) {
            return type.types.some(couldBePromise);
        }

        const bases = type.getBaseTypes();
        return bases !== undefined && bases.some(couldBePromise);
    }

    function isPromiseType(type: ts.Type): boolean {
        const { target } = type as ts.TypeReference;
        return target !== undefined && target.symbol !== undefined && promiseTypes.has(target.symbol.name);
    }
}
