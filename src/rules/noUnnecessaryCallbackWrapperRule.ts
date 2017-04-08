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

import { hasModifier, isArrowFunction, isCallExpression, isElementAccessExpression, isIdentifier,
    isPropertyAccessExpression, isSpreadElement } from "tsutils";
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

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        const call = detectUnnecessaryCallback(node);
        if (call !== undefined) {
            const start = node.getStart(sourceFile);
            ctx.addFailure(start, node.end, Rule.FAILURE_STRING(call.expression.getText()), [
                Lint.Replacement.deleteFromTo(start, call.getStart(sourceFile)),
                Lint.Replacement.deleteFromTo(call.expression.end, node.end),
            ]);
        } else {
            return ts.forEachChild(node, cb);
        }
    });
}

function detectUnnecessaryCallback(node: ts.Node): ts.CallExpression | undefined {
    if (isArrowFunction(node) && !hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword)) {
        const { parameters, body } = node;
        if (isCallExpression(body)) {
            const { expression, arguments: args } = body;
            if (isRedundantCallback(parameters, args) && shouldFailOnCalledExpression(parameters, expression)) {
                return body;
            }
        }
    }
    return undefined;
}

/**
 * False if there may be a 'this' binding or if a parameter is used in the called function itself.
 * I.e., rejects `x => obj.f(x)` or `x => f(x)(x)`.
 */
function shouldFailOnCalledExpression(parameters: ReadonlyArray<{ name: ts.Identifier }>, expression: ts.Expression): boolean {
    const parametersSet = new Set(parameters.map((p) => p.name.text));
    return !isPropertyAccessExpression(expression) && !isElementAccessExpression(expression) && !usesParameter(expression);
    function usesParameter(expr: ts.Expression): boolean {
        if (isIdentifier(expr)) {
            return parametersSet.has(expr.text);
        }
        if (isPropertyAccessExpression(expr)) {
            // Ignore rhs, that does not refer to the parameter.
            return usesParameter(expr.expression);
        }
        return ts.forEachChild(expr, usesParameter);
    }
}

/** Detects that parameters and arguments are identical identifiers. */
function isRedundantCallback(
        parameters: ReadonlyArray<ts.ParameterDeclaration>,
        args: ReadonlyArray<ts.Node>,
        ): parameters is ReadonlyArray<ts.ParameterDeclaration & { name: ts.Identifier }> {
    return parameters.length === args.length && parameters.every(({ dotDotDotToken, name }, i) => {
        let arg = args[i];
        if (dotDotDotToken !== undefined) {
            if (!isSpreadElement(arg)) {
                return false;
            }
            arg = arg.expression;
        }
        return isIdentifier(name) && isIdentifier(arg) && name.text === arg.text;
    });
}
