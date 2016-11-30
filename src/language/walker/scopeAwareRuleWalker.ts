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

import * as ts from "typescript";

import {RuleWalker} from "./ruleWalker";

export abstract class ScopeAwareRuleWalker<T> extends RuleWalker {
    private scopeStack: T[];

    constructor(sourceFile: ts.SourceFile, options?: any) {
        super(sourceFile, options);

        this.scopeStack = [];
    }

    public abstract createScope(node: ts.Node): T;

    public getCurrentScope(): T {
        return this.scopeStack[this.scopeStack.length - 1];
    }

    // get all scopes available at this depth
    public getAllScopes(): T[] {
        return this.scopeStack.slice();
    }

    public getCurrentDepth(): number {
        return this.scopeStack.length;
    }

    // callback notifier when a scope begins
    public onScopeStart() {
        return;
    }

    // callback notifier when a scope ends
    public onScopeEnd() {
        return;
    }

    protected visitNode(node: ts.Node) {
        const isNewScope = this.isScopeBoundary(node);

        if (isNewScope) {
            this.scopeStack.push(this.createScope(node));
            this.onScopeStart();
        }

        super.visitNode(node);

        if (isNewScope) {
            this.onScopeEnd();
            this.scopeStack.pop();
        }
    }

    protected isScopeBoundary(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            || node.kind === ts.SyntaxKind.SourceFile
            || node.kind === ts.SyntaxKind.FunctionExpression
            || node.kind === ts.SyntaxKind.PropertyAssignment
            || node.kind === ts.SyntaxKind.ShorthandPropertyAssignment
            || node.kind === ts.SyntaxKind.MethodDeclaration
            || node.kind === ts.SyntaxKind.Constructor
            || node.kind === ts.SyntaxKind.ModuleDeclaration
            || node.kind === ts.SyntaxKind.ArrowFunction
            || node.kind === ts.SyntaxKind.ParenthesizedExpression
            || node.kind === ts.SyntaxKind.ClassDeclaration
            || node.kind === ts.SyntaxKind.ClassExpression
            || node.kind === ts.SyntaxKind.InterfaceDeclaration
            || node.kind === ts.SyntaxKind.GetAccessor
            || node.kind === ts.SyntaxKind.SetAccessor;
    }
}
