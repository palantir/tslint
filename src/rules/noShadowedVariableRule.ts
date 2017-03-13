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

// tslint:disable switch-default

import * as utils from "tsutils";
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
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string): string {
        return `Shadowed variable: '${name}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, undefined));
    }
}

class Walker extends Lint.AbstractWalker<void> {
    private curLevel = -1;
    private scopes: ts.Node[] = [];
    // Maps a variable name to the scope level (or levels) where it appears.
    // (It only appears in multiple levels if there is shadowing.)
    private nameToLevel = new Map<string, number | number[]>();
    // Map from scope level to names added there. Used to remove variables after closing a scope.
    private namesAddedToCurrentScope: string[][] = [];

    public walk(sourceFile: ts.SourceFile): void {
        this.visitChildrenInNewScope(sourceFile);
        if (this.curLevel !== -1 || this.namesAddedToCurrentScope.length || this.nameToLevel.size) {
            throw new Error("Did not properly close scopes.");
        }
    }

    private visit(node: ts.Node): void {
        if (isSignatureLike(node)) {
            this.handleSignatureLike(node);
        } else if (isNonSignatureDeclaration(node)) {
            this.handleNonSignatureDeclaration(node);
        } else if (utils.isScopeBoundary(node)) {
            this.visitChildrenInNewScope(node);
        } else if (utils.isVariableDeclaration(node)) {
            const isVar = !utils.isBlockScopedVariableDeclaration(node);
            const lvl = isVar ? this.getNonBlockScopedLevel() : this.curLevel;
            this.addBindingNameToScope(node.name, lvl, /*mergable*/false);
            if (node.initializer) {
                this.visitChildren(node.initializer);
            }
        } else {
            this.visitChildren(node);
        }
    }

    private visitChildren(node: ts.Node): void {
        ts.forEachChild(node, (child) => this.visit(child));
    }

    private getNonBlockScopedLevel(): number {
        for (let lvl = this.scopes.length - 1; lvl >= 0; lvl--) {
            if (utils.isFunctionScopeBoundary(this.scopes[lvl])) {
                return lvl;
            }
        }
        return 0;
    }

    private handleSignatureLike(node: SignatureLike): void {
        const addToScope = (name: ts.Identifier | undefined, isMergeable: boolean) => {
            if (name) {
                this.addIdentifierToScope(name, this.curLevel, isMergeable);
            }
        };

        // For fn declaration, name goes in *outer* scope. For function expression, name goes in *inner* scope.
        // Fn declaration may be merged with another overload. Fn expression should *not* merge with others in the same scope.
        if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
            addToScope(node.name, /*isMergeable*/ true);
        }

        this.inNewScope(node, () => {
            if (node.kind === ts.SyntaxKind.FunctionExpression) {
                addToScope(node.name, /*isMergeable*/ false);
            }

            const { parameters, typeParameters } = node;
            this.addTypeParametersToScope(typeParameters);

            for (const { name } of parameters) {
                this.addBindingNameToScope(name, this.curLevel, /*mergable*/ false);
            }

            switch (node.kind) {
                case ts.SyntaxKind.MethodSignature:
                case ts.SyntaxKind.ConstructSignature:
                case ts.SyntaxKind.CallSignature:
                    break;
                default:
                    if (node.body) {
                        this.visitChildren(node.body);
                    }
            }
        });
    }

    private handleNonSignatureDeclaration(node: NonSignatureDeclaration): void {
        // Class expression is declared in its own scope, not outer scope.
        if (node.kind !== ts.SyntaxKind.ClassExpression && node.name) {
            this.addIdentifierToScope(node.name, this.curLevel, /*isMergeable*/ true);
        }

        switch (node.kind) {
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                this.inNewScope(node, () => {
                    if (node.kind === ts.SyntaxKind.ClassExpression && node.name) {
                        this.addIdentifierToScope(node.name, this.curLevel, /*isMergeable*/ false);
                    }

                    this.addTypeParametersToScope(node.typeParameters);
                    for (const m of node.members) {
                        this.visit(m);
                    }
                });
                break;

            case ts.SyntaxKind.ModuleDeclaration:
                this.visitChildrenInNewScope(node.body);
                break;

            case ts.SyntaxKind.TypeAliasDeclaration:
                this.inNewScope(node, () => {
                    this.addTypeParametersToScope(node.typeParameters);
                    this.visit(node.type);
                });
                break;
        }
    }

    private inNewScope(node: ts.Node, action: () => void): void {
        this.scopes.push(node);
        this.curLevel++;
        this.namesAddedToCurrentScope.push([]);

        action();

        this.scopes.pop();
        this.curLevel--;
        for (const name of this.namesAddedToCurrentScope.pop()!) {
            this.nameToLevel.delete(name);
        }
    }

    private visitChildrenInNewScope(node: ts.Node): void {
        this.inNewScope(node, () => this.visitChildren(node));
    }

    private addTypeParametersToScope(params: ts.TypeParameterDeclaration[] | undefined): void {
        if (params) {
            for (const { name } of params) {
                this.addBindingNameToScope(name, this.curLevel, /*isMergeable*/false);
            }
        }
    }

    private addBindingNameToScope(b: ts.BindingName, scopeLevel: number, isMergeable: boolean): void {
        eachIdentifier(b, (id) => {
            // Exempt "this" because shadowing it may be unavoidable. See #2214.
            if (id.text !== "this") {
                this.addIdentifierToScope(id, scopeLevel, isMergeable);
            }
        });
    }

    private addIdentifierToScope(id: ts.Identifier, level: number, isMergeable: boolean): void {
        const name = id.text;
        const oldLevel = this.nameToLevel.get(name);
        if (oldLevel === undefined) {
            // This name doesn't appear in lower scope, and this is the first time we've seen it in the current scope.
            this.nameToLevel.set(name, level);
            this.namesAddedToCurrentScope[level].push(name);
            return;
        }

        if (isMergeable && level === (typeof oldLevel === "number" ? oldLevel : oldLevel[oldLevel.length - 1])) {
            // This name appears another time in this same scope, and that's fine.
            return;
        }

        // This name appears in a lower scope, or in the current scope and it's not mergeable.
        // Since this is a failure, just pretend this doesn't exist.
        this.addFailureAtNode(id, Rule.FAILURE_STRING(name));
    }
}

function eachIdentifier(node: ts.BindingName, action: (id: ts.Identifier) => void): void {
    switch (node.kind) {
        case ts.SyntaxKind.Identifier:
            action(node);
            break;

        case ts.SyntaxKind.ObjectBindingPattern:
            for (const e of node.elements) {
                eachIdentifier(e.name, action);
            }
            break;

        case ts.SyntaxKind.ArrayBindingPattern:
            for (const e of node.elements) {
                if (e.kind !== ts.SyntaxKind.OmittedExpression) {
                    eachIdentifier(e.name, action);
                }
            }
            break;
    }
}

type NonSignatureDeclaration =
    | ts.NamespaceDeclaration
    | ts.TypeAliasDeclaration
    | ts.InterfaceDeclaration
    | ts.ClassDeclaration
    | ts.ClassExpression;
function isNonSignatureDeclaration(node: ts.Node): node is NonSignatureDeclaration {
    switch (node.kind) {
        case ts.SyntaxKind.ModuleDeclaration: {
            const { name } = node as ts.ModuleDeclaration;
            return name.kind === ts.SyntaxKind.Identifier;
        }
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
            return true;
        default:
            return false;
    }
}

type SignatureLike =
    | ts.FunctionDeclaration
    | ts.FunctionExpression
    | ts.ArrowFunction
    | ts.MethodDeclaration
    | ts.MethodSignature
    | ts.ConstructSignatureDeclaration
    | ts.ConstructorDeclaration
    | ts.CallSignatureDeclaration;
function isSignatureLike(node: ts.Node): node is SignatureLike {
    switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.CallSignature:
            return true;
        default:
            return false;
    }
}
