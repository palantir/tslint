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
import {
    isBlockScopedVariableDeclarationList,
    isIdentifier,
    isPrefixUnaryExpression,
} from "tsutils";
import * as ts from "typescript";

import { IDisabledInterval, RuleFailure } from "./rule/rule";

export function getSourceFile(fileName: string, source: string): ts.SourceFile {
    const normalizedName = path.normalize(fileName).replace(/\\/g, "/");
    return ts.createSourceFile(
        normalizedName,
        source,
        ts.ScriptTarget.ES5,
        /*setParentNodes*/ true,
    );
}

/** @deprecated See IDisabledInterval. */
export function doesIntersect(
    failure: RuleFailure,
    // tslint:disable-next-line:deprecation
    disabledIntervals: IDisabledInterval[],
): boolean {
    return disabledIntervals.some(interval => {
        const maxStart = Math.max(interval.startPosition, failure.getStartPosition().getPosition());
        const minEnd = Math.min(interval.endPosition, failure.getEndPosition().getPosition());
        return maxStart <= minEnd;
    });
}

/**
 * @returns true if any modifier kinds passed along exist in the given modifiers array
 *
 * @deprecated use `hasModifier` from `tsutils`
 */
export function hasModifier(
    modifiers: ts.ModifiersArray | undefined,
    ...modifierKinds: ts.SyntaxKind[]
): boolean {
    if (modifiers === undefined || modifierKinds.length === 0) {
        return false;
    }

    return modifiers.some(m => modifierKinds.some(k => m.kind === k));
}

/**
 * Determines if the appropriate bit in the parent (VariableDeclarationList) is set,
 * which indicates this is a "let" or "const".
 *
 * @deprecated use `isBlockScopedVariableDeclarationList` from `tsutils`
 */
export function isBlockScopedVariable(
    node: ts.VariableDeclaration | ts.VariableStatement,
): boolean {
    if (node.kind === ts.SyntaxKind.VariableDeclaration) {
        const parent = node.parent!;
        return (
            parent.kind === ts.SyntaxKind.CatchClause ||
            isBlockScopedVariableDeclarationList(parent)
        );
    } else {
        return isBlockScopedVariableDeclarationList(node.declarationList);
    }
}

/** @deprecated use `isBlockScopedVariableDeclarationList` and `getDeclarationOfBindingElement` from `tsutils` */
export function isBlockScopedBindingElement(node: ts.BindingElement): boolean {
    const variableDeclaration = getBindingElementVariableDeclaration(node); // tslint:disable-line:deprecation
    // if no variable declaration, it must be a function param, which is block scoped
    return variableDeclaration === null || isBlockScopedVariable(variableDeclaration); // tslint:disable-line:deprecation
}

/** @deprecated use `getDeclarationOfBindingElement` from `tsutils` */
export function getBindingElementVariableDeclaration(
    node: ts.BindingElement,
): ts.VariableDeclaration | null {
    let currentParent = node.parent! as ts.Node;
    while (currentParent.kind !== ts.SyntaxKind.VariableDeclaration) {
        if (currentParent.parent === undefined) {
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
 *
 * @deprecated use `getChildOfKind` from `tsutils`
 */
export function childOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
    return node.getChildren().find(child => child.kind === kind);
}

/**
 * @returns true if some ancestor of `node` satisfies `predicate`, including `node` itself.
 *
 * @deprecated no longer used, use a `while` loop instead
 */
export function someAncestor(node: ts.Node, predicate: (n: ts.Node) => boolean): boolean {
    return predicate(node) || (node.parent !== undefined && someAncestor(node.parent, predicate)); // tslint:disable-line:deprecation
}

export function ancestorWhere<T extends ts.Node = ts.Node>(
    node: ts.Node,
    predicate: ((n: ts.Node) => n is T) | ((n: ts.Node) => boolean),
): T | undefined {
    let cur: ts.Node | undefined = node;
    do {
        if (predicate(cur)) {
            return cur;
        }
        cur = cur.parent;
    } while (cur !== undefined);
    return undefined;
}

/** @deprecated use `isBinaryExpression(node) && isAssignmentKind(node.operatorToken.kind)` with functions from `tsutils` */
export function isAssignment(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.BinaryExpression) {
        const binaryExpression = node as ts.BinaryExpression;
        return (
            binaryExpression.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
            binaryExpression.operatorToken.kind <= ts.SyntaxKind.LastAssignment
        );
    } else {
        return false;
    }
}

/**
 * Bitwise check for node flags.
 *
 * @deprecated use `isNodeFlagSet` from `tsutils`
 */
export function isNodeFlagSet(node: ts.Node, flagToCheck: ts.NodeFlags): boolean {
    // tslint:disable-next-line:no-bitwise
    return (node.flags & flagToCheck) !== 0;
}

/**
 * Bitwise check for combined node flags.
 *
 * @deprecated no longer used
 */
export function isCombinedNodeFlagSet(node: ts.Node, flagToCheck: ts.NodeFlags): boolean {
    // tslint:disable-next-line:no-bitwise
    return (ts.getCombinedNodeFlags(node) & flagToCheck) !== 0;
}

/**
 * Bitwise check for combined modifier flags.
 *
 * @deprecated no longer used
 */
export function isCombinedModifierFlagSet(node: ts.Node, flagToCheck: ts.ModifierFlags): boolean {
    // tslint:disable-next-line:no-bitwise
    return (ts.getCombinedModifierFlags(node) & flagToCheck) !== 0;
}

/**
 * Bitwise check for type flags.
 *
 * @deprecated use `isTypeFlagSet` from `tsutils`
 */
export function isTypeFlagSet(type: ts.Type, flagToCheck: ts.TypeFlags): boolean {
    // tslint:disable-next-line:no-bitwise
    return (type.flags & flagToCheck) !== 0;
}

/**
 * Bitwise check for symbol flags.
 *
 * @deprecated use `isSymbolFlagSet` from `tsutils`
 */
export function isSymbolFlagSet(symbol: ts.Symbol, flagToCheck: ts.SymbolFlags): boolean {
    // tslint:disable-next-line:no-bitwise
    return (symbol.flags & flagToCheck) !== 0;
}

/**
 * Bitwise check for object flags.
 * Does not work with TypeScript 2.0.x
 *
 * @deprecated use `isObjectFlagSet` from `tsutils`
 */
export function isObjectFlagSet(objectType: ts.ObjectType, flagToCheck: ts.ObjectFlags): boolean {
    // tslint:disable-next-line:no-bitwise
    return (objectType.objectFlags & flagToCheck) !== 0;
}

/**
 * @returns true if decl is a nested module declaration, i.e. represents a segment of a dotted module path.
 *
 * @deprecated use `decl.parent!.kind === ts.SyntaxKind.ModuleDeclaration`
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

/** @deprecated use `isFunctionScopeBoundary` from `tsutils` */
export function isScopeBoundary(node: ts.Node): boolean {
    return (
        node.kind === ts.SyntaxKind.FunctionDeclaration ||
        node.kind === ts.SyntaxKind.FunctionExpression ||
        node.kind === ts.SyntaxKind.PropertyAssignment ||
        node.kind === ts.SyntaxKind.ShorthandPropertyAssignment ||
        node.kind === ts.SyntaxKind.MethodDeclaration ||
        node.kind === ts.SyntaxKind.Constructor ||
        node.kind === ts.SyntaxKind.ModuleDeclaration ||
        node.kind === ts.SyntaxKind.ArrowFunction ||
        node.kind === ts.SyntaxKind.ParenthesizedExpression ||
        node.kind === ts.SyntaxKind.ClassDeclaration ||
        node.kind === ts.SyntaxKind.ClassExpression ||
        node.kind === ts.SyntaxKind.InterfaceDeclaration ||
        node.kind === ts.SyntaxKind.GetAccessor ||
        node.kind === ts.SyntaxKind.SetAccessor ||
        (node.kind === ts.SyntaxKind.SourceFile && ts.isExternalModule(node as ts.SourceFile))
    );
}

/** @deprecated use `isBlockScopeBoundary` from `tsutils` */
export function isBlockScopeBoundary(node: ts.Node): boolean {
    return (
        isScopeBoundary(node) || // tslint:disable-line:deprecation
        node.kind === ts.SyntaxKind.Block ||
        isLoop(node) || // tslint:disable-line:deprecation
        node.kind === ts.SyntaxKind.WithStatement ||
        node.kind === ts.SyntaxKind.SwitchStatement ||
        (node.parent !== undefined &&
            (node.parent.kind === ts.SyntaxKind.TryStatement ||
                node.parent.kind === ts.SyntaxKind.IfStatement))
    );
}

/** @deprecated use `isIterationStatement` from `tsutils` or `typescript` */
export function isLoop(node: ts.Node): node is ts.IterationStatement {
    return (
        node.kind === ts.SyntaxKind.DoStatement ||
        node.kind === ts.SyntaxKind.WhileStatement ||
        node.kind === ts.SyntaxKind.ForStatement ||
        node.kind === ts.SyntaxKind.ForInStatement ||
        node.kind === ts.SyntaxKind.ForOfStatement
    );
}

/**
 * @returns Whether node is a numeric expression.
 */
export function isNumeric(node: ts.Expression) {
    while (
        isPrefixUnaryExpression(node) &&
        (node.operator === ts.SyntaxKind.PlusToken || node.operator === ts.SyntaxKind.MinusToken)
    ) {
        node = node.operand;
    }

    return (
        node.kind === ts.SyntaxKind.NumericLiteral ||
        (isIdentifier(node) && (node.text === "NaN" || node.text === "Infinity"))
    );
}

export interface TokenPosition {
    /** The start of the token including all trivia before it */
    fullStart: number;
    /** The start of the token */
    tokenStart: number;
    /** The end of the token */
    end: number;
}
export type ForEachTokenCallback = (
    fullText: string,
    kind: ts.SyntaxKind,
    pos: TokenPosition,
    parent: ts.Node,
) => void;
export type ForEachCommentCallback = (
    fullText: string,
    kind: ts.SyntaxKind,
    pos: TokenPosition,
) => void;
export type FilterCallback = (node: ts.Node) => boolean;

/**
 * Iterate over all tokens of `node`
 *
 * @description JsDoc comments are treated like regular comments and only visited if `skipTrivia` === false.
 *
 * @param node The node whose tokens should be visited
 * @param skipTrivia If set to false all trivia preceeding `node` or any of its children is included
 * @param cb Is called for every token of `node`. It gets the full text of the SourceFile and the position of the token within that text.
 * @param filter If provided, will be called for every Node and Token found. If it returns false `cb` will not be called for this subtree.
 *
 * @deprecated use `forEachToken` or `forEachTokenWithTrivia` from `tsutils`
 */
export function forEachToken(
    node: ts.Node,
    skipTrivia: boolean,
    cb: ForEachTokenCallback,
    filter?: FilterCallback,
) {
    // this function will most likely be called with SourceFile anyways, so there is no need for an additional parameter
    const sourceFile = node.getSourceFile();
    const fullText = sourceFile.text;
    const iterateFn = filter === undefined ? iterateChildren : iterateWithFilter;
    const handleTrivia = skipTrivia ? undefined : createTriviaHandler(sourceFile, cb);

    iterateFn(node);

    // this function is used to save the if condition for the common case where no filter is provided
    function iterateWithFilter(child: ts.Node): void {
        if (filter!(child)) {
            return iterateChildren(child);
        }
    }

    function iterateChildren(child: ts.Node): void {
        if (
            child.kind < ts.SyntaxKind.FirstNode ||
            // for backwards compatibility to typescript 2.0.10
            // JsxText was no Token, but a Node in that version
            child.kind === ts.SyntaxKind.JsxText
        ) {
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
            handleTrivia!(token.pos, tokenStart, token);
        }
        return cb(
            fullText,
            token.kind,
            { tokenStart, fullStart: token.pos, end: token.end },
            token.parent!,
        );
    }
}

function createTriviaHandler(sourceFile: ts.SourceFile, cb: ForEachTokenCallback) {
    const fullText = sourceFile.text;
    const scanner = ts.createScanner(
        sourceFile.languageVersion,
        false,
        sourceFile.languageVariant,
        fullText,
    );
    /**
     * Scan the specified range to get all trivia tokens.
     * This includes trailing trivia of the last token and the leading trivia of the current token
     */
    function handleTrivia(start: number, end: number, token: ts.Node) {
        const parent = token.parent!;
        // prevent false positives by not scanning inside JsxText
        if (!canHaveLeadingTrivia(token.kind, parent)) {
            return;
        }
        scanner.setTextPos(start);
        let position: number;
        // we only get here if start !== end, so we can scan at least one time
        do {
            const kind = scanner.scan();
            position = scanner.getTextPos();
            cb(
                fullText,
                kind,
                { tokenStart: scanner.getTokenPos(), end: position, fullStart: start },
                parent,
            );
        } while (position < end);
    }

    return handleTrivia;
}

/**
 * Iterate over all comments owned by `node` or its children
 *
 * @deprecated use `forEachComment` from `tsutils`
 */
export function forEachComment(node: ts.Node, cb: ForEachCommentCallback) {
    /* Visit all tokens and skip trivia.
       Comment ranges between tokens are parsed without the need of a scanner.
       forEachToken also does intentionally not pay attention to the correct comment ownership of nodes as it always
       scans all trivia before each token, which could include trailing comments of the previous token.
       Comment onwership is done right in this function*/
    // tslint:disable-next-line:deprecation
    return forEachToken(node, true, (fullText, tokenKind, pos, parent) => {
        // don't search for comments inside JsxText
        if (canHaveLeadingTrivia(tokenKind, parent)) {
            // Comments before the first token (pos.fullStart === 0) are all considered leading comments, so no need for special treatment
            const comments = ts.getLeadingCommentRanges(fullText, pos.fullStart);
            if (comments !== undefined) {
                for (const comment of comments) {
                    cb(fullText, comment.kind, {
                        end: comment.end,
                        fullStart: pos.fullStart,
                        tokenStart: comment.pos,
                    });
                }
            }
        }
        if (canHaveTrailingTrivia(tokenKind, parent)) {
            const comments = ts.getTrailingCommentRanges(fullText, pos.end);
            if (comments !== undefined) {
                for (const comment of comments) {
                    cb(fullText, comment.kind, {
                        end: comment.end,
                        fullStart: pos.fullStart,
                        tokenStart: comment.pos,
                    });
                }
            }
        }
    });
}

/** Exclude leading positions that would lead to scanning for trivia inside JsxText */
function canHaveLeadingTrivia(tokenKind: ts.SyntaxKind, parent: ts.Node): boolean {
    switch (tokenKind) {
        case ts.SyntaxKind.JsxText:
            return false; // there is no trivia before JsxText

        case ts.SyntaxKind.OpenBraceToken:
            // before a JsxExpression inside a JsxElement's body can only be other JsxChild, but no trivia
            return (
                parent.kind !== ts.SyntaxKind.JsxExpression ||
                parent.parent!.kind !== ts.SyntaxKind.JsxElement
            );

        case ts.SyntaxKind.LessThanToken:
            switch (parent.kind) {
                case ts.SyntaxKind.JsxClosingElement:
                    return false; // would be inside the element body
                case ts.SyntaxKind.JsxOpeningElement:
                case ts.SyntaxKind.JsxSelfClosingElement:
                    // there can only be leading trivia if we are at the end of the top level element
                    return parent.parent!.parent!.kind !== ts.SyntaxKind.JsxElement;
                default:
                    return true;
            }

        default:
            return true;
    }
}

/** Exclude trailing positions that would lead to scanning for trivia inside JsxText */
function canHaveTrailingTrivia(tokenKind: ts.SyntaxKind, parent: ts.Node): boolean {
    switch (tokenKind) {
        case ts.SyntaxKind.JsxText:
            // there is no trivia after JsxText
            return false;

        case ts.SyntaxKind.CloseBraceToken:
            // after a JsxExpression inside a JsxElement's body can only be other JsxChild, but no trivia
            return (
                parent.kind !== ts.SyntaxKind.JsxExpression ||
                parent.parent!.kind !== ts.SyntaxKind.JsxElement
            );

        case ts.SyntaxKind.GreaterThanToken:
            switch (parent.kind) {
                case ts.SyntaxKind.JsxOpeningElement:
                    return false; // would be inside the element
                case ts.SyntaxKind.JsxClosingElement:
                case ts.SyntaxKind.JsxSelfClosingElement:
                    // there can only be trailing trivia if we are at the end of the top level element
                    return parent.parent!.parent!.kind !== ts.SyntaxKind.JsxElement;

                default:
                    return true;
            }

        default:
            return true;
    }
}

/**
 * Checks if there are any comments between `position` and the next non-trivia token
 *
 * @param text The text to scan
 * @param position The position inside `text` where to start scanning. Make sure that this is a valid start position.
 *                 This value is typically obtained from `node.getFullStart()` or `node.getEnd()`
 */
export function hasCommentAfterPosition(text: string, position: number): boolean {
    return (
        ts.getTrailingCommentRanges(text, position) !== undefined ||
        ts.getLeadingCommentRanges(text, position) !== undefined
    );
}

export interface EqualsKind {
    isPositive: boolean; // True for "===" and "=="
    isStrict: boolean; // True for "===" and "!=="
}

export function getEqualsKind(node: ts.BinaryOperatorToken): EqualsKind | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.EqualsEqualsToken:
            return { isPositive: true, isStrict: false };
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
            return { isPositive: true, isStrict: true };
        case ts.SyntaxKind.ExclamationEqualsToken:
            return { isPositive: false, isStrict: false };
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return { isPositive: false, isStrict: true };
        default:
            return undefined;
    }
}

export function isStrictNullChecksEnabled(options: ts.CompilerOptions): boolean {
    return (
        options.strictNullChecks === true ||
        (options.strict === true && options.strictNullChecks !== false)
    );
}

export function isNegativeNumberLiteral(
    node: ts.Node,
): node is ts.PrefixUnaryExpression & { operand: ts.NumericLiteral } {
    return (
        isPrefixUnaryExpression(node) &&
        node.operator === ts.SyntaxKind.MinusToken &&
        node.operand.kind === ts.SyntaxKind.NumericLiteral
    );
}

/** Wrapper for compatibility with typescript@<2.3.1 */
export function isWhiteSpace(ch: number): boolean {
    // tslint:disable-next-line
    return (ts.isWhiteSpaceLike || (ts as any).isWhiteSpace)(ch);
}
