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

import { isBinaryExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALLOW_NULL_CHECK = "allow-null-check";
const OPTION_ALLOW_UNDEFINED_CHECK = "allow-undefined-check";

interface Options {
    allowNull: boolean;
    allowUndefined: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "triple-equals",
        description: "Requires `===` and `!==` in place of `==` and `!=`.",
        optionsDescription: Lint.Utils.dedent`
            Two arguments may be optionally provided:

            * \`"allow-null-check"\` allows \`==\` and \`!=\` when comparing to \`null\`.
            * \`"allow-undefined-check"\` allows \`==\` and \`!=\` when comparing to \`undefined\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_NULL_CHECK, OPTION_ALLOW_UNDEFINED_CHECK]
            },
            minLength: 0,
            maxLength: 2
        },
        optionExamples: [true, [true, "allow-null-check"], [true, "allow-undefined-check"]],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static EQ_FAILURE_STRING = "== should be ===";
    public static NEQ_FAILURE_STRING = "!= should be !==";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            allowNull: this.ruleArguments.indexOf(OPTION_ALLOW_NULL_CHECK) !== -1,
            allowUndefined: this.ruleArguments.indexOf(OPTION_ALLOW_UNDEFINED_CHECK) !== -1
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isBinaryExpression(node)) {
            if (
                (node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken ||
                    node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken) &&
                !(
                    isExpressionAllowed(node.right, ctx.options) ||
                    isExpressionAllowed(node.left, ctx.options)
                )
            ) {
                ctx.addFailureAtNode(
                    node.operatorToken,
                    node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken
                        ? Rule.EQ_FAILURE_STRING
                        : Rule.NEQ_FAILURE_STRING
                );
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function isExpressionAllowed(node: ts.Expression, options: Options) {
    if (node.kind === ts.SyntaxKind.NullKeyword) {
        return options.allowNull;
    }
    return (
        options.allowUndefined &&
        node.kind === ts.SyntaxKind.Identifier &&
        (node as ts.Identifier).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword
    );
}
