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

import { codeExamples } from "./code-examples/strictComparisons.examples";

const OPTION_ALLOW_OBJECT_EQUAL_COMPARISON = "allow-object-equal-comparison";
const OPTION_ALLOW_STRING_ORDER_COMPARISON = "allow-string-order-comparison";

const enum TypeKind {
    Any = 0,
    Number = 1,
    Enum = 2,
    String = 3,
    Boolean = 4,
    Null = 5,
    Undefined = 6,
    Object = 7,
}

const typeNames = {
    [TypeKind.Any]: "any",
    [TypeKind.Number]: "number",
    [TypeKind.Enum]: "enum",
    [TypeKind.String]: "string",
    [TypeKind.Boolean]: "boolean",
    [TypeKind.Null]: "null",
    [TypeKind.Undefined]: "undefined",
    [TypeKind.Object]: "object",
};

interface Options {
    [OPTION_ALLOW_OBJECT_EQUAL_COMPARISON]?: boolean;
    [OPTION_ALLOW_STRING_ORDER_COMPARISON]?: boolean;
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "strict-comparisons",
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

    public static INVALID_TYPES(types1: TypeKind[], types2: TypeKind[]) {
        const types1String = types1.map(type => typeNames[type]).join(" | ");
        const types2String = types2.map(type => typeNames[type]).join(" | ");

        return `Cannot compare type '${types1String}' to type '${types2String}'.`;
    }

    public static INVALID_TYPE_FOR_OPERATOR(type: TypeKind, comparator: string) {
        return `Cannot use '${comparator}' comparator for type '${typeNames[type]}'.`;
    }

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
            const leftType = checker.getTypeAtLocation(node.left);
            const rightType = checker.getTypeAtLocation(node.right);

            if (
                (containsNullOrUndefined(leftType) || containsNullOrUndefined(rightType)) &&
                isEquality
            ) {
                return;
            }

            const leftKinds: TypeKind[] = getTypes(leftType);
            const rightKinds: TypeKind[] = getTypes(rightType);
            const operandKind = getStrictestComparableType(leftKinds, rightKinds);

            if (operandKind === undefined) {
                const failureString = Rule.INVALID_TYPES(leftKinds, rightKinds);
                ctx.addFailureAtNode(node, failureString);
            } else {
                const failureString = Rule.INVALID_TYPE_FOR_OPERATOR(
                    operandKind,
                    node.operatorToken.getText(),
                );
                if (isEquality) {
                    // Check !=, ==, !==, ===
                    switch (operandKind) {
                        case TypeKind.Any:
                        case TypeKind.Number:
                        case TypeKind.Enum:
                        case TypeKind.String:
                        case TypeKind.Boolean:
                            break;
                        case TypeKind.Null:
                        case TypeKind.Undefined:
                        case TypeKind.Object:
                            if (options[OPTION_ALLOW_OBJECT_EQUAL_COMPARISON]) {
                                break;
                            }
                            ctx.addFailureAtNode(node, failureString);
                            break;
                        default:
                            ctx.addFailureAtNode(node, failureString);
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
                            ctx.addFailureAtNode(node, failureString);
                            break;
                        default:
                            ctx.addFailureAtNode(node, failureString);
                    }
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function containsNullOrUndefined(type: ts.Type) {
    return (
        (type as ts.IntrinsicType).intrinsicName === "null" ||
        (type as ts.IntrinsicType).intrinsicName === "undefined"
    );
}

function getTypes(types: ts.Type): TypeKind[] {
    // Compatibility for TypeScript pre-2.4, which used EnumLiteralType instead of LiteralType
    const baseType = ((types as any) as { baseType: ts.LiteralType }).baseType;
    return isUnionType(types)
        ? Array.from(new Set(types.types.map(getKind)))
        : isTypeFlagSet(types, ts.TypeFlags.EnumLiteral) && typeof baseType !== "undefined"
        ? [getKind(baseType)]
        : [getKind(types)];
}

function getStrictestComparableType(
    typesLeft: TypeKind[],
    typesRight: TypeKind[],
): TypeKind | undefined {
    const overlappingTypes = typesLeft.filter(type => typesRight.indexOf(type) >= 0);

    if (overlappingTypes.length > 0) {
        return getStrictestKind(overlappingTypes);
    } else {
        // In case one of the types is "any", get the strictest type of the other array
        if (arrayContainsKind(typesLeft, [TypeKind.Any])) {
            return getStrictestKind(typesRight);
        }
        if (arrayContainsKind(typesRight, [TypeKind.Any])) {
            return getStrictestKind(typesLeft);
        }

        // In case one array contains NullOrUndefined and the other an Object, return Object
        if (
            (arrayContainsKind(typesLeft, [TypeKind.Null, TypeKind.Undefined]) &&
                arrayContainsKind(typesRight, [TypeKind.Object])) ||
            (arrayContainsKind(typesRight, [TypeKind.Null, TypeKind.Undefined]) &&
                arrayContainsKind(typesLeft, [TypeKind.Object]))
        ) {
            return TypeKind.Object;
        }
        return undefined;
    }
}

function arrayContainsKind(types: TypeKind[], typeToCheck: TypeKind[]): boolean {
    return types.some(type => typeToCheck.indexOf(type) >= 0);
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
    if (is(ts.TypeFlags.String | ts.TypeFlags.StringLiteral)) {
        return TypeKind.String;
    } else if (is(ts.TypeFlags.Number | ts.TypeFlags.NumberLiteral)) {
        return TypeKind.Number;
    } else if (is(ts.TypeFlags.BooleanLike)) {
        return TypeKind.Boolean;
    } else if (is(ts.TypeFlags.Null)) {
        return TypeKind.Null;
    } else if (is(ts.TypeFlags.Undefined)) {
        return TypeKind.Undefined;
    } else if (is(ts.TypeFlags.Any)) {
        return TypeKind.Any;
    } else {
        return TypeKind.Object;
    }
    // tslint:enable:no-bitwise

    function is(flags: ts.TypeFlags) {
        return isTypeFlagSet(type, flags);
    }
}
