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

import * as ts from "typescript";
import * as Lint from "../index";
import { isAssignment, unwrapParentheses } from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-for-of",
        description: "Recommends a 'for-of' loop over a standard 'for' loop if the index is only used to access the array being iterated.",
        rationale: "A for(... of ...) loop is easier to implement and read when the index is not needed.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Expected a 'for-of' loop instead of a 'for' loop with this simple iteration";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

interface IncrementorState {
    indexVariableName: string;
    arrayToken: ts.Identifier;
    onlyArrayReadAccess: boolean;
}

function walk(ctx: Lint.WalkContext<void>): void {
    const scopes: IncrementorState[] = [];

    return ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ForStatement:
                return visitForStatement(node as ts.ForStatement);
            case ts.SyntaxKind.Identifier:
                return visitIdentifier(node as ts.Identifier);
            default:
                return ts.forEachChild(node, cb);
        }
    }

    function visitForStatement(node: ts.ForStatement): void {
        const arrayNodeInfo = getForLoopHeaderInfo(node);
        if (!node.incrementor || !arrayNodeInfo) {
            return ts.forEachChild(node, cb);
        }

        const { indexVariable, arrayToken } = arrayNodeInfo;
        const indexVariableName = indexVariable.text;

        // store `for` loop state
        const state: IncrementorState = {
            indexVariableName,
            arrayToken: arrayToken as ts.Identifier,
            onlyArrayReadAccess: true,
        };
        scopes.push(state);
        ts.forEachChild(node.statement, cb);
        scopes.pop();

        if (state.onlyArrayReadAccess) {
            ctx.addFailure(node.getStart(), node.statement.getFullStart(), Rule.FAILURE_STRING);
        }
    }

    function visitIdentifier(node: ts.Identifier): void {
        const state = getStateForVariable(node.text);
        if (state) {
            updateIncrementorState(node, state);
        }
    }

    function getStateForVariable(name: string): IncrementorState | undefined {
        for (let i = scopes.length - 1; i >= 0; i--) {
            const scope = scopes[i];
            if (scope.indexVariableName === name) {
                return scope;
            }
        }
        return undefined;
    }
}

function updateIncrementorState(node: ts.Identifier, state: IncrementorState): void {
    // check if iterator is used for something other than reading data from array
    if (node.parent!.kind === ts.SyntaxKind.ElementAccessExpression) {
        const elementAccess = node.parent as ts.ElementAccessExpression;
        const arrayIdentifier = unwrapParentheses(elementAccess.expression) as ts.Identifier;
        if (state.arrayToken.getText() !== arrayIdentifier.getText()) {
            // iterator used in array other than one iterated over
            state.onlyArrayReadAccess = false;
        } else if (elementAccess.parent && isAssignment(elementAccess.parent)) {
            // array position is assigned a new value
            state.onlyArrayReadAccess = false;
        }
    } else {
        state.onlyArrayReadAccess = false;
    }

}

// returns the iterator and array of a `for` loop if the `for` loop is basic.
function getForLoopHeaderInfo(forLoop: ts.ForStatement): { indexVariable: ts.Identifier, arrayToken: ts.Expression } | undefined {
    let indexVariableName: string | undefined;
    let indexVariable: ts.Identifier | undefined;

    // assign `indexVariableName` if initializer is simple and starts at 0
    if (forLoop.initializer && forLoop.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
        const syntaxList = forLoop.initializer.getChildAt(1);
        if (syntaxList.kind === ts.SyntaxKind.SyntaxList && syntaxList.getChildCount() === 1) {
            const assignment = syntaxList.getChildAt(0);
            if (assignment.kind === ts.SyntaxKind.VariableDeclaration && assignment.getChildCount() === 3) {
                const value = assignment.getChildAt(2).getText();
                if (value === "0") {
                    indexVariable = assignment.getChildAt(0) as ts.Identifier;
                    indexVariableName = indexVariable.getText();
                }
            }
        }
    }

    // ensure `for` condition
    if (!indexVariableName
        || !forLoop.condition
        || forLoop.condition.kind !== ts.SyntaxKind.BinaryExpression
        || forLoop.condition.getChildAt(0).getText() !== indexVariableName
        || forLoop.condition.getChildAt(1).getText() !== "<") {

        return undefined;
    }

    if (!forLoop.incrementor || !isIncremented(forLoop.incrementor, indexVariableName)) {
        return undefined;
    }

    // ensure that the condition checks a `length` property
    const conditionRight = forLoop.condition.getChildAt(2);
    if (conditionRight.kind === ts.SyntaxKind.PropertyAccessExpression) {
        const propertyAccess = conditionRight as ts.PropertyAccessExpression;
        if (indexVariable && propertyAccess.name.getText() === "length") {
            return { indexVariable: indexVariable!, arrayToken: unwrapParentheses(propertyAccess.expression) };
        }
    }

    return undefined;
}

function isIncremented(node: ts.Node, indexVariableName: string): boolean {
    if (!node) {
        return false;
    }

    // ensure variable is incremented
    if (node.kind === ts.SyntaxKind.PrefixUnaryExpression) {
        const incrementor = node as ts.PrefixUnaryExpression;
        if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
            // x++
            return true;
        }
    } else if (node.kind === ts.SyntaxKind.PostfixUnaryExpression) {
        const incrementor = node as ts.PostfixUnaryExpression;
        if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
            // ++x
            return true;
        }
    } else if (node.kind === ts.SyntaxKind.BinaryExpression) {
        const binaryExpression = node as ts.BinaryExpression;
        if (binaryExpression.operatorToken.getText() === "+="
            && binaryExpression.left.getText() === indexVariableName
            && binaryExpression.right.getText() === "1") {
            // x += 1
            return true;
        }
        if (binaryExpression.operatorToken.getText() === "="
            && binaryExpression.left.getText() === indexVariableName) {
            const addExpression = binaryExpression.right as ts.BinaryExpression;
            if (addExpression.operatorToken.getText() === "+") {
                if (addExpression.right.getText() === indexVariableName && addExpression.left.getText() === "1") {
                    // x = 1 + x
                    return true;
                } else if (addExpression.left.getText() === indexVariableName && addExpression.right.getText() === "1") {
                    // x = x + 1
                    return true;
                }
            }
        }
    }
    return false;
}
