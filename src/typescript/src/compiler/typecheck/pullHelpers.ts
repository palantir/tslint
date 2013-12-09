// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\references.ts' />

module TypeScript {

    export module PullHelpers {
        export interface SignatureInfoForFuncDecl {
            signature: PullSignatureSymbol;
            allSignatures: PullSignatureSymbol[];
        }

        export function getSignatureForFuncDecl(functionDecl: PullDecl) {
            var funcDecl = functionDecl.ast();
            var funcSymbol = functionDecl.getSymbol();

            if (!funcSymbol) {
                funcSymbol = functionDecl.getSignatureSymbol();
            }

            var functionSignature: PullSignatureSymbol = null;
            var typeSymbolWithAllSignatures: PullTypeSymbol = null;
            if (funcSymbol.isSignature()) {
                functionSignature = <PullSignatureSymbol>funcSymbol;
                var parent = functionDecl.getParentDecl();
                typeSymbolWithAllSignatures = parent.getSymbol().type;                
            }
            else {
                functionSignature = functionDecl.getSignatureSymbol();
                typeSymbolWithAllSignatures = funcSymbol.type;
            }
            var signatures: PullSignatureSymbol[];

            if (funcDecl.kind() === SyntaxKind.ConstructorDeclaration || functionDecl.kind === PullElementKind.ConstructSignature) {
                signatures = typeSymbolWithAllSignatures.getConstructSignatures();
            }
            else if (functionDecl.kind === PullElementKind.IndexSignature) {
                signatures = typeSymbolWithAllSignatures.getIndexSignatures();
            }
            else {
                signatures = typeSymbolWithAllSignatures.getCallSignatures();
            }

            return {
                signature: functionSignature,
                allSignatures: signatures
            };
        }

        export function getAccessorSymbol(getterOrSetter: AST, semanticInfoChain: SemanticInfoChain): PullAccessorSymbol {
            var functionDecl = semanticInfoChain.getDeclForAST(getterOrSetter);
            var getterOrSetterSymbol = functionDecl.getSymbol();
            
            return <PullAccessorSymbol>getterOrSetterSymbol;
        }

        export function getGetterAndSetterFunction(funcDecl: AST, semanticInfoChain: SemanticInfoChain): { getter: GetAccessor; setter: SetAccessor; } {
            var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, semanticInfoChain);
            var result: { getter: GetAccessor; setter: SetAccessor; } = {
                getter: null,
                setter: null
            };
            var getter = accessorSymbol.getGetter();
            if (getter) {
                var getterDecl = getter.getDeclarations()[0];
                result.getter = <GetAccessor>semanticInfoChain.getASTForDecl(getterDecl);
            }
            var setter = accessorSymbol.getSetter();
            if (setter) {
                var setterDecl = setter.getDeclarations()[0];
                result.setter = <SetAccessor>semanticInfoChain.getASTForDecl(setterDecl);
            }

            return result;
        }

        export function symbolIsEnum(source: PullSymbol): boolean {
            return source && (source.kind & (PullElementKind.Enum | PullElementKind.EnumMember)) !== 0;
        }

        export function symbolIsModule(symbol: PullSymbol) {
            return symbol && (symbol.kind == PullElementKind.Container || isOneDeclarationOfKind(symbol, PullElementKind.Container));
        }

        function isOneDeclarationOfKind(symbol: PullSymbol, kind: TypeScript.PullElementKind): boolean {
            var decls = symbol.getDeclarations();
            for (var i = 0; i < decls.length; i++) {
                if (decls[i].kind === kind) {
                    return true;
                }
            }

            return false;
        }

        export function isNameNumeric(name: string) {
            // Coerce the name to a number, and then use isFinite to make sure it is not Infinity or NaN
            return isFinite(+name);
        }


        export function typeSymbolsAreIdentical(a: PullTypeSymbol, b: PullTypeSymbol): boolean {
            // initialized types are omitted, since the type reference points back to the generic type
            // declaration.  (E.g., the referencedTypeSymbol of 'Foo<number>' would be 'Foo<T>'
            if (a.isTypeReference() && !a.getIsSpecialized()) {
                a = (<PullTypeReferenceSymbol>a).referencedTypeSymbol;
            }

            if (b.isTypeReference() && !b.getIsSpecialized()) {
                b = (<PullTypeReferenceSymbol>b).referencedTypeSymbol;
            }

            return a == b;
        }

        export function getRootType(type: PullTypeSymbol): PullTypeSymbol {
            var rootType: PullTypeSymbol = <PullTypeSymbol>type.getRootSymbol();

            while (true) {
                if (type == rootType) {
                    return type;
                }

                type = rootType;
                rootType = <PullTypeSymbol>type.getRootSymbol();
            }
        }

        export function isSymbolLocal(symbol: PullSymbol) {
            var container = symbol.getContainer();
            if (container) {
                var containerKind = container.kind;
                if (containerKind & (TypeScript.PullElementKind.SomeFunction | TypeScript.PullElementKind.FunctionType)) {
                    return true;
                }

                if (containerKind == TypeScript.PullElementKind.ConstructorType && !symbol.anyDeclHasFlag(TypeScript.PullElementFlags.Static)) {
                    return true;
                }
            }

            return false;
        }
    }
}