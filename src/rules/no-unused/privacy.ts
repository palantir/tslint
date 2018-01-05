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

import { hasModifier, isSymbolFlagSet } from "tsutils";
import * as ts from "typescript";
import { assertNever, isUsageTrackedDeclaration, tryCast } from "./utils";

export function isPublicAccess(
    node: ts.Identifier,
    symbol: ts.Symbol,
    currentFile: ts.SourceFile,
    currentClass: ts.ClassLikeDeclaration | undefined,
): boolean {
    for (const decl of symbol.declarations!) {
        const scope = getPrivacyScope(decl);
        if (scope === undefined) {
            continue;
        }
        switch (scope.kind) {
            case ts.SyntaxKind.SourceFile:
                return scope !== currentFile || isSymbolFlagSet(symbol, ts.SymbolFlags.Type) && isPublicTypeUse(node);
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                return scope !== currentClass;
            default:
                assertNever(scope);
        }
    }
    // For anything other than a class element or export, all uses are public.
    return true;
}

export function getPrivacyScope(declaration: ts.Declaration): ts.SourceFile | ts.ClassLikeDeclaration | undefined {
    const varStatement = variableStatementFromDeclaration(declaration);
    const decl = varStatement === undefined ? declaration : varStatement;
    const parent = decl.parent!;
    return isExported(decl) ? tryCast(parent, ts.isSourceFile)
        : ts.isClassElement(decl) ? tryCast(parent, ts.isClassLike)
        : ts.isParameterPropertyDeclaration(decl) ? tryCast(parent.parent!, ts.isClassLike)
        : undefined;
}

export function variableStatementFromDeclaration(decl: ts.Declaration): ts.VariableStatement | undefined {
    return ts.isVariableDeclaration(decl) && ts.isVariableDeclarationList(decl.parent!) && ts.isVariableStatement(decl.parent!.parent!)
        ? decl.parent!.parent as ts.VariableStatement : undefined;
}

/** A type is publicly used if it appears in the signature of an exported function/method, or is part of an exported type alias. */
function isPublicTypeUse(node: ts.Identifier): boolean {
    const parent = node.parent!;
    // The original declaration isn't a public use.
    return !(isUsageTrackedDeclaration(parent) && parent.name === node) && isPublicTypeUseWorker(parent);
}

function isPublicTypeUseWorker(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.InterfaceDeclaration:
            return isExported(node);
        default:
            return (ts.isTypeNode(node) || ts.isClassElement(node) || ts.isTypeElement(node) || ts.isParameter(node))
                && isPublicTypeUseWorker(node.parent!);
    }
}

function isExported(node: ts.Node): boolean {
    return hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword);
}
