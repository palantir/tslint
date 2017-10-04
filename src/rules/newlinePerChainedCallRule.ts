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

import {
    getChildOfKind,
    isCallExpression,
    isExpressionStatement,
    isIdentifier,
    isPropertyAccessExpression,
    isVariableDeclaration,
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "..";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "newline-per-chained-call",
        description: Lint.Utils.dedent`
            Requires that call expressions with three or more chained calls be broken apart onto new lines.`,
        rationale: Lint.Utils.dedent`
            This style helps to keep code 'vertical', avoiding the need for side-scrolling in IDEs or text editors.`,
        optionsDescription: "Not configurable",
        options: null,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    public static FAILURE_STRING = "Chained accessors should span multiple lines.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NewlinePerChainedCallWalker(sourceFile, this.ruleName, undefined),
        );
    }
}

class NewlinePerChainedCallWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        const checkForUnbrokenChain = (node: ts.Node): void => {
            if (
                isCallExpression(node) ||
                isPropertyAccessExpression(node) ||
                isExpressionStatement(node)
            ) {
                if (hasUnbrokenChain(node)) {
                    return this.addFailureAtNode(node.expression, Rule.FAILURE_STRING);
                }
            }
            return ts.forEachChild(node, checkForUnbrokenChain);
        };
        return ts.forEachChild(sourceFile, checkForUnbrokenChain);
    }
}

function getChainLength(
    node: ts.CallExpression | ts.PropertyAccessExpression | ts.ExpressionStatement,
): number {
    let chainLength =
        isVariableDeclaration(node) && isPropertyAccessExpression(node.initializer!) ? 1 : 0;
    const nextAccessorOrCallExpression = (nextNode: ts.Expression): void => {
        if (isIdentifier(nextNode)) {
            chainLength++;
            return;
        } else if (isPropertyAccessExpression(nextNode) && !isThisKeyword(nextNode)) {
            chainLength++;
            return nextAccessorOrCallExpression(nextNode.expression);
        } else if (isCallExpression(nextNode)) {
            return nextAccessorOrCallExpression(nextNode.expression);
        }
    };
    nextAccessorOrCallExpression(
        getChildOfKind(node, ts.SyntaxKind.PropertyAccessExpression) !== undefined
                ? getChildOfKind(node, ts.SyntaxKind.PropertyAccessExpression) as ts.PropertyAccessExpression
                : node.expression
    );
    return chainLength;
}

function hasUnbrokenChain(
    node: ts.CallExpression | ts.PropertyAccessExpression | ts.ExpressionStatement,
): boolean {
    return (
        getChainLength(node) > 2 &&
        node.expression.getText().split("\n").length < getChainLength(node)
    );
}

function isThisKeyword(node: ts.Expression): boolean {
    return node.kind === ts.SyntaxKind.ThisKeyword;
}
