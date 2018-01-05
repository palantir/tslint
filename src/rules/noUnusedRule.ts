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

import {
    getVariableDeclarationKind,
    hasModifier,
    isSymbolFlagSet,
    isTypeFlagSet,
    isTypeReference,
    isUnionOrIntersectionType,
    VariableDeclarationKind,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "..";
import { find } from "../utils";

import { AnalysisResult, getInfo } from "./no-unused";
import { getDeprecationFromDeclaration } from "./no-unused/deprecationUtils";
import { EnumUse, hasEnumUse } from "./no-unused/enumUse";
import { isImplicitlyExported } from "./no-unused/importUtils";
import { getPrivacyScope, variableStatementFromDeclaration } from "./no-unused/privacy";
import { isNameOfMutableCollectionType, SymbolUses } from "./no-unused/use";
import { assertNever, isFunctionLikeSymbol, isUsageTrackedDeclaration, UsageTrackedDeclaration } from "./no-unused/utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused",
        description: Lint.Utils.dedent`
            For every symbol, looks for all uses of that symbol to determine whether it has more capabilities than necessary.

            * Public class members which could be private.
            * Exported symbols that don't need to be exported.
            * Mutable properties that could be \`readonly\`.
            * Mutable variables that could be \`const\`.
            * Collections that are only read from, but are not typed as a \`ReadonlyArray\`, \`ReadonlySet\`, or \`ReadonlyMap\`.
            * Collections that are initialized to a fresh collection (\`[]\`, \`new Set(...)\`, \`new Map(...)\`)
              and have elements inserted, but never read from.
            * Functions that return a value but are only used for a side effect.
            * Optional properties that are read from, but are never assigned to.
            * Enum members that are tested for, but never used as a value.

            Note that looking for all uses of a symbol works best when as many files as possible are included in the tsconfig.
            When linting a library, it is recommended to lint with a \`tsconfig.json\` that includes tests,
            which should use of public exports of the library that are not used internally.

            This rule will be disabled on anything inside a node marked with a \`@deprecated\` jsdoc comment,
            since it is assumed that those will naturally have no uses.
            `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(
            sourceFile,
            this.ruleName,
            parseOptions(this.getOptions()),
            getInfo(program),
            program.getTypeChecker()));
    }
}

interface JsonOptions {
    readonly ignoreNames?: ReadonlyArray<string>;
}

function parseOptions(gotOptions: Lint.IOptions): Options {
    const raw = gotOptions.ruleArguments[0] as JsonOptions | undefined;
    const { ignoreNames }: JsonOptions = raw === undefined ? {} : raw;
    return { ignoreNames: new Set(ignoreNames === undefined ? [] : ignoreNames) };
}

interface Options {
    readonly ignoreNames: ReadonlySet<string>;
}

class Walker extends Lint.AbstractWalker<Options> {
    constructor(
        sourceFile: ts.SourceFile,
        ruleName: string,
        options: Options,
        private readonly analysis: AnalysisResult,
        private readonly checker: ts.TypeChecker,
    ) {
        super(sourceFile, ruleName, options);
    }

    public walk(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.Parameter:
                this.checkParameter(node as ts.ParameterDeclaration);
                break;
            case ts.SyntaxKind.EnumMember:
                this.checkEnumMember(node as ts.EnumMember);
                break;
            default:
                if (isUsageTrackedDeclaration(node)) {
                    this.checkSymbol(node, this.checker.getSymbolAtLocation(node.name)!);
                }
        }
        node.forEachChild((child) => this.walk(child));
    }

    private checkParameter(node: ts.ParameterDeclaration): void {
        if (!ts.isIdentifier(node.name) || isParameterOfBodilessFunction(node)) {
            return;
        }
        const nodeAsNamed = node as ts.ParameterDeclaration & { readonly name: ts.Identifier };
        if (ts.isParameterPropertyDeclaration(node)) {
            // Don't care if the parameter side is unused, since it's used to create the property.
            // So, only check the property side.
            const prop = this.checker.getSymbolsOfParameterPropertyDeclaration(node, node.name.text).find((sym) =>
                isSymbolFlagSet(sym, ts.SymbolFlags.Property))!;
            this.checkSymbol(nodeAsNamed, prop);
        } else if (node.name.originalKeywordKind !== ts.SyntaxKind.ThisKeyword) { // TODO: detect unused 'this' parameter
            this.checkSymbol(nodeAsNamed, this.checker.getSymbolAtLocation(node.name)!);
        }
    }

    private checkEnumMember(node: ts.EnumMember): void {
        const flags = this.analysis.getEnumAccessFlags(this.checker.getSymbolAtLocation(node.name)!);
        if (!hasEnumUse(flags, EnumUse.UsedInExpression)) {
            this.addFailureAtNode(
                node.name,
                hasEnumUse(flags, EnumUse.Tested)
                    ? "Enum member is compared against, but analysis found no cases of something being given this value."
                    : "Analysis found no uses of this symbol.");
        }
    }

    private checkSymbol(node: UsageTrackedDeclaration, symbol: ts.Symbol): void {
        if (isOkToNotUse(node, this.checker, this.options.ignoreNames)) {
            return;
        }

        const uses = this.analysis.getSymbolUses(symbol);
        this.checkSymbolUses(node, symbol, uses);
        if (!uses.everUsedAsMutableCollection) {
            this.warnOnNonMutatedCollection(node);
        }
    }

    private checkSymbolUses(node: UsageTrackedDeclaration, symbol: ts.Symbol, uses: SymbolUses): void {
        const fail = (failure: string): void => { this.addFailureAtNode(node.name, failure); };
        if (!uses.everUsedPublicly) {
            const privacyScope = getPrivacyScope(node);
            if (privacyScope === undefined) {
                fail("Analysis found no uses of this symbol.");
                return;
            } else if (ts.isSourceFile(privacyScope)) {
                if (!isImplicitlyExported(node, this.sourceFile, this.checker)) {
                    fail("Analysis found no uses in other modules; this should not be exported.");
                    return;
                }
            } else {
                if (!hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.AbstractKeyword)) {
                    fail("Analysis found no public uses; this should be private.");
                    return;
                }
            }
        }
        if (!uses.everRead) {
            if (uses.everUsedForSideEffect && isFunctionLikeSymbol(symbol)) {
                const sig = this.checker.getSignatureFromDeclaration(symbol.valueDeclaration as ts.SignatureDeclaration)!;
                if (!isTypeFlagSet(this.checker.getReturnTypeOfSignature(sig), ts.TypeFlags.Void)) {
                    fail("This function is used for its side effect, but the return value is never used.");
                }
            } else if (uses.mutatesCollection) {
                if (!uses.everAssignedANonFreshValue) {
                    fail("This collection is created and filled with values, but never read from.");
                }
            } else {
                fail("This symbol is given a value, but analysis found no reads. This is likely dead code.");
            }
        } else if (!uses.everWritten && isMutableAndCouldBeImmutable(node)) {
            fail(ts.isVariableDeclaration(node)
                ? "Analysis found no mutable uses of this variable; use `const`."
                : "Analysis found no writes to this property; mark it as `readonly`.");
        } else if (!uses.everCreatedOrWritten) {
            fail("Analysis found places where this is read, but found no places where it is given a value.");
        }
    }

    private warnOnNonMutatedCollection(node: UsageTrackedDeclaration): void {
        if (ts.isParameter(node) && node.dotDotDotToken !== undefined) {
            // Can't recommend to use `...args: ReadonlyArray<number>`.
            // See https://github.com/Microsoft/TypeScript/issues/15972
            return;
        }

        const typeNode = getTypeAnnotationNode(node);
        const info = typeNode === undefined
            ? shouldTypeReadonlyCollectionWithInferredType(node)
                ? getMutableCollectionTypeName(this.checker.getTypeAtLocation(node.name))
                : undefined
            : getMutableCollectionTypeFromNode(typeNode);
        if (info !== undefined) {
            this.addFailureAtNode(
                typeof info === "string" ? node.name : info.typeNode,
                `Analysis indicates this could be a Readonly${typeof info === "string" ? info : info.typeName}.`);
        }
    }
}

// For class property or export, warn if the implicit type is ReadonlyArray.
// But for a local variable, don't demand a type annotation everywhere an array isn't mutated, because that's annoying.
function shouldTypeReadonlyCollectionWithInferredType(node: UsageTrackedDeclaration): boolean {
    const varStatement = variableStatementFromDeclaration(node);
    return varStatement !== undefined && ts.isSourceFile(varStatement.parent!) || ts.isPropertyDeclaration(node);
}

function getMutableCollectionTypeName(type: ts.Type): string | undefined {
    return isUnionOrIntersectionType(type)
        ? find(type.types, getMutableCollectionTypeName)
        : isTypeReference(type)
            && type.symbol !== undefined
            && isNameOfMutableCollectionType(type.symbol.name)
        ? type.symbol.name
        : undefined;
}

function getMutableCollectionTypeFromNode(
    typeNode: ts.TypeNode,
): { readonly typeNode: ts.TypeNode; readonly typeName: string } | undefined {
    return ts.isUnionTypeNode(typeNode)
        ? find(typeNode.types, getMutableCollectionTypeFromNode)
        : ts.isArrayTypeNode(typeNode)
        ? { typeNode, typeName: "Array" }
        : ts.isTypeReferenceNode(typeNode)
            && ts.isIdentifier(typeNode.typeName)
            && isNameOfMutableCollectionType(typeNode.typeName.text)
        ? { typeNode, typeName: typeNode.typeName.text }
        : undefined;
}

function getTypeAnnotationNode(node: UsageTrackedDeclaration): ts.TypeNode | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.Parameter:
        case ts.SyntaxKind.VariableDeclaration:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            type T =
            | ts.ParameterDeclaration | ts.VariableDeclaration | ts.PropertyDeclaration
                | ts.MethodDeclaration | ts.MethodSignature | ts.FunctionDeclaration
                | ts.PropertyDeclaration | ts.PropertySignature | ts.GetAccessorDeclaration | ts.SetAccessorDeclaration;
            return (node as T).type;
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.TypeParameter:
        case ts.SyntaxKind.BindingElement:
        case ts.SyntaxKind.ExportSpecifier:
            return undefined;
        default:
            throw new Error(`TODO: Handle ${ts.SyntaxKind[node.kind]}`);
    }
}

// Note: returns false for parameters since those can't be made const.
function isMutableAndCouldBeImmutable(node: UsageTrackedDeclaration): boolean {
    return ts.isPropertyDeclaration(node) || ts.isPropertySignature(node) || ts.isParameterPropertyDeclaration(node)
        ? !hasModifier(node.modifiers, ts.SyntaxKind.ReadonlyKeyword)
        : ts.isVariableDeclaration(node)
            && node.parent!.kind !== ts.SyntaxKind.CatchClause
            && getVariableDeclarationKind(node.parent as ts.VariableDeclarationList) !== VariableDeclarationKind.Const;
}

function isOkToNotUse(
    node: UsageTrackedDeclaration,
    checker: ts.TypeChecker,
    ignoreNames: ReadonlySet<string>,
): boolean {
    return isIgnored(node)
        || isDeprecated(node)
        || isOverride(node, checker)
        || ignoreNames.has(node.name.text);
}

function isIgnored(node: UsageTrackedDeclaration): boolean {
    return node.name.text.startsWith("_");
}

function isDeprecated(node: ts.Node): boolean {
    return !ts.isSourceFile(node) && (getDeprecationFromDeclaration(node) !== undefined || isDeprecated(node.parent!));
}

function isParameterOfBodilessFunction(node: ts.ParameterDeclaration): boolean {
    const parent = node.parent!;
    switch (parent.kind) {
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.IndexSignature:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.ConstructorType:
        case ts.SyntaxKind.JSDocFunctionType:
            return true;
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionExpression:
            return false;
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return parent.body === undefined;
        default:
            throw assertNever(parent);
    }
}

// Don't warn about an unused override, because it may be used through the base type.
function isOverride(node: UsageTrackedDeclaration, checker: ts.TypeChecker): boolean {
    const parent = node.parent!;
    return ts.isClassLike(parent)
        && parent.heritageClauses !== undefined
        && parent.heritageClauses.some((clause) =>
            clause.types.some((typeNode) =>
                checker.getPropertyOfType(checker.getTypeFromTypeNode(typeNode), node.name.text) !== undefined));
}
