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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "typeof-compare",
        description: "Makes sure result of `typeof` is compared to correct string values",
        optionsDescription: "",
        options: {},
        optionExamples: [],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "typeof must be compared to correct value";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const comparisonWalker = new ComparisonWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(comparisonWalker);
    }
}

class ComparisonWalker extends Lint.RuleWalker {
    private static LEGAL_TYPEOF_RESULTS = ["undefined", "string", "boolean", "number", "function", "object", "symbol"];

    private static isCompareOperator(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.EqualsEqualsToken || node.kind === ts.SyntaxKind.EqualsEqualsEqualsToken;
    }

    private static isLegalStringLiteral(node: ts.Node) {
        return ComparisonWalker.LEGAL_TYPEOF_RESULTS.indexOf(node.getText()) > -1;
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (ComparisonWalker.isCompareOperator(node.operatorToken)) {
            // typeof is at left
            if (node.left.kind === ts.SyntaxKind.TypeOfExpression) {
                if (node.right.kind !== ts.SyntaxKind.StringLiteral) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                } else if (!ComparisonWalker.isLegalStringLiteral(node.right)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                }
            }
            // typeof is at right
            if (node.right.kind === ts.SyntaxKind.TypeOfExpression) {
                if (node.left.kind !== ts.SyntaxKind.StringLiteral) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                } else if (!ComparisonWalker.isLegalStringLiteral(node.left)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                }
            }
        }
        super.visitBinaryExpression(node);
    }

}
