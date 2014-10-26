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

        constructor(syntaxTree: TypeScript.SyntaxTree, options?: any) {
            super(syntaxTree, options);

            // initialize stack with global scope
            this.scopeStack = [this.createScope()];
        }

        public visitNode(node: TypeScript.SyntaxNode): void {
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
            throw TypeScript.Errors.abstract();
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

        private isScopeBoundary(node: TypeScript.SyntaxNode): boolean {
            return node instanceof TypeScript.Syntax.Concrete.FunctionDeclarationSyntax
                || node instanceof TypeScript.Syntax.Concrete.FunctionExpressionSyntax
                || node instanceof TypeScript.Syntax.Concrete.FunctionPropertyAssignmentSyntax
                || node instanceof TypeScript.Syntax.Concrete.MemberFunctionDeclarationSyntax
                || node instanceof TypeScript.Syntax.Concrete.ConstructorDeclarationSyntax
                || node instanceof TypeScript.Syntax.Concrete.ModuleDeclarationSyntax
                || node instanceof TypeScript.Syntax.Concrete.SimpleArrowFunctionExpressionSyntax
                || node instanceof TypeScript.Syntax.Concrete.ParenthesizedArrowFunctionExpressionSyntax
                || node instanceof TypeScript.Syntax.Concrete.ClassDeclarationSyntax
                || node instanceof TypeScript.Syntax.Concrete.InterfaceDeclarationSyntax
                || node instanceof TypeScript.Syntax.Concrete.GetAccessorSyntax
                || node instanceof TypeScript.Syntax.Concrete.SetAccessorSyntax;
        }
    }
}
