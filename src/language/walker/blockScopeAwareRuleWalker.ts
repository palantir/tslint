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

/// <reference path='scopeAwareRuleWalker.ts'/>

module Lint {
    export class BlockScopeAwareRuleWalker<T, U> extends ScopeAwareRuleWalker<T> {
        private blockScopeStack: U[];

        constructor(sourceFile: ts.SourceFile, options?: any) {
            super(sourceFile, options);

            // initialize stack with global scope
            this.blockScopeStack = [this.createBlockScope()];
        }

        public createBlockScope(): U {
            throw Lint.abstract();
        }

        public getCurrentBlockScope(): U {
            return this.blockScopeStack[this.blockScopeStack.length - 1];
        }

        // callback notifier when a block scope begins
        public onBlockScopeStart(): void {
            return;
        }

        // callback notifier when a block scope ends
        public onBlockScopeEnd(): void {
            return;
        }

        protected visitNode(node: ts.Node): void {
            var isNewBlockScope = this.isBlockScopeBoundary(node);

            if (isNewBlockScope) {
                this.blockScopeStack.push(this.createBlockScope());
            }

            this.onBlockScopeStart();
            super.visitNode(node);
            this.onBlockScopeEnd();

            if (isNewBlockScope) {
                this.blockScopeStack.pop();
            }
        }

        // block scopes are a superset of regular scopes
        private isBlockScopeBoundary(node: ts.Node): boolean {
            return super.isScopeBoundary(node)
                || node.kind === ts.SyntaxKind.ConditionalExpression
                || node.kind === ts.SyntaxKind.CaseBlock
                || node.kind === ts.SyntaxKind.ModuleBlock
                || node.kind === ts.SyntaxKind.Block;
        }
    }
}
