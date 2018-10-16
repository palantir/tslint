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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-qualifier",
        description: "Warns when a namespace qualifier (`A.x`) is unnecessary.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: true,
        requiresTypeInfo: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string) {
        return `Qualifier is unnecessary since '${name}' is in scope.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    const namespacesInScope: Array<ts.ModuleDeclaration | ts.EnumDeclaration> = [];
    ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ModuleDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
                namespacesInScope.push(node as ts.ModuleDeclaration | ts.EnumDeclaration);
                ts.forEachChild(node, cb);
                namespacesInScope.pop();
                break;

            case ts.SyntaxKind.QualifiedName:
                const { left, right } = node as ts.QualifiedName;
                visitNamespaceAccess(node, left, right);
                break;

            case ts.SyntaxKind.PropertyAccessExpression:
                const { expression, name } = node as ts.PropertyAccessExpression;
                if (utils.isEntityNameExpression(expression)) {
                    visitNamespaceAccess(node, expression, name);
                    break;
                }
            // falls through

            default:
                ts.forEachChild(node, cb);
        }
    }

    function visitNamespaceAccess(
        node: ts.Node,
        qualifier: ts.EntityNameOrEntityNameExpression,
        name: ts.Identifier
    ): void {
        if (qualifierIsUnnecessary(qualifier, name)) {
            const fix = Lint.Replacement.deleteFromTo(qualifier.getStart(), name.getStart());
            ctx.addFailureAtNode(qualifier, Rule.FAILURE_STRING(qualifier.getText()), fix);
        } else {
            // Only look for nested qualifier errors if we didn't already fail on the outer qualifier.
            ts.forEachChild(node, cb);
        }
    }

    function qualifierIsUnnecessary(
        qualifier: ts.EntityNameOrEntityNameExpression,
        name: ts.Identifier
    ): boolean {
        const namespaceSymbol = checker.getSymbolAtLocation(qualifier);
        if (namespaceSymbol === undefined || !symbolIsNamespaceInScope(namespaceSymbol)) {
            return false;
        }

        const accessedSymbol = checker.getSymbolAtLocation(name);
        if (accessedSymbol === undefined) {
            return false;
        }

        // If the symbol in scope is different, the qualifier is necessary.
        const fromScope = getSymbolInScope(qualifier, accessedSymbol.flags, name.text);
        return fromScope === undefined || symbolsAreEqual(accessedSymbol, fromScope);
    }

    function getSymbolInScope(
        node: ts.Node,
        flags: ts.SymbolFlags,
        name: string
    ): ts.Symbol | undefined {
        // TODO:PERF `getSymbolsInScope` gets a long list. Is there a better way?
        const scope = checker.getSymbolsInScope(node, flags);
        return scope.find(scopeSymbol => scopeSymbol.name === name);
    }

    function symbolIsNamespaceInScope(symbol: ts.Symbol): boolean {
        const symbolDeclarations = symbol.getDeclarations();
        if (symbolDeclarations === undefined) {
            return false;
        } else if (symbolDeclarations.some(decl => namespacesInScope.some(ns => ns === decl))) {
            return true;
        }

        const alias = tryGetAliasedSymbol(symbol, checker);
        return alias !== undefined && symbolIsNamespaceInScope(alias);
    }

    function symbolsAreEqual(accessed: ts.Symbol, inScope: ts.Symbol): boolean {
        if (checker.getExportSymbolOfSymbol !== undefined) {
            inScope = checker.getExportSymbolOfSymbol(inScope);
            return accessed === inScope;
        }
        return (
            accessed === inScope ||
            // For compatibility with typescript@2.5: compare declarations because the symbols don't have the same reference
            Lint.Utils.arraysAreEqual(
                accessed.declarations,
                inScope.declarations,
                (a, b) => a === b
            )
        );
    }
}

function tryGetAliasedSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol | undefined {
    return utils.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)
        ? checker.getAliasedSymbol(symbol)
        : undefined;
}
