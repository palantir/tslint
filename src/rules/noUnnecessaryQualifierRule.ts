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
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string) {
        return `Qualifier is unnecessary since '${name}' is in scope.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, program.getTypeChecker()));
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    const { sourceFile } = ctx;
    const namespacesInScope: Array<ts.ModuleDeclaration | ts.EnumDeclaration> = [];

    ts.forEachChild(sourceFile, cb);
    function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ModuleDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
                namespacesInScope.push(node as ts.ModuleDeclaration | ts.EnumDeclaration);
                ts.forEachChild(node, cb);
                namespacesInScope.pop();
                break;

            case ts.SyntaxKind.QualifiedName: {
                const { left, right } = node as ts.QualifiedName;
                visitNamespaceAccess(left, right);
                break;
            }

            case ts.SyntaxKind.PropertyAccessExpression: {
                const { expression, name } = node as ts.PropertyAccessExpression;
                if (utils.isEntityNameExpression(expression)) {
                    visitNamespaceAccess(expression, name);
                    break;
                }
            }
                // falls through

            default:
                ts.forEachChild(node, cb);
        }
    }

    function visitNamespaceAccess(qualifier: ts.EntityNameOrEntityNameExpression, name: ts.Identifier) {
        if (qualifierIsUnnecessary(qualifier, name)) {
            const fix = ctx.createFix(Lint.Replacement.deleteFromTo(qualifier.getStart(), name.getStart()));
            ctx.addFailureAtNode(qualifier, Rule.FAILURE_STRING(qualifier.getText()), fix);
        } else {
            // Only look for nested qualifier errors if we didn't already fail on the outer qualifier.
            cb(qualifier);
        }
    }

    function qualifierIsUnnecessary(qualifier: ts.EntityNameOrEntityNameExpression, name: ts.Identifier): boolean {
        const namespaceSymbol = checker.getSymbolAtLocation(qualifier);
        if (namespaceSymbol === undefined || !symbolIsNamespaceInScope(namespaceSymbol)) {
            return false;
        }

        const accessedSymbol = checker.getSymbolAtLocation(name);
        if (accessedSymbol === undefined) {
            return false;
        }

        // If the symbol in scope is different than the namespace (due to shadowing), the qualifier is necessary.
        const fromScope = getSymbolInScope(qualifier, accessedSymbol.flags, name.text, checker);
        return fromScope === undefined || fromScope === accessedSymbol;
    }

    function symbolIsNamespaceInScope(symbol: ts.Symbol): boolean {
        if (symbol.getDeclarations().some((decl) => namespacesInScope.some((ns) => ns === decl))) {
            return true;
        }
        const alias = tryGetAliasedSymbol(symbol, checker);
        return alias !== undefined && symbolIsNamespaceInScope(alias);
    }
}

function getSymbolInScope(node: ts.Node, flags: ts.SymbolFlags, name: string, checker: ts.TypeChecker): ts.Symbol | undefined {
    // TODO:PERF `getSymbolsInScope` gets a long list. Is there a better way?
    const scope = checker.getSymbolsInScope(node, flags);
    return scope.find((scopeSymbol) => scopeSymbol.name === name);
}

function tryGetAliasedSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol | undefined {
    return Lint.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : undefined;
}
