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

import { isCallExpression, isIdentifier, isPropertyAccessExpression } from "tsutils";
import * as ts from "typescript";
import * as Lint from "..";

interface Options {
    maxChainLength: number;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "newline-per-chained-call",
        description: Lint.Utils.dedent`
            Requires that chained property accessors be broken apart onto separate lines.`,
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
            new NewlinePerChainedCallWalker(
                sourceFile,
                this.ruleName,
                this.parseOptions(this.ruleArguments),
            ),
        );
    }

    private parseOptions(args: any[]): Options {
        let maxChainLength = 2;
        for (const arg of args) {
            if (typeof arg === "number") {
                maxChainLength = arg;
                break;
            }
        }
        return { maxChainLength };
    }
}

class NewlinePerChainedCallWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const checkForUnbrokenChain = (node: ts.Node): void => {
            if (this.hasUnbrokenChain(node)) {
                return this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
            return ts.forEachChild(node, checkForUnbrokenChain);
        };
        return ts.forEachChild(sourceFile, checkForUnbrokenChain);
    }

    private hasUnbrokenChain(node: ts.Node): boolean {
        if (!isPropertyAccessExpression(node)) {
            return false;
        }
        const chainLength = getChainLength(node);
        return (
            chainLength > this.options.maxChainLength &&
            node.getText().split("\n").length < chainLength
        );
    }
}

function getChainLength(node: ts.PropertyAccessExpression): number {
    let chainLength = 1;
    const nextAccessorOrCallExpression = (nextNode: ts.Expression): void => {
        if (
            isIdentifier(nextNode) ||
            (isPropertyAccessExpression(nextNode) && !isThisKeyword(nextNode))
        ) {
            chainLength++;
        }

        if (
            isCallExpression(nextNode) ||
            (isPropertyAccessExpression(nextNode) && !isThisKeyword(nextNode))
        ) {
            return nextAccessorOrCallExpression(nextNode.expression);
        }
        return;
    };
    nextAccessorOrCallExpression(node.expression);
    return chainLength;
}

function isThisKeyword(node: ts.Node): boolean {
    return node.kind === ts.SyntaxKind.ThisKeyword;
}
