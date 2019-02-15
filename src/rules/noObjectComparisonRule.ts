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

import { isBinaryExpression, isTypeFlagSet } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { codeExamples } from "./code-examples/noObjectComparison.examples";

const OPTION_ALLOW_EQUAL = "allow-equal";

interface Options {
    allowEquals: boolean;
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-object-comparison",
        description: "Only allow comparisons between primitives.",
        optionsDescription: Lint.Utils.dedent`
                One argument may be optionally provided:
                * \`${OPTION_ALLOW_EQUAL}\` allows \`!=\` \`==\` \`!==\` \`===\` comparison between any types.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_EQUAL]
            },
            minLength: 0,
            maxLength: 1
        },
        optionExamples: [true, [true, OPTION_ALLOW_EQUAL]],
        rationale: Lint.Utils.dedent`
                When using comparison operators to compare objects, they compare references and not values.
                This is often done accidentally.
                With this rule, \`>\`, \`>=\`, \`<\`, \`<=\` operators are only allowed when comparing \`numbers\`.
                \`===\`, \`!==\` are allowed for \`number\` \`string\` and \`boolean\` types and if one of the
                operands is \`null\` or \`undefined\`.
            `,
        type: "functionality",
        typescriptOnly: false,
        requiresTypeInfo: true,
        codeExamples
    };
    /* tslint:enable:object-literal-sort-keys */

    public static INVALID_COMPARISON = `Invalid comparison`;

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            {
                allowEquals: this.ruleArguments.indexOf(OPTION_ALLOW_EQUAL) !== -1
            },
            program
        );
    }
}

function walk(ctx: Lint.WalkContext<Options>, program: ts.Program) {
    const checker = program.getTypeChecker();

    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            isBinaryExpression(node) &&
            isComparisonOperator(node) &&
            !(isAnyType(node.left, checker) || isAnyType(node.right, checker)) &&
            !(isNumericType(node.left, checker) || isNumericType(node.right, checker)) &&
            !(
                isEqualityOperator(node) &&
                (isStringType(node.left, checker) || isStringType(node.right, checker))
            ) &&
            !(
                isEqualityOperator(node) &&
                (isBooleanType(node.left, checker) || isBooleanType(node.right, checker))
            ) &&
            !(
                isEqualityOperator(node) &&
                (isNullOrUndefinedType(node.left, checker) ||
                    isNullOrUndefinedType(node.right, checker))
            ) &&
            !(ctx.options.allowEquals && isEqualityOperator(node))
        ) {
            ctx.addFailureAtNode(node, Rule.INVALID_COMPARISON);
        }

        return ts.forEachChild(node, cb);
    });
}

function isComparisonOperator(node: ts.BinaryExpression): boolean {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.LessThanToken:
        case ts.SyntaxKind.GreaterThanToken:
        case ts.SyntaxKind.LessThanEqualsToken:
        case ts.SyntaxKind.GreaterThanEqualsToken:
        case ts.SyntaxKind.EqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsToken:
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return true;
        default:
            return false;
    }
}

function isEqualityOperator(node: ts.BinaryExpression): boolean {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.EqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsToken:
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return true;
        default:
            return false;
    }
}

function isAnyType(node: ts.Expression, checker: ts.TypeChecker) {
    return (
        node.kind === ts.SyntaxKind.AnyKeyword ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Any)
    );
}

function isNumericType(node: ts.Expression, checker: ts.TypeChecker) {
    return (
        node.kind === ts.SyntaxKind.NumericLiteral ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Number)
    );
}

function isStringType(node: ts.Expression, checker: ts.TypeChecker) {
    return (
        node.kind === ts.SyntaxKind.StringLiteral ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.String)
    );
}

function isBooleanType(node: ts.Expression, checker: ts.TypeChecker) {
    return (
        node.kind === ts.SyntaxKind.BooleanKeyword ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.BooleanLike)
    );
}

function isNullOrUndefinedType(node: ts.Expression, checker: ts.TypeChecker) {
    return (
        node.kind === ts.SyntaxKind.NullKeyword ||
        node.kind === ts.SyntaxKind.UndefinedKeyword ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Undefined) ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Null)
    );
}
