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

const typeNames = {
    [TypeKind.Any]: "any",
    [TypeKind.Number]: "number",
    [TypeKind.Enum]: "enum",
    [TypeKind.String]: "string",
    [TypeKind.Boolean]: "boolean",
    [TypeKind.NullOrUndefined]: "null | undefined",
    [TypeKind.Object]: "object",
};

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

    public static INVALID_TYPES(types1: TypeKind[], types2: TypeKind[]) {
        const types1String = types1.map(type => typeNames[type]).join(" | ");
        const types2String = types2.map(type => typeNames[type]).join(" | ");

        return `cannot compare type '${types1String}' to type '${types2String}'`;
    }

    public static INVALID_TYPE_FOR_OPERATOR(type: TypeKind, comparator: string) {
        return `cannot use '${comparator}' comparator for type '${typeNames[type]}'`;
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
            const leftType = checker.getTypeAtLocation(node.left);
            const rightType = checker.getTypeAtLocation(node.right);

            const leftKinds: TypeKind[] = isUnionType(leftType)
                ? Array.from(new Set(leftType.types.map(getKind)))
                : [getKind(leftType)];
            const rightKinds: TypeKind[] = isUnionType(rightType)
                ? Array.from(new Set(rightType.types.map(getKind)))
                : [getKind(rightType)];

            const operandKind = getStrictestComparableType(leftKinds, rightKinds);

            if (operandKind === undefined) {
                const failureString = Rule.INVALID_TYPES(leftKinds, rightKinds);
                ctx.addFailureAtNode(node, failureString);
            } else {
                const failureString = Rule.INVALID_TYPE_FOR_OPERATOR(
                    operandKind,
                    node.operatorToken.getText(),
                );
                const isEquality = isEqualityOperator(node);
                if (isEquality) {
                    // Check !=, ==, !==, ===
                    switch (operandKind) {
                        case TypeKind.Any:
                        case TypeKind.Number:
                        case TypeKind.Enum:
                        case TypeKind.String:
                        case TypeKind.Boolean:
                            break;
                        case TypeKind.NullOrUndefined:
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

function getStrictestComparableType(types1: TypeKind[], types2: TypeKind[]): TypeKind | undefined {
    const overlappingTypes = types1.filter(type1 => types2.indexOf(type1) >= 0);

    if (overlappingTypes.length > 0) {
        return getStrictestKind(overlappingTypes);
    } else {
        // In case one of the types is "any", get the strictest type of the other array
        if (arrayContainsKind(types1, TypeKind.Any)) {
            return getStrictestKind(types2);
        }
        if (arrayContainsKind(types2, TypeKind.Any)) {
            return getStrictestKind(types1);
        }

        // In case one array contains NullOrUndefined and the other an Object, return Object
        if (
            (arrayContainsKind(types1, TypeKind.NullOrUndefined) &&
                arrayContainsKind(types2, TypeKind.Object)) ||
            (arrayContainsKind(types2, TypeKind.NullOrUndefined) &&
                arrayContainsKind(types1, TypeKind.Object))
        ) {
            return TypeKind.Object;
        }
        return undefined;
    }
}

function arrayContainsKind(types: TypeKind[], typeToCheck: TypeKind): boolean {
    return types.some(type => type === typeToCheck);
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
                    : is(ts.TypeFlags.Any)
                        ? TypeKind.Any
                        : TypeKind.Object;
    // tslint:enable:no-bitwise

    function is(flags: ts.TypeFlags) {
        return isTypeFlagSet(type, flags);
    }
}
