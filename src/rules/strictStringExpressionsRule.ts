/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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

import { isTypeFlagSet, isUnionType } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALLOW_EMPTY_TYPES = "allow-empty-types";

interface Options {
    [OPTION_ALLOW_EMPTY_TYPES]?: boolean;
}

export class Rule extends Lint.Rules.TypedRule {
    public static CONVERSION_REQUIRED = "Explicit conversion to string type required";

    public static metadata: Lint.IRuleMetadata = {
        description: "Disable implicit toString() calls",
        descriptionDetails: Lint.Utils.dedent`
            Require explicit toString() call for variables used in strings. By default only strings are allowed.

            The following nodes are checked:

            * String literals ("foo" + bar)
            * ES6 templates (\`foo \${bar}\`)`,
        hasFix: true,
        optionExamples: [
            true,
            [
                true,
                {
                    [OPTION_ALLOW_EMPTY_TYPES]: true,
                },
            ],
        ],
        options: {
            properties: {
                [OPTION_ALLOW_EMPTY_TYPES]: {
                    type: "boolean",
                },
            },
            type: "object",
        },
        optionsDescription: Lint.Utils.dedent`
                Following arguments may be optionally provided:
                * \`${OPTION_ALLOW_EMPTY_TYPES}\` allows \`null\`, \`undefined\` and \`never\` to be passed into strings without explicit conversion`,
        requiresTypeInfo: true,
        ruleName: "strict-string-expressions",
        type: "functionality",
        typescriptOnly: true,
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            this.getRuleOptions(),
            program.getTypeChecker(),
        );
    }

    private getRuleOptions(): Options {
        if (this.ruleArguments[0] === undefined) {
            return {
                [OPTION_ALLOW_EMPTY_TYPES]: true,
            };
        } else {
            return this.ruleArguments[0] as Options;
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>, checker: ts.TypeChecker): void {
    const { sourceFile, options } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.BinaryExpression: {
                const binaryExpr = node as ts.BinaryExpression;
                if (binaryExpr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
                    const leftIsPassedAsIs = typeCanBeStringifiedEasily(
                        checker.getTypeAtLocation(binaryExpr.left),
                        options,
                    );
                    const rightIsPassedAsIs = typeCanBeStringifiedEasily(
                        checker.getTypeAtLocation(binaryExpr.right),
                        options,
                    );
                    const leftIsFailed = !leftIsPassedAsIs && rightIsPassedAsIs;
                    const rightIsFailed = leftIsPassedAsIs && !rightIsPassedAsIs;
                    if (leftIsFailed || rightIsFailed) {
                        const expression = leftIsFailed ? binaryExpr.left : binaryExpr.right;
                        addFailure(binaryExpr, expression);
                    }
                }
                break;
            }
            case ts.SyntaxKind.TemplateSpan: {
                const templateSpanNode = node as ts.TemplateSpan;
                const type = checker.getTypeAtLocation(templateSpanNode.expression);
                const shouldPassAsIs = typeCanBeStringifiedEasily(type, options);
                if (!shouldPassAsIs) {
                    const { expression } = templateSpanNode;
                    addFailure(templateSpanNode, expression);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });

    function addFailure(node: ts.Node, expression: ts.Expression) {
        const fix = Lint.Replacement.replaceFromTo(
            expression.getStart(),
            expression.end,
            `String(${expression.getText()})`,
        );
        ctx.addFailureAtNode(node, Rule.CONVERSION_REQUIRED, fix);
    }
}

const typeIsEmpty = (type: ts.Type): boolean =>
    isTypeFlagSet(type, ts.TypeFlags.Null) ||
    isTypeFlagSet(type, ts.TypeFlags.VoidLike) ||
    isTypeFlagSet(type, ts.TypeFlags.Undefined) ||
    isTypeFlagSet(type, ts.TypeFlags.Never);

function typeCanBeStringifiedEasily(type: ts.Type, options: Options): boolean {
    if (isUnionType(type)) {
        return type.types.every(unionAtomicType =>
            typeCanBeStringifiedEasily(unionAtomicType, options),
        );
    }

    if (options[OPTION_ALLOW_EMPTY_TYPES] && typeIsEmpty(type)) {
        return true;
    }

    return (
        isTypeFlagSet(type, ts.TypeFlags.BooleanLike) ||
        isTypeFlagSet(type, ts.TypeFlags.StringOrNumberLiteral) ||
        isTypeFlagSet(type, ts.TypeFlags.NumberLike) ||
        isTypeFlagSet(type, ts.TypeFlags.StringLike) ||
        isTypeFlagSet(type, ts.TypeFlags.Any)
    );
}
