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

import { isArrayTypeNode, isParameterDeclaration } from "tsutils";
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
            If \`"${OPTION_IGNORE_REST_ARGS}": true\` is provided rest arguments will be ignored.
        `,
        options: {
            type: "object",
            properties: {
                [OPTION_IGNORE_REST_ARGS]: { type: "boolean" },
            },
        },
        optionExamples: [true, [true, { [OPTION_IGNORE_REST_ARGS]: true }]],
        type: "typescript",
        typescriptOnly: true,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Type declaration of 'any' loses type-safety. Consider replacing it with a more precise type.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options: Options = getOptions(this.ruleArguments[0] as Partial<Options> | undefined);
        return this.applyWithFunction(sourceFile, walk, options);
    }
}

interface Options {
    [OPTION_IGNORE_REST_ARGS]: boolean;
}

function getOptions(options: Partial<Options> | undefined): Options {
    return {
        [OPTION_IGNORE_REST_ARGS]: false,
        ...options,
    };
}

function walk(ctx: Lint.WalkContext<Options>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            if (ctx.options[OPTION_IGNORE_REST_ARGS] && isRestParameterArrayType(node)) {
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
        isArrayTypeNode(anyTypeNode.parent) &&
        isParameterDeclaration(anyTypeNode.parent.parent) &&
        anyTypeNode.parent.parent.getChildAt(0).kind === ts.SyntaxKind.DotDotDotToken
    );
}
