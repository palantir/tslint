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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { unwrapParentheses } from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-for-of",
        description:
            "Recommends a 'for-of' loop over a standard 'for' loop if the index is only used to access the array being iterated.",
        rationale:
            "A for(... of ...) loop is easier to implement and read when the index is not needed.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Expected a 'for-of' loop instead of a 'for' loop with this simple iteration";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    let variables: Map<ts.Identifier, utils.VariableInfo> | undefined;

    return ts.forEachChild(sourceFile, function cb(node): void {
        if (utils.isForStatement(node)) {
            visitForStatement(node);
        }
        return ts.forEachChild(node, cb);
    });

    function visitForStatement(node: ts.ForStatement): void {
        const arrayNodeInfo = getForLoopHeaderInfo(node);
        if (arrayNodeInfo === undefined) {
            return;
        }

        const { indexVariable, arrayExpr } = arrayNodeInfo;

        if (variables === undefined) {
            variables = utils.collectVariableUsage(sourceFile);
        }
        for (const { location } of variables.get(indexVariable)!.uses) {
            if (
                location.pos < node.initializer!.end ||
                location.pos >= node.end || // bail out on use outside of for loop
                (location.pos >= node.statement.pos && // only check uses in loop body
                    isNonSimpleIncrementorUse(location, arrayExpr, sourceFile))
            ) {
                return;
            }
        }
        ctx.addFailure(node.getStart(sourceFile), node.statement.pos, Rule.FAILURE_STRING);
    }
}

function isNonSimpleIncrementorUse(
    node: ts.Identifier,
    arrayExpr: ts.Expression,
    sourceFile: ts.SourceFile,
): boolean {
    // check if iterator is used for something other than reading data from array
    const parent = node.parent;
    return (
        !utils.isElementAccessExpression(parent) ||
        // `a[i] = ...` or similar
        utils.isReassignmentTarget(parent) ||
        // `b[i]`
        !nodeEquals(arrayExpr, unwrapParentheses(parent.expression), sourceFile)
    );
}

function nodeEquals(a: ts.Node, b: ts.Node, sourceFile: ts.SourceFile): boolean {
    return a.getText(sourceFile) === b.getText(sourceFile);
}

// returns the iterator and array of a `for` loop if the `for` loop is basic.
function getForLoopHeaderInfo(
    forLoop: ts.ForStatement,
): { indexVariable: ts.Identifier; arrayExpr: ts.Expression } | undefined {
    const { initializer, condition, incrementor } = forLoop;
    if (initializer === undefined || condition === undefined || incrementor === undefined) {
        return undefined;
    }

    // Must start with `var i = 0;` or `let i = 0;`
    if (!utils.isVariableDeclarationList(initializer) || initializer.declarations.length !== 1) {
        return undefined;
    }
    const { name: indexVariable, initializer: indexInit } = initializer.declarations[0];
    if (
        indexVariable.kind !== ts.SyntaxKind.Identifier ||
        indexInit === undefined ||
        !isNumber(indexInit, "0")
    ) {
        return undefined;
    }

    // Must end with `i++`
    if (!isIncremented(incrementor, indexVariable.text)) {
        return undefined;
    }

    // Condition must be `i < arr.length;`
    if (!utils.isBinaryExpression(condition)) {
        return undefined;
    }

    const { left, operatorToken, right } = condition;
    if (
        !isIdentifierNamed(left, indexVariable.text) ||
        operatorToken.kind !== ts.SyntaxKind.LessThanToken ||
        !utils.isPropertyAccessExpression(right)
    ) {
        return undefined;
    }

    const { expression: arrayExpr, name } = right;
    if (name.text !== "length") {
        return undefined;
    }

    return { indexVariable, arrayExpr };
}

function isIncremented(node: ts.Node, indexVariableName: string): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.PrefixUnaryExpression:
        case ts.SyntaxKind.PostfixUnaryExpression: {
            const { operator, operand } = node as
                | ts.PrefixUnaryExpression
                | ts.PostfixUnaryExpression;
            // `++x` or `x++`
            return operator === ts.SyntaxKind.PlusPlusToken && isVar(operand);
        }

        case ts.SyntaxKind.BinaryExpression:
            const { operatorToken, left: updatedVar, right: rhs } = node as ts.BinaryExpression;
            if (!isVar(updatedVar)) {
                return false;
            }

            switch (operatorToken.kind) {
                case ts.SyntaxKind.PlusEqualsToken:
                    // x += 1
                    return isOne(rhs);
                case ts.SyntaxKind.EqualsToken: {
                    if (!utils.isBinaryExpression(rhs)) {
                        return false;
                    }
                    const { operatorToken: rhsOp, left, right } = rhs;
                    // `x = 1 + x` or `x = x + 1`
                    return (
                        rhsOp.kind === ts.SyntaxKind.PlusToken &&
                        ((isVar(left) && isOne(right)) || (isOne(left) && isVar(right)))
                    );
                }
                default:
                    return false;
            }

        default:
            return false;
    }

    function isVar(id: ts.Node): boolean {
        return isIdentifierNamed(id, indexVariableName);
    }
}

function isIdentifierNamed(node: ts.Node, text: string): boolean {
    return utils.isIdentifier(node) && node.text === text;
}

function isOne(node: ts.Node): boolean {
    return isNumber(node, "1");
}

function isNumber(node: ts.Node, value: string): boolean {
    return utils.isNumericLiteral(node) && node.text === value;
}
