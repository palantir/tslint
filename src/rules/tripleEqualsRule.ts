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
import * as Lint from "../lint";

const OPTION_ALLOW_NULL_CHECK = "allow-null-check";
const OPTION_ALLOW_UNDEFINED_CHECK = "allow-undefined-check";

function isUndefinedExpression(expression: ts.Expression) {
    return expression.kind === ts.SyntaxKind.Identifier && expression.getText() === "undefined";
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "triple-equals",
        description: "Requires `===` and `!==` in place of `==` and `!=`.",
        optionsDescription: Lint.Utils.dedent `
            Two arguments may be optionally provided:

            * \`"allow-null-check"\` allows \`==\` and \`!=\` when comparing to \`null\`.
            * \`"allow-undefined-check"\` allows \`==\` and \`!=\` when comparing to \`undefined\`.`,
        options: {
            type: "list",
            listType: {
                type: "enum",
                enumValues: [OPTION_ALLOW_NULL_CHECK, OPTION_ALLOW_UNDEFINED_CHECK],
            },
        },
        optionExamples: ["true", '[true, "allow-null-check"]', '[true, "allow-undefined-check"]'],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static EQ_FAILURE_STRING = "== should be ===";
    public static NEQ_FAILURE_STRING = "!= should be !==";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const comparisonWalker = new ComparisonWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(comparisonWalker);
    }
}

class ComparisonWalker extends Lint.RuleWalker {
    private static COMPARISON_OPERATOR_WIDTH = 2;

    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (!this.isExpressionAllowed(node)) {
            const position = node.getChildAt(1).getStart();
            this.handleOperatorToken(position, node.operatorToken.kind);
        }
        super.visitBinaryExpression(node);
    }

    private handleOperatorToken(position: number, operator: ts.SyntaxKind) {
        switch (operator) {
            case ts.SyntaxKind.EqualsEqualsToken:
                this.addFailure(this.createFailure(position, ComparisonWalker.COMPARISON_OPERATOR_WIDTH, Rule.EQ_FAILURE_STRING));
                break;
            case ts.SyntaxKind.ExclamationEqualsToken:
                this.addFailure(this.createFailure(position, ComparisonWalker.COMPARISON_OPERATOR_WIDTH, Rule.NEQ_FAILURE_STRING));
                break;
        }
    }

    private isExpressionAllowed(node: ts.BinaryExpression) {
        const nullKeyword = ts.SyntaxKind.NullKeyword;

        return (
            this.hasOption(OPTION_ALLOW_NULL_CHECK) && (node.left.kind === nullKeyword || node.right.kind === nullKeyword)
        ) || (
            this.hasOption(OPTION_ALLOW_UNDEFINED_CHECK) && (isUndefinedExpression(node.left) || isUndefinedExpression(node.right))
        );
    }
}
