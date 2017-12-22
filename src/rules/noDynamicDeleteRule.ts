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

import * as tsutils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Enforces not deleting computed expressions.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: "Deleting dynamically computed keys is dangerous and not well optimized.",
        ruleName: "no-dynamic-delete",
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "Do not delete dynamically computed property keys.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(context: Lint.WalkContext<void>) {
    function checkDeleteAccessExpression(node: ts.Expression | undefined): void {
        if (node === undefined || !ts.isElementAccessExpression(node)) {
            return;
        }

        const { argumentExpression } = node;
        if (argumentExpression === undefined || isNecessaryDynamicAccess(argumentExpression)) {
            return;
        }

        const start = argumentExpression.getStart(context.sourceFile) - 1;
        const width = argumentExpression.getWidth() + 2;
        let fix: Lint.Replacement | undefined;

        if (ts.isPrefixUnaryExpression(argumentExpression)) {
            const convertedOperand = convertUnaryOperand(argumentExpression);
            if (convertedOperand !== undefined) {
                fix = Lint.Replacement.replaceFromTo(start, start + width, `[${convertedOperand}]`);
            }
        } else if (ts.isStringLiteral(argumentExpression)) {
            fix = Lint.Replacement.replaceFromTo(start, start + width, `.${argumentExpression.text}`);
        }

        context.addFailureAt(start, width, Rule.FAILURE_STRING, fix);
    }

    return ts.forEachChild(context.sourceFile, function callback(node: ts.Node): void {
        if (ts.isDeleteExpression(node)) {
            checkDeleteAccessExpression(node.expression);
        }

        return ts.forEachChild(node, callback);
    });
}

function convertUnaryOperand(node: ts.PrefixUnaryExpression) {
    return ts.isNumericLiteral(node.operand)
        ? node.operand.text
        : undefined;
}

function isNumberLike(node: ts.Node): boolean {
    if (ts.isPrefixUnaryExpression(node)) {
        return ts.isNumericLiteral(node.operand) && node.operator === ts.SyntaxKind.MinusToken;
    }

    return ts.isNumericLiteral(node);
}

function isNecessaryDynamicAccess(argumentExpression: ts.Expression): boolean {
    if (isNumberLike(argumentExpression)) {
        return true;
    }

    return ts.isStringLiteral(argumentExpression) && !tsutils.isValidPropertyAccess(argumentExpression.text);
}
