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

// with due reference to https://github.com/Microsoft/TypeScript/blob/7813121c4d77e50aad0eed3152ef1f1156c7b574/scripts/tslint/noNullRule.ts

import * as ts from "typescript";

import { isConstructorDeclaration } from "tsutils";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-empty-constructor",
        description: "Requires constructor bodies to be empty if only initialising properties with parameters",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: true,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "This constructor is only initialising properties with parameters, leave it empty instead";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(context: Lint.WalkContext<void>) {
    const callback = (node: ts.Node): void => {
        if (isConstructorDeclaration(node) && hasRemovableBody(node)) {
            context.addFailureAtNode(node, Rule.FAILURE_STRING, createFix(node));
        } else {
            ts.forEachChild(node, callback);
        }
    };

    return ts.forEachChild(context.sourceFile, callback);
}

const hasRemovableBody = (constructor: ts.ConstructorDeclaration): boolean => {
    if (hasEmptyBody(constructor)) {
        return false;
    }

    return hasOnlyPropertiesInitialised(constructor);
};

const hasEmptyBody = (constructor: ts.ConstructorDeclaration): boolean => {
    const constructorBody = getOrCreateBody(constructor);

    return constructorBody.statements.length === 0;
};

const getOrCreateBody = (constructor: ts.ConstructorDeclaration): ts.Block => constructor.body || ts.createBlock([]);

const hasOnlyPropertiesInitialised = (constructor: ts.ConstructorDeclaration): boolean => {
    let result = true;
    const constructorBody = getOrCreateBody(constructor);

    constructorBody.forEachChild((child) => {
        if (!isThisPropertyAssignment(child)) {
            result = false;
        }
    });

    return result;
};

const isThisPropertyAssignment = (node: ts.Node): boolean => {
    if (!isBinaryExpressionStatement(node)) {
        return false;
    }

    return hasPropertyAssignmentShape((node as ts.ExpressionStatement));
};

const isBinaryExpressionStatement = (node: ts.Node): boolean => ts.isExpressionStatement(node) && ts.isBinaryExpression(node.expression);

const hasPropertyAssignmentShape = (node: ts.ExpressionStatement): boolean => {
    const expression = node.expression as ts.BinaryExpression;

    return ts.isPropertyAccessExpression(expression.left) &&
        isEqualsBinaryOperatorToken(expression.operatorToken) &&
        ts.isIdentifier(expression.right);
};

const isEqualsBinaryOperatorToken = (operator: ts.BinaryOperatorToken): boolean => operator.kind === 58;

const createFix = (constructor: ts.ConstructorDeclaration): Lint.Replacement => {
    const constructorBody = getOrCreateBody(constructor);

    return Lint.Replacement.replaceNode(constructorBody, "{}");
};
