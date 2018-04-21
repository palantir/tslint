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

import { isThrowStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-string-throw",
        description: "Flags throwing plain strings or concatenations of strings.",
        hasFix: true,
        options: null,
        optionExamples: [true],
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent`
            Only Error objects contain a \`.stack\` member equivalent to the current stack trace.
            Primitives such as strings do not.
        `,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
            "Throwing plain strings (not instances of Error) gives no stack traces";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isThrowStatement(node)) {
            const { expression } = node;
            if (isString(expression)) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING, [
                    Lint.Replacement.appendText(expression.getStart(sourceFile), "new Error("),
                    Lint.Replacement.appendText(expression.getEnd(), ")"),
                ]);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function isString(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.TemplateExpression:
            return true;
        case ts.SyntaxKind.BinaryExpression: {
            const { operatorToken, left, right } = node as ts.BinaryExpression;
            return operatorToken.kind === ts.SyntaxKind.PlusToken && (isString(left) || isString(right));
        }
        case ts.SyntaxKind.ParenthesizedExpression:
            return isString((node as ts.ParenthesizedExpression).expression);
        default:
            return false;
    }
}
