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
    hasModifier,
    isArrowFunction,
    isCallExpression,
    isIdentifier,
    isSpreadElement,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/noUnnecessaryCallbackWrapper.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-callback-wrapper",
        description: Lint.Utils.dedent`
            Replaces \`x => f(x)\` with just \`f\`.
            To catch more cases, enable \`only-arrow-functions\` and \`arrow-return-shorthand\` too.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            There's generally no reason to wrap a function with a callback wrapper if it's directly called anyway.
            Doing so creates extra inline lambdas that slow the runtime down.
        `,
        type: "style",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(cbText: string): string {
        return `No need to wrap '${cbText}' in another function. Just use it directly.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, cb);
    function cb(node: ts.Node): void {
        if (
            isArrowFunction(node) &&
            !hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword) &&
            isCallExpression(node.body) &&
            isIdentifier(node.body.expression) &&
            isRedundantCallback(node.parameters, node.body.arguments, node.body.expression)
        ) {
            const start = node.getStart(ctx.sourceFile);
            ctx.addFailure(start, node.end, Rule.FAILURE_STRING(node.body.expression.text), [
                Lint.Replacement.deleteFromTo(start, node.body.getStart(ctx.sourceFile)),
                Lint.Replacement.deleteFromTo(node.body.expression.end, node.end),
            ]);
        } else {
            return ts.forEachChild(node, cb);
        }
    }
}

function isRedundantCallback(
    parameters: ts.NodeArray<ts.ParameterDeclaration>,
    args: ts.NodeArray<ts.Node>,
    expression: ts.Identifier,
): boolean {
    if (parameters.length !== args.length) {
        return false;
    }
    for (let i = 0; i < parameters.length; ++i) {
        const { dotDotDotToken, name } = parameters[i];
        let arg = args[i];
        if (dotDotDotToken !== undefined) {
            if (!isSpreadElement(arg)) {
                return false;
            }
            arg = arg.expression;
        }
        if (
            !isIdentifier(name) ||
            !isIdentifier(arg) ||
            name.text !== arg.text ||
            // If the invoked expression is one of the parameters, bail.
            expression.text === name.text
        ) {
            return false;
        }
    }
    return true;
}
