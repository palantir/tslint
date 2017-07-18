/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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
    isBlockScopedVariableDeclarationList, isFunctionExpression, isFunctionWithBody, isScopeBoundary, isThisParameter, ScopeBoundary,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-shadowed-variable",
        description: "Disallows shadowing variable declarations.",
        rationale: "Shadowing a variable masks access to it and obscures to what value an identifier actually refers.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(name: string) {
        return `Shadowed name: '${name}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.ruleName, undefined));
    }
}

class Scope {
    public functionScope: Scope;
    public variables = new Map<string, ts.Identifier[]>();
    public variablesSeen = new Map<string, ts.Identifier[]>();
    public reassigned = new Set<string>();
    constructor(functionScope?: Scope) {
        // if no functionScope is provided we are in the process of creating a new function scope, which for consistency links to itself
        this.functionScope = functionScope !== undefined ? functionScope : this;
    }

    public addVariable(identifier: ts.Identifier, blockScoped = true) {
        // block scoped variables go to the block scope, function scoped variables to the containing function scope
        const scope = blockScoped ? this : this.functionScope;
        const list = scope.variables.get(identifier.text);
        if (list === undefined) {
            scope.variables.set(identifier.text, [identifier]);
        } else {
            list.push(identifier);
        }
    }
}

class NoShadowedVariableWalker extends Lint.AbstractWalker<void> {
    private scope: Scope;
    public walk(sourceFile: ts.SourceFile) {
        this.scope = new Scope();

        const cb = (node: ts.Node): void => {
            const parentScope = this.scope;
            if (isFunctionExpression(node) && node.name !== undefined) {
                /* special handling for named function expressions:
                   technically the name of the function is only visible inside of it,
                   but variables with the same name declared inside don't cause compiler errors.
                   Therefore we add an additional function scope only for the function name to avoid merging with other declarations */
                const functionScope = new Scope();
                functionScope.addVariable(node.name, false);
                this.scope = new Scope();
                ts.forEachChild(node, cb);
                this.onScopeEnd(functionScope);
                this.scope = functionScope;
                this.onScopeEnd(parentScope);
                this.scope = parentScope;
                return;
            }
            const boundary = isScopeBoundary(node);
            if (boundary === ScopeBoundary.Block) {
                this.scope = new Scope(parentScope.functionScope);
            } else if (boundary === ScopeBoundary.Function) {
                this.scope = new Scope();
            }
            switch (node.kind) {
                case ts.SyntaxKind.VariableDeclarationList:
                    this.handleVariableDeclarationList(node as ts.VariableDeclarationList);
                    break;
                case ts.SyntaxKind.ClassExpression:
                    if ((node as ts.ClassExpression).name !== undefined) {
                        this.scope.addVariable((node as ts.ClassExpression).name!);
                    }
                    break;
                case ts.SyntaxKind.TypeParameter:
                    this.scope.addVariable((node as ts.TypeParameterDeclaration).name);
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                    if ((node as ts.FunctionDeclaration | ts.ClassDeclaration).name !== undefined) {
                        parentScope.addVariable((node as ts.FunctionDeclaration | ts.ClassDeclaration).name!,
                                                node.kind !== ts.SyntaxKind.FunctionDeclaration);
                    }
                    break;
                case ts.SyntaxKind.TypeAliasDeclaration:
                case ts.SyntaxKind.EnumDeclaration:
                case ts.SyntaxKind.InterfaceDeclaration:
                    parentScope.addVariable((node as ts.TypeAliasDeclaration | ts.EnumDeclaration | ts.InterfaceDeclaration).name);
                    break;
                case ts.SyntaxKind.Parameter:
                    if (!isThisParameter(node as ts.ParameterDeclaration) && isFunctionWithBody(node.parent!)) {
                        this.handleBindingName((node as ts.ParameterDeclaration).name, false);
                    }
                    break;
                case ts.SyntaxKind.ModuleDeclaration:
                    if (node.parent!.kind !== ts.SyntaxKind.ModuleDeclaration &&
                        (node as ts.ModuleDeclaration).name.kind === ts.SyntaxKind.Identifier) {
                        parentScope.addVariable((node as ts.NamespaceDeclaration).name, false);
                    }
                    break;
                case ts.SyntaxKind.ImportClause:
                    if ((node as ts.ImportClause).name !== undefined) {
                        this.scope.addVariable((node as ts.ImportClause).name!, false);
                    }
                    break;
                case ts.SyntaxKind.NamespaceImport:
                case ts.SyntaxKind.ImportSpecifier:
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    this.scope.addVariable((node as ts.NamespaceImport | ts.ImportSpecifier | ts.ImportEqualsDeclaration).name, false);
            }
            if (boundary !== ScopeBoundary.None) {
                ts.forEachChild(node, cb);
                this.onScopeEnd(parentScope);
                this.scope = parentScope;
            } else {
                return ts.forEachChild(node, cb);
            }
        };

        ts.forEachChild(sourceFile, cb);
        this.onScopeEnd();
    }

    private handleVariableDeclarationList(node: ts.VariableDeclarationList) {
        const blockScoped = isBlockScopedVariableDeclarationList(node);
        for (const variable of node.declarations) {
            this.handleBindingName(variable.name, blockScoped);
        }
    }

    private handleBindingName(node: ts.BindingName, blockScoped: boolean) {
        if (node.kind === ts.SyntaxKind.Identifier) {
            this.scope.addVariable(node, blockScoped);
        } else {
            for (const element of node.elements) {
                if (element.kind !== ts.SyntaxKind.OmittedExpression) {
                    this.handleBindingName(element.name, blockScoped);
                }
            }
        }
    }

    private onScopeEnd(parent?: Scope) {
        const {variables, variablesSeen} = this.scope;
        variablesSeen.forEach((identifiers, name) => {
            if (variables.has(name)) {
                for (const identifier of identifiers) {
                    this.addFailureAtNode(identifier, Rule.FAILURE_STRING_FACTORY(name));
                }
            } else if (parent !== undefined) {
                addToList(parent.variablesSeen, name, identifiers);
            }
        });
        if (parent !== undefined) {
            variables.forEach((identifiers, name) => {
                addToList(parent.variablesSeen, name, identifiers);
            });
        }
    }
}

function addToList(map: Map<string, ts.Identifier[]>, name: string, identifiers: ts.Identifier[]) {
    const list = map.get(name);
    if (list === undefined) {
        map.set(name, identifiers);
    } else {
        list.push(...identifiers);
    }
}
