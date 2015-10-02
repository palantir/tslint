import * as Lint from "../lint";
import * as ts from "typescript";
export declare function getSourceFile(fileName: string, source: string): ts.SourceFile;
export declare function createCompilerOptions(): ts.CompilerOptions;
export declare function doesIntersect(failure: Lint.RuleFailure, disabledIntervals: Lint.IDisabledInterval[]): boolean;
export declare function abstract(): string;
export declare function scanAllTokens(scanner: ts.Scanner, callback: (s: ts.Scanner) => void): void;
/**
    * @returns true if any modifier kinds passed along exist in the given modifiers array
    */
export declare function hasModifier(modifiers: ts.ModifiersArray, ...modifierKinds: ts.SyntaxKind[]): boolean;
/**
    * Determines if the appropriate bit in the parent (VariableDeclarationList) is set,
    * which indicates this is a "let" or "const".
    */
export declare function isBlockScopedVariable(node: ts.VariableDeclaration | ts.VariableStatement): boolean;
export declare function isBlockScopedBindingElement(node: ts.BindingElement): boolean;
/**
    * Bitwise check for node flags.
    */
export declare function isNodeFlagSet(node: ts.Node, flagToCheck: ts.NodeFlags): boolean;
