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

import assert = require("assert");
import { isSymbolFlagSet, isTypeFlagSet, isTypeReference, isUnionOrIntersectionType } from "tsutils";
import * as ts from "typescript";

export function zip<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>, cb: (a: T, b: T) => void): void {
    assert(a.length === b.length);
    for (let i = 0; i < a.length; i++) {
        cb(a[i], b[i]);
    }
}

export function tryCast<T, U extends T>(a: T, f: (t: T) => t is U): U | undefined {
    return f(a) ? a : undefined;
}

// For now, only track declarations with identifier names.
export type UsageTrackedDeclaration = ts.NamedDeclaration & { readonly name: ts.Identifier };
export function isUsageTrackedDeclaration(node: ts.Node): node is UsageTrackedDeclaration {
    switch (node.kind) {
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.BindingElement:
            type T =
                | ts.PropertyDeclaration | ts.PropertySignature | ts.MethodSignature
                | ts.GetAccessorDeclaration | ts.SetAccessorDeclaration | ts.ModuleDeclaration
                | ts.BindingElement;
            return ts.isIdentifier((node as T).name);
        case ts.SyntaxKind.MethodDeclaration:
            const parent = node.parent!;
            return !ts.isObjectLiteralExpression(parent) && ts.isIdentifier((node as ts.MethodDeclaration).name);
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.TypeParameter:
            return true;
        case ts.SyntaxKind.FunctionDeclaration:
            return (node as ts.FunctionDeclaration).name !== undefined;
        case ts.SyntaxKind.VariableDeclaration:
            return ts.isIdentifier((node as ts.VariableDeclaration).name);
        default:
            return false;
    }
}

export function getOrCreate<K extends object, V>(map: Map<K, V> | WeakMap<K, V>, key: K, createValue: (key: K) => V): V {
    const oldValue = map.get(key);
    if (oldValue !== undefined) {
        return oldValue;
    } else {
        const newValue = createValue(key);
        map.set(key, newValue);
        return newValue;
    }
}

export function createMultiMap<T, K, V>(inputs: ReadonlyArray<T>, getPair: (input: T) => [K, V] | undefined): Map<K, V[]> {
    const map = new Map<K, V[]>();
    for (const input of inputs) {
        const pair = getPair(input);
        if (pair !== undefined) {
            const [k, v] = pair;
            const vs = map.get(k);
            if (vs !== undefined) {
                vs.push(v);
            } else {
                map.set(k, [v]);
            }
        }
    }
    return map;
}

export function multiMapAdd<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    const values = map.get(key);
    if (values === undefined) {
        map.set(key, new Set([value]));
    } else {
        values.add(value);
    }
}

export function assertNever(value: never): never {
    throw new Error(value);
}

export function skipAlias(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
    const alias = tryGetAliasedSymbol(symbol, checker);
    return alias === undefined ? symbol : alias;
}

export function tryGetAliasedSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol | undefined {
    return isSymbolFlagSet(symbol, ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : undefined;
}

export function isFunctionLikeSymbol(symbol: ts.Symbol): boolean {
    return isSymbolFlagSet(symbol, ts.SymbolFlags.Function | ts.SymbolFlags.Method); // tslint:disable-line no-bitwise
}

export function isOnLeftHandSideOfMutableDestructuring(node: ts.ArrayLiteralExpression | ts.ObjectLiteralExpression): boolean {
    const parent = node.parent!;
    switch (parent.kind) {
        case ts.SyntaxKind.PropertyAssignment:
            return isOnLeftHandSideOfMutableDestructuring((parent as ts.PropertyAssignment).parent);
        case ts.SyntaxKind.ArrayLiteralExpression:
        case ts.SyntaxKind.ObjectLiteralExpression:
            return isOnLeftHandSideOfMutableDestructuring(parent as ts.ArrayLiteralExpression | ts.ObjectLiteralExpression);
        case ts.SyntaxKind.BinaryExpression: {
            const { left, operatorToken } = parent as ts.BinaryExpression;
            return node === left && operatorToken.kind === ts.SyntaxKind.EqualsToken;
        }
        default:
            return false;
    }
}

export function isReadonlyType(type: ts.Type): boolean {
    return isTypeFlagSet(type, ts.TypeFlags.Any)
        || (isUnionOrIntersectionType(type)
            ? type.types.some(isReadonlyType)
            : isTypeReference(type) && type.symbol !== undefined && type.symbol.name.startsWith("Readonly"));
}
