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
import { isAssignment } from "../language/utils";

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

class PreferForOfWalker extends Lint.RuleWalker {
    // a map of incrementors and whether or not they are only used to index into an array reference in the for loop
    private incrementorMap: { [name: string]: IIncrementorState };

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.incrementorMap = {};
    }

    protected visitForStatement(node: ts.ForStatement) {
        const arrayNodeInfo = this.getForLoopHeaderInfo(node);
        let indexVariableName: string;
        if (arrayNodeInfo != null) {
            const { indexVariable, arrayToken } = arrayNodeInfo;
            indexVariableName = indexVariable.getText();

            // store `for` loop state
            this.incrementorMap[indexVariableName] = {
                arrayToken: arrayToken as ts.Identifier,
                forLoopEndPosition: node.incrementor.end + 1,
                onlyArrayReadAccess: true,
            };
        }

        super.visitForStatement(node);

        if (indexVariableName != null) {
            const incrementorState = this.incrementorMap[indexVariableName];
            if (incrementorState.onlyArrayReadAccess) {
                const length = incrementorState.forLoopEndPosition - node.getStart();
                const failure = this.createFailure(node.getStart(), length, Rule.FAILURE_STRING);
                this.addFailure(failure);
            }

            // remove current `for` loop state
            delete this.incrementorMap[indexVariableName];
        }
    }

    protected visitIdentifier(node: ts.Identifier) {
        const incrementorState = this.incrementorMap[node.text];

        // check if the identifier is an iterator and is currently in the `for` loop body
        if (incrementorState != null && incrementorState.arrayToken != null && incrementorState.forLoopEndPosition < node.getStart()) {
            // check if iterator is used for something other than reading data from array
            if (node.parent.kind === ts.SyntaxKind.ElementAccessExpression) {
                const elementAccess = node.parent as ts.ElementAccessExpression;
                const arrayIdentifier = elementAccess.expression as ts.Identifier;
                if (incrementorState.arrayToken.text !== arrayIdentifier.text) {
                    // iterator used in array other than one iterated over
                    incrementorState.onlyArrayReadAccess = false;
                } else if (isAssignment(elementAccess.parent)) {
                    // array position is assigned a new value
                    incrementorState.onlyArrayReadAccess = false;
                }
            } else {
                incrementorState.onlyArrayReadAccess = false;
            }
        }
        super.visitIdentifier(node);
    }

    // returns the iterator and array of a `for` loop if the `for` loop is basic. Otherwise, `null`
    private getForLoopHeaderInfo(forLoop: ts.ForStatement) {
        let indexVariableName: string;
        let indexVariable: ts.Identifier;

        // assign `indexVariableName` if initializer is simple and starts at 0
        if (forLoop.initializer != null && forLoop.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
            const syntaxList = forLoop.initializer.getChildAt(1);
            if (syntaxList.kind === ts.SyntaxKind.SyntaxList && syntaxList.getChildCount() === 1) {
                const assignment = syntaxList.getChildAt(0);
                if (assignment.kind === ts.SyntaxKind.VariableDeclaration) {
                    const value = assignment.getChildAt(2).getText();
                    if (value === "0") {
                        indexVariable = <ts.Identifier> assignment.getChildAt(0);
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

        if (!this.isIncremented(forLoop.incrementor, indexVariableName)) {
            return null;
        }

        // ensure that the condition checks a `length` property
        const conditionRight = forLoop.condition.getChildAt(2);
        if (conditionRight.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const propertyAccess = <ts.PropertyAccessExpression> conditionRight;
            if (propertyAccess.name.getText() === "length") {
                return { indexVariable, arrayToken: propertyAccess.expression };
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
            const incrementor = <ts.PrefixUnaryExpression> node;
            if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
                // x++
                return true;
            }
        } else if (node.kind === ts.SyntaxKind.PostfixUnaryExpression) {
            const incrementor = <ts.PostfixUnaryExpression> node;
            if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
                // ++x
                return true;
            }
        } else if (node.kind === ts.SyntaxKind.BinaryExpression) {
            const binaryExpression = <ts.BinaryExpression> node;
            if (binaryExpression.operatorToken.getText() === "+="
                && binaryExpression.left.getText() === indexVariableName
                && binaryExpression.right.getText() === "1") {
                // x += 1
                return true;
            }
            if (binaryExpression.operatorToken.getText() === "="
                && binaryExpression.left.getText() === indexVariableName) {
                const addExpression = <ts.BinaryExpression> binaryExpression.right;
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
        } else {
            return false;
        }
        return false;
    }
}
