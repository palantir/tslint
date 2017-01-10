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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-boolean-compare",
        description: "Warns on comparison to a boolean literal, as in `x === true`.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(negate: boolean) {
        return `This expression is unnecessarily compared to a boolean. Just ${negate ? "negate it" : "use it directly"}.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    public visitBinaryExpression(node: ts.BinaryExpression) {
        this.check(node);
        super.visitBinaryExpression(node);
    }

    private check(node: ts.BinaryExpression) {
        const comparison = deconstructComparison(node);
        if (comparison === undefined) {
            return;
        }

        const { negate, expression } = comparison;
        const type = this.getTypeChecker().getTypeAtLocation(expression);
        if (!Lint.isTypeFlagSet(type, ts.TypeFlags.Boolean)) {
            return;
        }

        const deleted = node.left === expression
            ? Lint.Replacement.deleteFromTo(node.left.end, node.end)
            : Lint.Replacement.deleteFromTo(node.getStart(), node.right.getStart());
        const replacements = [deleted];
        if (negate) {
            replacements.push(this.appendText(node.getStart(), "!"));
        }

        this.addFailureAtNode(expression, Rule.FAILURE_STRING(negate), this.createFix(...replacements));
    }
}

function deconstructComparison(node: ts.BinaryExpression): { negate: boolean, expression: ts.Expression } | undefined {
    const { left, operatorToken, right } = node;
    const operator = operatorKind(operatorToken);
    if (operator === undefined) {
        return undefined;
    }

    const leftValue = booleanFromExpression(left);
    if (leftValue !== undefined) {
        return { negate: leftValue !== operator, expression: right };
    }
    const rightValue = booleanFromExpression(right);
    if (rightValue !== undefined) {
        return { negate: rightValue !== operator, expression: left };
    }
    return undefined;
}

function operatorKind(operatorToken: ts.BinaryOperatorToken): boolean | undefined {
    switch (operatorToken.kind) {
        case ts.SyntaxKind.EqualsEqualsToken: case ts.SyntaxKind.EqualsEqualsEqualsToken:
            return true;
        case ts.SyntaxKind.ExclamationEqualsToken: case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return false;
        default:
            return undefined;
    }
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
