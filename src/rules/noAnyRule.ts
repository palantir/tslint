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

import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/noAny.examples";

const OPTION_IGNORE_REST_ARGS = "ignore-rest-args";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-any",
        description: "Disallows usages of `any` as a type declaration.",
        hasFix: false,
        rationale: Lint.Utils.dedent`
            Using \`any\` as a type declaration nullifies the compile-time benefits of the type system.

            If you're dealing with data of unknown or "any" types, you shouldn't be accessing members of it.
            Either add type annotations for properties that may exist or change the data type to the empty object type \`{}\`.

            Alternately, if you're creating storage or handling for consistent but unknown types, such as in data structures
            or serialization, use \`<T>\` template types for generic type handling.

            Also see the \`no-unsafe-any\` rule.
        `,
        optionsDescription: Lint.Utils.dedent`
            If \`"${OPTION_IGNORE_REST_ARGS}"\` is provided rest arguments will be ignored.
        `,
        options: {
            type: "string",
            enum: [OPTION_IGNORE_REST_ARGS],
        },
        optionExamples: [true, [true, OPTION_IGNORE_REST_ARGS]],
        type: "typescript",
        typescriptOnly: true,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Type declaration of 'any' loses type-safety. Consider replacing it with a more precise type.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options: Options = {
            ignoreRestArguments: this.ruleArguments.indexOf(OPTION_IGNORE_REST_ARGS) >= 0,
        };

        return this.applyWithFunction(sourceFile, walk, options);
    }
}

interface Options {
    ignoreRestArguments: boolean;
}

function walk(ctx: Lint.WalkContext<Options>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            if (ctx.options.ignoreRestArguments && isRestParameterArrayType(node)) {
                return;
            }

            const start = node.end - 3;
            return ctx.addFailure(start, node.end, Rule.FAILURE_STRING);
        }

        return ts.forEachChild(node, cb);
    });
}

function isRestParameterArrayType(anyTypeNode: ts.Node) {
    return (
        anyTypeNode.parent.kind === ts.SyntaxKind.ArrayType &&
        anyTypeNode.parent.parent.kind === ts.SyntaxKind.Parameter &&
        anyTypeNode.parent.parent.getChildAt(0).kind === ts.SyntaxKind.DotDotDotToken
    );
}
