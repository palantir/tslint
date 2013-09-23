// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export class CandidateInferenceInfo {
        public typeParameter: PullTypeParameterSymbol = null;
        public isFixed = false;
        public inferenceCandidates: PullTypeSymbol[] = [];

        public addCandidate(candidate: PullTypeSymbol) {
            if (!this.isFixed) {
                this.inferenceCandidates[this.inferenceCandidates.length] = candidate;
            }
        }
    }

    export class ArgumentInferenceContext {
        public inferenceCache: any = {};
        public candidateCache: any = {};


        public alreadyRelatingTypes(objectType: PullTypeSymbol, parameterType: PullTypeSymbol) {
            var comboID = objectType.pullSymbolIDString + "#" + parameterType.pullSymbolIDString;

            if (this.inferenceCache[comboID]) {
                return true;
            }
            else {
                this.inferenceCache[comboID] = true;
                return false;
            }            
        }

        public resetRelationshipCache() {
            this.inferenceCache = {};
        }

        public addInferenceRoot(param: PullTypeParameterSymbol) {
            var info = <CandidateInferenceInfo>this.candidateCache[param.pullSymbolIDString];

            if (!info) {
                info = new CandidateInferenceInfo();
                info.typeParameter = param;
                this.candidateCache[param.pullSymbolIDString] = info;
            }        
        }

        public getInferenceInfo(param: PullTypeParameterSymbol) {
            return <CandidateInferenceInfo>this.candidateCache[param.pullSymbolIDString];
        }

        public addCandidateForInference(param: PullTypeParameterSymbol, candidate: PullTypeSymbol, fix: boolean) {
            var info = this.getInferenceInfo(param);

            if (info) {

                if (candidate) {
                    info.addCandidate(candidate);
                }

                if (!info.isFixed) {
                    info.isFixed = fix;
                }
            }
        }

        public getInferenceCandidates(): any[] {
            var inferenceCandidates: any[] = [];
            var info: CandidateInferenceInfo;
            var val: any;

            for (var infoKey in this.candidateCache) {
                info = <CandidateInferenceInfo>this.candidateCache[infoKey];

                for (var i = 0; i < info.inferenceCandidates.length; i++) {
                    val = {};
                    val[info.typeParameter.pullSymbolIDString] = info.inferenceCandidates[i];
                    inferenceCandidates[inferenceCandidates.length] = val;
                }
            }

            return inferenceCandidates;
        }

        public inferArgumentTypes(resolver: PullTypeResolver, context: PullTypeResolutionContext): { results: { param: PullTypeParameterSymbol; type: PullTypeSymbol; }[]; unfit: boolean; } {
            var info: CandidateInferenceInfo = null;

            var collection: IPullTypeCollection;

            var bestCommonType: PullTypeSymbol;

            var results: { param: PullTypeParameterSymbol; type: PullTypeSymbol; }[] = [];

            var unfit = false;

            for (var infoKey in this.candidateCache) {
                info = <CandidateInferenceInfo>this.candidateCache[infoKey];

                if (!info.inferenceCandidates.length) {
                    results[results.length] = { param: info.typeParameter, type: resolver.semanticInfoChain.anyTypeSymbol };
                    continue;
                }

                collection = {
                    getLength: () => { return info.inferenceCandidates.length; },
                    setTypeAtIndex: (index: number, type: PullTypeSymbol) => { },
                    getTypeAtIndex: (index: number) => {
                        return info.inferenceCandidates[index].type;
                    }
                };

                bestCommonType = resolver.widenType(resolver.findBestCommonType(info.inferenceCandidates[0], null, collection, context, new TypeComparisonInfo()));

                if (!bestCommonType) {
                    unfit = true;
                }
                else {
                    // is there already a substitution for this type?
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].type == info.typeParameter) {
                            results[i].type = bestCommonType;
                        }
                    }
                }

                results[results.length] = { param: info.typeParameter, type: bestCommonType };
            }

            return { results: results, unfit: unfit };
        }
    }

    export class PullContextualTypeContext {
        public provisionallyTypedSymbols: PullSymbol[] = [];
        public provisionalDiagnostic: Diagnostic[] = [];

        constructor(public contextualType: PullTypeSymbol,
                     public provisional: boolean,
                     public substitutions: any) { }

        public recordProvisionallyTypedSymbol(symbol: PullSymbol) {
            this.provisionallyTypedSymbols[this.provisionallyTypedSymbols.length] = symbol;
        }

        public invalidateProvisionallyTypedSymbols() {
            for (var i = 0; i < this.provisionallyTypedSymbols.length; i++) {
                this.provisionallyTypedSymbols[i].invalidate();
            }
        }

        public postDiagnostic(error: Diagnostic) {
            this.provisionalDiagnostic[this.provisionalDiagnostic.length] = error;
        }

        public hadProvisionalErrors() {
            return this.provisionalDiagnostic.length > 0;
        }
    }

    export class PullTypeResolutionContext {
        private contextStack: PullContextualTypeContext[] = [];
        private typeSpecializationStack: any[] = [];
        private genericASTResolutionStack: AST[] = [];

        public resolvingTypeReference = false;
        public resolvingNamespaceMemberAccess = false;

        public resolveAggressively = false;

        public canUseTypeSymbol = false;

        public specializingToAny = false;
        public specializingToObject = false;
        public isResolvingClassExtendedType = false; 
        public isSpecializingSignatureAtCallSite = false;
        public isSpecializingConstructorMethod = false;
        public isComparingSpecializedSignatures = false;
        public isResolvingSuperConstructorTarget = false;
        public inConstructorArguments = false;
        public inImportDeclaration = false;
        public isInStaticInitializer = false;
        public isInInvocationExpression = false;
        public resolvingTypeNameAsNameExpression = false;

        constructor(public inTypeCheck = false) { }

        public pushContextualType(type: PullTypeSymbol, provisional: boolean, substitutions: any) {
            this.contextStack.push(new PullContextualTypeContext(type, provisional, substitutions));
        }

        public popContextualType(): PullContextualTypeContext {
            var tc = this.contextStack.pop();

            tc.invalidateProvisionallyTypedSymbols();

            return tc;
        }

        public findSubstitution(type: PullTypeSymbol) {
            var substitution: PullTypeSymbol = null;

            if (this.contextStack.length) {
                for (var i = this.contextStack.length - 1; i >= 0; i--) {
                    if (this.contextStack[i].substitutions) {
                        substitution = this.contextStack[i].substitutions[type.pullSymbolIDString];

                        if (substitution) {
                            break;
                        }
                    }
                }
            }

            return substitution;
        }

        public getContextualType(): PullTypeSymbol {
            var context = !this.contextStack.length ? null : this.contextStack[this.contextStack.length - 1];
            
            if (context) {
                var type = context.contextualType;

                if (!type) {
                    return null;
                }

                // if it's a type parameter, return the upper bound
                if (type.isTypeParameter() && (<PullTypeParameterSymbol>type).getConstraint()) {
                    type = (<PullTypeParameterSymbol>type).getConstraint();
                }

                var substitution = this.findSubstitution(type);

                return substitution ? substitution : type;
            }

            return null;
        }

        public inProvisionalResolution() {
            return (!this.contextStack.length ? false : this.contextStack[this.contextStack.length - 1].provisional);
        }

        public inSpecialization = false;
        public suppressErrors = false;
        private inBaseTypeResolution = false;

        public isInBaseTypeResolution() { return this.inBaseTypeResolution; }

        public startBaseTypeResolution() {
            var wasInBaseTypeResoltion = this.inBaseTypeResolution;
            this.inBaseTypeResolution = true;
            return wasInBaseTypeResoltion;
        }

        public doneBaseTypeResolution(wasInBaseTypeResolution: boolean) {
            this.inBaseTypeResolution = wasInBaseTypeResolution;
        }

        public setTypeInContext(symbol: PullSymbol, type: PullTypeSymbol) {
            var substitution: PullTypeSymbol = this.findSubstitution(type);

            symbol.type = substitution ? substitution : type;

            if (this.contextStack.length && this.inProvisionalResolution()) {
                this.contextStack[this.contextStack.length - 1].recordProvisionallyTypedSymbol(symbol);
            }
        }

        public pushTypeSpecializationCache(cache: any) {
            this.typeSpecializationStack[this.typeSpecializationStack.length] = cache;
        }

        public popTypeSpecializationCache() {
            if (this.typeSpecializationStack.length) {
                this.typeSpecializationStack.length--;
            }
        }

        public findSpecializationForType(type: PullTypeSymbol) {
            var specialization: PullTypeSymbol = null;

            for (var i = this.typeSpecializationStack.length - 1; i >= 0; i--) {
                specialization = (this.typeSpecializationStack[i])[type.pullSymbolIDString];

                if (specialization) {
                    return specialization;
                }
            }

            return type;
        }

        public postError(fileName: string, offset: number, length: number, diagnosticKey: string, arguments: any[], enclosingDecl: PullDecl, post=true): Diagnostic {
            var diagnostic = new Diagnostic(fileName, offset, length, diagnosticKey, arguments);

            if (post) {
                this.postDiagnostic(diagnostic, enclosingDecl);
            }

            return diagnostic;
        }

        public postDiagnostic(diagnostic: Diagnostic, enclosingDecl: PullDecl): void {
            if (this.inProvisionalResolution()) {
                (this.contextStack[this.contextStack.length - 1]).postDiagnostic(diagnostic);
            }
            else if (this.inTypeCheck && !this.suppressErrors && enclosingDecl) {
                enclosingDecl.addDiagnostic(diagnostic);
            }
        }

        public typeCheck() {
            return this.inTypeCheck && !this.inSpecialization;
        }

        public startResolvingTypeArguments(ast: AST) {
            this.genericASTResolutionStack[this.genericASTResolutionStack.length] = ast;
        }

        public isResolvingTypeArguments(ast: AST): boolean {
            for (var i = 0; i < this.genericASTResolutionStack.length; i++) {
                if (this.genericASTResolutionStack[i].astID === ast.astID) {
                    return true;
                }
            }

            return false;
        }

        public doneResolvingTypeArguments() {
            this.genericASTResolutionStack.length--;
        }
    }
}