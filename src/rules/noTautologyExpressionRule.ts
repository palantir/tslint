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

import * as tsutils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const TAUTOLOGY_DISCOVERED_ERROR_STRING = "Expression is a tautology. Comparison is redundant.";
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Enforces that two equal variables or literals are not compared.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: `Clean redundant code and unnecessary comparison of objects and literals.`,
        ruleName: "no-tautology-expression",
        type: "functionality",
        typescriptOnly: false,
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(context: Lint.WalkContext<void>) {
    const cb = (node: ts.Node): void => {
        if (tsutils.isBinaryExpression(node)) {
            if (isLiteral(node.left) && isLiteral(node.right)) {
                // Simple textual comparison of both sides
                if (node.left.getText() === node.right.getText()) {
                    context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
                }
            }
        }
        return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(context.sourceFile, cb);
}

function isLiteral(node: ts.Node): boolean {
    return tsutils.isStringLiteral(node) || tsutils.isNumericLiteral(node);
}
