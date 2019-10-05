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

import { IOptions } from "../rule/rule";
import { isBlockScopeBoundary } from "../utils";

import { ScopeAwareRuleWalker } from "./scopeAwareRuleWalker";

// tslint:disable:deprecation (extends deprecated class and uses deprecated utils - doesn't matter because it's deprecated, too)

/**
 * @deprecated See comment on ScopeAwareRuleWalker.
 *
 * An AST walker that is aware of block scopes in addition to regular scopes. Block scopes
 * are a superset of regular scopes (new block scopes are created more frequently in a program).
 */
export abstract class BlockScopeAwareRuleWalker<T, U> extends ScopeAwareRuleWalker<T> {
    private readonly blockScopeStack: U[];

    constructor(sourceFile: ts.SourceFile, options: IOptions) {
        super(sourceFile, options);

        // initialize with global scope if file is not a module
        this.blockScopeStack = ts.isExternalModule(sourceFile)
            ? []
            : [this.createBlockScope(sourceFile)];
    }

    public abstract createBlockScope(node: ts.Node): U;

    // get all block scopes available at this depth
    public getAllBlockScopes(): U[] {
        return this.blockScopeStack;
    }

    public getCurrentBlockScope(): U {
        return this.blockScopeStack[this.blockScopeStack.length - 1];
    }

    public getCurrentBlockDepth(): number {
        return this.blockScopeStack.length;
    }

    // callback notifier when a block scope begins
    public onBlockScopeStart() {
        return;
    }

    // callback notifier when a block scope ends
    public onBlockScopeEnd() {
        return;
    }

    public findBlockScope(predicate: (scope: U) => boolean) {
        // look through block scopes from local -> global
        for (let i = this.blockScopeStack.length - 1; i >= 0; i--) {
            if (predicate(this.blockScopeStack[i])) {
                return this.blockScopeStack[i];
            }
        }
        return undefined;
    }

    protected visitNode(node: ts.Node) {
        const isNewBlockScope = this.isBlockScopeBoundary(node);

        if (isNewBlockScope) {
            this.blockScopeStack.push(this.createBlockScope(node));
            this.onBlockScopeStart();
        }

        super.visitNode(node);

        if (isNewBlockScope) {
            this.onBlockScopeEnd();
            this.blockScopeStack.pop();
        }
    }

    private isBlockScopeBoundary(node: ts.Node): boolean {
        return isBlockScopeBoundary(node);
    }
}
