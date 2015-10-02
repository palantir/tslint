import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class MemberAccessWalker extends Lint.RuleWalker {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions);
    visitMethodDeclaration(node: ts.MethodDeclaration): void;
    visitPropertyDeclaration(node: ts.PropertyDeclaration): void;
    private validateVisibilityModifiers(node);
}
