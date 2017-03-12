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
        ruleName: "use-isnan",
        description: "Enforces use of the `isNaN()` function to check for NaN references instead of a comparison to the `NaN` constant.",
        rationale: Lint.Utils.dedent`
            Since \`NaN !== NaN\`, comparisons with regular operators will produce unexpected results.
            So, instead of \`if (myVar === NaN)\`, do \`if (isNaN(myVar))\`.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Found an invalid comparison for NaN: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UseIsnanRuleWalker(sourceFile, this.getOptions()));
    }
}

class UseIsnanRuleWalker extends Lint.RuleWalker {
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if ((this.isExpressionNaN(node.left) || this.isExpressionNaN(node.right))
                && this.isComparisonOperator(node.operatorToken.kind)) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING + node.getText());
        }
        super.visitBinaryExpression(node);
    }

    private isExpressionNaN(node: ts.Node) {
        return node.kind === ts.SyntaxKind.Identifier && node.getText() === "NaN";
    }

    private isComparisonOperator(operator: ts.BinaryOperator) {
        return (operator === ts.SyntaxKind.LessThanToken
            || operator === ts.SyntaxKind.GreaterThanToken
            || operator === ts.SyntaxKind.LessThanEqualsToken
            || operator === ts.SyntaxKind.GreaterThanEqualsToken
            || operator === ts.SyntaxKind.EqualsEqualsToken
            || operator === ts.SyntaxKind.ExclamationEqualsToken
            || operator === ts.SyntaxKind.EqualsEqualsEqualsToken
            || operator === ts.SyntaxKind.ExclamationEqualsEqualsToken);
    }
}
