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
import {ScopeAwareRuleWalker} from "./scopeAwareRuleWalker";

/**
 * An AST walker that is aware of block scopes in addition to regular scopes. Block scopes
 * are a superset of regular scopes (new block scopes are created more frequently in a program).
 */
export abstract class BlockScopeAwareRuleWalker<T, U> extends ScopeAwareRuleWalker<T> {
    private blockScopeStack: U[];

    constructor(sourceFile: ts.SourceFile, options?: any) {
        super(sourceFile, options);

        // initialize stack with global scope
        this.blockScopeStack = [this.createBlockScope()];
    }

    public abstract createBlockScope(): U;

    public getCurrentBlockScope(): U {
        return this.blockScopeStack[this.blockScopeStack.length - 1];
    }

    // callback notifier when a block scope begins
    public onBlockScopeStart() {
        return;
    }

    public getCurrentBlockDepth(): number {
        return this.blockScopeStack.length;
    }

    // callback notifier when a block scope ends
    public onBlockScopeEnd() {
        return;
    }

    protected visitNode(node: ts.Node) {
        const isNewBlockScope = this.isBlockScopeBoundary(node);

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

    private isBlockScopeBoundary(node: ts.Node): boolean {
        return super.isScopeBoundary(node)
            || node.kind === ts.SyntaxKind.DoStatement
            || node.kind === ts.SyntaxKind.WhileStatement
            || node.kind === ts.SyntaxKind.ForStatement
            || node.kind === ts.SyntaxKind.ForInStatement
            || node.kind === ts.SyntaxKind.ForOfStatement
            || node.kind === ts.SyntaxKind.WithStatement
            || node.kind === ts.SyntaxKind.SwitchStatement
            || (node.parent != null
                && (node.parent.kind === ts.SyntaxKind.TryStatement
                    || node.parent.kind === ts.SyntaxKind.IfStatement)
                )
            || (node.kind === ts.SyntaxKind.Block && node.parent != null
                && (node.parent.kind === ts.SyntaxKind.Block
                    || node.parent.kind === ts.SyntaxKind.SourceFile)
                );
    }
}
