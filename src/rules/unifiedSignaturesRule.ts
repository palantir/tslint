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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { arraysAreEqual, Equal } from "../utils";

import { getOverloadKey } from "./adjacentOverloadSignaturesRule";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "unified-signatures",
        description:
            "Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_OMITTING_SINGLE_PARAMETER(otherLine?: number) {
        return `${this.FAILURE_STRING_START(otherLine)} with an optional parameter.`;
    }
    public static FAILURE_STRING_OMITTING_REST_PARAMETER(otherLine?: number) {
        return `${this.FAILURE_STRING_START(otherLine)} with a rest parameter.`;
    }
    public static FAILURE_STRING_SINGLE_PARAMETER_DIFFERENCE(
        otherLine: number | undefined,
        type1: string,
        type2: string
    ) {
        return `${this.FAILURE_STRING_START(otherLine)} taking \`${type1} | ${type2}\`.`;
    }
    private static FAILURE_STRING_START(otherLine?: number): string {
        // For only 2 overloads we don't need to specify which is the other one.
        const overloads =
            otherLine === undefined
                ? "These overloads"
                : `This overload and the one on line ${otherLine}`;
        return `${overloads} can be combined into one signature`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    checkStatements(sourceFile.statements);
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ModuleBlock:
                checkStatements((node as ts.ModuleBlock).statements);
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration: {
                const { members, typeParameters } = node as
                    | ts.ClassDeclaration
                    | ts.InterfaceDeclaration;
                checkMembers(members, typeParameters);
                break;
            }
            case ts.SyntaxKind.TypeLiteral:
                checkMembers((node as ts.TypeLiteralNode).members);
        }

        return ts.forEachChild(node, cb);
    });

    function checkStatements(statements: ReadonlyArray<ts.Statement>): void {
        addFailures(
            checkOverloads(statements, undefined, statement => {
                if (utils.isFunctionDeclaration(statement)) {
                    const { body, name } = statement;
                    return body === undefined && name !== undefined
                        ? { signature: statement, key: name.text }
                        : undefined;
                } else {
                    return undefined;
                }
            })
        );
    }

    function checkMembers(
        members: ReadonlyArray<ts.TypeElement | ts.ClassElement>,
        typeParameters?: ReadonlyArray<ts.TypeParameterDeclaration>
    ): void {
        addFailures(
            checkOverloads(members, typeParameters, member => {
                switch (member.kind) {
                    case ts.SyntaxKind.CallSignature:
                    case ts.SyntaxKind.ConstructSignature:
                    case ts.SyntaxKind.MethodSignature:
                        break;
                    case ts.SyntaxKind.MethodDeclaration:
                    case ts.SyntaxKind.Constructor:
                        if (
                            (member as ts.MethodDeclaration | ts.ConstructorDeclaration).body !==
                            undefined
                        ) {
                            return undefined;
                        }
                        break;
                    default:
                        return undefined;
                }

                const signature = member as
                    | ts.CallSignatureDeclaration
                    | ts.ConstructSignatureDeclaration
                    | ts.MethodSignature
                    | ts.MethodDeclaration
                    | ts.ConstructorDeclaration;
                const key = getOverloadKey(signature);
                return key === undefined ? undefined : { signature, key };
            })
        );
    }

    function addFailures(failures: Failure[]): void {
        for (const failure of failures) {
            const { unify, only2 } = failure;
            switch (unify.kind) {
                case "single-parameter-difference": {
                    const { p0, p1 } = unify;
                    const lineOfOtherOverload = only2 ? undefined : getLine(p0.getStart());
                    ctx.addFailureAtNode(
                        p1,
                        Rule.FAILURE_STRING_SINGLE_PARAMETER_DIFFERENCE(
                            lineOfOtherOverload,
                            typeText(p0),
                            typeText(p1)
                        )
                    );
                    break;
                }
                case "extra-parameter": {
                    const { extraParameter, otherSignature } = unify;
                    const lineOfOtherOverload = only2 ? undefined : getLine(otherSignature.pos);
                    ctx.addFailureAtNode(
                        extraParameter,
                        extraParameter.dotDotDotToken !== undefined
                            ? Rule.FAILURE_STRING_OMITTING_REST_PARAMETER(lineOfOtherOverload)
                            : Rule.FAILURE_STRING_OMITTING_SINGLE_PARAMETER(lineOfOtherOverload)
                    );
                }
            }
        }
    }

    function getLine(pos: number): number {
        return ts.getLineAndCharacterOfPosition(sourceFile, pos).line + 1;
    }
}

interface Failure {
    unify: Unify;
    only2: boolean;
}
type Unify =
    | {
          kind: "single-parameter-difference";
          p0: ts.ParameterDeclaration;
          p1: ts.ParameterDeclaration;
      }
    | {
          kind: "extra-parameter";
          extraParameter: ts.ParameterDeclaration;
          otherSignature: ts.NodeArray<ts.ParameterDeclaration>;
      };

function checkOverloads<T>(
    signatures: ReadonlyArray<T>,
    typeParameters: ReadonlyArray<ts.TypeParameterDeclaration> | undefined,
    getOverload: GetOverload<T>
): Failure[] {
    const result: Failure[] = [];
    const isTypeParameter = getIsTypeParameter(typeParameters);
    for (const overloads of collectOverloads(signatures, getOverload)) {
        if (overloads.length === 2) {
            const unify = compareSignatures(overloads[0], overloads[1], isTypeParameter);
            if (unify !== undefined) {
                result.push({ unify, only2: true });
            }
        } else {
            forEachPair(overloads, (a, b) => {
                const unify = compareSignatures(a, b, isTypeParameter);
                if (unify !== undefined) {
                    result.push({ unify, only2: false });
                }
            });
        }
    }
    return result;
}

function compareSignatures(
    a: ts.SignatureDeclaration,
    b: ts.SignatureDeclaration,
    isTypeParameter: IsTypeParameter
): Unify | undefined {
    if (!signaturesCanBeUnified(a, b, isTypeParameter)) {
        return undefined;
    }

    return a.parameters.length === b.parameters.length
        ? signaturesDifferBySingleParameter(a.parameters, b.parameters)
        : signaturesDifferByOptionalOrRestParameter(a.parameters, b.parameters);
}

function signaturesCanBeUnified(
    a: ts.SignatureDeclaration,
    b: ts.SignatureDeclaration,
    isTypeParameter: IsTypeParameter
): boolean {
    // Must return the same type.
    return (
        typesAreEqual(a.type, b.type) &&
        // Must take the same type parameters.
        arraysAreEqual(a.typeParameters, b.typeParameters, typeParametersAreEqual) &&
        // If one uses a type parameter (from outside) and the other doesn't, they shouldn't be joined.
        signatureUsesTypeParameter(a, isTypeParameter) ===
            signatureUsesTypeParameter(b, isTypeParameter)
    );
}

/** Detect `a(x: number, y: number, z: number)` and `a(x: number, y: string, z: number)`. */
function signaturesDifferBySingleParameter(
    types1: ReadonlyArray<ts.ParameterDeclaration>,
    types2: ReadonlyArray<ts.ParameterDeclaration>
): Unify | undefined {
    const index = getIndexOfFirstDifference(types1, types2, parametersAreEqual);
    if (index === undefined) {
        return undefined;
    }

    // If remaining arrays are equal, the signatures differ by just one parameter type
    if (!arraysAreEqual(types1.slice(index + 1), types2.slice(index + 1), parametersAreEqual)) {
        return undefined;
    }

    const a = types1[index];
    const b = types2[index];
    // Can unify `a?: string` and `b?: number`. Can't unify `...args: string[]` and `...args: number[]`.
    // See https://github.com/Microsoft/TypeScript/issues/5077
    return parametersHaveEqualSigils(a, b) && a.dotDotDotToken === undefined
        ? { kind: "single-parameter-difference", p0: a, p1: b }
        : undefined;
}

/**
 * Detect `a(): void` and `a(x: number): void`.
 * Returns the parameter declaration (`x: number` in this example) that should be optional/rest, and overload it's a part of.
 */
function signaturesDifferByOptionalOrRestParameter(
    sig1: ts.NodeArray<ts.ParameterDeclaration>,
    sig2: ts.NodeArray<ts.ParameterDeclaration>
): Unify | undefined {
    const minLength = Math.min(sig1.length, sig2.length);
    const longer = sig1.length < sig2.length ? sig2 : sig1;
    const shorter = sig1.length < sig2.length ? sig1 : sig2;

    // If one is has 2+ parameters more than the other, they must all be optional/rest.
    // Differ by optional parameters: f() and f(x), f() and f(x, ?y, ...z)
    // Not allowed: f() and f(x, y)
    for (let i = minLength + 1; i < longer.length; i++) {
        if (!parameterMayBeMissing(longer[i])) {
            return undefined;
        }
    }

    for (let i = 0; i < minLength; i++) {
        if (!typesAreEqual(sig1[i].type, sig2[i].type)) {
            return undefined;
        }
    }

    if (minLength > 0 && shorter[minLength - 1].dotDotDotToken !== undefined) {
        return undefined;
    }

    return {
        kind: "extra-parameter",
        extraParameter: longer[longer.length - 1],
        otherSignature: shorter
    };
}

/**
 * Given a node, if it could potentially be an overload, return its signature and key.
 * All signatures which are overloads should have equal keys.
 */
type GetOverload<T> = (node: T) => { signature: ts.SignatureDeclaration; key: string } | undefined;

/**
 * Returns true if typeName is the name of an *outer* type parameter.
 * In: `interface I<T> { m<U>(x: U): T }`, only `T` is an outer type parameter.
 */
type IsTypeParameter = (typeName: string) => boolean;

/** Given type parameters, returns a function to test whether a type is one of those parameters. */
function getIsTypeParameter(
    typeParameters?: ReadonlyArray<ts.TypeParameterDeclaration>
): IsTypeParameter {
    if (typeParameters === undefined) {
        return () => false;
    }

    const set = new Set<string>();
    for (const t of typeParameters) {
        set.add(t.getText());
    }
    return (typeName: string) => set.has(typeName);
}

/** True if any of the outer type parameters are used in a signature. */
function signatureUsesTypeParameter(
    sig: ts.SignatureDeclaration,
    isTypeParameter: IsTypeParameter
): boolean {
    return sig.parameters.some(
        p => p.type !== undefined && typeContainsTypeParameter(p.type) === true
    );

    function typeContainsTypeParameter(type: ts.Node): boolean | undefined {
        if (utils.isTypeReferenceNode(type)) {
            const { typeName } = type;
            if (typeName.kind === ts.SyntaxKind.Identifier && isTypeParameter(typeName.text)) {
                return true;
            }
        }
        return ts.forEachChild(type, typeContainsTypeParameter);
    }
}

/**
 * Given all signatures, collects an array of arrays of signatures which are all overloads.
 * Does not rely on overloads being adjacent. This is similar to code in adjacentOverloadSignaturesRule.ts, but not the same.
 */
function collectOverloads<T>(
    nodes: ReadonlyArray<T>,
    getOverload: GetOverload<T>
): ts.SignatureDeclaration[][] {
    const map = new Map<string, ts.SignatureDeclaration[]>();
    for (const sig of nodes) {
        const overload = getOverload(sig);
        if (overload === undefined) {
            continue;
        }

        const { signature, key } = overload;
        const overloads = map.get(key);
        if (overloads !== undefined) {
            overloads.push(signature);
        } else {
            map.set(key, [signature]);
        }
    }
    return Array.from(map.values());
}

function parametersAreEqual(a: ts.ParameterDeclaration, b: ts.ParameterDeclaration): boolean {
    return parametersHaveEqualSigils(a, b) && typesAreEqual(a.type, b.type);
}

/** True for optional/rest parameters. */
function parameterMayBeMissing(p: ts.ParameterDeclaration): boolean {
    return p.dotDotDotToken !== undefined || p.questionToken !== undefined;
}

/** False if one is optional and the other isn't, or one is a rest parameter and the other isn't. */
function parametersHaveEqualSigils(
    a: ts.ParameterDeclaration,
    b: ts.ParameterDeclaration
): boolean {
    return (
        (a.dotDotDotToken !== undefined) === (b.dotDotDotToken !== undefined) &&
        (a.questionToken !== undefined) === (b.questionToken !== undefined)
    );
}

function typeParametersAreEqual(
    a: ts.TypeParameterDeclaration,
    b: ts.TypeParameterDeclaration
): boolean {
    return a.name.text === b.name.text && typesAreEqual(a.constraint, b.constraint);
}

function typesAreEqual(a: ts.TypeNode | undefined, b: ts.TypeNode | undefined): boolean {
    // TODO: Could traverse AST so that formatting differences don't affect this.
    return a === b || (a !== undefined && b !== undefined && a.getText() === b.getText());
}

/** Returns the first index where `a` and `b` differ. */
function getIndexOfFirstDifference<T>(
    a: ReadonlyArray<T>,
    b: ReadonlyArray<T>,
    equal: Equal<T>
): number | undefined {
    for (let i = 0; i < a.length && i < b.length; i++) {
        if (!equal(a[i], b[i])) {
            return i;
        }
    }
    return undefined;
}

/** Calls `action` for every pair of values in `values`. */
function forEachPair<T, Out>(
    values: ReadonlyArray<T>,
    action: (a: T, b: T) => Out | undefined
): Out | undefined {
    for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
            const result = action(values[i], values[j]);
            if (result !== undefined) {
                return result;
            }
        }
    }
    return undefined;
}

function typeText({ type }: ts.ParameterDeclaration) {
    return type === undefined ? "any" : type.getText();
}
