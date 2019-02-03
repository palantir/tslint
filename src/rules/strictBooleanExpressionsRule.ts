/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { isTypeFlagSet } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALLOW_NULL_UNION = "allow-null-union";
const OPTION_ALLOW_UNDEFINED_UNION = "allow-undefined-union";
const OPTION_ALLOW_STRING = "allow-string";
const OPTION_ALLOW_ENUM = "allow-enum";
const OPTION_ALLOW_NUMBER = "allow-number";
const OPTION_ALLOW_MIX = "allow-mix";
const OPTION_ALLOW_BOOLEAN_OR_UNDEFINED = "allow-boolean-or-undefined";
const OPTION_IGNORE_RHS = "ignore-rhs";

// tslint:disable object-literal-sort-keys no-bitwise

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "strict-boolean-expressions",
        description: Lint.Utils.dedent`
            Restricts the types allowed in boolean expressions. By default only booleans are allowed.

            The following nodes are checked:

            * Arguments to the \`!\`, \`&&\`, and \`||\` operators
            * The condition in a conditional expression (\`cond ? x : y\`)
            * Conditions for \`if\`, \`for\`, \`while\`, and \`do-while\` statements.`,
        optionsDescription: Lint.Utils.dedent`
            These options may be provided:

            * \`${OPTION_ALLOW_NULL_UNION}\` allows union types containing \`null\`.
              - It does *not* allow \`null\` itself.
              - Without the '--strictNullChecks' compiler option, this will allow anything other than a string, number, or enum.
            * \`${OPTION_ALLOW_UNDEFINED_UNION}\` allows union types containing \`undefined\`.
              - It does *not* allow \`undefined\` itself.
              - Without the '--strictNullChecks' compiler option, this will allow anything other than a string, number, or enum.
            * \`${OPTION_ALLOW_STRING}\` allows strings.
              - It does *not* allow unions containing \`string\`.
              - It does *not* allow string literal types.
            * \`${OPTION_ALLOW_ENUM}\` allows enums.
              - It does *not* allow unions containing \`enum\`.
            * \`${OPTION_ALLOW_NUMBER}\` allows numbers.
              - It does *not* allow unions containing \`number\`.
              - It does *not* allow enums or number literal types.
            * \`${OPTION_ALLOW_MIX}\` allows multiple of the above to appear together.
              - For example, \`string | number\` or \`RegExp | null | undefined\` would normally not be allowed.
              - A type like \`"foo" | "bar" | undefined\` is always allowed, because it has only one way to be false.
            * \`${OPTION_ALLOW_BOOLEAN_OR_UNDEFINED}\` allows \`boolean | undefined\`.
              - Also allows \`true | false | undefined\`.
              - Does not allow \`false | undefined\`.
              - This option is a subset of \`${OPTION_ALLOW_UNDEFINED_UNION}\`, so you don't need to enable both options at the same time.
            * \`${OPTION_IGNORE_RHS}\` ignores the right-hand operand of \`&&\` and \`||\'
        `,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_ALLOW_NULL_UNION,
                    OPTION_ALLOW_UNDEFINED_UNION,
                    OPTION_ALLOW_STRING,
                    OPTION_ALLOW_ENUM,
                    OPTION_ALLOW_NUMBER,
                    OPTION_ALLOW_BOOLEAN_OR_UNDEFINED,
                    OPTION_IGNORE_RHS,
                ],
            },
            minLength: 0,
            maxLength: 7,
        },
        optionExamples: [
            true,
            [
                true,
                OPTION_ALLOW_NULL_UNION,
                OPTION_ALLOW_UNDEFINED_UNION,
                OPTION_ALLOW_STRING,
                OPTION_ALLOW_ENUM,
                OPTION_ALLOW_NUMBER,
            ],
            [true, OPTION_ALLOW_BOOLEAN_OR_UNDEFINED],
        ],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const options = parseOptions(
            this.ruleArguments,
            Lint.isStrictNullChecksEnabled(program.getCompilerOptions()),
        );
        return this.applyWithFunction(sourceFile, walk, options, program.getTypeChecker());
    }
}

interface Options {
    strictNullChecks: boolean;
    allowNullUnion: boolean;
    allowUndefinedUnion: boolean;
    allowString: boolean;
    allowEnum: boolean;
    allowNumber: boolean;
    allowMix: boolean;
    allowBooleanOrUndefined: boolean;
    ignoreRhs: boolean;
}

function parseOptions(ruleArguments: string[], strictNullChecks: boolean): Options {
    return {
        strictNullChecks,
        allowNullUnion: has(OPTION_ALLOW_NULL_UNION),
        allowUndefinedUnion: has(OPTION_ALLOW_UNDEFINED_UNION),
        allowString: has(OPTION_ALLOW_STRING),
        allowEnum: has(OPTION_ALLOW_ENUM),
        allowNumber: has(OPTION_ALLOW_NUMBER),
        allowMix: has(OPTION_ALLOW_MIX),
        allowBooleanOrUndefined: has(OPTION_ALLOW_BOOLEAN_OR_UNDEFINED),
        ignoreRhs: has(OPTION_IGNORE_RHS),
    };

    function has(name: string): boolean {
        return ruleArguments.indexOf(name) !== -1;
    }
}

function walk(ctx: Lint.WalkContext<Options>, checker: ts.TypeChecker): void {
    const { sourceFile, options } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.BinaryExpression: {
                const b = node as ts.BinaryExpression;
                if (binaryBooleanExpressionKind(b) !== undefined) {
                    const { left, right } = b;
                    // If ignore-rhs is off, we don't have to analyze a boolean binary expression
                    // on the left side because it will be checked well enough on its own.  However,
                    // if ignore-rhs is on, we have to analyze the overall result of the left
                    // side no matter what, because its right side might not follow the rules.
                    if (options.ignoreRhs || !isBooleanBinaryExpression(left)) {
                        checkExpression(left, b);
                    }
                    // If ignore-rhs is on, we don't have to analyze the right hand side
                    // We also don't have to analyze the right hand side if it is also a
                    // boolean binary expression; its own inner check is sufficient.
                    if (!(options.ignoreRhs || isBooleanBinaryExpression(right))) {
                        checkExpression(right, b);
                    }
                }
                break;
            }

            case ts.SyntaxKind.PrefixUnaryExpression: {
                const { operator, operand } = node as ts.PrefixUnaryExpression;
                if (operator === ts.SyntaxKind.ExclamationToken) {
                    checkExpression(operand, node as ts.PrefixUnaryExpression);
                }
                break;
            }

            case ts.SyntaxKind.IfStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.DoStatement: {
                const c = node as ts.IfStatement | ts.WhileStatement | ts.DoStatement;
                // If it's a boolean binary expression, we'll check it when recursing.
                if (!isBooleanBinaryExpression(c.expression)) {
                    checkExpression(c.expression, c);
                }
                break;
            }

            case ts.SyntaxKind.ConditionalExpression:
                checkExpression(
                    (node as ts.ConditionalExpression).condition,
                    node as ts.ConditionalExpression,
                );
                break;

            case ts.SyntaxKind.ForStatement: {
                const { condition } = node as ts.ForStatement;
                if (condition !== undefined) {
                    checkExpression(condition, node as ts.ForStatement);
                }
            }
        }

        return ts.forEachChild(node, cb);
    });

    function checkExpression(node: ts.Expression, location: Location): void {
        const type = checker.getTypeAtLocation(node);
        const failure = getTypeFailure(type, options);
        if (failure !== undefined) {
            if (
                failure === TypeFailure.AlwaysTruthy &&
                !options.strictNullChecks &&
                (options.allowNullUnion || options.allowUndefinedUnion)
            ) {
                // OK; It might be null/undefined.
                return;
            }

            ctx.addFailureAtNode(node, showFailure(location, failure, isUnionType(type), options));
        }
    }
}

function getTypeFailure(type: ts.Type, options: Options): TypeFailure | undefined {
    if (isUnionType(type)) {
        return handleUnion(type, options);
    }

    const kind = getKind(type);
    const failure = failureForKind(kind, /*isInUnion*/ false, options);
    if (failure !== undefined) {
        return failure;
    }

    switch (triState(kind)) {
        case true:
            // Allow 'any'. Allow 'true' itself, but not any other always-truthy type.
            return isTypeFlagSet(type, ts.TypeFlags.Any | ts.TypeFlags.BooleanLiteral)
                ? undefined
                : TypeFailure.AlwaysTruthy;
        case false:
            // Allow 'false' itself, but not any other always-falsy type
            return isTypeFlagSet(type, ts.TypeFlags.BooleanLiteral)
                ? undefined
                : TypeFailure.AlwaysFalsy;
        case undefined:
            return undefined;
    }
}

function isBooleanUndefined(type: ts.UnionType): boolean | undefined {
    let isTruthy = false;
    for (const ty of type.types) {
        if (isTypeFlagSet(ty, ts.TypeFlags.Boolean)) {
            isTruthy = true;
        } else if (isTypeFlagSet(ty, ts.TypeFlags.BooleanLiteral)) {
            isTruthy = isTruthy || (ty as ts.IntrinsicType).intrinsicName === "true";
            // tslint:disable-next-line:no-bitwise
        } else if (!isTypeFlagSet(ty, ts.TypeFlags.Void | ts.TypeFlags.Undefined)) {
            return undefined;
        }
    }
    return isTruthy;
}

function handleUnion(type: ts.UnionType, options: Options): TypeFailure | undefined {
    if (options.allowBooleanOrUndefined) {
        switch (isBooleanUndefined(type)) {
            case true:
                return undefined;
            case false:
                return TypeFailure.AlwaysFalsy;
        }
    }
    // Tracks whether it's possibly truthy.
    let anyTruthy = false;
    // Counts falsy kinds to see if there's a mix. Also tracks whether it's possibly falsy.
    let seenFalsy = 0;

    for (const ty of type.types) {
        const kind = getKind(ty);
        const failure = failureForKind(kind, /*isInUnion*/ true, options);
        if (failure !== undefined) {
            return failure;
        }

        switch (triState(kind)) {
            case true:
                anyTruthy = true;
                break;
            case false:
                seenFalsy++;
                break;
            default:
                anyTruthy = true;
                seenFalsy++;
        }
    }

    return seenFalsy === 0
        ? TypeFailure.AlwaysTruthy
        : !anyTruthy
            ? TypeFailure.AlwaysFalsy
            : !options.allowMix && seenFalsy > 1
                ? TypeFailure.Mixes
                : undefined;
}

/** Fails if a kind of falsiness is not allowed. */
function failureForKind(
    kind: TypeKind,
    isInUnion: boolean,
    options: Options,
): TypeFailure | undefined {
    switch (kind) {
        case TypeKind.String:
        case TypeKind.FalseStringLiteral:
            return options.allowString ? undefined : TypeFailure.String;
        case TypeKind.Number:
        case TypeKind.FalseNumberLiteral:
            return options.allowNumber ? undefined : TypeFailure.Number;
        case TypeKind.Enum:
            return options.allowEnum ? undefined : TypeFailure.Enum;
        case TypeKind.Null:
            return isInUnion && !options.allowNullUnion ? TypeFailure.Null : undefined;
        case TypeKind.Undefined:
            return isInUnion && !options.allowUndefinedUnion ? TypeFailure.Undefined : undefined;
        default:
            return undefined;
    }
}

export type Location =
    | ts.PrefixUnaryExpression
    | ts.IfStatement
    | ts.WhileStatement
    | ts.DoStatement
    | ts.ForStatement
    | ts.ConditionalExpression
    | ts.BinaryExpression;

export const enum TypeFailure {
    AlwaysTruthy,
    AlwaysFalsy,
    String,
    Number,
    Null,
    Undefined,
    Enum,
    Mixes,
}

const enum TypeKind {
    String,
    FalseStringLiteral,
    Number,
    FalseNumberLiteral,
    Boolean,
    FalseBooleanLiteral,
    Null,
    Undefined,
    Enum,
    AlwaysTruthy,
}

/** Divides a type into always true, always false, or unknown. */
function triState(kind: TypeKind): boolean | undefined {
    switch (kind) {
        case TypeKind.String:
        case TypeKind.Number:
        case TypeKind.Boolean:
        case TypeKind.Enum:
            return undefined;

        case TypeKind.Null:
        case TypeKind.Undefined:
        case TypeKind.FalseNumberLiteral:
        case TypeKind.FalseStringLiteral:
        case TypeKind.FalseBooleanLiteral:
            return false;

        case TypeKind.AlwaysTruthy:
            return true;
    }
}

function getKind(type: ts.Type): TypeKind {
    return is(ts.TypeFlags.String)
        ? TypeKind.String
        : is(ts.TypeFlags.Number)
            ? TypeKind.Number
            : is(ts.TypeFlags.Boolean)
                ? TypeKind.Boolean
                : is(ts.TypeFlags.Null)
                    ? TypeKind.Null // tslint:disable-next-line:no-bitwise
                    : is(ts.TypeFlags.Undefined | ts.TypeFlags.Void)
                        ? TypeKind.Undefined
                        : is(ts.TypeFlags.EnumLike)
                            ? TypeKind.Enum
                            : is(ts.TypeFlags.NumberLiteral)
                                ? numberLiteralIsZero(type as ts.NumberLiteralType)
                                    ? TypeKind.FalseNumberLiteral
                                    : TypeKind.AlwaysTruthy
                                : is(ts.TypeFlags.StringLiteral)
                                    ? stringLiteralIsEmpty(type as ts.StringLiteralType)
                                        ? TypeKind.FalseStringLiteral
                                        : TypeKind.AlwaysTruthy
                                    : is(ts.TypeFlags.BooleanLiteral)
                                        ? (type as ts.IntrinsicType).intrinsicName === "true"
                                            ? TypeKind.AlwaysTruthy
                                            : TypeKind.FalseBooleanLiteral
                                        : TypeKind.AlwaysTruthy;

    function is(flags: ts.TypeFlags) {
        return isTypeFlagSet(type, flags);
    }
}

function numberLiteralIsZero(type: ts.NumberLiteralType): boolean {
    // for compatibility with typescript@<2.4.0
    return type.value !== undefined ? type.value === 0 : (type as any).text === "0";
}
function stringLiteralIsEmpty(type: ts.StringLiteralType): boolean {
    // for compatibility with typescript@<2.4.0
    return (type.value !== undefined ? type.value : (type as any).text) === "";
}

/** Matches `&&` and `||` operators. */
function isBooleanBinaryExpression(node: ts.Expression): boolean {
    return (
        node.kind === ts.SyntaxKind.BinaryExpression &&
        binaryBooleanExpressionKind(node as ts.BinaryExpression) !== undefined
    );
}

function binaryBooleanExpressionKind(node: ts.BinaryExpression): "&&" | "||" | undefined {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.AmpersandAmpersandToken:
            return "&&";
        case ts.SyntaxKind.BarBarToken:
            return "||";
        default:
            return undefined;
    }
}

function stringOr(parts: string[]): string {
    switch (parts.length) {
        case 1:
            return parts[0];
        case 2:
            return `${parts[0]} or ${parts[1]}`;
        default:
            let res = "";
            for (let i = 0; i < parts.length - 1; i++) {
                res += `${parts[i]}, `;
            }
            return `${res}or ${parts[parts.length - 1]}`;
    }
}

function isUnionType(type: ts.Type): type is ts.UnionType {
    return isTypeFlagSet(type, ts.TypeFlags.Union) && !isTypeFlagSet(type, ts.TypeFlags.Enum);
}

function showLocation(n: Location): string {
    switch (n.kind) {
        case ts.SyntaxKind.PrefixUnaryExpression:
            return "operand for the '!' operator";
        case ts.SyntaxKind.ConditionalExpression:
            return "condition";
        case ts.SyntaxKind.ForStatement:
            return "'for' condition";
        case ts.SyntaxKind.IfStatement:
            return "'if' condition";
        case ts.SyntaxKind.WhileStatement:
            return "'while' condition";
        case ts.SyntaxKind.DoStatement:
            return "'do-while' condition";
        case ts.SyntaxKind.BinaryExpression:
            return `operand for the '${binaryBooleanExpressionKind(n)}' operator`;
    }
}

function showFailure(
    location: Location,
    ty: TypeFailure,
    unionType: boolean,
    options: Options,
): string {
    const expectedTypes = showExpectedTypes(options);
    const expected =
        expectedTypes.length === 1
            ? `Only ${expectedTypes[0]}s are allowed`
            : `Allowed types are ${stringOr(expectedTypes)}`;
    const tyFail = showTypeFailure(ty, unionType, options.strictNullChecks);
    return `This type is not allowed in the ${showLocation(
        location,
    )} because it ${tyFail}. ${expected}.`;
}

function showExpectedTypes(options: Options): string[] {
    const parts = ["boolean"];
    if (options.allowNullUnion) {
        parts.push("null-union");
    }
    if (options.allowUndefinedUnion) {
        parts.push("undefined-union");
    }
    if (options.allowString) {
        parts.push("string");
    }
    if (options.allowEnum) {
        parts.push("enum");
    }
    if (options.allowNumber) {
        parts.push("number");
    }
    if (options.allowBooleanOrUndefined) {
        parts.push("boolean-or-undefined");
    }
    return parts;
}

function showTypeFailure(ty: TypeFailure, unionType: boolean, strictNullChecks: boolean) {
    const is = unionType ? "could be" : "is";
    switch (ty) {
        case TypeFailure.AlwaysTruthy:
            return strictNullChecks
                ? "is always truthy"
                : "is always truthy. It may be null/undefined, but neither " +
                      `'${OPTION_ALLOW_NULL_UNION}' nor '${OPTION_ALLOW_UNDEFINED_UNION}' is set`;
        case TypeFailure.AlwaysFalsy:
            return "is always falsy";
        case TypeFailure.String:
            return `${is} a string`;
        case TypeFailure.Number:
            return `${is} a number`;
        case TypeFailure.Null:
            return `${is} null`;
        case TypeFailure.Undefined:
            return `${is} undefined`;
        case TypeFailure.Enum:
            return `${is} an enum`;
        case TypeFailure.Mixes:
            return "unions more than one truthy/falsy type";
    }
}

declare module "typescript" {
    // No other way to distinguish boolean literal true from boolean literal false
    export interface IntrinsicType extends ts.Type {
        intrinsicName: string;
    }
}
