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

import * as path from "path";
import * as ts from "typescript";

import {IDisabledInterval, RuleFailure} from "./rule/rule";

export function getSourceFile(fileName: string, source: string): ts.SourceFile {
    const normalizedName = path.normalize(fileName).replace(/\\/g, "/");
    const compilerOptions = createCompilerOptions();

    const compilerHost: ts.CompilerHost = {
        fileExists: () => true,
        getCanonicalFileName: (filename: string) => filename,
        getCurrentDirectory: () => "",
        getDefaultLibFileName: () => "lib.d.ts",
        getDirectories: (_path: string) => [],
        getNewLine: () => "\n",
        getSourceFile: (filenameToGet: string) => {
            const target = compilerOptions.target == null ? ts.ScriptTarget.ES5 : compilerOptions.target;
            return ts.createSourceFile(filenameToGet, source, target, true);
        },
        readFile: (x: string) => x,
        useCaseSensitiveFileNames: () => true,
        writeFile: (x: string) => x,
    };

    const program = ts.createProgram([normalizedName], compilerOptions, compilerHost);

    return program.getSourceFile(normalizedName);
}

export function createCompilerOptions(): ts.CompilerOptions {
    return {
        allowJs: true,
        noResolve: true,
        target: ts.ScriptTarget.ES5,
    };
}

export function doesIntersect(failure: RuleFailure, disabledIntervals: IDisabledInterval[]) {
    const failureStart = failure.getStartPosition().getPosition();
    const failureEnd = failure.getEndPosition().getPosition();
    for (const interval of disabledIntervals) {
        const maxStart = Math.max(interval.startPosition, failureStart);
        const minEnd = Math.min(interval.endPosition, failureEnd);
        if (maxStart <= minEnd) {
            return true;
        }
    }
    return false;
}

export function scanAllTokens(scanner: ts.Scanner, callback: (s: ts.Scanner) => void) {
    let lastStartPos = -1;
    while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
        const startPos = scanner.getStartPos();
        if (startPos === lastStartPos) {
            break;
        }
        lastStartPos = startPos;
        callback(scanner);
    }
}

/**
 * @returns true if any modifier kinds passed along exist in the given modifiers array
 */
export function hasModifier(modifiers: ts.ModifiersArray | undefined, ...modifierKinds: ts.SyntaxKind[]) {
    if (modifiers === undefined || modifierKinds.length === 0) {
        return false;
    }

    for (const modifier of modifiers) {
        if (modifierKinds.indexOf(modifier.kind) !== -1) {
            return true;
        }
    }
    return false;
}

/**
 * Determines if the appropriate bit in the parent (VariableDeclarationList) is set,
 * which indicates this is a "let" or "const".
 */
export function isBlockScopedVariable(node: ts.VariableDeclaration | ts.VariableStatement): boolean {
    const parentNode = (node.kind === ts.SyntaxKind.VariableDeclaration)
        ? (node as ts.VariableDeclaration).parent
        : (node as ts.VariableStatement).declarationList;

    return isNodeFlagSet(parentNode!, ts.NodeFlags.Let)
        || isNodeFlagSet(parentNode!, ts.NodeFlags.Const);
}

export function isBlockScopedBindingElement(node: ts.BindingElement): boolean {
    const variableDeclaration = getBindingElementVariableDeclaration(node);
    // if no variable declaration, it must be a function param, which is block scoped
    return (variableDeclaration == null) || isBlockScopedVariable(variableDeclaration);
}

export function getBindingElementVariableDeclaration(node: ts.BindingElement): ts.VariableDeclaration | null {
    let currentParent = node.parent!;
    while (currentParent.kind !== ts.SyntaxKind.VariableDeclaration) {
        if (currentParent.parent == null) {
            return null; // function parameter, no variable declaration
        } else {
            currentParent = currentParent.parent;
        }
    }
    return currentParent as ts.VariableDeclaration;
}

/**
 * Finds a child of a given node with a given kind.
 * Note: This uses `node.getChildren()`, which does extra parsing work to include tokens.
 */
export function childOfKind(node: ts.Node, kind: ts.SyntaxKind, sourceFile?: ts.SourceFile): ts.Node | undefined {
    for (const child of node.getChildren(sourceFile)) {
        if (child.kind === kind) {
            return child;
        }
    }
    return undefined;
}

/**
 * @returns true if some ancestor of `node` satisfies `predicate`, including `node` itself.
 */
export function someAncestor(node: ts.Node, predicate: (n: ts.Node) => boolean): boolean {
    return predicate(node) || (node.parent != null && someAncestor(node.parent, predicate));
}

export function isAssignment(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.BinaryExpression) {
        const binaryExpression = node as ts.BinaryExpression;
        return binaryExpression.operatorToken.kind >= ts.SyntaxKind.FirstAssignment
            && binaryExpression.operatorToken.kind <= ts.SyntaxKind.LastAssignment;
    } else {
        return false;
    }
}

/**
 * Bitwise check for node flags.
 */
export function isNodeFlagSet(node: ts.Node, flagToCheck: ts.NodeFlags): boolean {
    /* tslint:disable:no-bitwise */
    return (node.flags & flagToCheck) !== 0;
    /* tslint:enable:no-bitwise */
}

/**
 * Bitwise check for combined node flags.
 */
export function isCombinedNodeFlagSet(node: ts.Node, flagToCheck: ts.NodeFlags): boolean {
    /* tslint:disable:no-bitwise */
    return (ts.getCombinedNodeFlags(node) & flagToCheck) !== 0;
    /* tslint:enable:no-bitwise */
}

/**
 * Bitwise check for combined modifier flags.
 */
export function isCombinedModifierFlagSet(node: ts.Node, flagToCheck: ts.ModifierFlags): boolean {
    /* tslint:disable:no-bitwise */
    return (ts.getCombinedModifierFlags(node) & flagToCheck) !== 0;
    /* tslint:enable:no-bitwise */
}

/**
 * Bitwise check for type flags.
 */
export function isTypeFlagSet(type: ts.Type, flagToCheck: ts.TypeFlags): boolean {
    /* tslint:disable:no-bitwise */
    return (type.flags & flagToCheck) !== 0;
    /* tslint:enable:no-bitwise */
}

/**
 * Bitwise check for object flags.
 * Does not work with TypeScript 2.0.x
 */
export function isObjectFlagSet(objectType: ts.ObjectType, flagToCheck: ts.ObjectFlags): boolean {
    /* tslint:disable:no-bitwise */
    return (objectType.objectFlags & flagToCheck) !== 0;
    /* tslint:enable:no-bitwise */
}

/**
 * @returns true if decl is a nested module declaration, i.e. represents a segment of a dotted module path.
 */
export function isNestedModuleDeclaration(decl: ts.ModuleDeclaration) {
    // in a declaration expression like 'module a.b.c' - 'a' is the top level module declaration node and 'b' and 'c'
    // are nested therefore we can depend that a node's position will only match with its name's position for nested
    // nodes
    return decl.name.pos === decl.pos;
}

export function unwrapParentheses(node: ts.Expression) {
    while (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
        node = (node as ts.ParenthesizedExpression).expression;
    }
    return node;
}

export function isScopeBoundary(node: ts.Node): boolean {
    return node.kind === ts.SyntaxKind.FunctionDeclaration
        || node.kind === ts.SyntaxKind.FunctionExpression
        || node.kind === ts.SyntaxKind.PropertyAssignment
        || node.kind === ts.SyntaxKind.ShorthandPropertyAssignment
        || node.kind === ts.SyntaxKind.MethodDeclaration
        || node.kind === ts.SyntaxKind.Constructor
        || node.kind === ts.SyntaxKind.ModuleDeclaration
        || node.kind === ts.SyntaxKind.ArrowFunction
        || node.kind === ts.SyntaxKind.ParenthesizedExpression
        || node.kind === ts.SyntaxKind.ClassDeclaration
        || node.kind === ts.SyntaxKind.ClassExpression
        || node.kind === ts.SyntaxKind.InterfaceDeclaration
        || node.kind === ts.SyntaxKind.GetAccessor
        || node.kind === ts.SyntaxKind.SetAccessor
        || node.kind === ts.SyntaxKind.SourceFile && ts.isExternalModule(node as ts.SourceFile);
}

export function isBlockScopeBoundary(node: ts.Node): boolean {
    return isScopeBoundary(node)
        || node.kind === ts.SyntaxKind.Block
        || node.kind === ts.SyntaxKind.DoStatement
        || node.kind === ts.SyntaxKind.WhileStatement
        || node.kind === ts.SyntaxKind.ForStatement
        || node.kind === ts.SyntaxKind.ForInStatement
        || node.kind === ts.SyntaxKind.ForOfStatement
        || node.kind === ts.SyntaxKind.WithStatement
        || node.kind === ts.SyntaxKind.SwitchStatement
        || node.parent !== undefined
            && (node.parent.kind === ts.SyntaxKind.TryStatement
            || node.parent.kind === ts.SyntaxKind.IfStatement);
}
