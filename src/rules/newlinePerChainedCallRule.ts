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
    isCallExpression,
    isElementAccessExpression,
    isPropertyAccessExpression,
    isSameLine,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "..";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "newline-per-chained-call",
        description: Lint.Utils.dedent`
            Requires that chained method calls be broken apart onto separate lines.`,
        rationale: Lint.Utils.dedent`
            This style helps to keep code 'vertical', avoiding the need for side-scrolling in IDEs or text editors.`,
        optionsDescription: "Not configurable",
        options: null,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    public static FAILURE_STRING = "When chaining calls, put method calls on new lines.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NewlinePerChainedCallWalker(sourceFile, this.ruleName, undefined),
        );
    }
}

class NewlinePerChainedCallWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        const checkForSameLine = (node: ts.Node): void => {
            if (
                isCallExpression(node) &&
                isPropertyAccessExpression(node.expression) &&
                isSameLine(sourceFile, node.expression.expression.end, node.expression.name.pos) &&
                hasChildCall(node.expression)
            ) {
                this.addFailure(
                    node.expression.name.pos - 1,
                    node.expression.name.end,
                    Rule.FAILURE_STRING,
                );
            }
            return ts.forEachChild(node, checkForSameLine);
        };
        return ts.forEachChild(sourceFile, checkForSameLine);
    }
}

function hasChildCall(node: ts.PropertyAccessExpression): boolean {
    let { expression } = node;
    while (isPropertyAccessExpression(expression) || isElementAccessExpression(expression)) {
        ({ expression } = expression);
    }
    return expression.kind === ts.SyntaxKind.CallExpression;
}
