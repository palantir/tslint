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

import { isBindingElement, isPropertyDeclaration, isSignatureDeclaration, isSymbolFlagSet, isVariableDeclaration } from "tsutils";
import * as ts from "typescript";

import { UsageTrackedDeclaration } from "./utils";

export function isImplicitlyExported(node: UsageTrackedDeclaration, sourceFile: ts.SourceFile, checker: ts.TypeChecker): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.EnumDeclaration:
            return isTypeImplicitlyExported(checker.getSymbolAtLocation(node.name)!, sourceFile, checker);
        case ts.SyntaxKind.VariableDeclaration:
            const s = checker.getSymbolAtLocation(node.name);
            return sourceFile.forEachChild(function cb(child): boolean | undefined {
                return ts.isTypeQueryNode(child)
                    ? checker.getSymbolAtLocation(child.exprName) === s
                    : child.forEachChild(cb);
            }) === true;
        default:
            return false;
    }
}

function isTypeImplicitlyExported(typeSymbol: ts.Symbol, sourceFile: ts.SourceFile, checker: ts.TypeChecker): boolean {
    return ts.forEachChild(sourceFile, function cb(child): boolean | undefined {
        if (isImportLike(child)) {
            return false;
        }
        const type = getImplicitType(child, checker);
        // TODO: checker.typeEquals https://github.com/Microsoft/TypeScript/issues/13502
        return type !== undefined && checker.typeToString(type) === checker.symbolToString(typeSymbol) || ts.forEachChild(child, cb);
    }) === true;
}

/**
 * Ignore this import if it's used as an implicit type somewhere.
 * Workround for https://github.com/Microsoft/TypeScript/issues/9944
 */
export function isImportUsed(importSpecifier: ts.Identifier, sourceFile: ts.SourceFile, checker: ts.TypeChecker): boolean {
    const importedSymbol = checker.getSymbolAtLocation(importSpecifier);
    if (importedSymbol === undefined) {
        return false;
    }

    const symbol = checker.getAliasedSymbol(importedSymbol);
    if (!isSymbolFlagSet(symbol, ts.SymbolFlags.Type)) {
        return false;
    }

    return isTypeImplicitlyExported(symbol, sourceFile, checker);
}

function getImplicitType(node: ts.Node, checker: ts.TypeChecker): ts.Type | undefined {
    if ((isPropertyDeclaration(node) || isVariableDeclaration(node)) &&
        node.type === undefined && node.name.kind === ts.SyntaxKind.Identifier ||
        isBindingElement(node) && node.name.kind === ts.SyntaxKind.Identifier) {
        return checker.getTypeAtLocation(node);
    } else if (isSignatureDeclaration(node) && node.type === undefined) {
        const sig = checker.getSignatureFromDeclaration(node);
        return sig === undefined ? undefined : sig.getReturnType();
    } else {
        return undefined;
    }
}

export type ImportLike = ts.ImportDeclaration | ts.ImportEqualsDeclaration;
export function isImportLike(node: ts.Node): node is ImportLike {
    return node.kind === ts.SyntaxKind.ImportDeclaration
        || node.kind === ts.SyntaxKind.ImportEqualsDeclaration;
}
