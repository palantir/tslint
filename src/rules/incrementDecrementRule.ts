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

interface Options {
    allowPost: boolean;
}

const OPTION_ALLOW_POST = "allow-post";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Enforces using explicit += 1 or -= 1 operators.",
        optionExamples: [true, [true, OPTION_ALLOW_POST]],
        options: {
            items: {
                enum: [OPTION_ALLOW_POST],
                type: "string",
            },
            maxLength: 1,
            minLength: 0,
            type: "array",
        },
        optionsDescription: Lint.Utils.dedent`
            If no arguments are provided, both pre- and post-unary operators are banned.
            If \`"${OPTION_ALLOW_POST}"\` is provided, post-unary operators will be allowed.
        `,
        rationale: Lint.Utils.dedent`
            It's easy to type +i or -i instead of --i or ++i, and won't always result in invalid code.
            Prefer standardizing small arithmetic operations with the explicit += and -= operators.
        `,
        ruleName: "increment-decrement",
        type: "style",
        typescriptOnly: false,
    };

    public static FAILURE_STRING_FACTORY = (newOperatorText: string) =>
        `Use an explicit ${newOperatorText} operator.`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options: Options = {
            allowPost: this.ruleArguments.indexOf(OPTION_ALLOW_POST) !== -1,
        };

        return this.applyWithFunction(sourceFile, walk, options);
    }
}

function walk(context: Lint.WalkContext<Options>) {
    function createReplacement(
        node: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression,
        newOperatorText: string,
    ): Lint.Replacement {
        let text = `${node.operand.getText(context.sourceFile)} ${newOperatorText}`;

        if (node.parent !== undefined && tsutils.isBinaryExpression(node.parent)) {
            text = `(${text})`;
        }

        return Lint.Replacement.replaceNode(node, text);
    }

    function complainOnNode(node: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression) {
        const newOperatorText = node.operator === ts.SyntaxKind.PlusPlusToken ? "+= 1" : "-= 1";
        let replacement: Lint.Replacement | undefined;

        if (
            tsutils.isPrefixUnaryExpression(node) ||
            node.parent.kind === ts.SyntaxKind.ExpressionStatement
        ) {
            replacement = createReplacement(node, newOperatorText);
        }

        const failure = Rule.FAILURE_STRING_FACTORY(newOperatorText);

        context.addFailureAtNode(node, failure, replacement);
    }

    function checkPostfixUnaryExpression(node: ts.PostfixUnaryExpression): void {
        if (!context.options.allowPost && isIncrementOrDecrementOperator(node.operator)) {
            complainOnNode(node);
        }
    }

    function checkPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void {
        if (isIncrementOrDecrementOperator(node.operator)) {
            complainOnNode(node);
        }
    }

    return ts.forEachChild(context.sourceFile, function callback(node: ts.Node): void {
        if (tsutils.isPostfixUnaryExpression(node)) {
            checkPostfixUnaryExpression(node);
        } else if (tsutils.isPrefixUnaryExpression(node)) {
            checkPrefixUnaryExpression(node);
        }

        return ts.forEachChild(node, callback);
    });
}

function isIncrementOrDecrementOperator(
    operator: ts.PostfixUnaryOperator | ts.PrefixUnaryOperator,
) {
    return operator === ts.SyntaxKind.PlusPlusToken || operator === ts.SyntaxKind.MinusMinusToken;
}
