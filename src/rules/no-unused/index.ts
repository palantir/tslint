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

import {
    hasModifier,
    isExpression,
    isSymbolFlagSet,
    isTypeFlagSet,
    isTypeReference,
    isUnionOrIntersectionType,
    isUnionType,
} from "tsutils";
import * as ts from "typescript";

import { arrayify, find, mapDefined } from "../../utils";
import { EnumUse, getEnumUse } from "./enumUse";
import { isPublicAccess } from "./privacy";
import { getUse, SymbolUses, Use } from "./use";
import { assertNever, getOrCreate, isOnLeftHandSideOfMutableDestructuring, isReadonlyType, multiMapAdd, skipAlias, zip } from "./utils";

const infoCache = new WeakMap<ts.Program, AnalysisResult>();
export function getInfo(program: ts.Program): AnalysisResult {
    return getOrCreate(infoCache, program, () => {
        const analyzer = new Analyzer(program.getTypeChecker());
        for (const file of program.getSourceFiles()) {
            analyzer.analyze(file, file, undefined);
        }
        return analyzer.finish();
    });
}

export class AnalysisResult {
    constructor(
        private readonly symbolUses: ReadonlyMap<ts.Symbol, SymbolUses>,
        private readonly enumMembers: ReadonlyMap<ts.Symbol, EnumUse>) {}

    public getSymbolUses(symbol: ts.Symbol): SymbolUses {
        return this.symbolUses.get(symbol)!;
    }

    public getEnumAccessFlags(enumMember: ts.Symbol): EnumUse {
        const flags = this.enumMembers.get(enumMember);
        return flags === undefined ? EnumUse.None : flags;
    }
}

class Analyzer {
    private readonly symbolUses = new Map<ts.Symbol, SymbolUses>();
    private readonly enumMembers = new Map<ts.Symbol, EnumUse>();
    private readonly localVariableAliases = new Map<ts.Symbol, Set<ts.Symbol>>();
    private readonly typeAssignments = new Map</*source*/ ts.Type, /*taret*/ Set<ts.Type>>();
    private readonly seenTypeCasts = new Set<ts.Type>();

    constructor(private readonly checker: ts.TypeChecker) {}

    public finish(): AnalysisResult {
        this.addUsesFromAliases();
        this.addUsesFromAssignments();
        return new AnalysisResult(this.symbolUses, this.enumMembers);
    }

    public analyze(node: ts.Node, currentFile: ts.SourceFile, currentClass: ts.ClassLikeDeclaration | undefined) {
        switch (node.kind) {
            case ts.SyntaxKind.Identifier:
                this.trackUse(node as ts.Identifier, currentFile, currentClass);
                break;

            case ts.SyntaxKind.VariableDeclaration: {
                const { name, type: typeNode, initializer } = node as ts.VariableDeclaration;
                const initializerType = initializer === undefined ? undefined : this.checker.getTypeAtLocation(initializer);
                const type = typeNode !== undefined ? this.checker.getTypeFromTypeNode(typeNode) : initializerType;
                if (initializer !== undefined && typeNode !== undefined) {
                    this.addTypeAssignment(type!, this.checker.getTypeAtLocation(initializer));
                }
                if (type !== undefined) {
                    this.addAliasesFromDestructure(name, type);
                }
                break;
            }

            case ts.SyntaxKind.BinaryExpression: {
                const { left, operatorToken, right } = node as ts.BinaryExpression;
                if (operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                    // Destructuring use should not count as a type assignment.
                    if (ts.isObjectLiteralExpression(left) || ts.isArrayLiteralExpression(left)) {
                    this.addAliasesFromMutatingDestructure(left);
                    } else {
                        this.addTypeAssignment(this.checker.getTypeAtLocation(left), this.checker.getTypeAtLocation(right));
                    }
                }
                break;
            }

            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                node.forEachChild((child) => this.analyze(child, currentFile, node as ts.ClassLikeDeclaration));
                return;

            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.TypePredicate:
                this.addCastToTypeNode((node as ts.AsExpression | ts.TypeAssertion | ts.TypePredicateNode).type);
        }

        if (isExpression(node)) {
            const parent = node.parent!;
            // We already handle `addTypeAssignment` at VariableDeclaration and BinaryExpression above, so no need to do it here again.
            if (!ts.isVariableDeclaration(parent) && !ts.isBinaryExpression(parent)) {
                const ctx = this.checker.getContextualType(node);
                if (ctx !== undefined) {
                    // The type of this expression is being assigned to the contextual type.
                    this.addTypeAssignment(ctx, this.checker.getTypeAtLocation(node));
                }
            }
        }

        node.forEachChild((child) => this.analyze(child, currentFile, currentClass));
    }

    private addAliasesFromDestructure(bind: ts.BindingName, type: ts.Type, property?: ts.Symbol) {
        switch (bind.kind) {
            case ts.SyntaxKind.Identifier: {
                if (property !== undefined) {
                    for (const root of this.checker.getRootSymbols(property)) {
                        this.addAlias(root, bind);
                    }
                }
                break;
            }

            case ts.SyntaxKind.ArrayBindingPattern:
                if (isTypeReference(type) && type.typeArguments !== undefined && type.typeArguments.length === 1) {
                    const elementType = type.typeArguments[0];
                    for (const element of bind.elements) {
                        if (element.kind !== ts.SyntaxKind.OmittedExpression) {
                            this.addAliasesFromDestructure(element.name, elementType);
                        }
                    }
                }
                break;

            case ts.SyntaxKind.ObjectBindingPattern:
                for (const { propertyName, name } of bind.elements) {
                    const propName = propertyName === undefined
                        ? ts.isIdentifier(name) ? name.text : undefined
                        : ts.isIdentifier(propertyName) ? propertyName.text : undefined;
                    const prop = propName === undefined ? undefined : this.checker.getPropertyOfType(type, propName);
                    const propType = prop === undefined ? undefined : getTypeOfProperty(prop, this.checker);
                    if (propType !== undefined) {
                        this.addAliasesFromDestructure(name, propType, prop);
                    }
                }
                break;

            default:
                assertNever(bind);
        }
    }

    private addAliasesFromMutatingDestructure(node: ts.Expression) {
        if (ts.isObjectLiteralExpression(node)) {
            for (const prop of node.properties) {
                switch (prop.kind) {
                    case ts.SyntaxKind.MethodDeclaration:
                    case ts.SyntaxKind.GetAccessor:
                    case ts.SyntaxKind.SetAccessor:
                        break; // These are errors anyway
                    case ts.SyntaxKind.SpreadAssignment:
                        // TODO
                        break;
                    case ts.SyntaxKind.PropertyAssignment: {
                        const { name, initializer } = prop;
                        if (ts.isIdentifier(name) && ts.isIdentifier(initializer)) {
                            const sym = this.checker.getPropertySymbolOfDestructuringAssignment(name);
                            if (sym !== undefined) {
                                this.addAlias(sym, initializer);
                            }
                        } else {
                            this.addAliasesFromMutatingDestructure(initializer);
                        }
                        break;
                    }
                    case ts.SyntaxKind.ShorthandPropertyAssignment: {
                        const localSymbol = this.checker.getShorthandAssignmentValueSymbol(prop);
                        const propertySymbol = this.checker.getPropertySymbolOfDestructuringAssignment(prop.name)!;
                        if (localSymbol !== undefined && propertySymbol !== undefined) {
                            this.addAliasSymbol(propertySymbol, localSymbol);
                        }
                        break;
                    }
                    default:
                        assertNever(prop);
                }
            }
        } else if (ts.isArrayLiteralExpression(node)) {
            for (const e of node.elements) {
                this.addAliasesFromMutatingDestructure(e);
            }
        }
    }

    private getSymbolUses(symbol: ts.Symbol): SymbolUses {
        return getOrCreate(this.symbolUses, symbol, () => new SymbolUses());
    }

    private trackUse(node: ts.Identifier, currentFile: ts.SourceFile, currentClass: ts.ClassLikeDeclaration | undefined): void {
        const sym = this.checker.getSymbolAtLocation(node);
        if (sym === undefined) {
            return;
        }

        const symbol = skipTransient(skipAlias(sym, this.checker));
        if (isSymbolFlagSet(symbol, ts.SymbolFlags.EnumMember)) {
            this.enumMembers.set(symbol, getEnumUse(node) | this.enumMembers.get(symbol)!);
            return;
        }

        const parent = node.parent!;
        const use = (used: ts.Symbol): void => this.trackUseOfSymbol(node, used, currentFile, currentClass);

        if (ts.isExportSpecifier(parent) && parent.propertyName === undefined) {
            // Also track a use of the original symbol
            use(sym);
        }

        const destructedPropertySymbol = ts.isBindingElement(parent)
            ? getPropertySymbolOfObjectBindingPatternWithoutPropertyName(symbol, this.checker)
            : undefined;
        if (destructedPropertySymbol !== undefined) {
            // TODO: TypeScript probably shouldn't be giving us transient symbols here
            if (!isSymbolFlagSet(destructedPropertySymbol, ts.SymbolFlags.Transient)) {
                this.addAlias(destructedPropertySymbol, node);
            }
            use(destructedPropertySymbol);
        } else {
            const grandParent = parent.parent!;
            if (ts.isObjectLiteralElementLike(parent)
                && parent.name === node
                && (ts.isObjectLiteralExpression(grandParent) || ts.isJsxAttributes(grandParent))) {
                if (ts.isObjectLiteralExpression(grandParent) && isOnLeftHandSideOfMutableDestructuring(grandParent)) {
                    const propertySymbol = this.checker.getPropertySymbolOfDestructuringAssignment(node);
                    if (propertySymbol !== undefined) {
                        use(propertySymbol);
                    }
                } else {
                    for (const assignedPropertySymbol of getPropertySymbolsFromContextualType(node, parent, this.checker)) {
                        use(assignedPropertySymbol);
                    }
                }
                // If this is shorthand, also count a use of the local symbol.
                if (ts.isShorthandPropertyAssignment(parent)) {
                    use(this.checker.getShorthandAssignmentValueSymbol(parent)!);
                }
                return;
            }
        }

        use(symbol);
    }

    private trackUseOfSymbol(
        node: ts.Identifier,
        sym: ts.Symbol,
        currentFile: ts.SourceFile,
        currentClass: ts.ClassLikeDeclaration | undefined,
    ) {
        for (const symbol of this.checker.getRootSymbols(sym)) {
            if (symbol.declarations === undefined) {
                return;
            }

            const access = getUse(node, symbol, this.checker, (aliasId) => this.addAlias(symbol, aliasId));
            const info = this.getSymbolUses(symbol);
            if (isPublicAccess(node, symbol, currentFile, currentClass)) {
                info.public |= access;
            } else {
                info.private |= access;
            }
        }
    }

    private addAlias(propertySymbol: ts.Symbol, aliasId: ts.Identifier): void {
        this.addAliasSymbol(propertySymbol, this.checker.getSymbolAtLocation(aliasId)!);
    }

    private addAliasSymbol(propertySymbol: ts.Symbol, aliasSymbol: ts.Symbol): void {
        multiMapAdd(this.localVariableAliases, propertySymbol, aliasSymbol);
    }

    private addTypeAssignment(to: ts.Type, from: ts.Type): void {
        if (to === from) {
            return;
        }

        // If 'to' is a union, assign from 'from' to each member of the union.
        if (isUnionOrIntersectionType(to)) {
            for (const type of to.types) {
                this.addTypeAssignment(type, from);
            }
            return;
        }
        if (isUnionOrIntersectionType(from)) {
            for (const type of from.types) {
                this.addTypeAssignment(to, type);
            }
            return;
        }

        // Assigning A[] to B[] means assigning A to B.
        if (isTypeReference(to)
            && isTypeReference(from)
            && to.typeArguments !== undefined
            && from.typeArguments !== undefined
            && to.typeArguments.length === from.typeArguments.length) {
            zip(to.typeArguments, from.typeArguments, (argA, argB) => {
                this.addTypeAssignment(argA, argB);
            });
        }

        multiMapAdd(this.typeAssignments, from, to);
    }

    private addCastToTypeNode(node: ts.TypeNode): void {
        this.addCastToType(this.checker.getTypeAtLocation(node));
    }

    private addCastToType(type: ts.Type): void {
        if (this.seenTypeCasts.has(type)) {
            return;
        }
        this.seenTypeCasts.add(type);

        if (isUnionOrIntersectionType(type)) {
            for (const t of type.types) {
                this.addCastToType(t);
            }
        } else if (isTypeReference(type) && type.typeArguments !== undefined) {
            this.addCastToType(type.target);
            for (const typeArg of type.typeArguments) {
                this.addCastToType(typeArg);
            }
        } else {
            for (let prop of this.checker.getPropertiesOfType(type)) {
                prop = skipTransient(prop);
                // Casting to a type counts as a creation of each property.
                this.getSymbolUses(prop).public |= Use.CreateAlias;

                // TODO: `this.checker.getDeclaredTypeOfSymbol(prop)` ought to work...
                // but it returns 'any' for `readonly a: { readonly b: number }`.
                if (prop.declarations !== undefined) {
                    for (const d of prop.declarations) {
                        if ((ts.isPropertyDeclaration(d) || ts.isPropertySignature(d)) && d.type !== undefined) {
                            this.addCastToTypeNode(d.type);
                        }
                    }
                }
            }
        }
    }

    /** When we assign `x = y`, if `x` is a mutable collection then `y` must be too. */
    private addUsesFromAliases(): void {
        let hadChanges = true;
        while (hadChanges) {
            hadChanges = false;
            this.localVariableAliases.forEach((aliases, symbol) => {
                const originalInfo = this.symbolUses.get(symbol)!;
                if (originalInfo.everUsedAsMutableCollection) {
                    return; // Nothing to propagate
                }
                aliases.forEach((alias) => {
                    const aliasInfo = this.symbolUses.get(alias)!;
                    // TODO: We might choose to warn on a collection which is mutated privately but publicly is only read.
                    if (aliasInfo.everUsedAsMutableCollection) {
                        originalInfo.private |= Use.ReadWithMutableType;
                        originalInfo.public |= Use.ReadWithMutableType;
                        hadChanges = true;
                    }
                });
            });
        }
    }

    /** When we assign to a type T from a type U, the properties in U are read and the corresponding properties in T are written. */
    private addUsesFromAssignments(): void {
        this.typeAssignments.forEach((targets, source) => {
            targets.forEach((target) => {
                this.addUsesFromAssignment(source, target);
            });
        });
    }

    private addUsesFromAssignment(source: ts.Type, target: ts.Type): void {
        if (isTypeFlagSet(source, ts.TypeFlags.Any)) {
            // Assigning to a target from "any" counts as a creation of all of `target`'s properties.
            for (const targetProperty of this.checker.getPropertiesOfType(target)) {
                this.getSymbolUses(targetProperty).public |= Use.CreateAlias;
            }
            return;
        }

        for (let sourceProperty of this.checker.getPropertiesOfType(source)) {
            sourceProperty = skipTransient(sourceProperty);
            const targetProperty = this.checker.getPropertyOfType(target, sourceProperty.name);
            if (targetProperty === undefined) {
                // Source property not actually used.
                continue;
            }

            const targetPropertyType = getTypeOfProperty(targetProperty, this.checker);
            // This counts as a read of the source property, and a creation of the target property.
            this.getSymbolUses(sourceProperty).public |=
                // If we assign this to a mutable collection type, then it needs to be mutable too.
                (targetPropertyType === undefined || isReadonlyType(targetPropertyType) ? Use.ReadReadonly : Use.ReadWithMutableType)
                // If we assign this to a mutable property, then it needs to be mutable too.
                | (isReadonlyProperty(targetProperty) ? Use.None : Use.Write);
            this.getSymbolUses(targetProperty).public |= Use.CreateAlias;
        }
    }
}

function skipTransient(symbol: ts.Symbol): ts.Symbol {
    // TODO: Maybe TypeScript shouldn't be returning transient symbols from the public API?
    if (isSymbolFlagSet(symbol, ts.SymbolFlags.Transient)) {
        const target = (symbol as any).target as ts.Symbol;
        return target === undefined ? symbol : target;
    } else {
        return symbol;
    }
}

function getTypeOfProperty(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Type | undefined {
    return symbol.declarations === undefined ? undefined : find(symbol.declarations, (d) =>
        (ts.isPropertyDeclaration(d) || ts.isPropertySignature(d)) && d.type !== undefined
            ? checker.getTypeFromTypeNode(d.type)
            : undefined);
}

function isReadonlyProperty(propertySymbol: ts.Symbol): boolean {
    // TODO: Would be nice if TypeScript's `isReadonlySymbol` were public...
    return propertySymbol.declarations !== undefined
        && propertySymbol.declarations.some((d) => hasModifier(d.modifiers, ts.SyntaxKind.ReadonlyKeyword));
}

function getObjectBindingElementWithoutPropertyName(symbol: ts.Symbol): ts.BindingElement | undefined {
    const bindingElement = symbol.declarations === undefined ? undefined : symbol.declarations.find(ts.isBindingElement);
    return bindingElement !== undefined
        && bindingElement.parent!.kind === ts.SyntaxKind.ObjectBindingPattern
        && bindingElement.propertyName === undefined
        ? bindingElement
        : undefined;
}

function getPropertySymbolOfObjectBindingPatternWithoutPropertyName(
    symbol: ts.Symbol,
    checker: ts.TypeChecker,
): ts.Symbol | undefined {
    const bindingElement = getObjectBindingElementWithoutPropertyName(symbol);
    if (bindingElement === undefined) {
        return undefined;
    }

    const typeOfPattern = checker.getTypeAtLocation(bindingElement.parent!);
    const propSymbol = typeOfPattern === undefined
        ? undefined
        : checker.getPropertyOfType(typeOfPattern, (bindingElement.name as ts.Identifier).text);
    return propSymbol !== undefined && isSymbolFlagSet(propSymbol, ts.SymbolFlags.Accessor)
        // See https://github.com/Microsoft/TypeScript/issues/16922
        ? skipTransient(propSymbol)
        : propSymbol;
}

/** An object literal expression writes to the properties in its contextual type. */
function getPropertySymbolsFromContextualType(
    name: ts.Identifier,
    parent: ts.ObjectLiteralElement,
    checker: ts.TypeChecker,
): ReadonlyArray<ts.Symbol> {
    const contextualType = checker.getContextualType(parent.parent as ts.ObjectLiteralExpression);
    const propertyName = name.text;
    return contextualType === undefined ? []
        : isUnionType(contextualType) ? mapDefined(contextualType.types, (t) => t.getProperty(propertyName))
        : arrayify(contextualType.getProperty(propertyName));
}
