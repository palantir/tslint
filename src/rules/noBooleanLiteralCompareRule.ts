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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-boolean-literal-compare",
        description: "Warns on comparison to a boolean literal, as in `x === true`.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Comparing boolean values to boolean literals is unnecessary, as those expressions will result in booleans too.
            Just use the boolean values directly or negate them.
        `,
        type: "style",
        typescriptOnly: true,
        requiresTypeInfo: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(negate: boolean) {
        return `This expression is unnecessarily compared to a boolean. Just ${
            negate ? "negate it" : "use it directly"
        }.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (utils.isBinaryExpression(node)) {
            const cmp = getBooleanComparison(node, checker);
            if (cmp !== undefined) {
                ctx.addFailureAtNode(
                    cmp.expression,
                    Rule.FAILURE_STRING(cmp.negate),
                    fix(node, cmp)
                );
            }
        }
        return ts.forEachChild(node, cb);
    });
}

interface Compare {
    negate: boolean;
    expression: ts.Expression;
}

function getBooleanComparison(
    node: ts.BinaryExpression,
    checker: ts.TypeChecker
): Compare | undefined {
    const cmp = deconstructComparison(node);
    return cmp === undefined ||
        !utils.isTypeFlagSet(checker.getTypeAtLocation(cmp.expression), ts.TypeFlags.Boolean)
        ? undefined
        : cmp;
}

function fix(node: ts.BinaryExpression, { negate, expression }: Compare): Lint.Fix {
    const deleted =
        node.left === expression
            ? Lint.Replacement.deleteFromTo(node.left.end, node.end)
            : Lint.Replacement.deleteFromTo(node.getStart(), node.right.getStart());
    if (!negate) {
        return deleted;
    } else if (needsParenthesesForNegate(expression)) {
        return [
            deleted,
            Lint.Replacement.appendText(node.getStart(), "!("),
            Lint.Replacement.appendText(node.getEnd(), ")")
        ];
    } else {
        return [deleted, Lint.Replacement.appendText(node.getStart(), "!")];
    }
}

function needsParenthesesForNegate(node: ts.Expression): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.AsExpression:
        case ts.SyntaxKind.BinaryExpression:
            return true;
        default:
            return false;
    }
}

function deconstructComparison(node: ts.BinaryExpression): Compare | undefined {
    const { left, operatorToken, right } = node;
    const eq = Lint.getEqualsKind(operatorToken);
    if (eq === undefined) {
        return undefined;
    }

    const leftValue = booleanFromExpression(left);
    if (leftValue !== undefined) {
        return { negate: leftValue !== eq.isPositive, expression: right };
    }
    const rightValue = booleanFromExpression(right);
    if (rightValue !== undefined) {
        return { negate: rightValue !== eq.isPositive, expression: left };
    }
    return undefined;
}

function booleanFromExpression(node: ts.Expression): boolean | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.TrueKeyword:
            return true;
        case ts.SyntaxKind.FalseKeyword:
            return false;
        default:
            return undefined;
    }
}
