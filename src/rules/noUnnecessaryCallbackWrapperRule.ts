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

import { isArrowFunction, isCallExpression, isIdentifier, isSpreadElement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-callback-wrapper",
        description: Lint.Utils.dedent`
            Replaces \`x => f(x)\` with just \`f\`.
            To catch more cases, enable \`only-arrow-functions\` and \`arrow-return-shorthand\` too.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
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
        const fn = detectRedundantCallback(node);
        if (fn) {
            const fix = [
                Lint.Replacement.deleteFromTo(node.getStart(), fn.getStart()),
                Lint.Replacement.deleteFromTo(fn.getEnd(), node.getEnd()),
            ];
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING(fn.getText()), fix);
        } else {
            return ts.forEachChild(node, cb);
        }
    }

}

// Returns the `f` in `x => f(x)`.
function detectRedundantCallback(node: ts.Node): ts.Expression | undefined {
    if (!isArrowFunction(node)) {
        return undefined;
    }

    const { body, parameters } = node;
    if (!isCallExpression(body)) {
        return undefined;
    }

    const { arguments: args, expression } = body;

    if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
        // Allow `x => obj.f(x)`
        return undefined;
    }

    const argumentsSameAsParameters = parameters.length === args.length && parameters.every(({dotDotDotToken, name}, i) => {
        let arg = args[i];
        if (dotDotDotToken) {
            // Use SpreadElementExpression for ts2.0 compatibility
            if (!(isSpreadElement(arg) || arg.kind === (ts.SyntaxKind as any).SpreadElementExpression)) {
                return false;
            }
            arg = (arg as ts.SpreadElement).expression;
        }

        return isIdentifier(name) && isIdentifier(arg) && name.text === arg.text;
    });

    return argumentsSameAsParameters ? expression : undefined;
}
