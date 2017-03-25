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

const OPTION_ALLOW_NULL_CHECK = "allow-null-check";
const OPTION_ALLOW_UNDEFINED_CHECK = "allow-undefined-check";

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
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_NULL_CHECK, OPTION_ALLOW_UNDEFINED_CHECK],
            },
            minLength: 0,
            maxLength: 2,
        },
        optionExamples: ["true", '[true, "allow-null-check"]', '[true, "allow-undefined-check"]'],
        type: "functionality",
        typescriptOnly: false,
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
    private allowNull = this.hasOption(OPTION_ALLOW_NULL_CHECK);
    private allowUndefined = this.hasOption(OPTION_ALLOW_UNDEFINED_CHECK);

    public visitBinaryExpression(node: ts.BinaryExpression) {
        const eq = Lint.getEqualsKind(node.operatorToken);
        if (eq !== undefined && !eq.isStrict && !this.isExpressionAllowed(node)) {
            this.addFailureAtNode(node.operatorToken, eq.isPositive ? Rule.EQ_FAILURE_STRING : Rule.NEQ_FAILURE_STRING);
        }
        super.visitBinaryExpression(node);
    }

    private isExpressionAllowed({ left, right }: ts.BinaryExpression) {
        const isAllowed = (n: ts.Expression) =>
            n.kind === ts.SyntaxKind.NullKeyword ? this.allowNull
            : this.allowUndefined &&
                n.kind === ts.SyntaxKind.Identifier &&
                (n as ts.Identifier).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword;
        return isAllowed(left) || isAllowed(right);
    }
}
