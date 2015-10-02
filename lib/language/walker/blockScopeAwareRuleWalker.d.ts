import { ScopeAwareRuleWalker } from "./scopeAwareRuleWalker";
import * as ts from "typescript";
/**
    * An AST walker that is aware of block scopes in addition to regular scopes. Block scopes
    * are a superset of regular scopes (new block scopes are created more frequently in a program).
    */
export declare abstract class BlockScopeAwareRuleWalker<T, U> extends ScopeAwareRuleWalker<T> {
    private blockScopeStack;
    constructor(sourceFile: ts.SourceFile, options?: any);
    abstract createBlockScope(): U;
    getCurrentBlockScope(): U;
    onBlockScopeStart(): void;
    getCurrentBlockDepth(): number;
    onBlockScopeEnd(): void;
    protected visitNode(node: ts.Node): void;
    private isBlockScopeBoundary(node);
}
