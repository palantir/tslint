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

import * as tsutils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.OptionallyTypedRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Prevents unnecessary and/or misleading scope bindings on functions.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent`
            \`function\` expressions that are immediately bound to \`this\` are equivalent to \`() =>\` arrow lambdas.
            Additionally, there's no use in binding a scope to an arrow lambda, as it already has one.
        `,
        requiresTypeInfo: true,
        ruleName: "unnecessary-bind",
        type: "style",
        typescriptOnly: false,
    };

    public static FAILURE_STRING_FUNCTION =
        "Don't bind `this` without arguments as a scope to a function. Use an arrow lambda instead.";

    public static FAILURE_STRING_ARROW =
        "Don't bind scopes to arrow lambdas, as they already have a bound scope.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(context: Lint.WalkContext<void>, typeChecker?: ts.TypeChecker) {
    const variableUsage = tsutils.collectVariableUsage(context.sourceFile);

    function checkArrowFunction(node: ts.CallExpression): void {
        if (node.arguments.length !== 1) {
            return;
        }

        context.addFailureAtNode(node, Rule.FAILURE_STRING_ARROW);
    }

    function canFunctionExpressionBeFixed(
        callExpression: ts.CallExpression,
        valueDeclaration: ts.FunctionExpression,
    ): boolean {
        if (
            callExpression.arguments.length !== 1 ||
            callExpression.arguments[0].kind !== ts.SyntaxKind.ThisKeyword ||
            valueDeclaration.asteriskToken !== undefined ||
            valueDeclaration.decorators !== undefined
        ) {
            return false;
        }

        const { name } = valueDeclaration;
        if (name === undefined) {
            return true;
        }

        const nameInfo = variableUsage.get(name);
        return nameInfo === undefined || nameInfo.uses.length === 0;
    }

    function checkFunctionExpression(
        callExpression: ts.CallExpression,
        valueDeclaration: ts.FunctionExpression,
    ): void {
        if (!canFunctionExpressionBeFixed(callExpression, valueDeclaration)) {
            return;
        }

        context.addFailureAtNode(callExpression, Rule.FAILURE_STRING_FUNCTION);
    }

    function getArrowFunctionDeclaration(node: ts.Node): ts.ArrowFunction | undefined {
        if (typeChecker === undefined) {
            return undefined;
        }

        const { symbol } = typeChecker.getTypeAtLocation(node);
        if (symbol === undefined) {
            return undefined;
        }

        const { valueDeclaration } = symbol;
        if (valueDeclaration === undefined) {
            return undefined;
        }

        if (!tsutils.isArrowFunction(valueDeclaration)) {
            return undefined;
        }

        return valueDeclaration;
    }

    function isDecoratedPropertyMember(node: ts.CallExpression): boolean {
        return (
            node.parent !== undefined &&
            tsutils.isPropertyDeclaration(node.parent) &&
            node.parent.decorators !== undefined
        );
    }

    function checkCallExpression(node: ts.CallExpression): void {
        if (isDecoratedPropertyMember(node)) {
            return;
        }

        const bindExpression = node.expression;
        if (!isBindPropertyAccess(bindExpression)) {
            return;
        }

        const boundExpression = Lint.unwrapParentheses(bindExpression.expression);
        if (tsutils.isFunctionExpression(boundExpression)) {
            checkFunctionExpression(node, boundExpression);
            return;
        }

        const valueDeclaration = getArrowFunctionDeclaration(boundExpression);
        if (valueDeclaration !== undefined) {
            checkArrowFunction(node);
        }
    }

    return ts.forEachChild(context.sourceFile, function callback(node: ts.Node): void {
        if (ts.isCallExpression(node)) {
            checkCallExpression(node);
        }

        return ts.forEachChild(node, callback);
    });
}

function isBindPropertyAccess(
    node: ts.LeftHandSideExpression,
): node is ts.PropertyAccessExpression {
    return ts.isPropertyAccessExpression(node) && node.name.text === "bind";
}
