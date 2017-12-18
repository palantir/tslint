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

export class Rule extends Lint.Rules.TypedRule {
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
        ruleName: "no-unnecessary-bind",
        type: "style",
        typescriptOnly: false,
    };

    public static FAILURE_STRING_FUNCTION = "Don't bind \`this\` without arguments as a scope to a function. Use an arrow lambda instead.";

    public static FAILURE_STRING_ARROW = "Don't bind scopes to arrow lambdas, as they already have a bound scope.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(context: Lint.WalkContext<void>, typeChecker: ts.TypeChecker) {
    function checkArrowFunction(node: ts.CallExpression, boundExpression: ts.Node): void {
        if (node.arguments.length !== 1) {
            return;
        }

        const replacement = Lint.Replacement.replaceNode(
            node,
            boundExpression.getText(context.sourceFile));

        context.addFailureAtNode(node, Rule.FAILURE_STRING_ARROW, replacement);
    }

    function checkFunctionExpression(node: ts.CallExpression, valueDeclaration: ts.FunctionExpression): void {
        if (node.arguments.length !== 1 || node.arguments[0].kind !== ts.SyntaxKind.ThisKeyword) {
            return;
        }

        const parameters = valueDeclaration.parameters
            .map((parameter) => parameter.getText(context.sourceFile))
            .join(", ");
        const body = valueDeclaration.body.getText(context.sourceFile);
        const replacement = Lint.Replacement.replaceNode(
            node,
            `(${parameters}) => ${body}`);

        context.addFailureAtNode(node, Rule.FAILURE_STRING_FUNCTION, replacement);
    }

    function getArrowFunctionDeclaration(node: ts.Node): ts.ArrowFunction | undefined {
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

    function checkCallExpression(node: ts.CallExpression): void {
        const bindExpression = node.expression;
        if (!isBindPropertyAccess(bindExpression)) {
            return;
        }

        const boundExpression = Lint.getNodeWithinParenthesis(bindExpression.expression);
        if (tsutils.isFunctionExpression(boundExpression)) {
            checkFunctionExpression(node, boundExpression);
            return;
        }

        const valueDeclaration = getArrowFunctionDeclaration(boundExpression);
        if (valueDeclaration !== undefined) {
            checkArrowFunction(node, boundExpression);
        }
    }

    return ts.forEachChild(context.sourceFile, function callback(node: ts.Node): void {
        if (ts.isCallExpression(node)) {
            checkCallExpression(node);
        }

        return ts.forEachChild(node, callback);
    });
}

function isBindPropertyAccess(node: ts.LeftHandSideExpression): node is ts.PropertyAccessExpression {
    return ts.isPropertyAccessExpression(node) && node.name.text === "bind";
}
