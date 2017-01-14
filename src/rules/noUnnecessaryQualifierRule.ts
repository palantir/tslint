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
import { arraysAreEqual } from "../utils";

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

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    private namespacesInScope: Array<ts.ModuleDeclaration | ts.EnumDeclaration> = [];

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        this.namespacesInScope.push(node);
        super.visitModuleDeclaration(node);
        this.namespacesInScope.pop();
    }

    public visitEnumDeclaration(node: ts.EnumDeclaration) {
        this.namespacesInScope.push(node);
        super.visitEnumDeclaration(node);
        this.namespacesInScope.pop();
    }

    public visitNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.QualifiedName:
                const { left, right } = node as ts.QualifiedName;
                this.visitNamespaceAccess(node, left, right);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
                const { expression, name } = node as ts.PropertyAccessExpression;
                if (isEntityNameExpression(expression)) {
                    this.visitNamespaceAccess(node, expression, name);
                    break;
                }
                // fall through
            default:
                super.visitNode(node);
        }
    }

    private visitNamespaceAccess(node: ts.Node, qualifier: ts.EntityNameOrEntityNameExpression, name: ts.Identifier) {
        if (this.qualifierIsUnnecessary(qualifier, name)) {
            const fix = this.createFix(this.deleteFromTo(qualifier.getStart(), name.getStart()));
            this.addFailureAtNode(qualifier, Rule.FAILURE_STRING(qualifier.getText()), fix);
        } else {
            // Only look for nested qualifier errors if we didn't already fail on the outer qualifier.
            super.visitNode(node);
        }
    }

    private qualifierIsUnnecessary(qualifier: ts.EntityNameOrEntityNameExpression, name: ts.Identifier): boolean {
        const namespaceSymbol = this.symbolAtLocation(qualifier);
        if (namespaceSymbol === undefined || !this.symbolIsNamespaceInScope(namespaceSymbol)) {
            return false;
        }

        const accessedSymbol = this.symbolAtLocation(name);
        if (accessedSymbol === undefined) {
            return false;
        }

        // If the symbol in scope is different, the qualifier is necessary.
        const fromScope = this.getSymbolInScope(qualifier, accessedSymbol.flags, name.text);
        return fromScope === undefined || symbolsAreEqual(fromScope, accessedSymbol);
    }

    private getSymbolInScope(node: ts.Node, flags: ts.SymbolFlags, name: string): ts.Symbol | undefined {
        // TODO:PERF `getSymbolsInScope` gets a long list. Is there a better way?
        const scope = this.getTypeChecker().getSymbolsInScope(node, flags);
        return scope.find((scopeSymbol) => scopeSymbol.name === name);
    }

    private symbolAtLocation(node: ts.Node): ts.Symbol | undefined {
        return this.getTypeChecker().getSymbolAtLocation(node);
    }

    private symbolIsNamespaceInScope(symbol: ts.Symbol): boolean {
        if (symbol.getDeclarations().some((decl) => this.namespacesInScope.some((ns) => nodesAreEqual(ns, decl)))) {
            return true;
        }
        const alias = this.tryGetAliasedSymbol(symbol);
        return alias !== undefined && this.symbolIsNamespaceInScope(alias);
    }

    private tryGetAliasedSymbol(symbol: ts.Symbol): ts.Symbol | undefined {
        return Lint.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias) ? this.getTypeChecker().getAliasedSymbol(symbol) : undefined;
    }
}

function isEntityNameExpression(expr: ts.Expression): expr is ts.EntityNameExpression {
    return expr.kind === ts.SyntaxKind.Identifier ||
        expr.kind === ts.SyntaxKind.PropertyAccessExpression && isEntityNameExpression((expr as ts.PropertyAccessExpression).expression);
}

// TODO: Should just be `===`. See https://github.com/palantir/tslint/issues/1969
function nodesAreEqual(a: ts.Node, b: ts.Node) {
    return a.pos === b.pos;
}

// Only needed in global files. Likely due to https://github.com/palantir/tslint/issues/1969. See `test.global.ts.lint`.
function symbolsAreEqual(a: ts.Symbol, b: ts.Symbol): boolean {
    return arraysAreEqual(a.declarations, b.declarations, nodesAreEqual);
}
