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

import { isBinaryExpression, isTypeAssertion } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-angle-bracket-type-assertion",
        description: "Requires the use of `as Type` for type assertions instead of `<Type>`.",
        hasFix: true,
        rationale: Lint.Utils.dedent`
            Both formats of type assertions have the same effect, but only \`as\` type assertions
            work in \`.tsx\` files. This rule ensures that you have a consistent type assertion style
            across your codebase.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Type assertion using the '<>' syntax is forbidden. Use the 'as' syntax instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isTypeAssertion(node)) {
            let { expression } = node;
            const start = node.getStart(ctx.sourceFile);
            const addParens = needsParens(node);
            let replaceText = ` as ${node.type.getText(ctx.sourceFile)}${addParens ? ")" : ""}`;
            while (isTypeAssertion(expression)) {
                replaceText = ` as ${expression.type.getText(ctx.sourceFile)}${replaceText}`;
                expression = expression.expression;
            }
            ctx.addFailure(start, node.end, Rule.FAILURE_STRING, [
                Lint.Replacement.appendText(node.end, replaceText),
                Lint.Replacement.replaceFromTo(
                    start,
                    expression.getStart(ctx.sourceFile),
                    addParens ? "(" : "",
                ),
            ]);
            return cb(expression);
        }
        return ts.forEachChild(node, cb);
    });
}

function needsParens(node: ts.TypeAssertion): boolean {
    const parent = node.parent;
    return (
        isBinaryExpression(parent) &&
        (parent.operatorToken.kind === ts.SyntaxKind.AmpersandToken ||
            parent.operatorToken.kind === ts.SyntaxKind.BarToken)
    );
}
