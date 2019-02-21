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

import { isBinaryExpression, isTypeFlagSet, isUnionType } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/objectComparison.examples";

const OPTION_ALLOW_OBJECT_EQUAL_COMPARISON = "allow-object-equal-comparison";
const OPTION_ALLOW_STRING_ORDER_COMPARISON = "allow-string-order-comparison";

const enum TypeKind {
    Any = 0,
    Number = 1,
    Enum = 2,
    String = 3,
    Boolean = 4,
    NullOrUndefined = 5,
    Object = 6,
}

interface Options {
    [OPTION_ALLOW_OBJECT_EQUAL_COMPARISON]?: boolean;
    [OPTION_ALLOW_STRING_ORDER_COMPARISON]?: boolean;
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-comparison",
        description: "Only allow comparisons between primitives.",
        optionsDescription: Lint.Utils.dedent`
                One of the following arguments may be optionally provided:
                * \`${OPTION_ALLOW_OBJECT_EQUAL_COMPARISON}\` allows \`!=\` \`==\` \`!==\` \`===\` comparison between any types.
                * \`${OPTION_ALLOW_STRING_ORDER_COMPARISON}\` allows \`>\` \`<\` \`>=\` \`<=\` comparison between strings.`,
        options: {
            type: "object",
            properties: {
                [OPTION_ALLOW_OBJECT_EQUAL_COMPARISON]: {
                    type: "boolean",
                },
                [OPTION_ALLOW_STRING_ORDER_COMPARISON]: {
                    type: "boolean",
                },
            },
        },
        optionExamples: [
            true,
            [
                true,
                {
                    [OPTION_ALLOW_OBJECT_EQUAL_COMPARISON]: false,
                    [OPTION_ALLOW_STRING_ORDER_COMPARISON]: false,
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
            const isEquality = isEqualityOperator(node);

            const leftKind = getKind(checker.getTypeAtLocation(node.left));
            const rightKind = getKind(checker.getTypeAtLocation(node.right));

            const operandKind = getStrictestKind([leftKind, rightKind]);

            if (isEquality) {
                // Check !=, ==, !==, ===
                if (options[OPTION_ALLOW_OBJECT_EQUAL_COMPARISON]) {
                    // With this option all equality checks are valid
                    return ts.forEachChild(node, cb);
                } else {
                    switch (operandKind) {
                        case TypeKind.Any:
                        case TypeKind.Number:
                        case TypeKind.Enum:
                        case TypeKind.String:
                        case TypeKind.Boolean:
                            break;
                        default:
                            ctx.addFailureAtNode(node, Rule.INVALID_COMPARISON);
                    }
                }
            } else {
                // Check >, <, >=, <=
                switch (operandKind) {
                    case TypeKind.Any:
                    case TypeKind.Number:
                        break;
                    case TypeKind.String:
                        if (options[OPTION_ALLOW_STRING_ORDER_COMPARISON]) {
                            break;
                        }
                        ctx.addFailureAtNode(node, Rule.INVALID_COMPARISON);
                        break;
                    default:
                        ctx.addFailureAtNode(node, Rule.INVALID_COMPARISON);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function getStrictestKind(types: TypeKind[]): TypeKind {
    // tslint:disable-next-line:no-unsafe-any
    return Math.max.apply(Math, types);
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

function getKind(type: ts.Type): TypeKind {
    // tslint:disable:no-bitwise
    return is(ts.TypeFlags.String | ts.TypeFlags.StringLiteral)
        ? TypeKind.String
        : is(ts.TypeFlags.Number | ts.TypeFlags.NumberLiteral)
            ? TypeKind.Number
            : is(ts.TypeFlags.BooleanLike)
                ? TypeKind.Boolean
                : is(ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)
                    ? TypeKind.NullOrUndefined
                    : isUnionType(type) && !is(ts.TypeFlags.Enum)
                        ? getStrictestKind(type.types.map(getKind))
                        : is(ts.TypeFlags.EnumLike)
                            ? getKind(type)
                            : is(ts.TypeFlags.Any)
                                ? TypeKind.Any
                                : TypeKind.Object;
    // tslint:enable:no-bitwise

    function is(flags: ts.TypeFlags) {
        return isTypeFlagSet(type, flags);
    }
}
