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
import { arraysAreEqual, Equal } from "../utils";

import { getOverloadKey, isSignatureDeclaration } from "./adjacentOverloadSignaturesRule";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "unified-signatures",
        description: "Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_OMITTING_SINGLE_PARAMETER =
        "These overloads can be combined into one signature with an optional parameter.";
    public static FAILURE_STRING_OMITTING_REST_PARAMETER =
        "These overloads can be combined into one signature with a rest parameter.";
    public static FAILURE_STRING_SINGLE_PARAMETER_DIFFERENCE(type1: string, type2: string) {
        return `These overloads can be combined into one signature taking \`${type1} | ${type2}\`.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        this.checkStatements(node.statements);
        super.visitSourceFile(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        const { body } = node;
        if (body && body.kind === ts.SyntaxKind.ModuleBlock) {
            this.checkStatements((body as ts.ModuleBlock).statements);
        }
        super.visitModuleDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.checkMembers(node.members, node.typeParameters);
        super.visitInterfaceDeclaration(node);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.checkMembers(node.members, node.typeParameters);
        super.visitClassDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        this.checkMembers(node.members);
        super.visitTypeLiteral(node);
    }

    private checkStatements(statements: ts.Statement[]) {
        this.checkOverloads(statements, (statement) => {
            if (statement.kind === ts.SyntaxKind.FunctionDeclaration) {
                const fn = statement as ts.FunctionDeclaration;
                if (fn.body) {
                    return undefined;
                }
                return fn.name && { signature: fn, key: fn.name.text };
            } else {
                return undefined;
            }
        });
    }

    private checkMembers(members: Array<ts.TypeElement | ts.ClassElement>, typeParameters?: ts.TypeParameterDeclaration[]) {
        this.checkOverloads(members, getOverloadName, typeParameters);
        function getOverloadName(member: ts.TypeElement | ts.ClassElement) {
            if (!isSignatureDeclaration(member) || (member as ts.MethodDeclaration).body) {
                return undefined;
            }
            const key = getOverloadKey(member);
            return key === undefined ? undefined : { signature: member, key };
        }
    }

    private checkOverloads<T>(signatures: T[], getOverload: GetOverload<T>, typeParameters?: ts.TypeParameterDeclaration[]) {
        const isTypeParameter = getIsTypeParameter(typeParameters);
        for (const overloads of collectOverloads(signatures, getOverload)) {
            forEachPair(overloads, (a, b) => {
                this.compareSignatures(a, b, isTypeParameter);
            });
        }
    }

    private compareSignatures(a: ts.SignatureDeclaration, b: ts.SignatureDeclaration, isTypeParameter: IsTypeParameter) {
        if (!signaturesCanBeUnified(a, b, isTypeParameter)) {
            return;
        }

        if (a.parameters.length === b.parameters.length) {
            const params = signaturesDifferBySingleParameter(a.parameters, b.parameters);
            if (params) {
                const [p0, p1] = params;
                this.addFailureAtNode(p1, Rule.FAILURE_STRING_SINGLE_PARAMETER_DIFFERENCE(typeText(p0), typeText(p1)));
            }
        } else {
            const extraParameter = signaturesDifferByOptionalOrRestParameter(a.parameters, b.parameters);
            if (extraParameter) {
                this.addFailureAtNode(extraParameter, extraParameter.dotDotDotToken
                    ? Rule.FAILURE_STRING_OMITTING_REST_PARAMETER
                    : Rule.FAILURE_STRING_OMITTING_SINGLE_PARAMETER);
            }
        }
    }
}

function typeText({ type }: ts.ParameterDeclaration) {
    return type === undefined ? "any" : type.getText();
}

function signaturesCanBeUnified(a: ts.SignatureDeclaration, b: ts.SignatureDeclaration, isTypeParameter: IsTypeParameter): boolean {
    // Must return the same type.
    return typesAreEqual(a.type, b.type) &&
        // Must take the same type parameters.
        arraysAreEqual(a.typeParameters, b.typeParameters, typeParametersAreEqual) &&
        // If one uses a type parameter (from outside) and the other doesn't, they shouldn't be joined.
        signatureUsesTypeParameter(a, isTypeParameter) === signatureUsesTypeParameter(b, isTypeParameter);
}

/** Detect `a(x: number, y: number, z: number)` and `a(x: number, y: string, z: number)`. */
function signaturesDifferBySingleParameter(types1: ts.ParameterDeclaration[], types2: ts.ParameterDeclaration[],
    ): [ts.ParameterDeclaration, ts.ParameterDeclaration] | undefined {
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
    return parametersHaveEqualSigils(a, b) ? [a, b] : undefined;
}

/**
 * Detect `a(): void` and `a(x: number): void`.
 * Returns the parameter declaration (`x: number` in this example) that should be optional/rest.
 */
function signaturesDifferByOptionalOrRestParameter(types1: ts.ParameterDeclaration[], types2: ts.ParameterDeclaration[],
    ): ts.ParameterDeclaration | undefined {
    const minLength = Math.min(types1.length, types2.length);
    const longer = types1.length < types2.length ? types2 : types1;

    // If one is has 2+ parameters more than the other, they must all be optional/rest.
    // Differ by optional parameters: f() and f(x), f() and f(x, ?y, ...z)
    // Not allowed: f() and f(x, y)
    for (let i = minLength + 1; i < longer.length; i++) {
        if (!parameterMayBeMissing(longer[i])) {
            return undefined;
        }
    }

    for (let i = 0; i < minLength; i++) {
        if (!typesAreEqual(types1[i].type, types2[i].type)) {
            return undefined;
        }
    }

    return longer[longer.length - 1];
}

/**
 * Given a node, if it could potentially be an overload, return its signature and key.
 * All signatures which are overloads should have equal keys.
 */
type GetOverload<T> = (node: T) => { signature: ts.SignatureDeclaration, key: string } | undefined;

/**
 * Returns true if typeName is the name of an *outer* type parameter.
 * In: `interface I<T> { m<U>(x: U): T }`, only `T` is an outer type parameter.
 */
type IsTypeParameter = (typeName: string) => boolean;

/** Given type parameters, returns a function to test whether a type is one of those parameters. */
function getIsTypeParameter(typeParameters?: ts.TypeParameterDeclaration[]): IsTypeParameter {
    if (!typeParameters) {
        return () => false;
    }

    const set = new Set<string>();
    for (const t of typeParameters) {
        set.add(t.getText());
    }
    return (typeName: string) => set.has(typeName);
}

/** True if any of the outer type parameters are used in a signature. */
function signatureUsesTypeParameter(sig: ts.SignatureDeclaration, isTypeParameter: IsTypeParameter): boolean {
    return sig.parameters.some((p) => p.type !== undefined && typeContainsTypeParameter(p.type));

    function typeContainsTypeParameter(type: ts.Node): boolean {
        if (type.kind === ts.SyntaxKind.TypeReference) {
            const name = (type as ts.TypeReferenceNode).typeName;
            if (name.kind === ts.SyntaxKind.Identifier && isTypeParameter(name.text)) {
                return true;
            }
        }
        return !!ts.forEachChild(type, typeContainsTypeParameter);
    }
}

/**
 * Given all signatures, collects an array of arrays of signatures which are all overloads.
 * Does not rely on overloads being adjacent. This is similar to code in adjacentOverloadSignaturesRule.ts, but not the same.
 */
function collectOverloads<T>(nodes: T[], getOverload: GetOverload<T>): ts.SignatureDeclaration[][] {
    const map = new Map<string, ts.SignatureDeclaration[]>();
    for (const sig of nodes) {
        const overload = getOverload(sig);
        if (!overload) {
            continue;
        }

        const { signature, key } = overload;
        const overloads = map.get(key);
        if (overloads) {
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
    return !!p.dotDotDotToken || !!p.questionToken;
}

/** False if one is optional and the other isn't, or one is a rest parameter and the other isn't. */
function parametersHaveEqualSigils(a: ts.ParameterDeclaration, b: ts.ParameterDeclaration): boolean {
    return !!a.dotDotDotToken === !!b.dotDotDotToken && !!a.questionToken === !!b.questionToken;
}

function typeParametersAreEqual(a: ts.TypeParameterDeclaration, b: ts.TypeParameterDeclaration): boolean {
    return a.name.text === b.name.text && typesAreEqual(a.constraint, b.constraint);
}

function typesAreEqual(a: ts.TypeNode | undefined, b: ts.TypeNode | undefined): boolean {
    // TODO: Could traverse AST so that formatting differences don't affect this.
    return a === b || !!a && !!b && a.getText() === b.getText();
}

/** Returns the first index where `a` and `b` differ. */
function getIndexOfFirstDifference<T>(a: T[], b: T[], equal: Equal<T>): number | undefined {
    for (let i = 0; i < a.length && i < b.length; i++) {
        if (!equal(a[i], b[i])) {
            return i;
        }
    }
    return undefined;
}

/** Calls `action` for every pair of values in `values`. */
function forEachPair<T>(values: T[], action: (a: T, b: T) => void): void {
    for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
            action(values[i], values[j]);
        }
    }
}
