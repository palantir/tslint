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

import * as ts from "typescript";
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
            Does *not* warn for 'if (x.y)' where 'x.y' is always truthy. For that, see strict-boolean-expressions.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(value: boolean): string {
        return `Expression is always ${value}.`;
    }

    public static FAILURE_STRICT_PREFER_STRICT_EQUALS(value: "null" | "undefined", isPositive: boolean) {
        return `Use '${isPositive ? "===" : "!=="} ${value}' instead.`;
    }

    public applyWithProgram(srcFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(srcFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    public visitBinaryExpression(node: ts.BinaryExpression) {
        const equals = getEquals(node.operatorToken.kind);
        if (equals) {
            this.checkEquals(node, equals);
        }
        super.visitBinaryExpression(node);
    }

    private checkEquals(node: ts.BinaryExpression, { isStrict, isPositive }: Equals) {
        const exprPred = getTypePredicate(node, isStrict);
        if (!exprPred) {
            return;
        }

        const checker = this.getTypeChecker();
        const exprType = checker.getTypeAtLocation(exprPred.expression);
        // TODO: could use checker.getBaseConstraintOfType to help with type parameters, but it's not publicly exposed.
        if (Lint.isTypeFlagSet(exprType, ts.TypeFlags.Any | ts.TypeFlags.TypeParameter)) {
            return;
        }

        const fail = (failure: string) => this.addFailureAtNode(node, failure);

        if (exprPred.isPlain) {
            const { predicate, isNullOrUndefined } = exprPred;
            const value = getConstantBoolean(exprType, predicate);
            // 'null'/'undefined' are the only two values *not* assignable to '{}'.
            if (value !== undefined && (isNullOrUndefined || !isEmptyType(checker, exprType))) {
                fail(Rule.FAILURE_STRING(value === isPositive));
            }
        } else {
            const result = testNonStrictNullUndefined(exprType);
            switch (typeof result) {
                case "boolean":
                    fail(Rule.FAILURE_STRING(result === isPositive));
                    break;

                case "string":
                    fail(Rule.FAILURE_STRICT_PREFER_STRICT_EQUALS(result as "null" | "undefined", isPositive));
                    break;

                default:
            }
        }

    }
}

/** Detects a type predicate given `left === right`. */
function getTypePredicate(node: ts.BinaryExpression, isStrictEquals: boolean): TypePredicate | undefined {
    const { left, right } = node;
    return getTypePredicateOneWay(left, right, isStrictEquals) || getTypePredicateOneWay(right, left, isStrictEquals);
}

/** Only gets the type predicate if the expression is on the left. */
function getTypePredicateOneWay(left: ts.Expression, right: ts.Expression, isStrictEquals: boolean): TypePredicate | undefined {
    switch (right.kind) {
        case ts.SyntaxKind.StringLiteral:
            if (left.kind !== ts.SyntaxKind.TypeOfExpression) {
                return undefined;
            }
            const expression = (left as ts.TypeOfExpression).expression;
            const kind = (right as ts.StringLiteral).text;
            return { isPlain: true, expression, predicate: getTypePredicateForKind(kind), isNullOrUndefined: kind === "undefined" };

        case ts.SyntaxKind.NullKeyword:
            return nullOrUndefined(ts.TypeFlags.Null);

        case ts.SyntaxKind.Identifier:
            if ((right as ts.Identifier).text === "undefined") {
                return nullOrUndefined(undefinedFlags);
            }

        default:
            return undefined;
    }

    function nullOrUndefined(flags: ts.TypeFlags): TypePredicate {
        return isStrictEquals
            ? { isPlain: true, expression: left, predicate: flagPredicate(flags), isNullOrUndefined: true }
            : { isPlain: false, expression: left };
    }
}

function isEmptyType(checker: ts.TypeChecker, type: ts.Type) {
    return checker.typeToString(type) === "{}";
}

const undefinedFlags = ts.TypeFlags.Undefined | ts.TypeFlags.Void;

type TypePredicate = PlainTypePredicate | NonStrictNullUndefinedPredicate;
interface PlainTypePredicate {
    isPlain: true;
    expression: ts.Expression;
    predicate: Predicate;
    isNullOrUndefined: boolean;
}
/** For `== null` and the like. */
interface NonStrictNullUndefinedPredicate {
    isPlain: false;
    expression: ts.Expression;
}

type Predicate = (type: ts.Type) => boolean;

function getTypePredicateForKind(kind: string): Predicate {
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
            const allFlags = ts.TypeFlags.Undefined | ts.TypeFlags.Void | ts.TypeFlags.BooleanLike |
                ts.TypeFlags.NumberLike | ts.TypeFlags.StringLike | ts.TypeFlags.ESSymbol;
            return (type) => !Lint.isTypeFlagSet(type, allFlags) && !isFunction(type);
        default:
            return (_) => false;
    }
}

function flagPredicate(testedFlag: ts.TypeFlags): Predicate {
    return (type) => Lint.isTypeFlagSet(type, testedFlag);
}

function isFunction(t: ts.Type): boolean {
    if (t.getCallSignatures().length !== 0) {
        return true;
    }
    const symbol = t.getSymbol();
    return (symbol && symbol.getName()) === "Function";
}

/** Returns a boolean value if that should always be the result of a type predicate. */
function getConstantBoolean(type: ts.Type, predicate: (t: ts.Type) => boolean): boolean | undefined {
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
function testNonStrictNullUndefined(type: ts.Type): boolean | string | undefined {
    let anyNull = false;
    let anyUndefined = false;
    let anyOther = false;
    for (const ty of unionParts(type)) {
        if (Lint.isTypeFlagSet(ty, ts.TypeFlags.Null)) {
            anyNull = true;
        } else if (Lint.isTypeFlagSet(ty, undefinedFlags)) {
            anyUndefined = true;
        } else {
            anyOther = true;
        }
    }

    return !anyOther ? true
        : anyNull && anyUndefined ? undefined
        : anyNull ? "null"
        : anyUndefined ? "undefined"
        : false;
}

interface Equals {
    isPositive: boolean; // True for "===" and "=="
    isStrict: boolean; // True for "===" and "!=="
}

function getEquals(kind: ts.SyntaxKind): Equals | undefined {
    switch (kind) {
        case ts.SyntaxKind.EqualsEqualsToken:
            return { isPositive: true, isStrict: false };
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
            return { isPositive: true, isStrict: true };
        case ts.SyntaxKind.ExclamationEqualsToken:
            return { isPositive: false, isStrict: false };
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return { isPositive: false, isStrict: true };
        default:
            return undefined;
    }
}

function unionParts(type: ts.Type) {
    return isUnionType(type) ? type.types : [type];
}

/** Type predicate to test for a union type. */
function isUnionType(type: ts.Type): type is ts.UnionType {
    return Lint.isTypeFlagSet(type, ts.TypeFlags.Union);
}
