// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var pullSymbolID = 0;
    export var globalTyvarID = 0;
    export var sentinelEmptyArray: any[] = [];

    export class PullSymbol {

        // private state
        public pullSymbolID = pullSymbolID++;
        public pullSymbolIDString: string = null;

        public name: string;

        private cachedPathIDs: any = {};

        public kind: PullElementKind;

        private _container: PullTypeSymbol = null;
        public type: PullTypeSymbol = null;

        // We cache the declarations to improve look-up speed
        // (but we re-create on edits because deletion from the linked list is
        // much faster)
        private _declarations: PullDecl[] = null;

        public isResolved = false;

        public isOptional = false;

        public inResolution = false;

        private isSynthesized = false;

        public isVarArg = false;

        private isSpecialized = false;
        public isBeingSpecialized = false;

        private rootSymbol: PullSymbol = null;

        private _parentAccessorSymbol: PullSymbol = null;
        private _enclosingSignature: PullSignatureSymbol = null;
        public docComments: string = null;

        public isPrinting = false;

        // This is used to store the AST directly on the symbol, rather than using a data map,
        // if the useDirectTypeStorage flag is set
        public ast: AST = null;

        public isType() {
            return (this.kind & PullElementKind.SomeType) != 0;
        }

        public isSignature() {
            return (this.kind & PullElementKind.SomeSignature) != 0;
        }

        public isArray() {
            return (this.kind & PullElementKind.Array) != 0;
        }

        public isPrimitive() {
            return this.kind === PullElementKind.Primitive;
        }

        public isAccessor() {
            return false;
        }

        public isError() {
            return false;
        }

        public isInterface() {
            return this.kind === PullElementKind.Interface;
        }

        public isMethod() {
            return this.kind === PullElementKind.Method;
        }

        public isProperty() {
            return this.kind === PullElementKind.Property;
        }

        public isAlias() { return false; }
        public isContainer() { return false; }


        constructor(name: string, declKind: PullElementKind) {
            this.name = name;
            this.kind = declKind;
            this.pullSymbolIDString = this.pullSymbolID.toString();
        }

        public setAccessorSymbol(accessor: PullSymbol) {
            this._parentAccessorSymbol = accessor;
        }

        public getAccessorySymbol(): PullSymbol {
            return this._parentAccessorSymbol;
        }

        private findAliasedType(decls: PullDecl[]) {
            for (var i = 0; i < decls.length; i++) {
                var childDecls = decls[i].getChildDecls();
                for (var j = 0; j < childDecls.length; j++) {
                    if (childDecls[j].kind === PullElementKind.TypeAlias) {
                        var symbol = <PullTypeAliasSymbol>childDecls[j].getSymbol();
                        if (PullContainerTypeSymbol.usedAsSymbol(symbol, this)) {
                            return symbol;
                        }
                    }
                }
            }

            return null;
        }

        public getAliasedSymbol(scopeSymbol: PullSymbol) {
            if (!scopeSymbol) {
                return null;
            }

            var scopePath = scopeSymbol.pathToRoot();
            if (scopePath.length && scopePath[scopePath.length - 1].kind === PullElementKind.DynamicModule) {
                var decls = scopePath[scopePath.length - 1].getDeclarations();
                var symbol = this.findAliasedType(decls);
                return symbol;
            }

            return null;
        }

        public getScopedDynamicModuleAlias(scopeSymbol: PullSymbol) {
            var aliasSymbol = this.getAliasedSymbol(scopeSymbol);
            // Use only alias symbols to the dynamic module
            if (aliasSymbol) {
                // Has value symbol
                if (aliasSymbol.assignedValue) {
                    return null;
                }

                // Has type that is not same as container
                if (aliasSymbol.assignedType && aliasSymbol.assignedType != aliasSymbol.assignedContainer) {
                    return null;
                }

                // Its internal module
                if (aliasSymbol.assignedContainer.kind != PullElementKind.DynamicModule) {
                    return null;
                }
            }
            return aliasSymbol;
        }

        /** Use getName for type checking purposes, and getDisplayName to report an error or display info to the user.
         * They will differ when the identifier is an escaped unicode character or the identifier "__proto__".
         */
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (symbol) {
                return symbol.getName();
            }
            
            return this.name;
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (symbol) {
                return symbol.getDisplayName();
            }

            // Get the actual name associated with a declaration for this symbol
            var decls = this.getDeclarations();
            return decls.length ? this.getDeclarations()[0].getDisplayName() : this.name;
        }

        public setIsSpecialized() { this.isSpecialized = true; this.isBeingSpecialized = false; }
        public getIsSpecialized() { return this.isSpecialized; }
        public currentlyBeingSpecialized() { return this.isBeingSpecialized; }
        public setIsBeingSpecialized() { this.isBeingSpecialized = true; }
        public setValueIsBeingSpecialized(val: boolean) { this.isBeingSpecialized = val; }

        public getRootSymbol() { 
            if (!this.rootSymbol) {
                return this;
            }
            return this.rootSymbol;
        }
        public setRootSymbol(symbol: PullSymbol) { this.rootSymbol = symbol; }

        public setIsSynthesized(value = true) {
            this.isSynthesized = value;
        }
        public getIsSynthesized() { return this.isSynthesized; }

        public setEnclosingSignature(signature: PullSignatureSymbol) {
            this._enclosingSignature = signature;
        }

        public getEnclosingSignature(): PullSignatureSymbol {
            return this._enclosingSignature;
        }

        public addCacheID(cacheID: string) {
            if (!this.cachedPathIDs[cacheID]) {
                this.cachedPathIDs[cacheID] = true;
            }
        }

        public invalidateCachedIDs(cache: any) {
            for (var id in this.cachedPathIDs) {
                if (cache[id]) {
                    cache[id] = undefined;
                }
            }
        }

        // declaration methods
        public addDeclaration(decl: PullDecl) {
            Debug.assert(!!decl);

            if (this.rootSymbol) {
                return;
            }

            if (!this._declarations) {
                this._declarations = [decl];
            }
            else {
                this._declarations[this._declarations.length] = decl;
            }
        }

        public getDeclarations(): PullDecl[] {
            if (this.rootSymbol) {
                return this.rootSymbol.getDeclarations();
            }

            if (!this._declarations) {
                this._declarations = [];
            }

            return this._declarations;
        }

        // link methods

        public setContainer(containerSymbol: PullTypeSymbol) {
            if (this.rootSymbol) {
                return;
            }

            this._container = containerSymbol;
        }

        public getContainer(): PullTypeSymbol {
            if (this.rootSymbol) {
                return this.rootSymbol.getContainer();
            }

            return this._container;
        }

        public setResolved() {
            this.isResolved = true;
            this.inResolution = false;
        }

        public startResolving() {
            this.inResolution = true;
        }

        public setUnresolved() {
            this.isResolved = false;
            this.inResolution = false;
        }

        public invalidate() {

            this.isResolved = false;

            var declarations = this.getDeclarations();

            // reset the errors for its decl
            //for (var i = 0; i < declarations.length; i++) {
            //    declarations[i].resetErrors();
            //}
        }

        public hasFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if ((declarations[i].flags & flag) !== PullElementFlags.None) {
                    return true;
                }
            }
            return false;
        }

        public allDeclsHaveFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if (!((declarations[i].flags & flag) !== PullElementFlags.None)) {
                    return false;
                }
            }
            return true;
        }

        public pathToRoot() {
            var path: PullSymbol[] = [];
            var node = this;
            while (node) {
                if (node.isType()) {
                    var associatedContainerSymbol = (<PullTypeSymbol>node).getAssociatedContainerType();
                    if (associatedContainerSymbol) {
                        node = associatedContainerSymbol;
                    }
                }
                path[path.length] = node;
                var nodeKind = node.kind;
                if (nodeKind == PullElementKind.Parameter) {
                    break;
                } else {
                    node = node.getContainer();
                }
            }
            return path;
        }

        public findCommonAncestorPath(b: PullSymbol): PullSymbol[] {
            var aPath = this.pathToRoot();
            if (aPath.length === 1) {
                // Global symbol
                return aPath;
            }

            var bPath: PullSymbol[];
            if (b) {
                bPath = b.pathToRoot();
            } else {
                return aPath;
            }

            var commonNodeIndex = -1;
            for (var i = 0, aLen = aPath.length; i < aLen; i++) {
                var aNode = aPath[i];
                for (var j = 0, bLen = bPath.length; j < bLen; j++) {
                    var bNode = bPath[j];
                    if (aNode === bNode) {
                        var aDecl: PullDecl = null;
                        if (i > 0) {
                            var decls = aPath[i - 1].getDeclarations();
                            if (decls.length) {
                                aDecl = decls[0].getParentDecl();
                            }
                        }
                        var bDecl: PullDecl = null;
                        if (j > 0) {
                            var decls = bPath[j - 1].getDeclarations();
                            if (decls.length) {
                                bDecl = decls[0].getParentDecl();
                            }
                        }
                        if (!aDecl || !bDecl || aDecl == bDecl) {
                            commonNodeIndex = i;
                            break;
                        }
                    }
                }
                if (commonNodeIndex >= 0) {
                    break;
                }
            }

            if (commonNodeIndex >= 0) {
                return aPath.slice(0, commonNodeIndex);
            }
            else {
                return aPath;
            }
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var str = this.getNameAndTypeName(scopeSymbol);
            return str;
        }

        public getNamePartForFullName() {
            return this.getDisplayName(null, true);
        }

        public fullName(scopeSymbol?: PullSymbol): string {
            var path = this.pathToRoot();
            var fullName = "";
            var aliasedSymbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.fullName(scopeSymbol);
            }

            for (var i = 1; i < path.length; i++) {
                aliasedSymbol = path[i].getScopedDynamicModuleAlias(scopeSymbol);
                if (aliasedSymbol) {
                    // Aliased name found
                    fullName = aliasedSymbol.fullName(scopeSymbol) + "." + fullName;
                    break;
                } else {
                    var scopedName = path[i].getNamePartForFullName();
                    if (path[i].kind == PullElementKind.DynamicModule && !isQuoted(scopedName)) {
                        // Same file as dynamic module - do not include this name
                        break;
                    }

                    if (scopedName === "") {
                        // If the item does not have a name, stop enumarting them, e.g. Object literal
                        break;
                    }

                    fullName = scopedName + "." + fullName;
                }
            }

            fullName = fullName + this.getNamePartForFullName();
            return fullName;
        }

        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var path = this.findCommonAncestorPath(scopeSymbol);
            var fullName = "";
            var aliasedSymbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.getScopedName(scopeSymbol);
            }

            for (var i = 1; i < path.length; i++) {
                var kind = path[i].kind;
                if (kind === PullElementKind.Container || kind === PullElementKind.DynamicModule) {
                    aliasedSymbol = path[i].getScopedDynamicModuleAlias(scopeSymbol);
                    if (aliasedSymbol) {
                        // Aliased name
                        fullName = aliasedSymbol.getScopedName(scopeSymbol) + "." + fullName;
                        break;
                    } else if (kind === PullElementKind.Container) {
                        fullName = path[i].getDisplayName() + "." + fullName;
                    } else {
                        // Dynamic module 
                        var displayName = path[i].getDisplayName();
                        if (isQuoted(displayName)) {
                            fullName = displayName + "." + fullName;
                        }
                        break;
                    }
                } else {
                    // Any other type of container is not part of the name
                    break;
                }
            }
            fullName = fullName + this.getDisplayName(scopeSymbol, useConstraintInName);
            return fullName;
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean) {
            var name = this.getScopedName(scopeSymbol, useConstraintInName);
            return MemberName.create(name);
        }

        public getTypeName(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean) {
            var memberName = this.getTypeNameEx(scopeSymbol, getPrettyTypeName);
            return memberName.toString();
        }

        public getTypeNameEx(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean) {
            var type = this.type;
            if (type) {
                var memberName: MemberName = getPrettyTypeName ? this.getTypeNameForFunctionSignature("", scopeSymbol, getPrettyTypeName) : null;
                if (!memberName) {
                    memberName = type.getScopedNameEx(scopeSymbol, /*useConstraintInName:*/ true, getPrettyTypeName);
                }

                return memberName;
            }
            return MemberName.create("");
        }

        private getTypeNameForFunctionSignature(prefix: string, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean) {
            var type = this.type;
            if (type && !type.isNamedTypeSymbol() && this.kind != PullElementKind.Property && this.kind != PullElementKind.Variable && this.kind != PullElementKind.Parameter) {
                var signatures = type.getCallSignatures();
                if (signatures.length == 1 || (getPrettyTypeName && signatures.length)) {
                    var typeName = new MemberNameArray();
                    var signatureName = PullSignatureSymbol.getSignaturesTypeNameEx(signatures, prefix, false, false, scopeSymbol, getPrettyTypeName);
                    typeName.addAll(signatureName);
                    return typeName;
                }
            }

            return null;
        }

        public getNameAndTypeName(scopeSymbol?: PullSymbol) {
            var nameAndTypeName = this.getNameAndTypeNameEx(scopeSymbol);
            return nameAndTypeName.toString();
        }

        public getNameAndTypeNameEx(scopeSymbol?: PullSymbol) {
            var type = this.type;
            var nameStr = this.getDisplayName(scopeSymbol);
            if (type) {
                nameStr = nameStr + (this.isOptional ? "?" : "");
                var memberName: MemberName = this.getTypeNameForFunctionSignature(nameStr, scopeSymbol);
                if (!memberName) {
                    var typeNameEx = type.getScopedNameEx(scopeSymbol);
                    memberName = MemberName.create(typeNameEx, nameStr + ": ", "");
                }
                return memberName;
            }
            return MemberName.create(nameStr);
        }

        static getTypeParameterString(typars: PullTypeSymbol[], scopeSymbol?: PullSymbol, useContraintInName?: boolean) {
            return PullSymbol.getTypeParameterStringEx(typars, scopeSymbol, /*getTypeParamMarkerInfo:*/ undefined, useContraintInName).toString();
        }

        static getTypeParameterStringEx(typeParameters: PullTypeSymbol[], scopeSymbol?: PullSymbol, getTypeParamMarkerInfo?: boolean, useContraintInName?: boolean) {
            var builder = new MemberNameArray();
            builder.prefix = "";

            if (typeParameters && typeParameters.length) {
                builder.add(MemberName.create("<"));

                for (var i = 0; i < typeParameters.length; i++) {
                    if (i) {
                        builder.add(MemberName.create(", "));
                    }

                    if (getTypeParamMarkerInfo) {
                        builder.add(new MemberName());
                    }

                    builder.add(typeParameters[i].getScopedNameEx(scopeSymbol, useContraintInName));

                    if (getTypeParamMarkerInfo) {
                        builder.add(new MemberName());
                    }
                }

                builder.add(MemberName.create(">"));
            }

            return builder;
        }

        static getIsExternallyVisible(symbol: PullSymbol, fromIsExternallyVisibleSymbol: PullSymbol, inIsExternallyVisibleSymbols: PullSymbol[]) {
            if (inIsExternallyVisibleSymbols) {
                for (var i = 0; i < inIsExternallyVisibleSymbols.length; i++) {
                    if (inIsExternallyVisibleSymbols[i] === symbol) {
                        return true;
                    }
                }
            } else {
                inIsExternallyVisibleSymbols = [];
            }

            if (fromIsExternallyVisibleSymbol === symbol) {
                return true;
            }
            inIsExternallyVisibleSymbols = inIsExternallyVisibleSymbols.concat(<any>fromIsExternallyVisibleSymbol);

            return symbol.isExternallyVisible(inIsExternallyVisibleSymbols);
        }

        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean {
            // Primitive
            var kind = this.kind;
            if (kind === PullElementKind.Primitive) {
                return true;
            }

            // Type - use container to determine privacy info
            if (this.isType()) {
                var associatedContainerSymbol = (<PullTypeSymbol>this).getAssociatedContainerType();
                if (associatedContainerSymbol) {
                    return PullSymbol.getIsExternallyVisible(associatedContainerSymbol, this, inIsExternallyVisibleSymbols);
                }
            }

            // Private member
            if (this.hasFlag(PullElementFlags.Private)) {
                return false;
            }

            // If the container for this symbol is null, then this symbol is visible
            var container = this.getContainer();
            if (container === null) {
                return true;
            }

            // If export assignment check if this is the symbol that is exported
            if (container.kind == PullElementKind.DynamicModule ||
                (container.getAssociatedContainerType() && container.getAssociatedContainerType().kind == PullElementKind.DynamicModule)) {
                var containerTypeSymbol = container.kind == PullElementKind.DynamicModule
                    ? <PullContainerTypeSymbol>container
                    : <PullContainerTypeSymbol>container.getAssociatedContainerType();
                if (PullContainerTypeSymbol.usedAsSymbol(containerTypeSymbol, this)) {
                    return true;
                }
            }

            // If non exported member and is not class properties and method, it is not visible
            if (!this.hasFlag(PullElementFlags.Exported) && kind != PullElementKind.Property && kind != PullElementKind.Method) {
                return false;
            }

            // Visible if parent is visible
            return PullSymbol.getIsExternallyVisible(container, this, inIsExternallyVisibleSymbols);
        }
    }

    export class PullSignatureSymbol extends PullSymbol {

        public parameters: PullSymbol[] = sentinelEmptyArray;
        public typeParameters: PullTypeParameterSymbol[] = null;
        public returnType: PullTypeSymbol = null;
        public functionType: PullTypeSymbol = null;

        public hasOptionalParam = false;
        public nonOptionalParamCount = 0;

        public hasVarArgs = false;

        private specializationCache: any = {};

        private memberTypeParameterNameCache: any = null;

        public hasAGenericParameter = false;
        private stringConstantOverload: boolean = undefined;

        public hasBeenChecked = false;

        constructor(kind: PullElementKind) {
            super("", kind);
        }

        public isDefinition() { return false; }

        public isGeneric() { return this.hasAGenericParameter || (this.typeParameters && this.typeParameters.length != 0); }

        public addParameter(parameter: PullSymbol, isOptional = false) {
            if (this.parameters == sentinelEmptyArray) {
                this.parameters = [];
            }

            this.parameters[this.parameters.length] = parameter;
            this.hasOptionalParam = isOptional;

            if (!parameter.getEnclosingSignature()) {
                parameter.setEnclosingSignature(this); 
            }

            if (!isOptional) {
                this.nonOptionalParamCount++;
            }
        }

        public addSpecialization(signature: PullSignatureSymbol, typeArguments: PullTypeSymbol[]) {
            if (typeArguments && typeArguments.length) {
                this.specializationCache[getIDForTypeSubstitutions(typeArguments)] = signature;
            }
        }

        public getSpecialization(typeArguments: PullTypeSymbol[]): PullSignatureSymbol {

            if (typeArguments) {
                var sig = <PullSignatureSymbol>this.specializationCache[getIDForTypeSubstitutions(typeArguments)];

                if (sig) {
                    return sig;
                }
            }

            return null;
        }

        public addTypeParameter(typeParameter: PullTypeParameterSymbol) {
            if (!this.typeParameters) {
                this.typeParameters = [];
            }

            if (!this.memberTypeParameterNameCache) {
                this.memberTypeParameterNameCache = new BlockIntrinsics();
            }

            this.typeParameters[this.typeParameters.length] = typeParameter;

            this.memberTypeParameterNameCache[typeParameter.getName()] = typeParameter;
        }
        
        public getTypeParameters(): PullTypeParameterSymbol[]{

            if (!this.typeParameters) {
                this.typeParameters = [];
            }

            return this.typeParameters;
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            var memberSymbol: PullTypeParameterSymbol;

            if (!this.memberTypeParameterNameCache) {
                this.memberTypeParameterNameCache = new BlockIntrinsics();

                if (this.typeParameters) {
                    for (var i = 0; i < this.typeParameters.length; i++) {
                        this.memberTypeParameterNameCache[this.typeParameters[i].getName()] = this.typeParameters[i];
                    }
                }
            }

            memberSymbol = this.memberTypeParameterNameCache[name];

            return memberSymbol;
        }

        public mimicSignature(signature: PullSignatureSymbol, resolver: PullTypeResolver) {
            // mimic type parameters
            var typeParameters = signature.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;

            if (typeParameters) {
                for (var i = 0; i < typeParameters.length; i++) {
                    //typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());
                    //typeParameter.addDeclaration(typeParameters[i].getDeclarations()[0]);
                    this.addTypeParameter(typeParameters[i]);
                }
            }

            // mimic paremeteres (optionality, varargs)
            var parameters = signature.parameters;
            var parameter: PullSymbol;

            if (parameters) {
                for (var j = 0; j < parameters.length; j++) {
                    parameter = new PullSymbol(parameters[j].name, PullElementKind.Parameter);
                    parameter.setRootSymbol(parameters[j]);
                    //parameter.addDeclaration(parameters[j].getDeclarations()[0]);
                    if (parameters[j].isOptional) {
                        parameter.isOptional = true;
                    }
                    if (parameters[j].isVarArg) {
                        parameter.isVarArg = true;
                        this.hasVarArgs = true;
                    }
                    this.addParameter(parameter);
                }
            }

            // Don't set the return type, since that will just lead to redundant
            // calls to setReturnType when we re-resolve the signature for
            // specialization

            var returnType = signature.returnType;

             if (!resolver.isTypeArgumentOrWrapper(returnType)) {
                 this.returnType = returnType;
             }
        }

        public isFixed(): boolean {

            if (!this.isGeneric()) {
                return true;
            }

            if (this.parameters) {
                var paramType: PullTypeSymbol;
                for (var i = 0; i < this.parameters.length; i++) {
                    paramType = this.parameters[i].type;

                    if (paramType && !paramType.isFixed()) {
                        return false;
                    }
                }
            }

            if (this.returnType) {
                if (!this.returnType.isFixed()) {
                    return false;
                }
            }

            return true;
        }

        public invalidate() {

            this.nonOptionalParamCount = 0;
            this.hasOptionalParam = false;
            this.hasAGenericParameter = false;
            this.stringConstantOverload = undefined;

            super.invalidate();
        }

        public isStringConstantOverloadSignature() {
            if (this.stringConstantOverload === undefined) {
                var params = this.parameters;
                this.stringConstantOverload = false;
                for (var i = 0; i < params.length; i++) {
                    var paramType = params[i].type;
                    if (paramType && paramType.isPrimitive() && (<PullPrimitiveTypeSymbol>paramType).isStringConstant()) {
                        this.stringConstantOverload = true;
                    }
                }
            }

            return this.stringConstantOverload;
        }

        static getSignatureTypeMemberName(candidateSignature: PullSignatureSymbol, signatures: PullSignatureSymbol[], scopeSymbol: PullSymbol) {
            var allMemberNames = new MemberNameArray();
            var signatureMemberName = PullSignatureSymbol.getSignaturesTypeNameEx(signatures, "", false, false, scopeSymbol, true, candidateSignature);
            allMemberNames.addAll(signatureMemberName);
            return allMemberNames;
        }

        static getSignaturesTypeNameEx(signatures: PullSignatureSymbol[],
                                       prefix: string,
                                       shortform: boolean,
                                       brackets: boolean,
                                       scopeSymbol?: PullSymbol,
                                       getPrettyTypeName?: boolean,
                                       candidateSignature?: PullSignatureSymbol) {
            var result: MemberName[] = [];
            if (!signatures) {
                return result;
            }

            var len = signatures.length;
            if (!getPrettyTypeName && len > 1) {
                shortform = false;
            }

            var foundDefinition = false;
            if (candidateSignature && candidateSignature.isDefinition() && len > 1) {
                // Overloaded signature with candidateSignature = definition - cannot be used.
                candidateSignature = null;
            }

            for (var i = 0; i < len; i++) {
                // the definition signature shouldn't be printed if there are overloads
                if (len > 1 && signatures[i].isDefinition()) {
                    foundDefinition = true;
                    continue;
                }

                var signature = signatures[i];
                if (getPrettyTypeName && candidateSignature) {
                    signature = candidateSignature;
                }

                result.push(signature.getSignatureTypeNameEx(prefix, shortform, brackets, scopeSymbol));
                if (getPrettyTypeName) {
                    break;
                }
            }

            if (getPrettyTypeName && result.length && len > 1) {
                var lastMemberName = <MemberNameArray>result[result.length - 1];
                for (var i = i + 1; i < len; i++) {
                    if (signatures[i].isDefinition()) {
                        foundDefinition = true;
                        break;
                    }
                }
                var overloadString = getLocalizedText(DiagnosticCode._0_overload_s, [foundDefinition ? len - 2 : len - 1]);
                lastMemberName.add(MemberName.create(overloadString));
            }

            return result;
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var s = this.getSignatureTypeNameEx(this.getScopedNameEx().toString(), false, false, scopeSymbol, undefined, useConstraintInName).toString();
            return s;
        }

        public getSignatureTypeNameEx(prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getParamMarkerInfo?: boolean, getTypeParamMarkerInfo?: boolean) {
            var typeParamterBuilder = new MemberNameArray();

            typeParamterBuilder.add(PullSymbol.getTypeParameterStringEx(
                this.getTypeParameters(), scopeSymbol, getTypeParamMarkerInfo, /*useConstraintInName*/true));

            if (brackets) {
                typeParamterBuilder.add(MemberName.create("["));
            }
            else {
                typeParamterBuilder.add(MemberName.create("("));
            }

            var builder = new MemberNameArray();
            builder.prefix = prefix;

            if (getTypeParamMarkerInfo) {
                builder.prefix = prefix;
                builder.addAll(typeParamterBuilder.entries);
            }
            else {
                builder.prefix = prefix + typeParamterBuilder.toString();
            }

            var params = this.parameters;
            var paramLen = params.length;
            for (var i = 0; i < paramLen; i++) {
                var paramType = params[i].type;
                var typeString = paramType ? ": " : "";
                var paramIsVarArg = params[i].isVarArg;
                var varArgPrefix = paramIsVarArg ? "..." : "";
                var optionalString = (!paramIsVarArg && params[i].isOptional) ? "?" : "";
                if (getParamMarkerInfo) {
                    builder.add(new MemberName());
                }
                builder.add(MemberName.create(varArgPrefix + params[i].getScopedNameEx(scopeSymbol).toString() + optionalString + typeString));
                if (paramType) {
                    builder.add(paramType.getScopedNameEx(scopeSymbol));
                }
                if (getParamMarkerInfo) {
                    builder.add(new MemberName());
                }
                if (i < paramLen - 1) {
                    builder.add(MemberName.create(", "));
                }
            }

            if (shortform) {
                if (brackets) {
                    builder.add(MemberName.create("] => "));
                }
                else {
                    builder.add(MemberName.create(") => "));
                }
            }
            else {
                if (brackets) {
                    builder.add(MemberName.create("]: "));
                }
                else {
                    builder.add(MemberName.create("): "));
                }
            }

            if (this.returnType) {
                builder.add(this.returnType.getScopedNameEx(scopeSymbol));
            }
            else {
                builder.add(MemberName.create("any"));
            }

            return builder;
        }
    }

    export class PullTypeSymbol extends PullSymbol {

        private _members: PullSymbol[] = sentinelEmptyArray;
        private _enclosedMemberTypes: PullTypeSymbol[] = null;
        private _typeParameters: PullTypeParameterSymbol[] = null;
        private _typeArguments: PullTypeSymbol[] = null;
        private _containedNonMembers: PullSymbol[] = null;
        private _containedNonMemberTypes: PullTypeSymbol[] = null;

        private _specializedVersionsOfThisType: PullTypeSymbol[] = null;
        private _arrayVersionOfThisType: PullTypeSymbol = null;

        private _implementedTypes: PullTypeSymbol[] = null;
        private _extendedTypes: PullTypeSymbol[] = null;

        private _typesThatExplicitlyImplementThisType: PullTypeSymbol[] = null;
        private _typesThatExtendThisType: PullTypeSymbol[] = null;

        private _callSignatures: PullSignatureSymbol[] = null;
        private _allCallSignatures: PullSignatureSymbol[] = null;
        private _constructSignatures: PullSignatureSymbol[] = null;
        private _allConstructSignatures: PullSignatureSymbol[] = null;
        private _indexSignatures: PullSignatureSymbol[] = null;
        private _allIndexSignatures: PullSignatureSymbol[] = null;

        private _elementType: PullTypeSymbol = null;

        private _memberNameCache: any = null;
        private _enclosedTypeNameCache: any = null;
        private _typeParameterNameCache: any = null;
        private _containedNonMemberNameCache: any = null;
        private _containedNonMemberTypeNameCache: any = null;
        private _specializedTypeIDCache: any = null;

        private _hasGenericSignature = false;
        private _hasGenericMember = false;
        private _hasBaseTypeConflict = false;

        private _knownBaseTypeCount = 0;

        private _invalidatedSpecializations = false;

        private _associatedContainerTypeSymbol: PullTypeSymbol = null;

        private _constructorMethod: PullSymbol = null;
        private _hasDefaultConstructor = false;
        
        // TODO: Really only used to track doc comments...
        private _functionSymbol: PullSymbol = null;

        public hasRecursiveSpecializationError = false;

        private inMemberTypeNameEx = false;
        public inSymbolPrivacyCheck = false;

        constructor(name: string, kind: PullElementKind) {
            super(name, kind);
            this.type = this;
        }

        public isType() { return true; }
        public isClass() {
            return this.kind == PullElementKind.Class || (this._constructorMethod != null);
        }
        public isFunction() { return (this.kind & (PullElementKind.ConstructorType | PullElementKind.FunctionType)) != 0; }
        public isConstructor() { return this.kind == PullElementKind.ConstructorType; }
        public isTypeParameter() { return false; }
        public isTypeVariable() { return false; }
        public isError() { return false; }
        public isEnum() { return this.kind == PullElementKind.Enum; }

        public getKnownBaseTypeCount() { return this._knownBaseTypeCount; }
        public resetKnownBaseTypeCount() { this._knownBaseTypeCount = 0; }
        public incrementKnownBaseCount() { this._knownBaseTypeCount++; }

        public setHasBaseTypeConflict() {
            this._hasBaseTypeConflict = true;
        }
        public hasBaseTypeConflict() {
            return this._hasBaseTypeConflict;
        }

        public setUnresolved() {
            super.setUnresolved();

            this._invalidatedSpecializations = false;

            var specializations = this.getKnownSpecializations();

            for (var i = 0; i < specializations.length; i++) {
                specializations[i].setUnresolved();
            }
        }

        public hasMembers() {

            if (this._members != sentinelEmptyArray) {
                return true;
            }

            var parents = this.getExtendedTypes();

            for (var i = 0; i < parents.length; i++) {
                if (parents[i].hasMembers()) {
                    return true;
                }
            }

            return false;
        }

        public setHasGenericSignature() { this._hasGenericSignature = true; }
        public getHasGenericSignature() { return this._hasGenericSignature; }

        public setHasGenericMember() { this._hasGenericMember = true; }
        public getHasGenericMember() { return this._hasGenericMember; }

        public setAssociatedContainerType(type: PullTypeSymbol) {
            this._associatedContainerTypeSymbol = type;
        }

        public getAssociatedContainerType() {
            return this._associatedContainerTypeSymbol;
        }

        public getArrayType() { return this._arrayVersionOfThisType; }

        public getElementType(): PullTypeSymbol {            
            return this._elementType;
        }

        public setElementType(type: PullTypeSymbol) {
            this._elementType = type;
        }

        public setArrayType(arrayType: PullTypeSymbol) {
            this._arrayVersionOfThisType = arrayType;
        }

        public getFunctionSymbol() {
            return this._functionSymbol;
        }

        public setFunctionSymbol(symbol: PullSymbol) {
            if (symbol) {
                this._functionSymbol = symbol;
            }
        }

        public addContainedNonMember(nonMember: PullSymbol) {

            if (!nonMember) {
                return;
            }

            if (!this._containedNonMembers) {
                this._containedNonMembers = [];
            }

            this._containedNonMembers[this._containedNonMembers.length] = nonMember;

            if (!this._containedNonMemberNameCache) {
                this._containedNonMemberNameCache = new BlockIntrinsics();
            }

            this._containedNonMemberNameCache[nonMember.name] = nonMember;
        }

        // TODO: This seems to conflate exposed members with private non-Members
        public findContainedNonMember(name: string): PullSymbol {
            if (!this._containedNonMemberNameCache) {
                return null;
            }

            return this._containedNonMemberNameCache[name];
        }

        public findContainedNonMemberType(typeName: string): PullTypeSymbol {
            if (!this._containedNonMemberTypeNameCache) {
                return null;
            }

            return this._containedNonMemberTypeNameCache[typeName];
        }

        public addMember(memberSymbol: PullSymbol): void {
            if (!memberSymbol) {
                return;
            }

            memberSymbol.setContainer(this);

            if (!this._memberNameCache) {
                this._memberNameCache = new BlockIntrinsics();
            }

            if (this._members == sentinelEmptyArray) {
                this._members = [];
            }

            this._members[this._members.length] = memberSymbol;
            this._memberNameCache[memberSymbol.name] = memberSymbol;
        }

        public addEnclosedMemberType(enclosedType: PullTypeSymbol): void {

            if (!enclosedType) {
                return;
            }

            enclosedType.setContainer(this);

            if (!this._enclosedTypeNameCache) {
                this._enclosedTypeNameCache = new BlockIntrinsics();
            }

            if (!this._enclosedMemberTypes) {
                this._enclosedMemberTypes = [];
            }

            this._enclosedMemberTypes[this._enclosedMemberTypes.length] = enclosedType;
            this._enclosedTypeNameCache[enclosedType.name] = enclosedType;
        }

        public addEnclosedNonMember(enclosedNonMember: PullSymbol): void {

            if (!enclosedNonMember) {
                return;
            }

            enclosedNonMember.setContainer(this);

            if (!this._containedNonMemberNameCache) {
                this._containedNonMemberNameCache = new BlockIntrinsics();
            }

            if (!this._containedNonMembers) {
                this._containedNonMembers = [];
            }

            this._containedNonMembers[this._containedNonMembers.length] = enclosedNonMember;
            this._containedNonMemberNameCache[enclosedNonMember.name] = enclosedNonMember;
        }

        public addEnclosedNonMemberType(enclosedNonMemberType: PullTypeSymbol): void {

            if (!enclosedNonMemberType) {
                return;
            }

            enclosedNonMemberType.setContainer(this);

            if (!this._containedNonMemberTypeNameCache) {
                this._containedNonMemberTypeNameCache = new BlockIntrinsics();
            }

            if (!this._containedNonMemberTypes) {
                this._containedNonMemberTypes = [];
            }

            this._containedNonMemberTypes[this._containedNonMemberTypes.length] = enclosedNonMemberType;
            this._containedNonMemberTypeNameCache[enclosedNonMemberType.name] = enclosedNonMemberType;
        }

        public addTypeParameter(typeParameter: PullTypeParameterSymbol): void {
            if (!typeParameter) {
                return;
            }

            if (!typeParameter.getContainer()) {
                typeParameter.setContainer(this);
            }

            if (!this._typeParameterNameCache) {
                this._typeParameterNameCache = new BlockIntrinsics();
            }

            if (!this._typeParameters) {
                this._typeParameters = [];
            }

            this._typeParameters[this._typeParameters.length] = typeParameter;
            this._typeParameterNameCache[typeParameter.getName()] = typeParameter;
        }

        public addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol) {

            this.addTypeParameter(typeParameter);

            var constructSignatures = this.getConstructSignatures();

            for (var i = 0; i < constructSignatures.length; i++) {
                constructSignatures[i].addTypeParameter(typeParameter);
            }
        }

        public getMembers(): PullSymbol[] {
            return this._members;
        }

        public setHasDefaultConstructor(hasOne= true) {
            this._hasDefaultConstructor = hasOne;
        }

        public getHasDefaultConstructor() {
            return this._hasDefaultConstructor;
        }

        public getConstructorMethod() {
            return this._constructorMethod;
        }

        public setConstructorMethod(constructorMethod: PullSymbol) {
            this._constructorMethod = constructorMethod;
        }

        public getTypeParameters(): PullTypeParameterSymbol[]{
            if (!this._typeParameters) {
                return sentinelEmptyArray;
            }

            return this._typeParameters;
        }

        public isGeneric(): boolean {
            return (this._typeParameters && this._typeParameters.length != 0) ||
                this._hasGenericSignature ||
                this._hasGenericMember ||
                (this._typeArguments && this._typeArguments.length) ||
                this.isArray();
        }

        public isFixed() {

            if (!this.isGeneric()) {
                return true;
            }

            if (this._typeParameters && this._typeArguments) {
                if (!this._typeArguments.length || this._typeArguments.length < this._typeParameters.length) {
                    return false;
                }

                for (var i = 0; i < this._typeArguments.length; i++) {
                    if (!this._typeArguments[i].isFixed()) {
                        return false;
                    }
                }

                return true;
            }
            else if (this._hasGenericMember) {
                var members = this.getMembers();
                var memberType: PullTypeSymbol = null;

                for (var i = 0; i < members.length; i++) {
                    memberType = members[i].type;

                    if (memberType && !memberType.isFixed()) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void {

            if (!substitutingTypes || !substitutingTypes.length) {
                return;
            }

            if (!this._specializedTypeIDCache) {
                this._specializedTypeIDCache = new BlockIntrinsics();
            }

            if (!this._specializedVersionsOfThisType) {
                this._specializedVersionsOfThisType = [];
            }

            this._specializedVersionsOfThisType[this._specializedVersionsOfThisType.length] = specializedVersionOfThisType;

            this._specializedTypeIDCache[getIDForTypeSubstitutions(substitutingTypes)] = specializedVersionOfThisType;
        }

        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol {

            if (!substitutingTypes || !substitutingTypes.length) {
                return null;
            }

            if (!this._specializedTypeIDCache) {
                this._specializedTypeIDCache = new BlockIntrinsics();

                return null;
            }

            var specialization = <PullTypeSymbol>this._specializedTypeIDCache[getIDForTypeSubstitutions(substitutingTypes)];

            if (!specialization) {
                return null;
            }

            return specialization;
        }

        public getKnownSpecializations(): PullTypeSymbol[]{
            if (!this._specializedVersionsOfThisType) {
                return sentinelEmptyArray;
            }

            return this._specializedVersionsOfThisType;
        }

        public getTypeArguments() {
            return this._typeArguments;
        }
        public setTypeArguments(typeArgs: PullTypeSymbol[]) { this._typeArguments = typeArgs; }

        public addCallSignature(callSignature: PullSignatureSymbol) {

            if (!this._callSignatures) {
                this._callSignatures = [];
            }

            this._callSignatures[this._callSignatures.length] = callSignature;

            if (callSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            callSignature.functionType = this;
        }

        public addConstructSignature(constructSignature: PullSignatureSymbol) {

            if (!this._constructSignatures) {
                this._constructSignatures = [];
            }

            this._constructSignatures[this._constructSignatures.length] = constructSignature;

            if (constructSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            constructSignature.functionType = this;
        }

        public addIndexSignature(indexSignature: PullSignatureSymbol) {
            if (!this._indexSignatures) {
                this._indexSignatures = [];
            }

            this._indexSignatures[this._indexSignatures.length] = indexSignature;

            if (indexSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            indexSignature.functionType = this;
        }

        public hasOwnCallSignatures() { return !!this._callSignatures; }

        public getCallSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{

            if (!collectBaseSignatures) {
                return this._callSignatures || [];
            }

            if (this._allCallSignatures) {
                return this._allCallSignatures;
            }

            var signatures: PullSignatureSymbol[] = [];

            if (this._callSignatures) {
                signatures = signatures.concat(this._callSignatures);
            }

            if (collectBaseSignatures && this._extendedTypes) {
                for (var i = 0; i < this._extendedTypes.length; i++) {
                    if (this._extendedTypes[i].hasBase(this)) {
                        continue;
                    }

                    signatures = signatures.concat(this._extendedTypes[i].getCallSignatures());
                }
            }

            this._allCallSignatures = signatures;

            return signatures;
        }

        public hasOwnConstructSignatures() { return !!this._constructSignatures; }

        public getConstructSignatures(collectBaseSignatures= true): PullSignatureSymbol[] {

            if (!collectBaseSignatures) {
                return this._constructSignatures || [];
            }

            var signatures: PullSignatureSymbol[] = [];

            if (this._constructSignatures) {
                signatures = signatures.concat(this._constructSignatures);
            }

            // If it's a constructor type, we don't inherit construct signatures
            // (E.g., we'd be looking at the statics on a class, where we want
            // to inherit members, but not construct signatures
            if (collectBaseSignatures && this._extendedTypes && !(this.kind == PullElementKind.ConstructorType)) {
                for (var i = 0; i < this._extendedTypes.length; i++) {
                    if (this._extendedTypes[i].hasBase(this)) {
                        continue;
                    }

                    signatures = signatures.concat(this._extendedTypes[i].getConstructSignatures());
                }
            }

            return signatures;
        }

        public hasOwnIndexSignatures() { return !!this._indexSignatures; }

        public getIndexSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{

            if (!collectBaseSignatures) {
                return this._indexSignatures || [];
            }

            if (this._allIndexSignatures) {
                return this._allIndexSignatures;
            }

            var signatures: PullSignatureSymbol[] = [];

            if (this._indexSignatures) {
                signatures = signatures.concat(this._indexSignatures);
            }

            if (collectBaseSignatures && this._extendedTypes) {
                for (var i = 0; i < this._extendedTypes.length; i++) {
                    if (this._extendedTypes[i].hasBase(this)) {
                        continue;
                    }

                    signatures = signatures.concat(this._extendedTypes[i].getIndexSignatures());
                }
            }

            this._allIndexSignatures = signatures;

            return signatures;
        }

        public addImplementedType(implementedType: PullTypeSymbol) {
            if (!implementedType) {
                return;
            }

            if (!this._implementedTypes) {
                this._implementedTypes = [];
            }

            this._implementedTypes[this._implementedTypes.length] = implementedType;

            implementedType.addTypeThatExplicitlyImplementsThisType(this);
        }

        public getImplementedTypes(): PullTypeSymbol[]{
            if (!this._implementedTypes) {
                return sentinelEmptyArray;
            }

            return this._implementedTypes;
        }

        public addExtendedType(extendedType: PullTypeSymbol) {
            if (!extendedType) {
                return;
            }

            if (!this._extendedTypes) {
                this._extendedTypes = [];
            }

            this._extendedTypes[this._extendedTypes.length] = extendedType;

            extendedType.addTypeThatExtendsThisType(this);
        }

        public getExtendedTypes(): PullTypeSymbol[]{
            if (!this._extendedTypes) {
                return sentinelEmptyArray;
            }

            return this._extendedTypes;
        }

        public addTypeThatExtendsThisType(type: PullTypeSymbol) {
            if (!type) {
                return;
            }

            if (!this._typesThatExtendThisType) {
                this._typesThatExtendThisType = [];
            }

            this._typesThatExtendThisType[this._typesThatExtendThisType.length] = type;
        }

        public getTypesThatExtendThisType(): PullTypeSymbol[]{
            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            return this._typesThatExtendThisType;
        }

        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol) {
            if (!type) {
                return;
            }

            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            this._typesThatExplicitlyImplementThisType[this._typesThatExplicitlyImplementThisType.length] = type;
        }

        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[]{
            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            return this._typesThatExplicitlyImplementThisType;
        }

        public hasBase(potentialBase: PullTypeSymbol, origin: PullSymbol = null) {
            if (this === potentialBase) {
                return true;
            }

            if (origin && (this === origin || this.getRootSymbol() === origin)) {
                return true;
            }

            if (!origin) {
                origin = this;
            }

            var extendedTypes = this.getExtendedTypes();

            for (var i = 0; i < extendedTypes.length; i++) {
                if (extendedTypes[i].hasBase(potentialBase, origin)) {
                    return true;
                }
            }

            var implementedTypes = this.getImplementedTypes();

            for (var i = 0; i < implementedTypes.length; i++) {
                if (implementedTypes[i].hasBase(potentialBase, origin)) {
                    return true;
                }
            }

            return false;
        }

        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean) {
            // Error type symbol is invalid base kind
            if (baseType.isError()) {
                return false;
            }

            var thisIsClass = this.isClass();
            if (isExtendedType) {
                if (thisIsClass) {
                    // Class extending non class Type is invalid
                    return baseType.kind === PullElementKind.Class;
                }
            } else {
                if (!thisIsClass) {
                    // Interface implementing baseType is invalid
                    return false;
                }
            }

            // Interface extending non interface or class 
            // or class implementing non interface or class - are invalid
            return !!(baseType.kind & (PullElementKind.Interface | PullElementKind.Class | PullElementKind.Array));
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            var memberSymbol: PullSymbol = null;

            if (this._memberNameCache) {
                memberSymbol = this._memberNameCache[name];
            }            

            if (!lookInParent) {
                return memberSymbol;
            }
            else if (memberSymbol) {
                return memberSymbol;
            }

            // check parents
            if (!memberSymbol && this._extendedTypes) {

                for (var i = 0; i < this._extendedTypes.length; i++) {
                    memberSymbol = this._extendedTypes[i].findMember(name);

                    if (memberSymbol) {
                        return memberSymbol;
                    }
                }
            }

            return null;
        }

        public findNestedType(name: string, kind = PullElementKind.None): PullTypeSymbol {
            var memberSymbol: PullTypeSymbol;

            if (!this._enclosedTypeNameCache) {
                return null;
            }

            memberSymbol = this._enclosedTypeNameCache[name];

            if (memberSymbol && kind != PullElementKind.None) {
                memberSymbol = ((memberSymbol.kind & kind) != 0) ? memberSymbol : null;
            }

            return memberSymbol;
        }

        public getAllMembers(searchDeclKind: PullElementKind, includePrivate: boolean): PullSymbol[] {

            var allMembers: PullSymbol[] = [];

            var i = 0;
            var j = 0;
            var m = 0;
            var n = 0;

            // Add members
            if (this._members != sentinelEmptyArray) {

                for (var i = 0, n = this._members.length; i < n; i++) {
                    var member = this._members[i];
                    if ((member.kind & searchDeclKind) && (includePrivate || !member.hasFlag(PullElementFlags.Private))) {
                        allMembers[allMembers.length] = member;
                    }
                }
            }

            // Add parent members
            if (this._extendedTypes) {

                for (var i = 0 , n = this._extendedTypes.length; i < n; i++) {
                    var extendedMembers = this._extendedTypes[i].getAllMembers(searchDeclKind, includePrivate);

                    for (var j = 0 , m = extendedMembers.length; j < m; j++) {
                        var extendedMember = extendedMembers[j];
                        if (!(this._memberNameCache && this._memberNameCache[extendedMember.name])) {
                            allMembers[allMembers.length] = extendedMember;
                        }
                    }
                }
            }

            if (this.isContainer() && this._enclosedMemberTypes) {
                for (var i = 0; i < this._enclosedMemberTypes.length; i++) {
                    allMembers[allMembers.length] = this._enclosedMemberTypes[i];
                }
            }

            return allMembers;
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            if (!this._typeParameterNameCache) {
                return null;
            }

            return this._typeParameterNameCache[name];
        }

        public setResolved() {
            super.setResolved();
        }

        public invalidate() {

            if (this._constructorMethod) {
                this._constructorMethod.invalidate();
            }
            
            this._knownBaseTypeCount = 0;

            super.invalidate();
        }

        public getNamePartForFullName() {
            var name = super.getNamePartForFullName();

            var typars = this.getTypeArguments();
            if (!typars || !typars.length) {
                typars = this.getTypeParameters();
            }

            var typarString = PullSymbol.getTypeParameterString(typars, this, /*useConstraintInName:*/ true);
            return name + typarString;
        }

        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.getScopedNameEx(scopeSymbol, useConstraintInName).toString();
        }

        public isNamedTypeSymbol() {
            if (this.isArray()) {
                return false;
            }

            var kind = this.kind;
            if (kind === PullElementKind.Primitive || // primitives
            kind === PullElementKind.Class || // class
            kind === PullElementKind.Container || // module
            kind === PullElementKind.DynamicModule || // dynamic module
            kind === PullElementKind.TypeAlias || // dynamic module
            kind === PullElementKind.Enum || // enum
            kind === PullElementKind.TypeParameter || //TypeParameter
            ((kind === PullElementKind.Interface || kind === PullElementKind.ObjectType) && this.name != "")) {
                return true;
            }

            return false;
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var s = this.getScopedNameEx(scopeSymbol, useConstraintInName).toString();
            return s;
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean) {

            if (this.isArray()) {
                var elementMemberName = this._elementType ?
                    (this._elementType.isArray() || this._elementType.isNamedTypeSymbol() ?
                    this._elementType.getScopedNameEx(scopeSymbol, false, getPrettyTypeName, getTypeParamMarkerInfo) :
                    this._elementType.getMemberTypeNameEx(false, scopeSymbol, getPrettyTypeName)) :
                    MemberName.create("any");
                return MemberName.create(elementMemberName, "", "[]");
            }

            if (!this.isNamedTypeSymbol()) {
                return this.getMemberTypeNameEx(true, scopeSymbol, getPrettyTypeName);
            }

            var builder = new MemberNameArray();
            builder.prefix = super.getScopedName(scopeSymbol, useConstraintInName);

            var typars = this.getTypeArguments();
            if (!typars || !typars.length) {
                typars = this.getTypeParameters();
            }

            builder.add(PullSymbol.getTypeParameterStringEx(typars, scopeSymbol, getTypeParamMarkerInfo, useConstraintInName));

            return builder;
        }

        public hasOnlyOverloadCallSignatures() {
            var members = this.getMembers();
            var callSignatures = this.getCallSignatures();
            var constructSignatures = this.getConstructSignatures();
            return members.length === 0 && constructSignatures.length === 0 && callSignatures.length > 1;
        }

        private getMemberTypeNameEx(topLevel: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): MemberName {
            var members = this.getMembers();
            var callSignatures = this.getCallSignatures();
            var constructSignatures = this.getConstructSignatures();
            var indexSignatures = this.getIndexSignatures();

            if (members.length > 0 || callSignatures.length > 0 || constructSignatures.length > 0 || indexSignatures.length > 0) {
                if (this.inMemberTypeNameEx) {
                    var associatedContainerType = this.getAssociatedContainerType();
                    if (associatedContainerType && associatedContainerType.isNamedTypeSymbol()) {
                        var nameForTypeOf = associatedContainerType.getScopedNameEx(scopeSymbol);
                        return MemberName.create(nameForTypeOf, "typeof ", "");
                    } else {
                        // If recursive without type name(possible?) default to any
                        return MemberName.create("any");
                    }
                }

                this.inMemberTypeNameEx = true;

                var allMemberNames = new MemberNameArray();
                var curlies = !topLevel || indexSignatures.length != 0;
                var delim = "; ";
                for (var i = 0; i < members.length; i++) {
                    if (members[i].kind == PullElementKind.Method && members[i].type.hasOnlyOverloadCallSignatures()) {
                        // Add all Call signatures of the method
                        var methodCallSignatures = members[i].type.getCallSignatures();
                        var nameStr = members[i].getDisplayName(scopeSymbol) + (members[i].isOptional ? "?" : "");;
                        var methodMemberNames = PullSignatureSymbol.getSignaturesTypeNameEx(methodCallSignatures, nameStr, false, false, scopeSymbol);
                        allMemberNames.addAll(methodMemberNames);
                    } else {
                        var memberTypeName = members[i].getNameAndTypeNameEx(scopeSymbol);
                        if (memberTypeName.isArray() && (<MemberNameArray>memberTypeName).delim === delim) {
                            allMemberNames.addAll((<MemberNameArray>memberTypeName).entries);
                        } else {
                            allMemberNames.add(memberTypeName);
                        }
                    }
                    curlies = true;
                }

                // Use pretty Function overload signature if this is just a call overload
                var getPrettyFunctionOverload = getPrettyTypeName && !curlies && this.hasOnlyOverloadCallSignatures();

                var signatureCount = callSignatures.length + constructSignatures.length + indexSignatures.length;
                var useShortFormSignature = !curlies && (signatureCount === 1);
                var signatureMemberName: MemberName[];

                if (callSignatures.length > 0) {
                    signatureMemberName =
                    PullSignatureSymbol.getSignaturesTypeNameEx(callSignatures, "", useShortFormSignature, false, scopeSymbol, getPrettyFunctionOverload);
                    allMemberNames.addAll(signatureMemberName);
                }

                if (constructSignatures.length > 0) {
                    signatureMemberName =
                    PullSignatureSymbol.getSignaturesTypeNameEx(constructSignatures, "new", useShortFormSignature, false, scopeSymbol);
                    allMemberNames.addAll(signatureMemberName);
                }

                if (indexSignatures.length > 0) {
                    signatureMemberName =
                    PullSignatureSymbol.getSignaturesTypeNameEx(indexSignatures, "", useShortFormSignature, true, scopeSymbol);
                    allMemberNames.addAll(signatureMemberName);
                }

                if ((curlies) || (!getPrettyFunctionOverload && (signatureCount > 1) && topLevel)) {
                    allMemberNames.prefix = "{ ";
                    allMemberNames.suffix = "}";
                    allMemberNames.delim = delim;
                } else if (allMemberNames.entries.length > 1) {
                    allMemberNames.delim = delim;
                }

                this.inMemberTypeNameEx = false;

                return allMemberNames;

            }

            return MemberName.create("{}");
        }

        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean {
            var isVisible = super.isExternallyVisible(inIsExternallyVisibleSymbols);
            if (isVisible) {
                // Get type parameters
                var typars = this.getTypeArguments();
                if (!typars || !typars.length) {
                    typars = this.getTypeParameters();
                }

                if (typars) {
                    // If any of the type parameter is not visible the type is invisible
                    for (var i = 0; i < typars.length; i++) {
                        isVisible = PullSymbol.getIsExternallyVisible(typars[i], this, inIsExternallyVisibleSymbols);
                        if (!isVisible) {
                            break;
                        }
                    }
                }
            }

            return isVisible;
        }
    }

    export class PullPrimitiveTypeSymbol extends PullTypeSymbol {
        constructor(name: string) {
            super(name, PullElementKind.Primitive);

            this.isResolved = true;
        }

        public isStringConstant() { return false; }

        public isFixed() {
            return true;
        }

        public invalidate() {
            // do nothing...
        }
    }

    export class PullStringConstantTypeSymbol extends PullPrimitiveTypeSymbol {
        constructor(name: string) {
            super(name);
        }

        public isStringConstant() {
            return true;
        }
    }

    export class PullErrorTypeSymbol extends PullPrimitiveTypeSymbol {

        constructor(private diagnostic: Diagnostic, public delegateType: PullTypeSymbol, private _data: any = null) {
            super("error");

            this.isResolved = true;
        }

        public isError() {
            return true;
        }

        public getDiagnostic() {
            return this.diagnostic;
        }

        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.delegateType.getName(scopeSymbol, useConstraintInName);
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.delegateType.getDisplayName(scopeSymbol, useConstraintInName);
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            return this.delegateType.toString(scopeSymbol, useConstraintInName);
        }

        public setData(data: any) {
            this._data = data;
        }

        public getData(): any {
            return this._data;
        }
    }

    // represents the module "namespace" type
    export class PullContainerTypeSymbol extends PullTypeSymbol {
        public instanceSymbol: PullSymbol = null;

        private assignedValue: PullSymbol = null;
        private assignedType: PullTypeSymbol = null;
        private assignedContainer: PullContainerTypeSymbol = null;

        constructor(name: string, kind = PullElementKind.Container) {
            super(name, kind);
        }

        public isContainer() { return true; }

        public setInstanceSymbol(symbol: PullSymbol) {
            this.instanceSymbol = symbol;
        }

        public getInstanceSymbol(): PullSymbol {
            return this.instanceSymbol;
        }

        public invalidate() {

            if (this.instanceSymbol) {
                this.instanceSymbol.invalidate();
            }

            super.invalidate();
        }

        public setExportAssignedValueSymbol(symbol: PullSymbol) {
            this.assignedValue = symbol; 
        }
        public getExportAssignedValueSymbol() {
            return this.assignedValue;
        }

        public setExportAssignedTypeSymbol(type: PullTypeSymbol) {
            this.assignedType = type;
        }

        public getExportAssignedTypeSymbol() {
            return this.assignedType;
        }

        public setExportAssignedContainerSymbol(container: PullContainerTypeSymbol) {
            this.assignedContainer = container;
        }

        public getExportAssignedContainerSymbol() {
            return this.assignedContainer;
        }

        public resetExportAssignedSymbols() {
            this.assignedValue = null;
            this.assignedType = null;
            this.assignedContainer = null;
        }

        static usedAsSymbol(containerSymbol: PullSymbol, symbol: PullSymbol): boolean {
            if (!containerSymbol || !containerSymbol.isContainer()) {
                return false;
            }

            if (!containerSymbol.isAlias() && containerSymbol.type == symbol) {
                return true;
            }

            var containerTypeSymbol = <PullContainerTypeSymbol>containerSymbol;
            var valueExportSymbol = containerTypeSymbol.getExportAssignedValueSymbol();
            var typeExportSymbol = containerTypeSymbol.getExportAssignedTypeSymbol();
            var containerExportSymbol = containerTypeSymbol.getExportAssignedContainerSymbol();
            if (valueExportSymbol || typeExportSymbol || containerExportSymbol) {
                return valueExportSymbol == symbol || typeExportSymbol == symbol || containerExportSymbol == symbol || PullContainerTypeSymbol.usedAsSymbol(containerExportSymbol, symbol);
            }

            return false;
        }

        public getInstanceType() {
            return this.instanceSymbol ? this.instanceSymbol.type : null;
        }
    }

    export class PullTypeAliasSymbol extends PullTypeSymbol {
        public assignedValue: PullSymbol = null;
        public assignedType: PullTypeSymbol = null;
        public assignedContainer: PullContainerTypeSymbol = null;

        public isUsedAsValue = false;
        public typeUsedExternally = false;
        private retrievingExportAssignment = false;

        constructor(name: string) {
            super(name, PullElementKind.TypeAlias);
        }

        public isAlias() { return true; }
        public isContainer() { return true; }

        public setAssignedValueSymbol(symbol: PullSymbol): void {
            this.assignedValue = symbol;
        }

        public getExportAssignedValueSymbol(): PullSymbol {
            if (this.assignedValue) {
                return this.assignedValue;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.assignedContainer) {
                this.retrievingExportAssignment = true;
                var sym = this.assignedContainer.getExportAssignedValueSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public setAssignedTypeSymbol(type: PullTypeSymbol): void {
            this.assignedType = type;
        }

        public getExportAssignedTypeSymbol(): PullTypeSymbol {
            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.assignedType) {
                if (this.assignedType.isAlias()) {
                    this.retrievingExportAssignment = true;
                    var sym = (<PullTypeAliasSymbol>this.assignedType).getExportAssignedTypeSymbol();
                    this.retrievingExportAssignment = false;
                } else if (this.assignedType != this.assignedContainer) {
                    return this.assignedType;
                }
            }

            if (this.assignedContainer) {
                this.retrievingExportAssignment = true;
                var sym = this.assignedContainer.getExportAssignedTypeSymbol();
                this.retrievingExportAssignment = false;
                if (sym) {
                    return sym;
                }
            }

            return this.assignedContainer;
        }

        public setAssignedContainerSymbol(container: PullContainerTypeSymbol): void {
            this.assignedContainer = container;
        }

        public getExportAssignedContainerSymbol(): PullContainerTypeSymbol {
            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.assignedContainer) {
                this.retrievingExportAssignment = true;
                var sym = this.assignedContainer.getExportAssignedContainerSymbol();
                this.retrievingExportAssignment = false;
                if (sym) {
                    return sym;
                }
            }

            return this.assignedContainer;
        }

        public getMembers(): PullSymbol[]{
            if (this.assignedType) {
                return this.assignedType.getMembers();
            }

            return sentinelEmptyArray;
        }

        public getCallSignatures(): PullSignatureSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getCallSignatures();
            }

            return sentinelEmptyArray;
        }

        public getConstructSignatures(): PullSignatureSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getConstructSignatures();
            }

            return sentinelEmptyArray;
        }

        public getIndexSignatures(): PullSignatureSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getIndexSignatures();
            }

            return sentinelEmptyArray;
        }

        public findMember(name: string): PullSymbol {
            if (this.assignedType) {
                return this.assignedType.findMember(name);
            }

            return null;
        }

        public findNestedType(name: string): PullTypeSymbol {
            if (this.assignedType) {
                return this.assignedType.findNestedType(name);
            }

            return null;
        }

        public getAllMembers(searchDeclKind: PullElementKind, includePrivate: boolean): PullSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getAllMembers(searchDeclKind, includePrivate);
            }

            return sentinelEmptyArray;
        }

        public invalidate() {
            this.isUsedAsValue = false;

            super.invalidate();
        }
    }

    export class PullDefinitionSignatureSymbol extends PullSignatureSymbol {
        public isDefinition() { return true; }
    }

    export class PullTypeParameterSymbol extends PullTypeSymbol {
        private _constraint: PullTypeSymbol = null;

        constructor(name: string, private _isFunctionTypeParameter: boolean) {
            super(name, PullElementKind.TypeParameter);
        }

        public isTypeParameter() { return true; }
        public isFunctionTypeParameter() { return this._isFunctionTypeParameter; }

        public isFixed() { return false; }

        public setConstraint(constraintType: PullTypeSymbol) {
            this._constraint = constraintType;
        }

        public getConstraint(): PullTypeSymbol {
            return this._constraint;
        }

        public isGeneric() { return true; }

        public fullName(scopeSymbol?: PullSymbol) {
            var name = this.getDisplayName(scopeSymbol);
            var container = this.getContainer();
            if (container) {
                var containerName = container.fullName(scopeSymbol);
                name = name + " in " + containerName;
            }

            return name;
        }

        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {

            var name = super.getName(scopeSymbol);

            if (this.isPrinting) {
                return name;
            }

            this.isPrinting = true;         

            if (useConstraintInName && this._constraint) {
                name += " extends " + this._constraint.toString(scopeSymbol);
            }

            this.isPrinting = false;
        
            return name;
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {

            var name = super.getDisplayName(scopeSymbol, useConstraintInName);

            if (this.isPrinting) {
                return name;
            }

            this.isPrinting = true;

            if (useConstraintInName && this._constraint) {
                name += " extends " + this._constraint.toString(scopeSymbol);
            }

            this.isPrinting = false;
            
            return name;
        }

        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean {
            var constraint = this.getConstraint();
            if (constraint) {
                return PullSymbol.getIsExternallyVisible(constraint, this, inIsExternallyVisibleSymbols);
            }

            return true;          
        }
    }

    // transient type variables...
    export class PullTypeVariableSymbol extends PullTypeParameterSymbol {

        constructor(name: string, isFunctionTypeParameter: boolean) {
            super(name, isFunctionTypeParameter);
        }

        private tyvarID =  globalTyvarID++;

        public isTypeParameter() { return true; }
        public isTypeVariable() { return true; }
    }

    export class PullAccessorSymbol extends PullSymbol {

        private _getterSymbol: PullSymbol = null;
        private _setterSymbol: PullSymbol = null;

        constructor(name: string) {
            super(name, PullElementKind.Property);
        }

        public isAccessor() { return true; }

        public setSetter(setter: PullSymbol) {
            if (!setter) {
                return;
            }

            this._setterSymbol = setter;

            setter.setAccessorSymbol(this);
        }

        public getSetter(): PullSymbol {
            return this._setterSymbol;
        }

        public setGetter(getter: PullSymbol) {
            if (!getter) {
                return;
            }

            this._getterSymbol = getter;

            getter.setAccessorSymbol(this);
        }

        public getGetter(): PullSymbol {
            return this._getterSymbol;
        }

        public invalidate() {
            if (this._getterSymbol) {
                this._getterSymbol.invalidate();
            }

            if (this._setterSymbol) {
                this._setterSymbol.invalidate();
            }

            super.invalidate();
        }
    }

    export function typeWrapsTypeParameter(type: PullTypeSymbol, typeParameter: PullTypeParameterSymbol) {

        if (type.isTypeParameter()) {
            return type == typeParameter;
        }

        var typeArguments = type.getTypeArguments();

        if (typeArguments) {
            for (var i = 0; i < typeArguments.length; i++) {
                if (typeWrapsTypeParameter(typeArguments[i], typeParameter)) {
                    return true;
                }
            }
        }

        return false;
    }

    export function getRootType(typeToSpecialize: PullTypeSymbol) {
        var decl = typeToSpecialize.getDeclarations()[0];

        if (!typeToSpecialize.isGeneric()) {
            return typeToSpecialize;
        }

        return (typeToSpecialize.kind & (PullElementKind.Class | PullElementKind.Interface)) ? <PullTypeSymbol>decl.getSymbol().type : typeToSpecialize;
    }

    export var nSpecializationsCreated = 0;
    export var nSpecializedSignaturesCreated = 0;

    export function shouldSpecializeTypeParameterForTypeParameter(specialization: PullTypeParameterSymbol, typeToSpecialize: PullTypeParameterSymbol) {
        if (specialization == typeToSpecialize) {
            return false;
        }

        if (!(specialization.isTypeParameter() && typeToSpecialize.isTypeParameter())) {
            return true;
        }

        var parent = specialization.getDeclarations()[0].getParentDecl();
        var targetParent = typeToSpecialize.getDeclarations()[0].getParentDecl();

        // if they share a parent, it's fine to specialize
        if (parent == targetParent) {
            return true;
        }

        // if the target parent encloses the specialization type, we don't want to specialize
        while (parent) {
            if (parent.flags & PullElementFlags.Static) {
                return true;
            }

            if (parent == targetParent) {
                return false;
            }

            parent = parent.getParentDecl();
        }

        return true;
    }

    export function specializeType(typeToSpecialize: PullTypeSymbol, typeArguments: PullTypeSymbol[], resolver: PullTypeResolver, enclosingDecl: PullDecl, context: PullTypeResolutionContext, ast?: AST): PullTypeSymbol {

        if (typeToSpecialize.isPrimitive() || !typeToSpecialize.isGeneric()) {
            return typeToSpecialize;
        }

        var searchForExistingSpecialization = typeArguments != null;

        if (typeArguments === null || (context.specializingToAny && typeArguments.length)) {
            typeArguments = [];
        }

        if (typeToSpecialize.isTypeParameter()) {

            if (context.specializingToAny) {
                return resolver.semanticInfoChain.anyTypeSymbol;
            }

            var substitution = context.findSpecializationForType(typeToSpecialize);

            if (substitution != typeToSpecialize) {

                if (shouldSpecializeTypeParameterForTypeParameter(<PullTypeParameterSymbol>substitution, <PullTypeParameterSymbol>typeToSpecialize)) {
                    return substitution;
                }
            }

            if (typeArguments && typeArguments.length) {
                if (shouldSpecializeTypeParameterForTypeParameter(<PullTypeParameterSymbol>typeArguments[0], <PullTypeParameterSymbol>typeToSpecialize)) {
                    return typeArguments[0];
                }
            }

            return typeToSpecialize;
        }

        // In this case, we have an array type that may have been specialized to a type variable
        if (typeToSpecialize.isArray()) {

            if (typeToSpecialize.currentlyBeingSpecialized()) {
                return typeToSpecialize;
            }

            var newElementType: PullTypeSymbol = null;

            if (!context.specializingToAny) {
                var elementType = typeToSpecialize.getElementType();

                newElementType = specializeType(elementType, typeArguments, resolver, enclosingDecl, context, ast);
            }
            else {
                newElementType = resolver.semanticInfoChain.anyTypeSymbol;
            }

            // we re-specialize so that we can re-use any cached array type symbols
            var newArrayType = specializeType(resolver.getCachedArrayType(), [newElementType], resolver, enclosingDecl, context);

            return newArrayType;
        }     

        var typeParameters = typeToSpecialize.getTypeParameters();

        // if we don't have the complete list of types to specialize to, we'll need to reconstruct the specialization signature
        if (!context.specializingToAny && searchForExistingSpecialization && (typeParameters.length > typeArguments.length)) {
            searchForExistingSpecialization = false;
        }

        var newType: PullTypeSymbol = null;

        var newTypeDecl = typeToSpecialize.getDeclarations()[0];

        var rootType: PullTypeSymbol = getRootType(typeToSpecialize);

        var isArray = typeToSpecialize === resolver.getCachedArrayType() || typeToSpecialize.isArray();

        if (searchForExistingSpecialization || context.specializingToAny || typeToSpecialize.hasRecursiveSpecializationError) {
            if (!typeArguments.length || context.specializingToAny || typeToSpecialize.hasRecursiveSpecializationError) {
                for (var i = 0; i < typeParameters.length; i++) {
                    typeArguments[i] = resolver.semanticInfoChain.anyTypeSymbol;
                }
            }

            if (isArray) {
                newType = typeArguments[0].getArrayType();
            }
            else if (typeArguments.length) {
                newType = rootType.getSpecialization(typeArguments);
            }
            
            if (!newType && !typeParameters.length && context.specializingToAny) {
                newType = rootType.getSpecialization([resolver.semanticInfoChain.anyTypeSymbol]);
            }
            
            for (var i = 0; i < typeArguments.length; i++) {
                if (!typeArguments[i].isTypeParameter() && (typeArguments[i] == rootType || typeWrapsTypeParameter(typeArguments[i], typeParameters[i]))) {
                    declAST = resolver.semanticInfoChain.getASTForDecl(newTypeDecl);
                    if (declAST && typeArguments[i] != resolver.getCachedArrayType()) {
                        diagnostic = context.postError(enclosingDecl.getScriptName(), declAST.minChar, declAST.getLength(), DiagnosticCode.A_generic_type_may_not_reference_itself_with_a_wrapped_form_of_its_own_type_parameters, null, enclosingDecl);
                        typeToSpecialize.hasRecursiveSpecializationError = true;
                        return resolver.getNewErrorTypeSymbol(diagnostic);
                    }
                    else {
                        return resolver.semanticInfoChain.anyTypeSymbol;
                    }
                }
            }
        }
        else {
            var knownTypeArguments = typeToSpecialize.getTypeArguments();
            var typesToReplace = knownTypeArguments ? knownTypeArguments : typeParameters;
            var diagnostic: Diagnostic;
            var declAST: AST;

            for (var i = 0; i < typesToReplace.length; i++) {

                if (!typesToReplace[i].isTypeParameter() && (typeArguments[i] == rootType || typeWrapsTypeParameter(typesToReplace[i], typeParameters[i]))) {
                    declAST = resolver.semanticInfoChain.getASTForDecl(newTypeDecl);
                    if (declAST && typeArguments[i] != resolver.getCachedArrayType()) {
                        diagnostic = context.postError(enclosingDecl.getScriptName(), declAST.minChar, declAST.getLength(), DiagnosticCode.A_generic_type_may_not_reference_itself_with_a_wrapped_form_of_its_own_type_parameters, null, enclosingDecl);
                        typeToSpecialize.hasRecursiveSpecializationError = true;
                        return resolver.getNewErrorTypeSymbol(diagnostic);
                    }
                    else {
                        return resolver.semanticInfoChain.anyTypeSymbol;
                    }
                }

                substitution = specializeType(typesToReplace[i], null, resolver, enclosingDecl, context, ast);

                typeArguments[i] = substitution != null ? substitution : typesToReplace[i];
            }
            
            newType = rootType.getSpecialization(typeArguments);            
        }

        // check to see if this is a recursive specialization while resolving the root type
        // E.g.,
        //
        // interface Array<T> {
        //     p: Array<T>; <- This is really just the declaration
        // }
        //
        var rootTypeParameters = rootType.getTypeParameters();

        if (rootTypeParameters.length && (rootTypeParameters.length == typeArguments.length)) {
            for (var i = 0; i < typeArguments.length; i++) {
                if (typeArguments[i] != rootTypeParameters[i]) {
                    break;
                }
            }

            if (i == rootTypeParameters.length) {
                return rootType;
            }
        }   

        if (newType) {
            if (!newType.isResolved && !newType.currentlyBeingSpecialized()) {
                //typeToSpecialize.invalidateSpecializations();
            }
            else {
                return newType;
            }
        }
        
        var prevInSpecialization = context.inSpecialization;
        context.inSpecialization = true;

        if (!newType) {
            nSpecializationsCreated++;

            newType = typeToSpecialize.isClass() ? new PullTypeSymbol(typeToSpecialize.name, PullElementKind.Class) :
                                                    isArray ? new PullTypeSymbol("Array", PullElementKind.Array) :
                                                        typeToSpecialize.isTypeParameter() ? // watch out for replacing one tyvar with another
                                                            new PullTypeVariableSymbol(typeToSpecialize.name, (<PullTypeParameterSymbol>typeToSpecialize).isFunctionTypeParameter()) :
                                                                new PullTypeSymbol(typeToSpecialize.name, typeToSpecialize.kind);
            newType.setRootSymbol(rootType);
        }

        newType.setIsBeingSpecialized();

        newType.setTypeArguments(typeArguments);

        newType.hasRecursiveSpecializationError = typeToSpecialize.hasRecursiveSpecializationError;

        rootType.addSpecialization(newType, typeArguments);

        if (isArray) {
            newType.setElementType(typeArguments[0]);
            typeArguments[0].setArrayType(newType);
        }

        if (typeToSpecialize.currentlyBeingSpecialized()) {
            return newType;
        }

        // If it's a constructor, we want to flag the type as being specialized
        // to prevent stack overflows when specializing the return type
        var prevCurrentlyBeingSpecialized = typeToSpecialize.currentlyBeingSpecialized();
        if (typeToSpecialize.kind == PullElementKind.ConstructorType) {
            typeToSpecialize.setIsBeingSpecialized();
        }

        // create the type replacement map

        var typeReplacementMap: any = {};

        for (var i = 0; i < typeParameters.length; i++) {
            if (typeParameters[i] != typeArguments[i]) {
                typeReplacementMap[typeParameters[i].pullSymbolIDString] = typeArguments[i];
            }
            newType.addTypeParameter(typeParameters[i]);
        }

        // specialize any extends/implements types
        var extendedTypesToSpecialize = typeToSpecialize.getExtendedTypes();
        var typeDecl: PullDecl;
        var typeAST: TypeDeclaration;
        var unitPath: string;
        var decls: PullDecl[] = typeToSpecialize.getDeclarations();
        var extendTypeSymbol: PullTypeSymbol = null;
        var implementedTypeSymbol: PullTypeSymbol = null;

        if (extendedTypesToSpecialize.length) {
            for (var i = 0; i < decls.length; i++) {
                typeDecl = decls[i];
                typeAST = <TypeDeclaration>resolver.semanticInfoChain.getASTForDecl(typeDecl);

                // if this is an 'extended' interface declaration, the AST's extends list may not match
                if (typeAST.extendsList) {
                    unitPath = resolver.getUnitPath();
                    resolver.setUnitPath(typeDecl.getScriptName());
                    for (var j = 0; j < typeAST.extendsList.members.length; j++) {
                        context.pushTypeSpecializationCache(typeReplacementMap);
                        extendTypeSymbol = resolver.resolveTypeReference(new TypeReference(typeAST.extendsList.members[j], 0), typeDecl, context);
                        resolver.setUnitPath(unitPath);
                        context.popTypeSpecializationCache();

                        newType.addExtendedType(extendTypeSymbol);
                    }
                }
            }
        }

        var implementedTypesToSpecialize = typeToSpecialize.getImplementedTypes();

        if (implementedTypesToSpecialize.length) {
            for (var i = 0; i < decls.length; i++) {
                typeDecl = decls[i];
                typeAST = <TypeDeclaration>resolver.semanticInfoChain.getASTForDecl(typeDecl);

                if (typeAST.implementsList) {
                    unitPath = resolver.getUnitPath();
                    resolver.setUnitPath(typeDecl.getScriptName());
                    for (var j = 0; j < typeAST.implementsList.members.length; j++) {
                        context.pushTypeSpecializationCache(typeReplacementMap);
                        implementedTypeSymbol = resolver.resolveTypeReference(new TypeReference(typeAST.implementsList.members[j], 0), typeDecl, context);
                        resolver.setUnitPath(unitPath);
                        context.popTypeSpecializationCache();

                        newType.addImplementedType(implementedTypeSymbol);
                    }
                }
            }
        }

        var callSignatures = typeToSpecialize.getCallSignatures(false);
        var constructSignatures = typeToSpecialize.getConstructSignatures(false);
        var indexSignatures = typeToSpecialize.getIndexSignatures(false);
        var members = typeToSpecialize.getMembers();

        // specialize call signatures
        var newSignature: PullSignatureSymbol;
        var placeHolderSignature: PullSignatureSymbol;
        var signature: PullSignatureSymbol;

        var decl: PullDecl = null;
        var declAST: AST = null;
        var parameters: PullSymbol[];
        var newParameters: PullSymbol[];
        var returnType: PullTypeSymbol = null;
        var prevSpecializationSignature: PullSignatureSymbol = null;

        for (var i = 0; i < callSignatures.length; i++) {
            signature = callSignatures[i];

            if (!signature.currentlyBeingSpecialized()) {

                context.pushTypeSpecializationCache(typeReplacementMap);

                decl = signature.getDeclarations()[0];
                unitPath = resolver.getUnitPath();
                resolver.setUnitPath(decl.getScriptName());

                newSignature = new PullSignatureSymbol(signature.kind);
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Call signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);

                // if the signature is not yet specialized, specialize the signature using an empty context first - that way, no type parameters
                // will be accidentally specialized
                if (!(signature.isResolved || signature.inResolution)) {
                    resolver.resolveDeclaredSymbol(signature, enclosingDecl, new PullTypeResolutionContext());
                }   

                resolver.resolveAST(declAST, false, newTypeDecl, context, true);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.parameters;
                newParameters = newSignature.parameters;

                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].type = parameters[p].type;
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.returnType;

                if (!returnType) {
                    newSignature.returnType = signature.returnType;
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                placeHolderSignature = newSignature;
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

                if (newSignature != placeHolderSignature) {
                    newSignature.setRootSymbol(signature);
                }

                context.popTypeSpecializationCache();

                if (!newSignature) {
                    context.inSpecialization = prevInSpecialization;
                    typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
                    Debug.assert(false, "returning from call");
                    return resolver.semanticInfoChain.anyTypeSymbol;
                }
            }
            else {
                newSignature = signature;
            }          

            newType.addCallSignature(newSignature);

            if (newSignature.hasAGenericParameter) {
                newType.setHasGenericSignature();
            }
        }

        // specialize construct signatures
        for (var i = 0; i < constructSignatures.length; i++) {
            signature = constructSignatures[i];

            if (!signature.currentlyBeingSpecialized()) {

                context.pushTypeSpecializationCache(typeReplacementMap);

                decl = signature.getDeclarations()[0];
                unitPath = resolver.getUnitPath();
                resolver.setUnitPath(decl.getScriptName());

                newSignature = new PullSignatureSymbol(signature.kind);
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Construct signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);

                if (!(signature.isResolved || signature.inResolution)) {
                    resolver.resolveDeclaredSymbol(signature, enclosingDecl, new PullTypeResolutionContext());
                } 

                resolver.resolveAST(declAST, false, newTypeDecl, context, true);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.parameters;
                newParameters = newSignature.parameters;

                // we need to clone the parameter types, but the return type
                // was set during resolution
                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].type = parameters[p].type;
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.returnType;

                if (!returnType) {
                    newSignature.returnType = signature.returnType;
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                placeHolderSignature = newSignature;
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

                if (newSignature != placeHolderSignature) {
                    newSignature.setRootSymbol(signature);
                }

                context.popTypeSpecializationCache();

                if (!newSignature) {
                    context.inSpecialization = prevInSpecialization;
                    typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
                    Debug.assert(false, "returning from construct");
                    return resolver.semanticInfoChain.anyTypeSymbol;
                }
            }
            else {
                newSignature = signature;
            }   

            newType.addConstructSignature(newSignature);

            if (newSignature.hasAGenericParameter) {
                newType.setHasGenericSignature();
            }
        }

        // specialize index signatures
        for (var i = 0; i < indexSignatures.length; i++) {
            signature = indexSignatures[i];

            if (!signature.currentlyBeingSpecialized()) {                

                context.pushTypeSpecializationCache(typeReplacementMap);

                decl = signature.getDeclarations()[0];
                unitPath = resolver.getUnitPath();
                resolver.setUnitPath(decl.getScriptName());

                newSignature = new PullSignatureSymbol(signature.kind);
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Index signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);

                if (!(signature.isResolved || signature.inResolution)) {
                    resolver.resolveDeclaredSymbol(signature, enclosingDecl, new PullTypeResolutionContext());
                } 

                resolver.resolveAST(declAST, false, newTypeDecl, context, true);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.parameters;
                newParameters = newSignature.parameters;

                // we need to clone the parameter types, but the return type
                // was set during resolution
                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].type = parameters[p].type;
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.returnType;

                if (!returnType) {
                    newSignature.returnType = signature.returnType;
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                placeHolderSignature = newSignature;
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

                if (newSignature != placeHolderSignature) {
                    newSignature.setRootSymbol(signature);
                }

                context.popTypeSpecializationCache();

                if (!newSignature) {
                    context.inSpecialization = prevInSpecialization;
                    typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
                    Debug.assert(false, "returning from index");
                    return resolver.semanticInfoChain.anyTypeSymbol;
                }
            }
            else {
                newSignature = signature;
            }   
            
            newType.addIndexSignature(newSignature);

            if (newSignature.hasAGenericParameter) {
                newType.setHasGenericSignature();
            }
        }        

        // specialize members

        var field: PullSymbol = null;
        var newField: PullSymbol = null;

        var fieldType: PullTypeSymbol = null;
        var newFieldType: PullTypeSymbol = null;
        var replacementType: PullTypeSymbol = null;

        var fieldSignatureSymbol: PullSignatureSymbol = null;

        for (var i = 0; i < members.length; i++) {
            field = members[i];
            field.setIsBeingSpecialized();

            decls = field.getDeclarations();

            newField = new PullSymbol(field.name, field.kind);

            newField.setRootSymbol(field);

            if (field.isOptional) {
                newField.isOptional = true;
            }

            if (!field.isResolved) {
                resolver.resolveDeclaredSymbol(field, newTypeDecl, context);
            }            

            fieldType = field.type;

            if (!fieldType) {
                fieldType = newType; 
            }

            replacementType = <PullTypeSymbol>typeReplacementMap[fieldType.pullSymbolIDString];

            if (replacementType) {
                newField.type = replacementType;
            }
            else {
                // re-resolve all field decls using the current replacements
                if (fieldType.isGeneric() && !fieldType.isFixed()) {
                    unitPath = resolver.getUnitPath();
                    resolver.setUnitPath(decls[0].getScriptName());

                    context.pushTypeSpecializationCache(typeReplacementMap);

                    newFieldType = specializeType(fieldType, !fieldType.getIsSpecialized() ? typeArguments : null, resolver, newTypeDecl, context, ast);

                    resolver.setUnitPath(unitPath);

                    context.popTypeSpecializationCache();

                    newField.type = newFieldType;
                }
                else {
                    newField.type = fieldType;
                }
            }
            field.setIsSpecialized();
            newType.addMember(newField);
        }

        // specialize the constructor and statics, if need be
        if (typeToSpecialize.isClass()) {
            var constructorMethod = typeToSpecialize.getConstructorMethod();

            // If we haven't yet resolved the constructor method, we need to resolve it *without* substituting
            // for any type variables, so as to avoid accidentally specializing the root declaration
            if (!constructorMethod.isResolved) {
                var prevIsSpecializingConstructorMethod = context.isSpecializingConstructorMethod;
                context.isSpecializingConstructorMethod = true;
                resolver.resolveDeclaredSymbol(constructorMethod, enclosingDecl, context);
                context.isSpecializingConstructorMethod = prevIsSpecializingConstructorMethod;
            }

            var newConstructorMethod = new PullSymbol(constructorMethod.name, PullElementKind.ConstructorMethod);
            var newConstructorType = specializeType(constructorMethod.type, typeArguments, resolver, newTypeDecl, context, ast);

            newConstructorMethod.type = newConstructorType;

            var constructorDecls: PullDecl[] = constructorMethod.getDeclarations();

            newConstructorMethod.setRootSymbol(constructorMethod);

            newType.setConstructorMethod(newConstructorMethod);
        }

        newType.setIsSpecialized();

        newType.setResolved();
        typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
        context.inSpecialization = prevInSpecialization;
        return newType;
    }

    // PULLTODO: Replace typeReplacementMap with use of context
    export function specializeSignature(signature: PullSignatureSymbol,
        skipLocalTypeParameters: boolean,
        typeReplacementMap: any,
        typeArguments: PullTypeSymbol[],
        resolver: PullTypeResolver,
        enclosingDecl: PullDecl,
        context: PullTypeResolutionContext,
        ast?: AST): PullSignatureSymbol {

        if (signature.currentlyBeingSpecialized()) {
            return signature;
        }

        if (!signature.isResolved && !signature.inResolution) {
            resolver.resolveDeclaredSymbol(signature, enclosingDecl, context);
        }

        var newSignature = signature.getSpecialization(typeArguments);

        if (newSignature) {
            return newSignature;
        }

        signature.setIsBeingSpecialized();

        var prevInSpecialization = context.inSpecialization;
        context.inSpecialization = true;

        newSignature = new PullSignatureSymbol(signature.kind);
        nSpecializedSignaturesCreated++;
        newSignature.setRootSymbol(signature);

        if (signature.hasVarArgs) {
            newSignature.hasVarArgs = true;
        }

        if (signature.hasAGenericParameter) {
            newSignature.hasAGenericParameter = true;
        }

        signature.addSpecialization(newSignature, typeArguments);      

        var parameters = signature.parameters;
        var typeParameters = signature.getTypeParameters();
        var returnType = signature.returnType;

        for (var i = 0; i < typeParameters.length; i++) {
            newSignature.addTypeParameter(typeParameters[i]);
        }

        if (signature.hasAGenericParameter) {
            newSignature.hasAGenericParameter = true;
        }

        var newParameter: PullSymbol;
        var newParameterType: PullTypeSymbol;
        var newParameterElementType: PullTypeSymbol;
        var parameterType: PullTypeSymbol;
        var replacementParameterType: PullTypeSymbol;
        var localTypeParameters: any = new BlockIntrinsics();
        var localSkipMap: any = null;

        // if we specialize the signature recursive (through, say, the specialization of a method whilst specializing
        // its class), we need to prevent accidental specialization of type parameters that shadow type parameters in the
        // enclosing type.  (E.g., "class C<T> { public m<T>() {...} }" )
        if (skipLocalTypeParameters) {
            for (var i = 0; i < typeParameters.length; i++) {
                localTypeParameters[typeParameters[i].getName()] = true;
                if (!localSkipMap) {
                    localSkipMap = {};
                }
                localSkipMap[typeParameters[i].pullSymbolIDString] = typeParameters[i];
            }
        }

        context.pushTypeSpecializationCache(typeReplacementMap);

        if (skipLocalTypeParameters && localSkipMap) {
            context.pushTypeSpecializationCache(localSkipMap);
        }
        var newReturnType = (!localTypeParameters[returnType.name] /*&& typeArguments != null*/) ? specializeType(returnType, null/*typeArguments*/, resolver, enclosingDecl, context, ast) : returnType;
        if (skipLocalTypeParameters && localSkipMap) {
            context.popTypeSpecializationCache();
        }
        context.popTypeSpecializationCache();

        newSignature.returnType = newReturnType;

        for (var k = 0; k < parameters.length; k++) {

            newParameter = new PullSymbol(parameters[k].name, parameters[k].kind);
            newParameter.setRootSymbol(parameters[k]);

            parameterType = parameters[k].type;

            context.pushTypeSpecializationCache(typeReplacementMap);
            if (skipLocalTypeParameters && localSkipMap) {
                context.pushTypeSpecializationCache(localSkipMap);
            }
            newParameterType = !localTypeParameters[parameterType.name] ? specializeType(parameterType, null/*typeArguments*/, resolver, enclosingDecl, context, ast) : parameterType;
            if (skipLocalTypeParameters && localSkipMap) {
                context.popTypeSpecializationCache();
            }
            context.popTypeSpecializationCache();

            if (parameters[k].isOptional) {
                newParameter.isOptional = true;
            }

            if (parameters[k].isVarArg) {
                newParameter.isVarArg = true;
                newSignature.hasVarArgs = true;
            }

            if (resolver.isTypeArgumentOrWrapper(newParameterType)) {
                newSignature.hasAGenericParameter = true;
            }

            newParameter.type = newParameterType;
            newSignature.addParameter(newParameter, newParameter.isOptional);
        }

        signature.setIsSpecialized();

        context.inSpecialization = prevInSpecialization;

        return newSignature;
    }

    export function getIDForTypeSubstitutions(types: PullTypeSymbol[]): string {
        var substitution = "";

        for (var i = 0; i < types.length; i++) {
            substitution += types[i].pullSymbolIDString + "#";
        }

        return substitution;
    }
}