import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class MemberOrderingWalker extends Lint.RuleWalker {
    private previousMember;
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions);
    visitClassDeclaration(node: ts.ClassDeclaration): void;
    visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void;
    visitMethodDeclaration(node: ts.MethodDeclaration): void;
    visitMethodSignature(node: ts.SignatureDeclaration): void;
    visitPropertyDeclaration(node: ts.PropertyDeclaration): void;
    visitPropertySignature(node: ts.Node): void;
    visitTypeLiteral(node: ts.TypeLiteralNode): void;
    private resetPreviousModifiers();
    private checkModifiersAndSetPrevious(node, currentMember);
    private canAppearAfter(previousMember, currentMember);
}
