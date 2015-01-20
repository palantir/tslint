/*
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

/// <reference path='ruleWalker.ts'/>

module Lint {
    export class ScopeAwareRuleWalker<T> extends RuleWalker {
        private scopeStack: T[];

        constructor(sourceFile: ts.SourceFile, options?: any) {
            super(sourceFile, options);

            // initialize stack with global scope
            this.scopeStack = [this.createScope()];
        }

        public visitNode(node: ts.Node): void {
            var isNewScope = this.isScopeBoundary(node);

            if (isNewScope) {
                this.scopeStack.push(this.createScope());
            }

            this.onScopeStart();
            super.visitNode(node);
            this.onScopeEnd();

            if (isNewScope) {
                this.scopeStack.pop();
            }
        }

        // create a new scope
        public createScope(): T {
            throw Lint.abstract();
        }

        // get the current scope
        public getCurrentScope(): T {
            return this.scopeStack[this.scopeStack.length - 1];
        }

        // get the depth of the scope stack
        public getCurrentDepth(): number {
            return this.scopeStack.length;
        }

        // callback notifier when a scope begins
        public onScopeStart(): void {
            return;
        }

        // callback notifier when a scope ends
        public onScopeEnd(): void {
            return;
        }

        private isScopeBoundary(node: ts.Node): boolean {
            return node.kind === ts.SyntaxKind.FunctionDeclaration
                || node.kind === ts.SyntaxKind.FunctionExpression
                || node.kind === ts.SyntaxKind.PropertyAssignment
                || node.kind === ts.SyntaxKind.ShorthandPropertyAssignment
                || node.kind === ts.SyntaxKind.Method
                || node.kind === ts.SyntaxKind.Constructor
                || node.kind === ts.SyntaxKind.ModuleDeclaration
                || node.kind === ts.SyntaxKind.ArrowFunction
                || node.kind === ts.SyntaxKind.ParenthesizedExpression
                || node.kind === ts.SyntaxKind.ClassDeclaration
                || node.kind === ts.SyntaxKind.InterfaceDeclaration
                || node.kind === ts.SyntaxKind.GetAccessor
                || node.kind === ts.SyntaxKind.SetAccessor;
        }
    }
}
