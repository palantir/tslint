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
    return disabledIntervals.some((interval) => {
        const maxStart = Math.max(interval.startPosition, failure.getStartPosition().getPosition());
        const minEnd = Math.min(interval.endPosition, failure.getEndPosition().getPosition());
        return maxStart <= minEnd;
    });
}

/** @deprecated use forEachToken instead */
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
export function childOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
    return node.getChildren().find((child) => child.kind === kind);
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

export interface TokenPosition {
    /** The start of the token including all trivia before it */
    fullStart: number;
    /** The start of the token */
    tokenStart: number;
    /** The end of the token */
    end: number;
}
export type ForEachCallback = (fullText: string, kind: ts.SyntaxKind, pos: TokenPosition) => void;
export type FilterCallback = (node: ts.Node) => boolean;

/**
 * Iterate over all tokens of `node`
 * 
 * @description JsDoc comments are treated like regular comments and only visited if `skipTrivia` === false.
 * 
 * @param node The node whose tokens should be visited
 * @param skipTrivia If set to false all trivia owned by `node` or its children is included
 * @param cb Is called for every token of `node`. It gets the full text of the SourceFile and the position of the token within that text.
 * @param filter If provided, will be called for every Node and Token found. If it returns false `cb` will not be called for this subtree.
 */
export function forEachToken(node: ts.Node, skipTrivia: boolean, cb: ForEachCallback, filter?: FilterCallback) {
    // this function will most likely be called with SourceFile anyways, so there is no need for an additional parameter
    const sourceFile = node.getSourceFile();
    const fullText = sourceFile.text;
    const scanner = skipTrivia ? undefined : ts.createScanner(sourceFile.languageVersion, false, sourceFile.languageVariant, fullText);
    const iterateFn = filter === undefined ? iterateChildren : iterateWithFilter;

    iterateFn(node);

    // this function is used to save the if condition for the common case where no filter is provided
    function iterateWithFilter(child: ts.Node): void {
        if (filter!(child)) {
            return iterateChildren(child);
        }
    }

    function iterateChildren(child: ts.Node): void {
        if (child.kind < ts.SyntaxKind.FirstNode) {
            // we found a token, tokens have no children, stop recursing here
            return callback(child);
        }
        /* Exclude everything contained in JsDoc, it will be handled with the other trivia anyway.
         * When we would handle JsDoc tokens like regular ones, we would scan some trivia multiple times.
         * Even worse, we would scan for trivia inside the JsDoc comment, which yields unexpected results.*/
        if (child.kind !== ts.SyntaxKind.JSDocComment) {
            // recurse into Node's children to find tokens
            return child.getChildren(sourceFile).forEach(iterateFn);
        }
    }

    function callback(token: ts.Node) {
        const tokenStart = token.getStart(sourceFile);
        if (!skipTrivia && tokenStart !== token.pos) {
            // we only have to handle trivia before each token, because there is nothing after EndOfFileToken
            handleTrivia(token.pos, tokenStart);
        }
        return cb(fullText, token.kind, {tokenStart, fullStart: token.pos, end: token.end});
    }

    /** 
     * Scan the specified range to get all trivia tokens.
     * This includes trailing trivia of the last token and the leading trivia of the current token
     */
    function handleTrivia(start: number, end: number) {
        scanner!.setTextPos(start);
        let position: number;
        // we only get here if start !== end, so we can scan at least one time
        do {
            const kind = scanner!.scan();
            position = scanner!.getTextPos();
            cb(fullText, kind, {tokenStart: scanner!.getTokenPos(), end: position, fullStart: start});
        } while (position < end);
    }
}

// TODO whitespaceRule template expression

/** Iterate over all comments owned by `node` or its children */
export function forEachComment(node: ts.Node, cb: ForEachCallback) {
    // get all tokens and skip trivia. comment ranges between tokens are parsed without the need of a scanner
    return forEachToken(node, true, (fullText, _kind, pos) => {
        // Comments before the first token (pos.fullStart === 0) are all considered leading comments, so no need for special treatment
        ts.forEachLeadingCommentRange(fullText, pos.fullStart, commentCallback);
        ts.forEachTrailingCommentRange(fullText, pos.end, commentCallback);
        function commentCallback(tokenStart: number, end: number, kind: ts.SyntaxKind) {
            cb(fullText, kind, {tokenStart, end, fullStart: pos.fullStart});
        }
    });
}

function hasCommentCallback() {
    return true;
}

/** Checks if there are any comments between `position` and the next non-tivia token */
export function hasCommentAfterPosition(text: string, position: number): boolean {
    return ts.forEachTrailingCommentRange(text, position, hasCommentCallback) ||
           ts.forEachLeadingCommentRange(text, position, hasCommentCallback) ||
           false; // return boolean instead of undefined if no comment is found
}
