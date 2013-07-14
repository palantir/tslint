
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {

    export class FindReferenceHelpers {
        public static getCorrectASTForReferencedSymbolName(matchingAST: TypeScript.AST, symbolName: string): TypeScript.AST {

            if (matchingAST.nodeType == TypeScript.NodeType.MemberAccessExpression) {
                var binaryExpression: TypeScript.BinaryExpression = <TypeScript.BinaryExpression>matchingAST;
                var identifierOperand1: TypeScript.Identifier = <TypeScript.Identifier>binaryExpression.operand1;
                var identifierOperand2: TypeScript.Identifier = <TypeScript.Identifier>binaryExpression.operand2;
                if (identifierOperand1.actualText === symbolName) {
                    return binaryExpression.operand1;
                }
                else if (identifierOperand2.actualText === symbolName) {
                    return binaryExpression.operand2;
                }
            }
            return matchingAST;
        }

        public static compareSymbolsForLexicalIdentity(firstSymbol: TypeScript.PullSymbol, secondSymbol: TypeScript.PullSymbol): boolean {
            if (firstSymbol.getKind() === secondSymbol.getKind())
            {
                return firstSymbol === secondSymbol;
            }
            else {
                switch (firstSymbol.getKind()) {
                    case TypeScript.PullElementKind.Class: {
                        return this.checkSymbolsForDeclarationEquality(firstSymbol, secondSymbol);
                    }
                    case TypeScript.PullElementKind.Property: {
                        if (firstSymbol.isAccessor()) {
                            var getterSymbol = (<TypeScript.PullAccessorSymbol>firstSymbol).getGetter();
                            var setterSymbol = (<TypeScript.PullAccessorSymbol>firstSymbol).getSetter();

                            if (getterSymbol && getterSymbol === secondSymbol) {
                                return true;
                            }

                            if (setterSymbol && setterSymbol === secondSymbol) {
                                return true;
                            }
                        }
                        return false;   
                    }
                    case TypeScript.PullElementKind.Function: {
                        if (secondSymbol.isAccessor()) {
                            var getterSymbol = (<TypeScript.PullAccessorSymbol>secondSymbol).getGetter();
                            var setterSymbol = (<TypeScript.PullAccessorSymbol>secondSymbol).getSetter();

                            if (getterSymbol && getterSymbol === firstSymbol) {
                                return true;
                            }

                            if (setterSymbol && setterSymbol === firstSymbol) {
                                return true;
                            }
                        }
                        return false;
                    }
                    case TypeScript.PullElementKind.ConstructorMethod: {
                        return this.checkSymbolsForDeclarationEquality(firstSymbol, secondSymbol);
                    }
                }
            }

            return firstSymbol === secondSymbol;
        }

        private static checkSymbolsForDeclarationEquality(firstSymbol: TypeScript.PullSymbol, secondSymbol: TypeScript.PullSymbol): boolean {
            var firstSymbolDeclarations: TypeScript.PullDecl[] = firstSymbol.getDeclarations();
            var secondSymbolDeclarations: TypeScript.PullDecl[] = secondSymbol.getDeclarations();
            for (var i = 0, iLen = firstSymbolDeclarations.length; i < iLen; i++) {
                for (var j = 0, jLen = secondSymbolDeclarations.length; j < jLen; j++) {
                    if (this.declarationsAreSameOrParents(firstSymbolDeclarations[i], secondSymbolDeclarations[j])) {
                        return true;
                    }
                }
            }
            return false;
        }

        private static declarationsAreSameOrParents(firstDecl: TypeScript.PullDecl, secondDecl: TypeScript.PullDecl): boolean {
            var firstParent: TypeScript.PullDecl = firstDecl.getParentDecl();
            var secondParent: TypeScript.PullDecl = secondDecl.getParentDecl();
            if (firstDecl === secondDecl ||
                firstDecl === secondParent ||
                firstParent === secondDecl ||
                firstParent === secondParent) {
                return true;
            }
            return false;
        }
    }
}