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

import {
    isAwaitExpression,
    isForOfStatement,
    isTypeFlagSet,
    isTypeReference,
    isUnionOrIntersectionType,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "await-promise",
        description: "Warns for an awaited value that is not a Promise.",
        optionsDescription: Lint.Utils.dedent`
            A list of 'string' names of any additional classes that should also be treated as Promises.
            For example, if you are using a class called 'Future' that implements the Thenable interface,
            you might tell the rule to consider type references with the name 'Future' as valid Promise-like
            types. Note that this rule doesn't check for type assignability or compatibility; it just checks
            type reference names.
        `,
        options: {
            type: "list",
            listType: {
                type: "array",
                items: { type: "string" },
            },
        },
        optionExamples: [true, [true, "Thenable"]],
        rationale: Lint.Utils.dedent`
            While it is valid JavaScript to await a non-Promise-like value (it will resolve immediately),
            this pattern is often a programmer error and the resulting semantics can be unintuitive.

            Awaiting non-Promise-like values often is an indication of programmer error, such as
            forgetting to add parenthesis to call a function that returns a Promise.
        `,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Invalid 'await' of a non-Promise value.";
    public static FAILURE_FOR_AWAIT_OF = "Invalid 'for-await-of' of a non-AsyncIterable value.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const promiseTypes = new Set(["Promise", ...(this.ruleArguments as string[])]);
        return this.applyWithFunction(sourceFile, walk, promiseTypes, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<Set<string>>, tc: ts.TypeChecker) {
    const promiseTypes = ctx.options;
    return ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): void {
        if (
            isAwaitExpression(node) &&
            !containsType(tc.getTypeAtLocation(node.expression), isPromiseType)
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        } else if (
            isForOfStatement(node) &&
            node.awaitModifier !== undefined &&
            !containsType(tc.getTypeAtLocation(node.expression), isAsyncIterable)
        ) {
            ctx.addFailureAtNode(node.expression, Rule.FAILURE_FOR_AWAIT_OF);
        }
        return ts.forEachChild(node, cb);
    }

    function isPromiseType(name: string) {
        return promiseTypes.has(name);
    }
}

function containsType(type: ts.Type, predicate: (name: string) => boolean): boolean {
    if (isTypeFlagSet(type, ts.TypeFlags.Any)) {
        return true;
    }
    if (isTypeReference(type)) {
        type = type.target;
    }
    if (type.symbol !== undefined && predicate(type.symbol.name)) {
        return true;
    }
    if (isUnionOrIntersectionType(type)) {
        return type.types.some(t => containsType(t, predicate));
    }
    const bases = type.getBaseTypes();
    return bases !== undefined && bases.some(t => containsType(t, predicate));
}

function isAsyncIterable(name: string) {
    return name === "AsyncIterable" || name === "AsyncIterableIterator";
}
