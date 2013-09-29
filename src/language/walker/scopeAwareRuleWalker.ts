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
            
            super.visitNode(node);

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

        private isScopeBoundary(node: TypeScript.SyntaxNode): boolean {
            return node instanceof TypeScript.FunctionDeclarationSyntax
                || node instanceof TypeScript.FunctionExpressionSyntax
                || node instanceof TypeScript.MemberFunctionDeclarationSyntax
                || node instanceof TypeScript.SimpleArrowFunctionExpressionSyntax
                || node instanceof TypeScript.ParenthesizedArrowFunctionExpressionSyntax
                || node instanceof TypeScript.ClassDeclarationSyntax
                || node instanceof TypeScript.InterfaceDeclarationSyntax;
        }
    }
}
