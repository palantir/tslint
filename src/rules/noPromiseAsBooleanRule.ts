/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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

import {
    isBinaryExpression,
    isConditionalExpression,
    isDoStatement,
    isForStatement,
    isIfStatement,
    isPrefixUnaryExpression,
    isWhileStatement,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_PROMISE_CLASSES = "promise-classes";

interface Options {
    promiseClasses: string[];
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-promise-as-boolean",
        description: "Warns for Promises that are used for boolean conditions.",
        optionsDescription: Lint.Utils.dedent`
            A list of 'string' names of any additional classes that should also be treated as Promises.
            For example, if you are using a class called 'Future' that implements the Thenable interface,
            you might tell the rule to consider type references with the name 'Future' as valid Promise-like
            types. Note that this rule doesn't check for type assignability or compatibility; it just checks
            type reference names.
        `,
        options: {
            type: "object",
            properties: {
                [OPTION_PROMISE_CLASSES]: {
                    type: "array",
                    items: { type: "string" },
                },
            },
        },
        optionExamples: [true, [true, { OPTION_PROMISE_CLASSES: ["Thenable"] }]],
        rationale: Lint.Utils.dedent`
            There are no situations where one would like to check whether a variable's value is truthy if its type
            only is Promise.
            This may only occur when the typings are incorrect or the variable has a union type
            (like Promise | undefined), of which the latter is allowed.

            This rule prevents common bugs from forgetting to 'await' a Promise.
        `,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const rawOptions = { ...this.ruleArguments[0] } as { [OPTION_PROMISE_CLASSES]?: string[] };
        return this.applyWithFunction(
            sourceFile,
            walk,
            { promiseClasses: ["Promise", ...(rawOptions[OPTION_PROMISE_CLASSES] || [])] },
            program.getTypeChecker(),
        );
    }
}

const RULE_MESSAGE = "Promises are not allowed as boolean.";

function walk(context: Lint.WalkContext<Options>, checker: ts.TypeChecker): void {
    const { sourceFile } = context;
    return ts.forEachChild(sourceFile, cb);

    function cb(node: ts.Node): void {
        if (isBooleanBinaryExpression(node)) {
            const { left, right } = node;
            if (!isBooleanBinaryExpression(left)) {
                checkExpression(left);
            }

            if (!isBooleanBinaryExpression(right)) {
                checkExpression(right);
            }
        } else if (isPrefixUnaryExpression(node)) {
            const { operator, operand } = node;
            if (operator === ts.SyntaxKind.ExclamationToken) {
                checkExpression(operand);
            }
        } else if (isIfStatement(node) || isWhileStatement(node) || isDoStatement(node)) {
            // If it's a boolean binary expression, we'll check it when recursing.
            if (!isBooleanBinaryExpression(node.expression)) {
                checkExpression(node.expression);
            }
        } else if (isConditionalExpression(node)) {
            checkExpression(node.condition);
        } else if (isForStatement(node)) {
            const { condition } = node;
            if (condition !== undefined) {
                checkExpression(condition);
            }
        }

        return ts.forEachChild(node, cb);
    }

    function checkExpression(expression: ts.Expression): void {
        const mainType = checker.getTypeAtLocation(expression);
		if (isPromiseType(mainType) || (mainType.isUnion() && mainType.types.every(isPromiseType))) {
			context.addFailureAtNode(expression, RULE_MESSAGE);
		}
    }

    function isPromiseType(type: ts.Type) {
        const promiseClasses = context.options.promiseClasses;
        return type.symbol !== undefined && promiseClasses.indexOf(type.symbol.name) !== -1;
    }
}

/** Matches `&&` and `||` operators. */
function isBooleanBinaryExpression(expression: ts.Node): expression is ts.BinaryExpression {
    return (
        isBinaryExpression(expression) &&
        (expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
            expression.operatorToken.kind === ts.SyntaxKind.BarBarToken)
    );
}
