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
import { codeExamples } from "./code-examples/objectComparison.examples";

const OPTION_ALLOW_EQUAL = "allow-equal";

interface Options {
    [OPTION_ALLOW_EQUAL]?: boolean;
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-comparison",
        description: "Only allow comparisons between primitives.",
        optionsDescription: Lint.Utils.dedent`
                One argument may be optionally provided:
                * \`${OPTION_ALLOW_EQUAL}\` allows \`!=\` \`==\` \`!==\` \`===\` comparison between any types.`,
        options: {
            type: "object",
            properties: {
                [OPTION_ALLOW_EQUAL]: {
                    type: "boolean",
                },
            },
        },
        optionExamples: [
            true,
            [
                true,
                {
                    [OPTION_ALLOW_EQUAL]: true,
                },
            ],
        ],
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
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static INVALID_COMPARISON = `Invalid comparison`;

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions(), program);
    }

    private getRuleOptions(): Options {
        if (this.ruleArguments[0] === undefined) {
            return {};
        } else {
            return this.ruleArguments[0] as Options;
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>, program: ts.Program) {
    const { sourceFile, options } = ctx;

    const checker = program.getTypeChecker();

    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isBinaryExpression(node) && isComparisonOperator(node)) {
            const leftKind = getKind(node.left, checker);
            const rightKind = getKind(node.right, checker);
            const isEquality = isEqualityOperator(node);

            if (
                !(leftKind === TypeKind.Any || rightKind === TypeKind.Any) &&
                !(leftKind === TypeKind.Number || rightKind === TypeKind.Number) &&
                !(isEquality && (leftKind === TypeKind.String || rightKind === TypeKind.String)) &&
                !(
                    isEquality &&
                    (leftKind === TypeKind.Boolean || rightKind === TypeKind.Boolean)
                ) &&
                !(isEquality && (leftKind === TypeKind.Enum || rightKind === TypeKind.Enum)) &&
                !(
                    isEquality &&
                    (leftKind === TypeKind.NullOrUndefined ||
                        rightKind === TypeKind.NullOrUndefined)
                ) &&
                !(options[OPTION_ALLOW_EQUAL] && isEquality)
            ) {
                ctx.addFailureAtNode(node, Rule.INVALID_COMPARISON);
            }
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

const enum TypeKind {
    String,
    Number,
    Boolean,
    NullOrUndefined,
    Enum,
    Any,
    Object,
}

function getKind(node: ts.Expression, checker: ts.TypeChecker): TypeKind {
    const type = checker.getTypeAtLocation(node);

    return node.kind === ts.SyntaxKind.StringLiteral || is(ts.TypeFlags.String)
        ? TypeKind.String
        : is(ts.TypeFlags.Number) || node.kind === ts.SyntaxKind.NumericLiteral
            ? TypeKind.Number
            : is(ts.TypeFlags.BooleanLike) || node.kind === ts.SyntaxKind.BooleanKeyword
                ? TypeKind.Boolean // tslint:disable-next-line:no-bitwise
                : is(ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void) ||
                  node.kind === ts.SyntaxKind.NullKeyword ||
                  node.kind === ts.SyntaxKind.UndefinedKeyword
                    ? TypeKind.NullOrUndefined
                    : is(ts.TypeFlags.EnumLike) || node.kind === ts.SyntaxKind.EnumMember
                        ? TypeKind.Enum
                        : is(ts.TypeFlags.Any) || node.kind === ts.SyntaxKind.AnyKeyword
                            ? TypeKind.Any
                            : TypeKind.Object;

    function is(flags: ts.TypeFlags) {
        return isTypeFlagSet(type, flags);
    }
}
/*
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

function isEnumType(node: ts.Expression, checker: ts.TypeChecker) {
    if (
        node.kind === ts.SyntaxKind.EnumMember ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.EnumLike)
    ) {
        console.log("checking enum", node.getText());
    }
    return (
        node.kind === ts.SyntaxKind.EnumMember ||
        isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.EnumLike)
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
*/
