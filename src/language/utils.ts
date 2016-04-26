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
        getNewLine: () => "\n",
        getSourceFile: function (filenameToGet: string) {
            if (filenameToGet === normalizedName) {
                return ts.createSourceFile(filenameToGet, source, compilerOptions.target, true);
            }
        },
        readFile: () => null,
        useCaseSensitiveFileNames: () => true,
        writeFile: () => null,
    };

    const program = ts.createProgram([normalizedName], compilerOptions, compilerHost);

    return program.getSourceFile(normalizedName);
}

export function createCompilerOptions(): ts.CompilerOptions {
    return {
        noResolve: true,
        target: ts.ScriptTarget.ES5,
    };
}

export function doesIntersect(failure: RuleFailure, disabledIntervals: IDisabledInterval[]) {
    return disabledIntervals.some((interval) => {
        const maxStart = Math.max(interval.startPosition, failure.getStartPosition().getPosition());
        const minEnd = Math.min(interval.endPosition, failure.getEndPosition().getPosition());
        return maxStart <= minEnd;
    });
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
export function hasModifier(modifiers: ts.ModifiersArray, ...modifierKinds: ts.SyntaxKind[]) {
    if (modifiers == null || modifierKinds == null) {
        return false;
    }

    return modifiers.some((m) => {
        return modifierKinds.some((k) => m.kind === k);
    });
}

/**
 * Determines if the appropriate bit in the parent (VariableDeclarationList) is set,
 * which indicates this is a "let" or "const".
 */
export function isBlockScopedVariable(node: ts.VariableDeclaration | ts.VariableStatement): boolean {
    const parentNode = (node.kind === ts.SyntaxKind.VariableDeclaration)
        ? (<ts.VariableDeclaration> node).parent
        : (<ts.VariableStatement> node).declarationList;

    return isNodeFlagSet(parentNode, ts.NodeFlags.Let)
        || isNodeFlagSet(parentNode, ts.NodeFlags.Const);
}

export function isBlockScopedBindingElement(node: ts.BindingElement): boolean {
    const variableDeclaration = getBindingElementVariableDeclaration(node);
    // if no variable declaration, it must be a function param, which is block scoped
    return (variableDeclaration == null) || isBlockScopedVariable(variableDeclaration);
}

export function getBindingElementVariableDeclaration(node: ts.BindingElement): ts.VariableDeclaration {
    let currentParent = node.parent;
    while (currentParent.kind !== ts.SyntaxKind.VariableDeclaration) {
        if (currentParent.parent == null) {
            return null; // function parameter, no variable declaration
        } else {
            currentParent = currentParent.parent;
        }
    }
    return <ts.VariableDeclaration> currentParent;
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
 * Returns true if decl is a nested module declaration, i.e. represents a segment of a dotted module path.
 */
export function isNestedModuleDeclaration(decl: ts.ModuleDeclaration) {
    // in a declaration expression like 'module a.b.c' - 'a' is the top level module declaration node and 'b' and 'c'
    // are nested therefore we can depend that a node's position will only match with its name's position for nested
    // nodes
    return decl.name.pos === decl.pos;
}
