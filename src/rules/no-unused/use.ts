/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

// tslint:disable no-bitwise

import assert = require("assert");
import { hasModifier, isAssignmentKind, isSymbolFlagSet, isTypeFlagSet } from "tsutils";
import * as ts from "typescript";

import { assertNever, isFunctionLikeSymbol, isOnLeftHandSideOfMutableDestructuring, isReadonlyType } from "./utils";

export class SymbolUses {
    public private = Use.None;
    public public = Use.None;

    get everUsedPublicly(): boolean {
        return this.public !== Use.None;
    }

    get everUsedAsMutableCollection(): boolean {
        return this.has(Use.ReadWithMutableType | Use.MutateCollection);
    }

    get everUsedForSideEffect(): boolean {
        return this.has(Use.SideEffect);
    }

    get everCreatedOrWritten(): boolean {
        return this.has(Use.CreateFresh | Use.CreateAlias | Use.Write);
    }

    get everWritten(): boolean {
        return this.has(Use.Write);
    }

    get everRead(): boolean {
        return this.has(Use.ReadEitherWay);
    }

    get mutatesCollection(): boolean {
        return this.has(Use.MutateCollection);
    }

    get everAssignedANonFreshValue(): boolean {
        return this.has(Use.Write | Use.CreateAlias);
    }

    private has(flag: Use): boolean {
        return hasUse(this.private | this.public, flag);
    }
}

export const enum Use {
    None = 0,
    /** Only reads from a variable. */
    ReadReadonly = 1 << 0,
    /** Assign this to a variable that's not a readonly collection. */
    ReadWithMutableType = 1 << 1,
    /** Call a method like `push()` that's *purely* a setter; we will detect collections that are *only* pushed to. */
    MutateCollection = 1 << 2,
    /**
     * Only writes to a variable without using the result. E.g.: `x++;`.
     * Note that mutating the variable pointing to a collection is not mutating the collection.
     */
    Write = 1 << 3,
    /** Creates it as in `x = []` */
    CreateFresh = 1 << 4,
    /** Creates it as in `x = f()` (may be an alias) */
    CreateAlias = 1 << 5,
    /** Calling `f()` uses it for a side effect, but doesn't touch the return value. */
    SideEffect = 1 << 6,

    ReadEitherWay = ReadReadonly | ReadWithMutableType,
}
function hasUse(a: Use, b: Use): boolean {
    return (a & b) !== Use.None;
}

export function getUse(
    node: ts.Identifier,
    symbol: ts.Symbol,
    checker: ts.TypeChecker,
    addAlias: (id: ts.Identifier) => void,
): Use {
    return new UseChecker(checker, addAlias).work(node, symbol, true);
}
class UseChecker {
    constructor(private readonly checker: ts.TypeChecker, private readonly addAlias: (id: ts.Identifier) => void) {}

    public work(node: ts.Expression, symbol: ts.Symbol | undefined, shouldAddAlias: boolean): Use {
        const parent = node.parent!;
        switch (parent.kind) {
            case ts.SyntaxKind.PropertyAccessExpression: {
                const { name } = parent as ts.PropertyAccessExpression;
                if (node === name) {
                    // Recurse to parent to see how the property is being used.
                    return this.work(parent as ts.PropertyAccessExpression, symbol, shouldAddAlias);
                }

                // If this property access is called, it's a method call -- may be mutating a collection.
                const call = parent.parent!;
                if (!ts.isCallExpression(call) || call.expression !== parent) {
                    return Use.ReadReadonly;
                }

                // If the method name is e.g. "push" we aren't *writing* to the symbol, but we are writing to its *content*.
                const collectionMutateKind = getCollectionMutateKind(name.text);
                switch (collectionMutateKind) {
                    case CollectionMutateKind.None:
                        return Use.ReadReadonly;
                    case CollectionMutateKind.ReturnThis:
                        return this.work(call, symbol, shouldAddAlias) | Use.MutateCollection;
                    case CollectionMutateKind.ReturnData:
                        // Recurse to check if the returned data was actually used.
                        return this.work(call, symbol, shouldAddAlias) | Use.MutateCollection;
                    case CollectionMutateKind.ReturnNonUseful:
                        return Use.MutateCollection;
                    default:
                        throw assertNever(collectionMutateKind);
                }
            }

            case ts.SyntaxKind.VariableDeclaration: {
                const { initializer, name, parent: grandParent } = parent as ts.VariableDeclaration;
                if (node === name) {
                    const varStatement = grandParent!.parent!;
                    return ts.isVariableStatement(varStatement)
                        ? isAmbient(varStatement) ? Use.CreateAlias : createFlag(initializer)
                        : Use.CreateAlias;
                } else {
                    assert(node === initializer);
                    const addedAlias = ts.isIdentifier(name) && shouldAddAlias;
                    if (addedAlias) {
                        this.addAlias(name as ts.Identifier);
                    }
                    // There may be no contextual type, in which case we consider this an immutable use for now.
                    // But we will track uses of the alias and handle that at the end.
                    return this.readFromContext(node, addedAlias);
                }
            }

            case ts.SyntaxKind.BinaryExpression: {
                const { left, operatorToken, right } = parent as ts.BinaryExpression;
                if (operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                    if (node === left) {
                        // `this.x = ...` in a constructor is a *creation* and not a write.
                        return ts.isPropertyAccessExpression(left)
                            && left.expression.kind === ts.SyntaxKind.ThisKeyword
                            && isInOwnConstructor(node, symbol)
                            ? createFlag(right)
                            : Use.Write;
                    } else {
                        // `... = x` means we are assigning this to something else,
                        // and need the contextual type to know if it's used as a readonly collection.
                        // When assigning to an existing variable there should always be a contextual type, so no need to track an alias.
                        return this.readFromContext(node);
                    }
                } else {
                    return node === left && isAssignmentKind(operatorToken.kind)
                        // `x += ...` is treated as a write, and also as a read if it appears in another expression as in `f(x += 1)`.
                        ? writeAndMaybeRead(node, symbol)
                        // `... += x` is a pure read.
                        : Use.ReadReadonly;
                }
            }

            case ts.SyntaxKind.ElementAccessExpression: {
                if (node === (parent as ts.ElementAccessExpression).argumentExpression) {
                    return Use.ReadReadonly;
                } else {
                    // Don't add an alias for the parent, since this is for an element of the array.
                    const parentFlags = this.work(parent as ts.ElementAccessExpression, undefined, /*shouldAddAlias*/ false);
                    // Read/write an element of the array
                    const read = hasUse(parentFlags, Use.ReadEitherWay) ? Use.ReadReadonly : Use.None;
                    const write = hasUse(parentFlags, Use.Write) ? Use.MutateCollection : Use.None;
                    return write | read;
                }
            }

            case ts.SyntaxKind.ShorthandPropertyAssignment:
                return isOnLeftHandSideOfMutableDestructuring((parent as ts.ShorthandPropertyAssignment).parent)
                    // `({ x } = o);`: If this is the property symbol, reads it. If this is the local variable, writes to it.
                    // We will create an alias in Analyzer, so mark readonly for now.
                    ? isSymbolFlagSet(symbol!, ts.SymbolFlags.Property) ? Use.ReadReadonly : Use.Write
                    // If this is the property symbol, this creates it. Otherwise this is reading a local variable.
                    : isSymbolFlagSet(symbol!, ts.SymbolFlags.Property) ? Use.CreateAlias : this.readFromContext(node);

            case ts.SyntaxKind.PropertyAssignment: {
                const { name, initializer, parent: grandParent } = parent as ts.PropertyAssignment;
                return isOnLeftHandSideOfMutableDestructuring(grandParent)
                    // Mark as ReadReadonly for now; Analyzer will create an alias.
                    ? node === name ? Use.ReadReadonly : Use.Write
                    : node === name ? createFlag(initializer) : this.readFromContext(node);
            }

            case ts.SyntaxKind.CallExpression: {
                const { expression } = parent as ts.CallExpression;
                return node !== expression
                    ? this.readFromContext(node)
                    : symbol !== undefined && isFunctionLikeSymbol(symbol)
                        // For a callable, we analyze the return type to see if it's used mutably.
                        ? this.work(parent as ts.CallExpression, symbol, shouldAddAlias)
                        : Use.ReadReadonly;
            }

            case ts.SyntaxKind.ExportSpecifier: {
                const { name, propertyName } = parent as ts.ExportSpecifier;
                if (propertyName === undefined) {
                    // Symbol is the originating symbol.
                    assert(symbol !== undefined);
                    return isSymbolFlagSet(symbol!, ts.SymbolFlags.Alias) ? Use.CreateAlias : Use.ReadReadonly;
                }
                return node === name ? Use.ReadReadonly : Use.Write;
            }

            case ts.SyntaxKind.NewExpression:
                return node !== (parent as ts.NewExpression).expression
                    ? this.readFromContext(node)
                    : Use.ReadReadonly;

            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
                const { operator } = parent as ts.PrefixUnaryExpression | ts.PostfixUnaryExpression;
                return operator === ts.SyntaxKind.PlusPlusToken || operator === ts.SyntaxKind.MinusMinusToken
                    ? writeAndMaybeRead(node, symbol)
                    : Use.ReadReadonly;

            case ts.SyntaxKind.PropertyDeclaration: {
                const { name, initializer } = parent as ts.PropertyDeclaration;
                return node === name ? createFlag(initializer) : this.readFromContext(node);
            }

            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.NonNullExpression:
            case ts.SyntaxKind.ParenthesizedExpression:
                type T = ts.AsExpression | ts.TypeAssertion | ts.NonNullExpression | ts.ParenthesizedExpression;
                return this.work(parent as T, symbol, shouldAddAlias);

            case ts.SyntaxKind.BindingElement:
                // Mark it as ReadReadonly for now, but in Analyzer we'll create an alias between the property and the new local.
                return isSymbolFlagSet(symbol!, ts.SymbolFlags.Property) ? Use.ReadReadonly : Use.CreateAlias;

            case ts.SyntaxKind.ArrayLiteralExpression:
                return isOnLeftHandSideOfMutableDestructuring(parent as ts.ArrayLiteralExpression) ? Use.Write : this.readFromContext(node);

            case ts.SyntaxKind.ConditionalExpression:
                return node === (parent as ts.ConditionalExpression).condition ? Use.ReadReadonly : this.readFromContext(node);

            case ts.SyntaxKind.Parameter:
                return node === (parent as ts.ParameterDeclaration).name ? Use.CreateAlias : this.readFromContext(node);

            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.ArrowFunction: // Return value only, parameters are in ParameterDeclarations
            case ts.SyntaxKind.ThrowStatement:
                return this.readFromContext(node);

            case ts.SyntaxKind.DeleteExpression:
                return Use.Write;

            case ts.SyntaxKind.ExpressionStatement:
                return Use.SideEffect;

            case ts.SyntaxKind.FunctionExpression: // We won't analyze this anyway.
            case ts.SyntaxKind.PropertySignature:
                return Use.None;

            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.ModuleDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ExpressionWithTypeArguments:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ExportAssignment:
            case ts.SyntaxKind.NamespaceExportDeclaration:
            case ts.SyntaxKind.TypeParameter:
            case ts.SyntaxKind.NamespaceImport:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.ImportSpecifier:
            case ts.SyntaxKind.ImportClause:
            case ts.SyntaxKind.ImportEqualsDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.MethodSignature:
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
                return Use.CreateFresh;

            case ts.SyntaxKind.ComputedPropertyName:
            case ts.SyntaxKind.IfStatement:
            case ts.SyntaxKind.AwaitExpression:
            case ts.SyntaxKind.SpreadAssignment:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement:
            case ts.SyntaxKind.WhileStatement: // The condition of the loop
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.VoidExpression:
            case ts.SyntaxKind.CaseClause:
            case ts.SyntaxKind.TaggedTemplateExpression:
            case ts.SyntaxKind.TemplateSpan:
            case ts.SyntaxKind.SwitchStatement: // The thing being switched on
            case ts.SyntaxKind.SpreadElement:
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.QualifiedName:
            case ts.SyntaxKind.TypeQuery:
            case ts.SyntaxKind.EnumMember:
            case ts.SyntaxKind.TypePredicate:
            case ts.SyntaxKind.TypeReference:
                return Use.ReadReadonly;

            default:
                throw new Error(`TODO: handle ${ts.SyntaxKind[parent.kind]}`);
        }
    }

    private readFromContext(node: ts.Expression, addedAlias = false): Use {
        // In all other locations: if provided to a context with a readonly type, not a mutable use.
        // `function f(): ReadonlyArray<number> { return x; }` uses `x` readonly, `funciton f(): number[]` does not.
        const contextualType = this.checker.getContextualType(node);
        return contextualType === undefined
            // If there's no contextual type, be pessimistic.
            // But for variable declaration be optimistic because we just added an alias.
            ? addedAlias ? Use.ReadReadonly : Use.ReadWithMutableType
            : isTypeFlagSet(contextualType, ts.TypeFlags.Any)
            // Assume that it's OK to pass a readonly collection to 'any'
            ? Use.ReadReadonly
            : !isReadonlyType(contextualType) ? Use.ReadWithMutableType : Use.ReadReadonly;
    }
}

function createFlag(initializer: ts.Expression | undefined): Use {
    return initializer === undefined
        ? Use.None
        : isFreshCollection(initializer)
        ? Use.CreateFresh
        : Use.CreateAlias;
}
function isFreshCollection(initializer: ts.Expression): boolean {
    return ts.isArrayLiteralExpression(initializer) ||
        ts.isNewExpression(initializer)
        && ts.isIdentifier(initializer.expression)
        && isNameOfMutableCollectionType(initializer.expression.text);
}

export function isNameOfMutableCollectionType(name: string): boolean {
    return mutableCollectionTypeNames.has(name);
}
const mutableCollectionTypeNames: ReadonlySet<string> = new Set(["Array", "Set", "Map"]);

/** Include a read flag if the parent expression is used. */
function writeAndMaybeRead(node: ts.Node, symbol: ts.Symbol | undefined): Use {
    // If grandparent is not an ExpressionStatement, this is used as an expression in addition to having a side effect.
    const shouldRead = node.parent!.parent!.kind !== ts.SyntaxKind.ExpressionStatement;
    // In all the places this function is called, we are using an operator like `++` or `+=`,
    // so no need to worry about collection freshness.
    const flags = isInOwnConstructor(node, symbol) ? Use.CreateFresh : Use.Write;
    return shouldRead ? flags | Use.ReadReadonly : flags;
}

// Write usage of a property is "readonly" if it appears in a constructor.
function isInOwnConstructor(node: ts.Node, propertySymbol: ts.Symbol | undefined): boolean {
    if (propertySymbol === undefined) {
        return false;
    }
    const decl = propertySymbol.valueDeclaration;
    if (decl === undefined || !ts.isPropertyDeclaration(decl)) {
        return false;
    }
    const declParent = decl.parent!;
    if (!ts.isClassLike(declParent)) {
        return false;
    }

    const ctr = declParent.members.find((m) => ts.isConstructorDeclaration(m) && m.body !== undefined);
    while (true) {
        const parent = node.parent;
        if (parent === undefined) {
            return false;
        }
        if (ts.isFunctionLike(parent)) {
            return parent === ctr;
        }
        node = parent;
    }
}

const enum CollectionMutateKind {
    /**
     * Collection is read but not changed.
     * These are presumed to return useful data, meaning it's not a write-only collection.
     */
    None,
    /** Mutates the collection and returns it. Need to watch out for chained calls. */
    ReturnThis,
    /** Mutates the collection and returns useful data, meaning it's not a write-only collection. */
    ReturnData,
    /** Just mutates the collection and doesn't return values from inside it. It may be a write-only collection. */
    ReturnNonUseful,
}
function getCollectionMutateKind(name: string): CollectionMutateKind {
    switch (name) {
        case "copyWithin":
        case "sort":
        case "add": // Set
        case "set": // Map
            return CollectionMutateKind.ReturnThis;
        case "pop":
        case "shift":
        case "splice":
        case "delete": // Set/Map, returns whether it succeeded, which is useful info
            return CollectionMutateKind.ReturnData;
        case "push": // Returns array length -- not really useful since you could use a counter instead
        case "unshift": // Same as above
        case "clear": // Returns undefined
            return CollectionMutateKind.ReturnNonUseful;
        default:
            return CollectionMutateKind.None;
    }
}

function isAmbient(node: ts.Node): boolean {
    // TODO: ts.NodeFlags.Ambient could be public, then just use isNodeFlagSet(node, ts.NodeFlags.Ambient)
    return ts.isSourceFile(node) ? false : hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword) || isAmbient(node.parent!);
}
