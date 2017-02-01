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
        return this.applyWithWalker(new PreferForOfWalker(sourceFile, this.getOptions()));
    }
}

interface IIncrementorState {
    arrayToken: ts.Identifier;
    forLoopEndPosition: number;
    onlyArrayReadAccess: boolean;
}

// a map of incrementors and whether or not they are only used to index into an array reference in the for loop
type IncrementorMap = Map<string, IIncrementorState>;

class PreferForOfWalker extends Lint.BlockScopeAwareRuleWalker<void, IncrementorMap> {
    public createScope() {} // tslint:disable-line:no-empty

    public createBlockScope() {
        return new Map();
    }

    protected visitForStatement(node: ts.ForStatement) {
        const arrayNodeInfo = this.getForLoopHeaderInfo(node);
        const currentBlockScope = this.getCurrentBlockScope();
        let indexVariableName: string | undefined;
        if (node.incrementor != null && arrayNodeInfo != null) {
            const { indexVariable, arrayToken } = arrayNodeInfo;
            indexVariableName = indexVariable.getText();

            // store `for` loop state
            currentBlockScope.set(indexVariableName, {
                arrayToken: arrayToken as ts.Identifier,
                forLoopEndPosition: node.incrementor.end + 1,
                onlyArrayReadAccess: true,
            });
        }

        super.visitForStatement(node);

        if (indexVariableName != null) {
            const incrementorState = currentBlockScope.get(indexVariableName)!;
            if (incrementorState.onlyArrayReadAccess) {
                this.addFailureFromStartToEnd(node.getStart(), incrementorState.forLoopEndPosition, Rule.FAILURE_STRING);
            }

            // remove current `for` loop state
            currentBlockScope.delete(indexVariableName);
        }
    }

    protected visitIdentifier(node: ts.Identifier) {
        const incrementorScope = this.findBlockScope((scope) => scope.has(node.text));

        if (incrementorScope != null) {
            const incrementorState = incrementorScope.get(node.text);

            // check if the identifier is an iterator and is currently in the `for` loop body
            if (incrementorState != null && incrementorState.arrayToken != null && incrementorState.forLoopEndPosition < node.getStart()) {
                // check if iterator is used for something other than reading data from array
                if (node.parent!.kind === ts.SyntaxKind.ElementAccessExpression) {
                    const elementAccess = node.parent as ts.ElementAccessExpression;
                    const arrayIdentifier = unwrapParentheses(elementAccess.expression) as ts.Identifier;
                    if (incrementorState.arrayToken.getText() !== arrayIdentifier.getText()) {
                        // iterator used in array other than one iterated over
                        incrementorState.onlyArrayReadAccess = false;
                    } else if (elementAccess.parent != null && isAssignment(elementAccess.parent)) {
                        // array position is assigned a new value
                        incrementorState.onlyArrayReadAccess = false;
                    }
                } else {
                    incrementorState.onlyArrayReadAccess = false;
                }
            }
            super.visitIdentifier(node);
        }
    }

    // returns the iterator and array of a `for` loop if the `for` loop is basic. Otherwise, `null`
    private getForLoopHeaderInfo(forLoop: ts.ForStatement) {
        let indexVariableName: string | undefined;
        let indexVariable: ts.Identifier | undefined;

        // assign `indexVariableName` if initializer is simple and starts at 0
        if (forLoop.initializer != null && forLoop.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
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
        if (indexVariableName == null
            || forLoop.condition == null
            || forLoop.condition.kind !== ts.SyntaxKind.BinaryExpression
            || forLoop.condition.getChildAt(0).getText() !== indexVariableName
            || forLoop.condition.getChildAt(1).getText() !== "<") {

            return null;
        }

        if (forLoop.incrementor == null || !this.isIncremented(forLoop.incrementor, indexVariableName)) {
            return null;
        }

        // ensure that the condition checks a `length` property
        const conditionRight = forLoop.condition.getChildAt(2);
        if (conditionRight.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const propertyAccess = conditionRight as ts.PropertyAccessExpression;
            if (indexVariable != null && propertyAccess.name.getText() === "length") {
                return { indexVariable: indexVariable!, arrayToken: unwrapParentheses(propertyAccess.expression) };
            }
        }

        return null;
    }

    private isIncremented(node: ts.Node, indexVariableName: string) {
        if (node == null) {
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
}
