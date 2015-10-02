import { RuleWalker } from "./ruleWalker";
import * as ts from "typescript";
export declare abstract class ScopeAwareRuleWalker<T> extends RuleWalker {
    private scopeStack;
    constructor(sourceFile: ts.SourceFile, options?: any);
    abstract createScope(): T;
    getCurrentScope(): T;
    getAllScopes(): T[];
    getCurrentDepth(): number;
    onScopeStart(): void;
    onScopeEnd(): void;
    protected visitNode(node: ts.Node): void;
    protected isScopeBoundary(node: ts.Node): boolean;
}
