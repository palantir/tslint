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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Prevents unnecessary and/or misleading scope bindings on functions.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: ".",
        requiresTypeInfo: true,
        ruleName: "no-unnecessary-function-bind",
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING_FUNCTION = Lint.Utils.dedent`
        Don't bind \`this\` without arguments as a scope to a function. Use an arrow lambda instead.
    `;

    public static FAILURE_STRING_ARROW = "Don't bind scopes to arrow lambdas, as they already have a bound scope.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(context: Lint.WalkContext<void>, typeChecker: ts.TypeChecker) {
    function createReplacement(node: ts.CallExpression, declaration: ts.FunctionExpression): Lint.Replacement | undefined {
        const parameters = declaration.parameters
            .map((parameter) => parameter.getText(context.sourceFile))
            .join(", ");
        const body = declaration.body.getText(context.sourceFile);

        return Lint.Replacement.replaceNode(node, `(${parameters}) => ${body}`);
    }

    function checkArrowFunctionDeclaration(node: ts.CallExpression): void {
        if (node.arguments.length > 0) {
            context.addFailureAtNode(node, Rule.FAILURE_STRING_ARROW);
        }
    }

    function checkFunctionDeclarationOrExpression(node: ts.CallExpression, valueDeclaration: ts.FunctionLike): void {
        if (node.arguments.length === 1 && node.arguments[0].kind === ts.SyntaxKind.ThisKeyword) {
            context.addFailureAtNode(node, Rule.FAILURE_STRING_FUNCTION, createReplacement(node, valueDeclaration));
        }
    }

    function getFunctionLikeValueDeclaration(node: ts.LeftHandSideExpression): ts.FunctionLike | undefined {
        const { symbol } = typeChecker.getTypeAtLocation(node);
        if (symbol === undefined) {
            return undefined;
        }

        const { valueDeclaration } = symbol;
        if (valueDeclaration === undefined) {
            return undefined;
        }

        if (!ts.isFunctionLike(valueDeclaration)) {
            return undefined;
        }

        return valueDeclaration;
    }

    function checkCallExpression(node: ts.CallExpression): void {
        const { expression } = node;
        if (!isBindPropertyAccess(expression)) {
            return;
        }

        const valueDeclaration = getFunctionLikeValueDeclaration(node.expression);
        if (valueDeclaration === undefined) {
            return;
        }

        if (ts.isArrowFunction(valueDeclaration)) {
            checkArrowFunctionDeclaration(node);
        } else {
            checkFunctionDeclarationOrExpression(node, valueDeclaration);
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
