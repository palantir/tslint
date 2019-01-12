/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import {
    isBinaryExpression,
    isIdentifier,
    isLiteralExpression,
    isTypeFlagSet,
    isUnionType,
} from "tsutils";
import * as ts from "typescript";

import { showWarningOnce } from "../error";
import * as Lint from "../index";

// tslint:disable:no-bitwise

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "strict-type-predicates",
        description: Lint.Utils.dedent`
            Warns for type predicates that are always true or always false.
            Works for 'typeof' comparisons to constants (e.g. 'typeof foo === "string"'), and equality comparison to 'null'/'undefined'.
            (TypeScript won't let you compare '1 === 2', but it has an exception for '1 === undefined'.)
            Does not yet work for 'instanceof'.
            Does *not* warn for 'if (x.y)' where 'x.y' is always truthy. For that, see strict-boolean-expressions.

            This rule requires \`strictNullChecks\` to work properly.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_BAD_TYPEOF = "Bad comparison for 'typeof'.";

    public static FAILURE_STRING(value: boolean): string {
        return `Expression is always ${value}.`;
    }

    public static FAILURE_STRICT_PREFER_STRICT_EQUALS(
        value: "null" | "undefined",
        isPositive: boolean,
    ) {
        return `Use '${isPositive ? "===" : "!=="} ${value}' instead.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        if (!Lint.isStrictNullChecksEnabled(program.getCompilerOptions())) {
            showWarningOnce("strict-type-predicates does not work without --strictNullChecks");
            return [];
        }
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isBinaryExpression(node)) {
            const equals = Lint.getEqualsKind(node.operatorToken);
            if (equals !== undefined) {
                checkEquals(node, equals);
            }
        }
        return ts.forEachChild(node, cb);
    });

    function checkEquals(
        node: ts.BinaryExpression,
        { isStrict, isPositive }: Lint.EqualsKind,
    ): void {
        const exprPred = getTypePredicate(node, isStrict);
        if (exprPred === undefined) {
            return;
        }

        if (exprPred.kind === TypePredicateKind.TypeofTypo) {
            fail(Rule.FAILURE_STRING_BAD_TYPEOF);
            return;
        }

        const exprType = checker.getTypeAtLocation(exprPred.expression);
        // TODO: could use checker.getBaseConstraintOfType to help with type parameters, but it's not publicly exposed.
        if (
            isTypeFlagSet(
                exprType,
                ts.TypeFlags.Any | ts.TypeFlags.TypeParameter | ts.TypeFlags.Unknown,
            )
        ) {
            return;
        }

        switch (exprPred.kind) {
            case TypePredicateKind.Plain: {
                const { predicate, isNullOrUndefined } = exprPred;
                const value = getConstantBoolean(exprType, predicate);
                // 'null'/'undefined' are the only two values *not* assignable to '{}'.
                if (value !== undefined && (isNullOrUndefined || !isEmptyType(checker, exprType))) {
                    fail(Rule.FAILURE_STRING(value === isPositive));
                }
                break;
            }

            case TypePredicateKind.NonStructNullUndefined: {
                const result = testNonStrictNullUndefined(exprType);
                if (result !== undefined) {
                    fail(
                        typeof result === "boolean"
                            ? Rule.FAILURE_STRING(result === isPositive)
                            : Rule.FAILURE_STRICT_PREFER_STRICT_EQUALS(result, isPositive),
                    );
                }
            }
        }

        function fail(failure: string): void {
            ctx.addFailureAtNode(node, failure);
        }
    }
}

/** Detects a type predicate given `left === right`. */
function getTypePredicate(
    node: ts.BinaryExpression,
    isStrictEquals: boolean,
): TypePredicate | undefined {
    const { left, right } = node;
    const lr = getTypePredicateOneWay(left, right, isStrictEquals);
    return lr !== undefined ? lr : getTypePredicateOneWay(right, left, isStrictEquals);
}

/** Only gets the type predicate if the expression is on the left. */
function getTypePredicateOneWay(
    left: ts.Expression,
    right: ts.Expression,
    isStrictEquals: boolean,
): TypePredicate | undefined {
    switch (right.kind) {
        case ts.SyntaxKind.TypeOfExpression:
            const expression = (right as ts.TypeOfExpression).expression;
            if (!isLiteralExpression(left)) {
                if (
                    (isIdentifier(left) && left.text === "undefined") ||
                    left.kind === ts.SyntaxKind.NullKeyword ||
                    left.kind === ts.SyntaxKind.TrueKeyword ||
                    left.kind === ts.SyntaxKind.FalseKeyword
                ) {
                    return { kind: TypePredicateKind.TypeofTypo };
                }
                return undefined;
            }
            const predicate = getTypePredicateForKind(left.text);
            return predicate === undefined
                ? { kind: TypePredicateKind.TypeofTypo }
                : {
                      expression,
                      isNullOrUndefined: left.text === "undefined",
                      kind: TypePredicateKind.Plain,
                      predicate,
                  };

        case ts.SyntaxKind.NullKeyword:
            return nullOrUndefined(ts.TypeFlags.Null);

        case ts.SyntaxKind.Identifier:
            if ((right as ts.Identifier).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword) {
                return nullOrUndefined(undefinedFlags);
            }
            return undefined;
        default:
            return undefined;
    }

    function nullOrUndefined(flags: ts.TypeFlags): TypePredicate {
        return isStrictEquals
            ? {
                  expression: left,
                  isNullOrUndefined: true,
                  kind: TypePredicateKind.Plain,
                  predicate: flagPredicate(flags),
              }
            : { kind: TypePredicateKind.NonStructNullUndefined, expression: left };
    }
}

function isEmptyType(checker: ts.TypeChecker, type: ts.Type) {
    return checker.typeToString(type) === "{}";
}

const undefinedFlags = ts.TypeFlags.Undefined | ts.TypeFlags.Void;

type TypePredicate =
    | PlainTypePredicate
    | NonStrictNullUndefinedPredicate
    | { kind: TypePredicateKind.TypeofTypo };
interface PlainTypePredicate {
    kind: TypePredicateKind.Plain;
    expression: ts.Expression;
    predicate: Predicate;
    isNullOrUndefined: boolean;
}
/** For `== null` and the like. */
interface NonStrictNullUndefinedPredicate {
    kind: TypePredicateKind.NonStructNullUndefined;
    expression: ts.Expression;
}
const enum TypePredicateKind {
    Plain,
    NonStructNullUndefined,
    TypeofTypo,
}

type Predicate = (type: ts.Type) => boolean;

function getTypePredicateForKind(kind: string): Predicate | undefined {
    switch (kind) {
        case "undefined":
            return flagPredicate(undefinedFlags);
        case "boolean":
            return flagPredicate(ts.TypeFlags.BooleanLike);
        case "number":
            return flagPredicate(ts.TypeFlags.NumberLike);
        case "string":
            return flagPredicate(ts.TypeFlags.StringLike);
        case "symbol":
            return flagPredicate(ts.TypeFlags.ESSymbol);
        case "function":
            return isFunction;
        case "object":
            // It's an object if it's not any of the above.
            const allFlags =
                ts.TypeFlags.Undefined |
                ts.TypeFlags.Void |
                ts.TypeFlags.BooleanLike |
                ts.TypeFlags.NumberLike |
                ts.TypeFlags.StringLike |
                ts.TypeFlags.ESSymbol;
            return type => !isTypeFlagSet(type, allFlags) && !isFunction(type);
        default:
            return undefined;
    }
}

function flagPredicate(testedFlag: ts.TypeFlags): Predicate {
    return type => isTypeFlagSet(type, testedFlag);
}

function isFunction(t: ts.Type): boolean {
    if (t.getConstructSignatures().length !== 0 || t.getCallSignatures().length !== 0) {
        return true;
    }
    const symbol = t.getSymbol();
    return symbol !== undefined && symbol.getName() === "Function";
}

/** Returns a boolean value if that should always be the result of a type predicate. */
function getConstantBoolean(
    type: ts.Type,
    predicate: (t: ts.Type) => boolean,
): boolean | undefined {
    let anyTrue = false;
    let anyFalse = false;
    for (const ty of unionParts(type)) {
        if (predicate(ty)) {
            anyTrue = true;
        } else {
            anyFalse = true;
        }

        if (anyTrue && anyFalse) {
            return undefined;
        }
    }

    return anyTrue;
}

/** Returns bool for always/never true, or a string to recommend strict equality. */
function testNonStrictNullUndefined(type: ts.Type): boolean | "null" | "undefined" | undefined {
    let anyNull = false;
    let anyUndefined = false;
    let anyOther = false;
    for (const ty of unionParts(type)) {
        if (isTypeFlagSet(ty, ts.TypeFlags.Null)) {
            anyNull = true;
        } else if (isTypeFlagSet(ty, undefinedFlags)) {
            anyUndefined = true;
        } else {
            anyOther = true;
        }
    }

    return !anyOther
        ? true
        : anyNull && anyUndefined
            ? undefined
            : anyNull
                ? "null"
                : anyUndefined
                    ? "undefined"
                    : false;
}

function unionParts(type: ts.Type) {
    return isUnionType(type) ? type.types : [type];
}
