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
    export class BlockScopeAwareRuleWalker<T> extends ScopeAwareRuleWalker<T> {
        constructor(sourceFile: ts.SourceFile, options?: any) {
            super(sourceFile, options);
        }

        // block scopes are a superset of regular scopes
        protected isScopeBoundary(node: ts.Node): boolean {
            return super.isScopeBoundary(node)
                || node.kind === ts.SyntaxKind.ConditionalExpression
                || node.kind === ts.SyntaxKind.CaseBlock
                || node.kind === ts.SyntaxKind.ModuleBlock
                || node.kind === ts.SyntaxKind.Block;
        }
    }
}
