// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
///<reference path="..\typescript.ts" />

module TypeScript {
    export enum GenerativeTypeClassification {
        Unknown,
        Open,
        Closed,
        InfinitelyExpanding
    }


    // Type references and instantiated type references
    export class PullTypeReferenceSymbol extends PullTypeSymbol {
        public static createTypeReference(type: PullTypeSymbol): PullTypeReferenceSymbol {

            if (type.isTypeReference()) {
                return <PullTypeReferenceSymbol>type;
            }

            var typeReference = type.typeReference;

            if (!typeReference) {
                typeReference = new PullTypeReferenceSymbol(type);
                type.typeReference = typeReference;
            }

            return typeReference;
        }

        // use the root symbol to model the actual type
        // do not call this directly!
        constructor(public referencedTypeSymbol: PullTypeSymbol) {
            super(referencedTypeSymbol.name, referencedTypeSymbol.kind);

            Debug.assert(referencedTypeSymbol != null, "Type root symbol may not be null");

            this.setRootSymbol(referencedTypeSymbol);

            this.typeReference = this;
        }

        public isTypeReference() {
            return true;
        }

        public isResolved = true;

        public setResolved() { }

        // do nothing on invalidate
        public setUnresolved(): void { }
        public invalidate(): void { }

        public ensureReferencedTypeIsResolved(): void {
            this._getResolver().resolveDeclaredSymbol(this.referencedTypeSymbol);
        }

        public getReferencedTypeSymbol(): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol;
        }

        public _getResolver(): PullTypeResolver {
            return this.referencedTypeSymbol._getResolver();
        }

        // type symbol shims
        public hasMembers(): boolean {
            // no need to resolve first - members are collected during binding

            return this.referencedTypeSymbol.hasMembers();
        }

        public setAssociatedContainerType(type: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": setAssociatedContainerType");
        }

        public getAssociatedContainerType(): PullTypeSymbol {
            return this.referencedTypeSymbol.getAssociatedContainerType();
        }

        public getFunctionSymbol(): PullSymbol {
            // necessary because the function symbol may be set during type resolution to
            // facilitate doc comments
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.getFunctionSymbol();
        }
        public setFunctionSymbol(symbol: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": setFunctionSymbol");
        }

        public addContainedNonMember(nonMember: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addContainedNonMember");
        }
        public findContainedNonMemberContainer(containerName: string, kind = PullElementKind.None): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.findContainedNonMemberContainer(containerName, kind);
        }

        public addMember(memberSymbol: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addMember");
        }
        public addEnclosedMemberType(enclosedType: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addEnclosedMemberType");
        }
        public addEnclosedMemberContainer(enclosedContainer: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addEnclosedMemberContainer");
        }
        public addEnclosedNonMember(enclosedNonMember: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addEnclosedNonMember");
        }
        public addEnclosedNonMemberType(enclosedNonMemberType: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addEnclosedNonMemberType");
        }
        public addEnclosedNonMemberContainer(enclosedNonMemberContainer: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addEnclosedNonMemberContainer");
        }
        public addTypeParameter(typeParameter: PullTypeParameterSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addTypeParameter");
        }
        public addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addConstructorTypeParameter");
        }

        public findContainedNonMember(name: string): PullSymbol {
            // need to ensure the referenced type is resolved so we can find the non-member
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findContainedNonMember(name);
        }

        public findContainedNonMemberType(typeName: string, kind = PullElementKind.None): PullTypeSymbol {
            // similar to the above, need to ensure that the type is resolved so we can introspect any
            // contained types
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findContainedNonMemberType(typeName, kind);
        }

        public getMembers(): PullSymbol[]{
            // need to resolve the referenced types to get the members
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.getMembers();
        }

        public setHasDefaultConstructor(hasOne= true): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ":setHasDefaultConstructor");
        }
        public getHasDefaultConstructor(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getHasDefaultConstructor();
        }
        public getConstructorMethod(): PullSymbol {
            // need to resolve so we don't accidentally substitute in a default constructor
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getConstructorMethod();
        }
        public setConstructorMethod(constructorMethod: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": setConstructorMethod");
        }
        public getTypeParameters(): PullTypeParameterSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeParameters();
        }

        public isGeneric(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.isGeneric();
        }

        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void {
            //Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addSpecialization");
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.addSpecialization(specializedVersionOfThisType, substitutingTypes);
        }
        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getSpecialization(substitutingTypes);
        }
        public getKnownSpecializations(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getKnownSpecializations();
        }
        public getTypeArguments(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeArguments();
        }
        public getTypeArgumentsOrTypeParameters(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeArgumentsOrTypeParameters();
        }

        public addCallSignature(callSignature: PullSignatureSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addCallSignature");
        }
        public addConstructSignature(constructSignature: PullSignatureSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addConstructSignature");
        }
        public addIndexSignature(indexSignature: PullSignatureSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolID + ": addIndexSignature");
        }

        public hasOwnCallSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnCallSignatures();
        }
        public getCallSignatures(): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getCallSignatures();
        }
        public hasOwnConstructSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnConstructSignatures();
        }
        public getConstructSignatures(): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getConstructSignatures();
        }
        public hasOwnIndexSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnIndexSignatures();
        }
        public getIndexSignatures(): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getIndexSignatures();
        }

        public addImplementedType(implementedType: PullTypeSymbol): void {
            this.referencedTypeSymbol.addImplementedType(implementedType);
        }
        public getImplementedTypes(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getImplementedTypes();
        }
        public addExtendedType(extendedType: PullTypeSymbol): void {
            this.referencedTypeSymbol.addExtendedType(extendedType);
        }
        public getExtendedTypes(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getExtendedTypes();
        }
        public addTypeThatExtendsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExtendsThisType(type);
        }
        public getTypesThatExtendThisType(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExtendThisType();
        }
        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExplicitlyImplementsThisType(type);
        }
        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExplicitlyImplementThisType();
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasBase(potentialBase, visited);
        }
        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.isValidBaseKind(baseType, isExtendedType);
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            // ensure that the type is resolved before looking for members
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findMember(name, lookInParent);
        }
        public findNestedType(name: string, kind = PullElementKind.None): PullTypeSymbol {
            // ensure that the type is resolved before looking for nested types
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findNestedType(name, kind);
        }
        public findNestedContainer(name: string, kind = PullElementKind.None): PullTypeSymbol {
            // ensure that the type is resolved before looking for nested containers
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findNestedContainer(name, kind);
        }
        public getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[]{
            // ensure that the type is resolved before trying to collect all members
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            // ensure that the type is resolved before trying to look up a type parameter
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findTypeParameter(name);
        }

        /*
        public getNamePartForFullName(): string {
            return this.referencedTypeSymbol.getNamePartForFullName();
        }
        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.referencedTypeSymbol.getScopedName(scopeSymbol, useConstraintInName);
        }
        public isNamedTypeSymbol(): boolean {
            return this.referencedTypeSymbol.isNamedTypeSymbol();
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.referencedTypeSymbol.toString(scopeSymbol, useConstraintInName);
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean): MemberName {
            return this.referencedTypeSymbol.getScopedNameEx(scopeSymbol, useConstraintInName, getPrettyTypeName, getTypeParamMarkerInfo);
        }
        */

        public hasOnlyOverloadCallSignatures(): boolean {
            // no need to resolve the referenced type - only computed during printing
            return this.referencedTypeSymbol.hasOnlyOverloadCallSignatures();
        }
    }

    export var nSpecializationsCreated = 0;
    export var nSpecializedSignaturesCreated = 0;    

    export class PullInstantiatedTypeReferenceSymbol extends PullTypeReferenceSymbol {

        private _instantiatedMembers: PullSymbol[] = null;
        private _allInstantiatedMemberNameCache: { [name: string]: PullSymbol; } = null;
        private _instantiatedMemberNameCache = createIntrinsicsObject<PullSymbol>(); // cache from member names to pull symbols
        private _instantiatedCallSignatures: PullSignatureSymbol[] = null;
        private _instantiatedConstructSignatures: PullSignatureSymbol[] = null;
        private _instantiatedIndexSignatures: PullSignatureSymbol[] = null;
        private _typeArgumentReferences: PullTypeSymbol[] = null;
        private _instantiatedConstructorMethod: PullSymbol = null;
        private _instantiatedAssociatedContainerType: PullTypeSymbol = null;
        private _isArray:boolean = undefined;

        public isInstanceReferenceType: boolean = false;

        public getIsSpecialized() { return !this.isInstanceReferenceType; }

        private _generativeTypeClassification: GenerativeTypeClassification = GenerativeTypeClassification.Unknown;

        public getGenerativeTypeClassification(enclosingType: PullTypeSymbol): GenerativeTypeClassification {

            if (this._generativeTypeClassification == GenerativeTypeClassification.Unknown) {
                // With respect to the enclosing type, is this type reference open, closed or 
                // infinitely expanding?

                var typeParameters = enclosingType.getTypeParameters();
                var typeReferenceTypeArguments = (<PullTypeReferenceSymbol>this.getRootSymbol()).getTypeArguments();
                var referenceTypeArgument: PullTypeSymbol = null;

                // may have an object literal or a function signature
                if (!typeReferenceTypeArguments) {
                    // create a new type map with just the type parameter
                    var typeParametersMap: PullTypeSymbol[] = [];

                    for (var i = 0; i < typeParameters.length; i++) {
                        typeParametersMap[typeParameters[i].pullSymbolID] = typeParameters[i];
                    }

                    var rootThis = PullHelpers.getRootType(this);
                    var wrapsSomeTypeParameters = rootThis.wrapsSomeTypeParameter(typeParametersMap);

                    // It's a wrap of a wrap
                    if (wrapsSomeTypeParameters && this.wrapsSomeNestedTypeIntoInfiniteExpansion(enclosingType)) {
                        this._generativeTypeClassification = GenerativeTypeClassification.InfinitelyExpanding;
                    }
                    else if (wrapsSomeTypeParameters) {
                        this._generativeTypeClassification = GenerativeTypeClassification.Open;
                    }
                    else {
                        this._generativeTypeClassification = GenerativeTypeClassification.Closed;
                    }
                }
                else {
                    var i = 0;

                    while (i < typeReferenceTypeArguments.length) {
                        referenceTypeArgument = <PullTypeSymbol>typeReferenceTypeArguments[i].getRootSymbol();

                        if (referenceTypeArgument.wrapsSomeTypeParameter(this._typeParameterArgumentMap)) {
                            break;
                        }

                        i++;
                    }

                    // if none of the type parameters are wrapped, the type reference is closed
                    if (i == typeParameters.length) {
                        this._generativeTypeClassification = GenerativeTypeClassification.Closed;
                    }

                    // If the type reference is not closed, it's either open or infinitely expanding
                    if (this._generativeTypeClassification == GenerativeTypeClassification.Unknown) {

                        // A type reference that references any of this type's type parameters in a type
                        // argument position is 'open'

                        var i = 0;

                        while ((this._generativeTypeClassification == GenerativeTypeClassification.Unknown) &&
                            (i < typeReferenceTypeArguments.length)) {

                                for (var j = 0; j < typeParameters.length; j++) {
                                    if (typeParameters[j] == typeReferenceTypeArguments[i]) {
                                        this._generativeTypeClassification = GenerativeTypeClassification.Open;
                                        break;
                                    }
                                }

                                i++;
                        }

                        // if it's not open, then it's infinitely expanding (given that the 'wrap' check above
                        // returned true
                        if (this._generativeTypeClassification != GenerativeTypeClassification.Open) {
                            this._generativeTypeClassification = GenerativeTypeClassification.InfinitelyExpanding;
                        }
                    }
                }
            }

            return this._generativeTypeClassification;
        }

        // shims

        public isArrayNamedTypeReference(): boolean {
            if (this._isArray === undefined) {
                this._isArray = this.getRootSymbol().isArrayNamedTypeReference() || (this.getRootSymbol() == this._getResolver().getArrayNamedType());
            }
            return this._isArray;
        }

        public getElementType(): PullTypeSymbol {
            if (!this.isArrayNamedTypeReference()) {
                return null;
            }

            var typeArguments = this.getTypeArguments();

            if (typeArguments != null) {
                return typeArguments[0];
            }

            return null;
        }

        public getReferencedTypeSymbol(): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();

            if (this.getIsSpecialized()) {
                return this;
            }

            return this.referencedTypeSymbol;
        }

        // The typeParameterArgumentMap parameter represents a mapping of PUllSymbolID strings of type parameters to type argument symbols
        // The instantiateFunctionTypeParameters parameter is set to true when a signature is being specialized at a call site, or if its
        // type parameters need to otherwise be specialized (say, during a type relationship check)
        public static create(resolver: PullTypeResolver, type: PullTypeSymbol, typeParameterArgumentMap: PullTypeSymbol[], instantiateFunctionTypeParameters = false): PullInstantiatedTypeReferenceSymbol {
            Debug.assert(resolver);

            // check for an existing instantiation
            var rootType = <PullTypeSymbol>type.getRootSymbol();

            var reconstructedTypeArgumentList: PullTypeSymbol[] = [];
            var typeArguments = type.getTypeArguments();
            var typeParameters = rootType.getTypeParameters();

            // if the type is already specialized, we need to create a new type argument map that represents the mapping of type arguments we've just received
            // to type arguments as previously passed through
            if (type.getIsSpecialized() && typeArguments && typeArguments.length) {
                for (var i = 0; i < typeArguments.length; i++) {
                    reconstructedTypeArgumentList[reconstructedTypeArgumentList.length] = resolver.instantiateType(typeArguments[i], typeParameterArgumentMap, instantiateFunctionTypeParameters);
                }
                
                for (var i = 0; i < typeArguments.length; i++) {
                    typeParameterArgumentMap[typeArguments[i].pullSymbolID] = reconstructedTypeArgumentList[i];
                }
            }
            else {
                var tyArg: PullTypeSymbol = null;

                for (var typeParameterID in typeParameterArgumentMap) {
                    if (typeParameterArgumentMap.hasOwnProperty(typeParameterID)) {
                        tyArg = typeParameterArgumentMap[typeParameterID];

                        if (tyArg) {
                            reconstructedTypeArgumentList[reconstructedTypeArgumentList.length] = tyArg;
                        }
                    }
                }
            }

            if (!instantiateFunctionTypeParameters) {
                var instantiation = <PullInstantiatedTypeReferenceSymbol>rootType.getSpecialization(reconstructedTypeArgumentList);

                if (instantiation) {
                    return instantiation;
                }
            }

            // If the reference is made to itself (e.g., referring to Array<T> within the declaration of Array<T>,
            // We want to special-case the reference so later calls to getMember, etc., will delegate directly
            // to the referenced declaration type, and not force any additional instantiation
            var isReferencedType = (type.kind & PullElementKind.SomeInstantiatableType) != 0;

            if (isReferencedType) {
                if (typeParameters && reconstructedTypeArgumentList) {
                    if (typeParameters.length == reconstructedTypeArgumentList.length) {
                        for (var i = 0; i < typeParameters.length; i++) {
                            if (!PullHelpers.typeSymbolsAreIdentical(typeParameters[i], reconstructedTypeArgumentList[i])) {
                                isReferencedType = false;
                                break;
                            }
                        }

                        if (isReferencedType) {
                            typeParameterArgumentMap = [];
                        }
                    }
                    else {
                        isReferencedType = false; // the same number of type parameters are not shared
                    }
                }
            }

            var instantiateRoot = isReferencedType;

            // if we're re-specializing a generic type (say, if a signature parameter gets specialized
            // from 'Array<S>' to 'Array<foo>', then we'll need to create a new initialization map.  This helps
            // us get the type argument list right when it's requested via getTypeArguments
            if (type.isTypeReference() && type.isGeneric()) {
                var initializationMap: PullTypeSymbol[] = [];

                // first, initialize the argument map
                for (var typeParameterID in typeParameterArgumentMap) {
                    if (typeParameterArgumentMap.hasOwnProperty(typeParameterID)) {
                        initializationMap[typeParameterID] = typeParameterArgumentMap[typeParameterID];
                    }
                }

                var oldMap = typeParameterArgumentMap;

                var outerTypeMap = (<PullInstantiatedTypeReferenceSymbol>type)._typeParameterArgumentMap;
                var innerSubstitution: PullTypeSymbol = null;
                var outerSubstitution: PullTypeSymbol = null;
                var canRelatePreInstantiatedTypeParametersToRootTypeParameters = true;

                for (var typeParameterID in outerTypeMap) {
                    if (outerTypeMap.hasOwnProperty(typeParameterID)) {

                        outerSubstitution = outerTypeMap[typeParameterID];
                        innerSubstitution = typeParameterArgumentMap[outerSubstitution.pullSymbolID];

                        // Consider the following case
                        //
                        // interface A<StringArgPos1, NumberArgPos2> {
                        //    xPos1 : StringArgPos1
                        //    yPos2 : NumberArgPos2
                        //    zPos2Pos1 : A<NumberArgPos2, StringArgPos1>
                        // }
                        //   
                        // In such a situation where we want to instantiate A (say, "A<string, number>"),
                        // we need to be careful that in instantiating zPos2Pos1, we don't improperly 
                        // condense NumberArgPos2 to StringArgPos1.  Because the type parameters of zPos2Pos1
                        // are a re-ordering of the type parameters for A, re-specializing one will cause the other
                        // to be respecialized in the instantiation map.  (So, in this case, zPos2Pos1 would end
                        // up with a type of 'A<string, number>', when we wanted A<number, string>.
                        //
                        // We do the check below to prevent dependent type parameters from being re-instantiated up-front.
                        // Instead, we preserve the instantiation info, and let substitution occur lazily.
                       
                        if (innerSubstitution &&
                            (!outerSubstitution.isTypeParameter() ||
                            !outerTypeMap[innerSubstitution.pullSymbolID] ||
                            !outerTypeMap[outerTypeMap[typeParameterID].pullSymbolID] ||
                            (outerTypeMap[outerTypeMap[typeParameterID].pullSymbolID] == outerSubstitution))) {

                            initializationMap[typeParameterID] = typeParameterArgumentMap[outerTypeMap[typeParameterID].pullSymbolID];

                            // In cases where we're testing for infinitely expanding generic types, a non-type parameter value may
                            // can be added to the substitution map.  In these cases, we do not want to re-map all type arguments
                            // to the root's type parameters - doing so would prevent us from properly checking for wrapped nested
                            // types later on (because the checks depend on wrapped instantiations *not* being an instantiation of
                            // the root type.  See getGenerativeTypeClassification
                            if (!outerSubstitution.isTypeParameter()) {
                                canRelatePreInstantiatedTypeParametersToRootTypeParameters = false;
                            }
                        }
                        else {
                            canRelatePreInstantiatedTypeParametersToRootTypeParameters = false;
                        }
                    }
                }

                // If the type being instantiated has takes type parameters, rather than passing in the entire type substitution context,
                // we limit the substitutions to those that affect the root named type.  This prevents us from over-instantiating types
                // in a generic function signature
                if (canRelatePreInstantiatedTypeParametersToRootTypeParameters && typeParameters.length) {
                    typeParameterArgumentMap = [];

                    for (var i = 0; i < typeParameters.length; i++) {
                        typeParameterArgumentMap[typeParameters[i].pullSymbolID] = initializationMap[typeParameters[i].pullSymbolID];
                    }

                    instantiateRoot = true;
                }
                else {
                    typeParameterArgumentMap = initializationMap;
                }
                
            }

            instantiation = new PullInstantiatedTypeReferenceSymbol(instantiateRoot ? rootType : type, typeParameterArgumentMap);

            if (!instantiateFunctionTypeParameters) {
                rootType.addSpecialization(instantiation, reconstructedTypeArgumentList);
            }

            if (isReferencedType) {
                instantiation.isInstanceReferenceType = true;
            }

            return instantiation;
        }

        constructor(public referencedTypeSymbol: PullTypeSymbol, private _typeParameterArgumentMap: PullTypeSymbol[]) {
            super(referencedTypeSymbol);

            nSpecializationsCreated++;
        }

        public isGeneric(): boolean {
            return !!this.referencedTypeSymbol.getTypeParameters().length;
        }

        public getTypeParameterArgumentMap(): PullTypeSymbol[] {
            return this._typeParameterArgumentMap;
        }

        public getTypeArguments(): PullTypeSymbol[]{

            if (this.isInstanceReferenceType) {
                return this.getTypeParameters();
            }

            if (!this._typeArgumentReferences) {
                var typeParameters = this.referencedTypeSymbol.getTypeParameters();

                if (typeParameters.length) {
                    var typeArgument: PullTypeSymbol = null;
                    var typeArguments: PullTypeSymbol[] = [];

                    for (var i = 0; i < typeParameters.length; i++) {
                        typeArgument = <PullTypeSymbol>this._typeParameterArgumentMap[typeParameters[i].pullSymbolID];

                        if (!typeArgument) {
                            Debug.fail("type argument count mismatch");
                        }

                        if (typeArgument) {
                            typeArguments[typeArguments.length] = typeArgument;
                        }
                    }

                    this._typeArgumentReferences = typeArguments;
                }
            }

            return this._typeArgumentReferences;
        }
        
        public getTypeArgumentsOrTypeParameters() {
            return this.getTypeArguments();
        }

        //
        // lazily evaluated members
        //
        public getMembers(): PullSymbol[] {
            // need to resolve the referenced types to get the members
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getMembers();
            }

            // for each of the referenced type's members, need to properly instantiate their
            // type references
            if (!this._instantiatedMembers) {
                var referencedMembers = this.referencedTypeSymbol.getMembers();
                var referencedMember: PullSymbol = null;
                var instantiatedMember: PullSymbol = null;

                this._instantiatedMembers = [];

                for (var i = 0; i < referencedMembers.length; i++) {
                    referencedMember = referencedMembers[i];

                    this._getResolver().resolveDeclaredSymbol(referencedMember);

                    if (!this._instantiatedMemberNameCache[referencedMember.name]) {

                        // if the member does not require further specialization, re-use the referenced symbol
                        if (!referencedMember.type.wrapsSomeTypeParameter(this._typeParameterArgumentMap)) {
                            instantiatedMember = referencedMember;
                        }
                        else {
                            instantiatedMember = new PullSymbol(referencedMember.name, referencedMember.kind);
                            instantiatedMember.setRootSymbol(referencedMember);
                            instantiatedMember.type = this._getResolver().instantiateType(referencedMember.type, this._typeParameterArgumentMap);
                            instantiatedMember.isOptional = referencedMember.isOptional;
                        }

                        this._instantiatedMemberNameCache[instantiatedMember.name] = instantiatedMember;
                    }
                    else {
                        instantiatedMember = this._instantiatedMemberNameCache[referencedMember.name]
                    }

                    this._instantiatedMembers[this._instantiatedMembers.length] = instantiatedMember;
                }
            }

            return this._instantiatedMembers;
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            // ensure that the type is resolved before looking for members
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.findMember(name, lookInParent);
            }

            // if the member exists on the referenced type, need to ensure that it's
            // instantiated

            var memberSymbol = <PullSymbol>this._instantiatedMemberNameCache[name];

            if (!memberSymbol) {
                var referencedMemberSymbol = this.referencedTypeSymbol.findMember(name, lookInParent);

                if (referencedMemberSymbol) {
                    memberSymbol = new PullSymbol(referencedMemberSymbol.name, referencedMemberSymbol.kind);
                    memberSymbol.setRootSymbol(referencedMemberSymbol);

                    this._getResolver().resolveDeclaredSymbol(referencedMemberSymbol);

                    memberSymbol.type = this._getResolver().instantiateType(referencedMemberSymbol.type, this._typeParameterArgumentMap);

                    memberSymbol.isOptional = referencedMemberSymbol.isOptional;

                    this._instantiatedMemberNameCache[memberSymbol.name] = memberSymbol;
                }
                else {
                    memberSymbol = null;
                }
            }

            return memberSymbol;
        }

        // May need to cache based on search kind / visibility combinations
        public getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[]{

            // ensure that the type is resolved before trying to collect all members
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);
            }

            var requestedMembers: PullSymbol[] = [];
            var allReferencedMembers = this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);

            if (!this._allInstantiatedMemberNameCache) {
                this._allInstantiatedMemberNameCache = createIntrinsicsObject<PullSymbol>();

                // first, seed with this type's members
                var members = this.getMembers();

                for (var i = 0; i < members.length; i++) {
                    this._allInstantiatedMemberNameCache[members[i].name] = members[i];
                }
            }

            // next, for add any symbols belonging to the parent type, if necessary
            var referencedMember: PullSymbol = null;
            var requestedMember: PullSymbol = null;

            for (var i = 0; i < allReferencedMembers.length; i++) {
                referencedMember = allReferencedMembers[i];

                this._getResolver().resolveDeclaredSymbol(referencedMember);

                if (this._allInstantiatedMemberNameCache[referencedMember.name]) {
                    requestedMembers[requestedMembers.length] = this._allInstantiatedMemberNameCache[referencedMember.name];
                }
                else {
                    if (!referencedMember.type.wrapsSomeTypeParameter(this._typeParameterArgumentMap)) {
                        this._allInstantiatedMemberNameCache[referencedMember.name] = referencedMember;
                        requestedMembers[requestedMembers.length] = referencedMember;
                    }
                    else {
                        requestedMember = new PullSymbol(referencedMember.name, referencedMember.kind);
                        requestedMember.setRootSymbol(referencedMember);

                        requestedMember.type = this._getResolver().instantiateType(referencedMember.type, this._typeParameterArgumentMap);
                        requestedMember.isOptional = referencedMember.isOptional;

                        this._allInstantiatedMemberNameCache[requestedMember.name] = requestedMember;
                        requestedMembers[requestedMembers.length] = requestedMember;
                    }
                }
            }
            
            return requestedMembers;
        }

        public getConstructorMethod(): PullSymbol {

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getConstructorMethod();
            }

            if (!this._instantiatedConstructorMethod) {
                var referencedConstructorMethod = this.referencedTypeSymbol.getConstructorMethod();
                this._instantiatedConstructorMethod = new PullSymbol(referencedConstructorMethod.name, referencedConstructorMethod.kind);
                this._instantiatedConstructorMethod.type = PullInstantiatedTypeReferenceSymbol.create(this._getResolver(), referencedConstructorMethod.type, this._typeParameterArgumentMap);
            }


            return this._instantiatedConstructorMethod;
        }

        public getAssociatedContainerType(): PullTypeSymbol {

            if (!this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getAssociatedContainerType();
            }

            if (!this._instantiatedAssociatedContainerType) {
                var referencedAssociatedContainerType = this.referencedTypeSymbol.getAssociatedContainerType();

                if (referencedAssociatedContainerType) {
                    this._instantiatedAssociatedContainerType = PullInstantiatedTypeReferenceSymbol.create(this._getResolver(), referencedAssociatedContainerType, this._typeParameterArgumentMap);
                }
            }

            return this._instantiatedAssociatedContainerType;
        }

        public getCallSignatures(): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getCallSignatures();
            }

            if (this._instantiatedCallSignatures) {
                return this._instantiatedCallSignatures;
            }

            var referencedCallSignatures = this.referencedTypeSymbol.getCallSignatures();
            this._instantiatedCallSignatures = [];

            for (var i = 0; i < referencedCallSignatures.length; i++) {
                this._getResolver().resolveDeclaredSymbol(referencedCallSignatures[i]);

                if (!referencedCallSignatures[i].wrapsSomeTypeParameter(this._typeParameterArgumentMap)) {
                    this._instantiatedCallSignatures[this._instantiatedCallSignatures.length] = referencedCallSignatures[i];
                }
                else {
                    this._instantiatedCallSignatures[this._instantiatedCallSignatures.length] = this._getResolver().instantiateSignature(referencedCallSignatures[i], this._typeParameterArgumentMap);
                    this._instantiatedCallSignatures[this._instantiatedCallSignatures.length - 1].functionType = this;
                }
            }

            return this._instantiatedCallSignatures;
        }

        public getConstructSignatures(): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getConstructSignatures();
            }

            if (this._instantiatedConstructSignatures) {
                return this._instantiatedConstructSignatures;
            }

            var referencedConstructSignatures = this.referencedTypeSymbol.getConstructSignatures();
            this._instantiatedConstructSignatures = [];

            for (var i = 0; i < referencedConstructSignatures.length; i++) {
                this._getResolver().resolveDeclaredSymbol(referencedConstructSignatures[i]);

                if (!referencedConstructSignatures[i].wrapsSomeTypeParameter(this._typeParameterArgumentMap)) {
                    this._instantiatedConstructSignatures[this._instantiatedConstructSignatures.length] = referencedConstructSignatures[i];
                }
                else {
                    this._instantiatedConstructSignatures[this._instantiatedConstructSignatures.length] = this._getResolver().instantiateSignature(referencedConstructSignatures[i], this._typeParameterArgumentMap);
                    this._instantiatedConstructSignatures[this._instantiatedConstructSignatures.length - 1].functionType = this;
                }
            }

            return this._instantiatedConstructSignatures;
        }

        public getIndexSignatures(): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getIndexSignatures();
            }

            if (this._instantiatedIndexSignatures) {
                return this._instantiatedIndexSignatures;
            }

            var referencedIndexSignatures = this.referencedTypeSymbol.getIndexSignatures();
            this._instantiatedIndexSignatures = [];

            for (var i = 0; i < referencedIndexSignatures.length; i++) {
                this._getResolver().resolveDeclaredSymbol(referencedIndexSignatures[i]);

                if (!referencedIndexSignatures[i].wrapsSomeTypeParameter(this._typeParameterArgumentMap)) {
                    this._instantiatedIndexSignatures[this._instantiatedIndexSignatures.length] = referencedIndexSignatures[i];
                }
                else {
                    this._instantiatedIndexSignatures[this._instantiatedIndexSignatures.length] = this._getResolver().instantiateSignature(referencedIndexSignatures[i], this._typeParameterArgumentMap);
                    this._instantiatedIndexSignatures[this._instantiatedIndexSignatures.length - 1].functionType = this;
                }
            }

            return this._instantiatedIndexSignatures;
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            return this.referencedTypeSymbol.hasBase(potentialBase, visited);
        }
    }
}