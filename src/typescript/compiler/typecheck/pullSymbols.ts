// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var pullSymbolID = 0
    export var lastBoundPullSymbolID = 0;
    export var globalTyvarID = 0;

    export class PullSymbol {

        // private state
        private pullSymbolID = pullSymbolID++;

        private outgoingLinks: LinkList = new LinkList();
        private incomingLinks: LinkList = new LinkList();

        private declarations: LinkList = new LinkList();

        private name: string;

        private cachedPathIDs: any = {};

        private declKind: PullElementKind;

        private cachedContainerLink: PullSymbolLink = null;
        private cachedTypeLink: PullSymbolLink = null;

        // We cache the declarations to improve look-up speed
        // (but we re-create on edits because deletion from the linked list is
        // much faster)
        private cachedDeclarations: PullDecl[] = null;

        private hasBeenResolved = false;

        private isOptional = false;

        private inResolution = false;

        private isSynthesized = false;

        private isBound = false;

        private rebindingID = 0;

        private isVarArg = false;

        private isSpecialized = false;
        private isBeingSpecialized = false;

        private rootSymbol: PullSymbol = null;

        public typeChangeUpdateVersion = -1;
        public addUpdateVersion = -1;
        public removeUpdateVersion = -1;

        public docComments: string = null;

        public isPrinting = false;

        // public surface area
        public getSymbolID() { return this.pullSymbolID; }

        public isType() {
            return (this.declKind & PullElementKind.SomeType) != 0;
        }

        public isSignature() {
            return (this.declKind & PullElementKind.SomeSignature) != 0;
        }

        public isArray() {
            return (this.declKind & PullElementKind.Array) != 0;
        }

        public isPrimitive() {
            return this.declKind === PullElementKind.Primitive;
        }

        public isAccessor() {
            return false;
        }

        public isError() {
            return false;
        }

        constructor(name: string, declKind: PullElementKind) {
            this.name = name;
            this.declKind = declKind;
        }

        public isAlias() { return false; }
        public isContainer() { return false; }

        private findAliasedType(decls: PullDecl[]) {
            for (var i = 0; i < decls.length; i++) {
                var childDecls = decls[i].getChildDecls();
                for (var j = 0; j < childDecls.length; j++) {
                    if (childDecls[j].getKind() === PullElementKind.TypeAlias) {
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
            if (scopePath.length && scopePath[scopePath.length - 1].getKind() === PullElementKind.DynamicModule) {
                var decls = scopePath[scopePath.length - 1].getDeclarations();
                var symbol = this.findAliasedType(decls);
                return symbol;
            }

            return null;
        }

        /** Use getName for type checking purposes, and getDisplayName to report an error or display info to the user.
         * They will differ when the identifier is an escaped unicode character or the identifier "__proto__".
         */
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getAliasedSymbol(scopeSymbol);
            if (symbol) {
                return symbol.getName();
            }
            
            return this.name;
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getAliasedSymbol(scopeSymbol);
            if (symbol) {
                return symbol.getDisplayName();
            }

            // Get the actual name associated with a declaration for this symbol
            return this.getDeclarations()[0].getDisplayName();
        }

        public getKind() { return this.declKind; }
        public setKind(declType: PullElementKind) { this.declKind = declType; }

        public setIsOptional() { this.isOptional = true; }
        public getIsOptional() { return this.isOptional; }

        public getIsVarArg() { return this.isVarArg; }
        public setIsVarArg() { this.isVarArg = true; }

        public setIsSynthesized() { this.isSynthesized = true; }
        public getIsSynthesized() { return this.isSynthesized; }

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

        public setIsBound(rebindingID: number) {
            this.isBound = true;
            this.rebindingID = rebindingID;
        }

        public getRebindingID() {
            return this.rebindingID;
        }

        public getIsBound() { return this.isBound; }

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

            this.declarations.addItem(decl);

            if (!this.cachedDeclarations) {
                this.cachedDeclarations = [decl];
            }
            else {
                this.cachedDeclarations[this.cachedDeclarations.length] = decl;
            }
        }

        public getDeclarations(): PullDecl[] {
            if (this.rootSymbol) {
                return this.rootSymbol.getDeclarations();
            }

            if (!this.cachedDeclarations) {
                this.cachedDeclarations = [];
            }

            return this.cachedDeclarations;
        }

        public removeDeclaration(decl: PullDecl) {

            if (this.rootSymbol) {
                return;
            }

            this.declarations.remove(d => d === decl);
            this.cachedDeclarations = <PullDecl[]>this.declarations.find(d => d);
        }

        public updateDeclarations(map: (item: PullDecl, context: any) => void , context: any) {

            if (this.rootSymbol) {
                return;
            }

            this.declarations.update(map, context);
        }

        // link methods
        public addOutgoingLink(linkTo: PullSymbol, kind: SymbolLinkKind) {
            var link = new PullSymbolLink(this, linkTo, kind);
            this.outgoingLinks.addItem(link);
            linkTo.incomingLinks.addItem(link);

            return link;
        }

        public findOutgoingLinks(p: (psl: PullSymbolLink) => boolean) {
            return <PullSymbolLink[]>this.outgoingLinks.find(p);
        }

        public findIncomingLinks(p: (psl: PullSymbolLink) => boolean) {
            return <PullSymbolLink[]>this.incomingLinks.find(p);
        }

        public removeOutgoingLink(link: PullSymbolLink) {
            if (link) {
                this.outgoingLinks.remove(p => p === link);

                if (link.end.incomingLinks) {
                    link.end.incomingLinks.remove(p => p === link);
                }
            }
        }

        public updateOutgoingLinks(map: (item: PullSymbolLink, context: any) => void , context: any) {
            if (this.outgoingLinks) {
                this.outgoingLinks.update(map, context);
            }
        }

        public updateIncomingLinks(map: (item: PullSymbolLink, context: any) => void , context: any) {
            if (this.incomingLinks) {
                this.incomingLinks.update(map, context);
            }
        }

        // remove all outgoing, as well as incoming, links
        public removeAllLinks() {
            this.updateOutgoingLinks((item) => this.removeOutgoingLink(item), null);
            this.updateIncomingLinks((item) => item.start.removeOutgoingLink(item), null);
        }

        public setContainer(containerSymbol: PullTypeSymbol) {
            //containerSymbol.addOutgoingLink(this, relationshipKind);

            var link = this.addOutgoingLink(containerSymbol, SymbolLinkKind.ContainedBy);
            this.cachedContainerLink = link;

            containerSymbol.addContainedByLink(link);
        }

        public getContainer(): PullTypeSymbol {
            if (this.cachedContainerLink) {
                return <PullTypeSymbol>this.cachedContainerLink.end;
            }

            if (this.getIsSpecialized()) {
                var specializations = this.findIncomingLinks((symbolLink) => symbolLink.kind == SymbolLinkKind.SpecializedTo);
                if (specializations.length == 1) {
                    return specializations[0].start.getContainer();
                }
            }

            return null;
        }

        public unsetContainer() {
            if (this.cachedContainerLink) {
                this.removeOutgoingLink(this.cachedContainerLink);
            }

            this.invalidate();
        }

        public setType(typeRef: PullTypeSymbol) {

            // PULLTODO: Remove once we're certain that duplicate types can never be set
            //if (this.cachedTypeLink) {
            //    CompilerDiagnostics.Alert("Type '" + this.name + "' is having its type reset from '" + this.cachedTypeLink.end.getName() + "' to '" + typeRef.getName() + "'");
            //}

            if (this.cachedTypeLink) {
                this.unsetType();
            }

            this.cachedTypeLink = this.addOutgoingLink(typeRef, SymbolLinkKind.TypedAs);

        }

        public getType(): PullTypeSymbol {
            if (this.cachedTypeLink) {
                return <PullTypeSymbol>this.cachedTypeLink.end;
            }

            //var typeList = this.findOutgoingLinks(link => link.kind === SymbolLinkKind.TypedAs);

            //if (typeList.length) {
            //    this.cachedTypeLink = typeList[0];
            //    return <PullTypeSymbol>this.cachedTypeLink.end;
            //}

            return null;
        }

        public unsetType() {
            var foundType = false;

            if (this.cachedTypeLink) {
                this.removeOutgoingLink(this.cachedTypeLink);
                foundType = true;
            }
            //else {
            //    var typeList = this.findOutgoingLinks(link => link.kind === SymbolLinkKind.TypedAs);

            //    if (typeList.length) {
            //        this.removeOutgoingLink(typeList[0]);
            //    }

            //    foundType = true;
            //}

            if (foundType) {
                this.invalidate();
            }
        }

        public isTyped() {
            return this.getType() != null;
        }

        public setResolved() {
            this.hasBeenResolved = true;
            this.inResolution = false;
        }
        public isResolved() { return this.hasBeenResolved; }

        public startResolving() {
            this.inResolution = true;
        }
        public isResolving() {
            return this.inResolution;
        }

        public setUnresolved() {
            this.hasBeenResolved = false;
            this.isBound = false;
            this.inResolution = false;
        }

        public invalidate() {

            this.docComments = null;

            this.hasBeenResolved = false;
            this.isBound = false;

            // reset the errors for its decl
            this.declarations.update((pullDecl: PullDecl) => pullDecl.resetErrors(), null);
        }

        public hasFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if ((declarations[i].getFlags() & flag) !== PullElementFlags.None) {
                    return true;
                }
            }
            return false;
        }

        public allDeclsHaveFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if (!((declarations[i].getFlags() & flag) !== PullElementFlags.None)) {
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
                node = node.getContainer();
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

        public toString(useConstraintInName?: boolean) {
            var str = this.getNameAndTypeName();
            return str;
        }

        public getNamePartForFullName() {
            return this.getDisplayName(null, true);
        }

        public fullName(scopeSymbol?: PullSymbol) {
            var path = this.pathToRoot();
            var fullName = "";
            var aliasedSymbol = this.getAliasedSymbol(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.getDisplayName();
            }

            for (var i = 1; i < path.length; i++) {
                aliasedSymbol = path[i].getAliasedSymbol(scopeSymbol);
                if (aliasedSymbol) {
                    // Aliased name found
                    fullName = aliasedSymbol.getDisplayName() + "." + fullName;
                    break;
                } else {
                    var scopedName = path[i].getNamePartForFullName();
                    if (path[i].getKind() == PullElementKind.DynamicModule && !isQuoted(scopedName)) {
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

        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var path = this.findCommonAncestorPath(scopeSymbol);
            var fullName = "";
            var aliasedSymbol = this.getAliasedSymbol(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.getDisplayName();
            }

            for (var i = 1; i < path.length; i++) {
                var kind = path[i].getKind();
                if (kind === PullElementKind.Container || kind === PullElementKind.DynamicModule) {
                    aliasedSymbol = path[i].getAliasedSymbol(scopeSymbol);
                    if (aliasedSymbol) {
                        // Aliased name
                        fullName = aliasedSymbol.getDisplayName() + "." + fullName;
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
            var type = this.getType();
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
            var type = this.getType();
            if (type && !type.isNamedTypeSymbol() && this.declKind != PullElementKind.Property && this.declKind != PullElementKind.Variable && this.declKind != PullElementKind.Parameter) {
                var signatures = type.getCallSignatures();
                var typeName = new MemberNameArray();
                var signatureName = PullSignatureSymbol.getSignaturesTypeNameEx(signatures, prefix, false, false, scopeSymbol, getPrettyTypeName);
                typeName.addAll(signatureName);
                return typeName;
            }

            return null;
        }

        public getNameAndTypeName(scopeSymbol?: PullSymbol) {
            var nameAndTypeName = this.getNameAndTypeNameEx(scopeSymbol);
            return nameAndTypeName.toString();
        }

        public getNameAndTypeNameEx(scopeSymbol?: PullSymbol) {
            var type = this.getType();
            var nameEx = this.getScopedNameEx(scopeSymbol);
            if (type) {
                var nameStr = nameEx.toString() + (this.getIsOptional() ? "?" : "");
                var memberName: MemberName = this.getTypeNameForFunctionSignature(nameStr, scopeSymbol);
                if (!memberName) {
                    var typeNameEx = type.getScopedNameEx(scopeSymbol);
                    memberName = MemberName.create(typeNameEx, nameStr + ": ", "");
                }
                return memberName;
            }
            return nameEx;
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
            var kind = this.getKind();
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
            if (container.getKind() == PullElementKind.DynamicModule ||
                (container.getAssociatedContainerType() && container.getAssociatedContainerType().getKind() == PullElementKind.DynamicModule)) {
                var containerTypeSymbol = container.getKind() == PullElementKind.DynamicModule
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

        public isModule() {
            return this.getKind() == PullElementKind.Container || this.isOneDeclarationOfKind(PullElementKind.Container);
        }

        private isOneDeclarationOfKind(kind: TypeScript.PullElementKind): boolean {
            var decls = this.getDeclarations();
            for (var i = 0; i < decls.length; i++) {
                if (decls[i].getKind() === kind) {
                    return true;
                }
            }

            return false;
        }
    }

    export class PullExpressionSymbol extends PullSymbol {
        contributingSymbols: PullSymbol[] = [];

        constructor() {
            super("", PullElementKind.Expression);
        }

        public addContributingSymbol(symbol: PullSymbol) {
            var link = this.addOutgoingLink(symbol, SymbolLinkKind.ContributesToExpression);

            this.contributingSymbols[this.contributingSymbols.length] = symbol;
        }

        public getContributingSymbols() {
            return this.contributingSymbols;
        }
    }

    export class PullSignatureSymbol extends PullSymbol {
        private parameterLinks: PullSymbolLink[] = null;
        private typeParameterLinks: PullSymbolLink[] = null;

        private returnTypeLink: PullSymbolLink = null;

        private hasOptionalParam = false;
        private nonOptionalParamCount = 0;

        private hasVarArgs = false;

        private specializationCache: any = {}

        private memberTypeParameterNameCache: any = null;

        private hasAGenericParameter = false;
        private stringConstantOverload: boolean = undefined;

        constructor(kind: PullElementKind) {
            super("", kind);
        }

        public isDefinition() { return false; }

        public hasVariableParamList() { return this.hasVarArgs; }
        public setHasVariableParamList() { this.hasVarArgs = true; }

        public setHasGenericParameter() { this.hasAGenericParameter = true; }
        public hasGenericParameter() { return this.hasAGenericParameter; }

        public isGeneric() { return this.hasAGenericParameter || (this.typeParameterLinks && this.typeParameterLinks.length != 0); }

        public addParameter(parameter: PullSymbol, isOptional = false) {
            if (!this.parameterLinks) {
                this.parameterLinks = [];
            }

            var link = this.addOutgoingLink(parameter, SymbolLinkKind.Parameter);
            this.parameterLinks[this.parameterLinks.length] = link;
            this.hasOptionalParam = isOptional;

            if (!isOptional) {
                this.nonOptionalParamCount++;
            }
        }

        public addSpecialization(signature: PullSignatureSymbol, typeArguments: PullTypeSymbol[]) {
            if (typeArguments && typeArguments.length) {
                this.specializationCache[getIDForTypeSubstitutions(typeArguments)] = signature;
            }
        }

        public getSpecialization(typeArguments): PullSignatureSymbol {

            if (typeArguments) {
                var sig = <PullSignatureSymbol>this.specializationCache[getIDForTypeSubstitutions(typeArguments)];

                if (sig) {
                    return sig;
                }
            }

            return null;
        }

        public addTypeParameter(parameter: PullTypeParameterSymbol) {
            if (!this.typeParameterLinks) {
                this.typeParameterLinks = [];
            }

            if (!this.memberTypeParameterNameCache) {
                this.memberTypeParameterNameCache = new BlockIntrinsics();
            }

            var link = this.addOutgoingLink(parameter, SymbolLinkKind.TypeParameter);
            this.typeParameterLinks[this.typeParameterLinks.length] = link;

            this.memberTypeParameterNameCache[link.end.getName()] = link.end;
        }

        public getNonOptionalParameterCount() { return this.nonOptionalParamCount; }

        public setReturnType(returnType: PullTypeSymbol) {

            if (returnType) {
                if (this.returnTypeLink) {
                    this.removeOutgoingLink(this.returnTypeLink);
                }
                this.returnTypeLink = this.addOutgoingLink(returnType, SymbolLinkKind.ReturnType);
            }
        }

        public getParameters() {
            var params: PullSymbol[] = [];

            if (this.parameterLinks) {
                for (var i = 0; i < this.parameterLinks.length; i++) {
                    params[params.length] = this.parameterLinks[i].end;
                }
            }

            return params;
        }

        public getTypeParameters(): PullTypeParameterSymbol[] {
            var params: PullTypeParameterSymbol[] = [];

            if (this.typeParameterLinks) {
                for (var i = 0; i < this.typeParameterLinks.length; i++) {
                    params[params.length] = <PullTypeParameterSymbol>this.typeParameterLinks[i].end;
                }
            }

            return params;
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            var memberSymbol: PullTypeParameterSymbol;

            if (!this.memberTypeParameterNameCache) {
                this.memberTypeParameterNameCache = new BlockIntrinsics();

                if (this.typeParameterLinks) {
                    for (var i = 0; i < this.typeParameterLinks.length; i++) {
                        this.memberTypeParameterNameCache[this.typeParameterLinks[i].end.getName()] = this.typeParameterLinks[i].end;
                    }
                }
            }

            memberSymbol = this.memberTypeParameterNameCache[name];

            return memberSymbol;
        }

        public removeParameter(parameterSymbol: PullSymbol) {
            var paramLink: PullSymbolLink;

            if (this.parameterLinks) {
                for (var i = 0; i < this.parameterLinks.length; i++) {
                    if (parameterSymbol === this.parameterLinks[i].end) {
                        paramLink = this.parameterLinks[i];
                        this.removeOutgoingLink(paramLink);
                        break;
                    }
                }
            }

            this.invalidate();
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
            var parameters = signature.getParameters();
            var parameter: PullSymbol;

            if (parameters) {
                for (var j = 0; j < parameters.length; j++) {
                    parameter = new PullSymbol(parameters[j].getName(), PullElementKind.Parameter);
                    parameter.setRootSymbol(parameters[j]);
                    //parameter.addDeclaration(parameters[j].getDeclarations()[0]);
                    if (parameters[j].getIsOptional()) {
                        parameter.setIsOptional();
                    }
                    if (parameters[j].getIsVarArg()) {
                        parameter.setIsVarArg();
                        this.setHasVariableParamList();
                    }
                    this.addParameter(parameter);
                }
            }

            // Don't set the return type, since that will just lead to redundant
            // calls to setReturnType when we re-resolve the signature for
            // specialization

             var returnType = signature.getReturnType();

             if (!resolver.isTypeArgumentOrWrapper(returnType)) {
                 this.setReturnType(returnType);
             }
        }

        public getReturnType(): PullTypeSymbol {
            if (this.returnTypeLink) {
                return <PullTypeSymbol> this.returnTypeLink.end;
            }
            else {
                var rtl = this.findOutgoingLinks((p) => p.kind === SymbolLinkKind.ReturnType);

                if (rtl.length) {
                    this.returnTypeLink = rtl[0];
                    return <PullTypeSymbol> this.returnTypeLink.end;
                }

                return null;
            }
        }

        public parametersAreFixed(): boolean {

            if (!this.isGeneric()) {
                return true;
            }

            if (this.parameterLinks) {
                var paramType: PullTypeSymbol;
                for (var i = 0; i < this.parameterLinks.length; i++) {
                    paramType = this.parameterLinks[i].end.getType();

                    if (paramType && !paramType.isFixed()) {
                        return false;
                    }
                }
            }

            return true;
        }

        public isFixed(): boolean {

            if (!this.isGeneric()) {
                return true;
            }

            if (this.parameterLinks) {
                var parameterType: PullTypeSymbol = null;
                
                for (var i = 0; i < this.parameterLinks.length; i++) {
                    parameterType = this.parameterLinks[i].end.getType();
                    
                    if (parameterType && !parameterType.isFixed()) {
                        return false;
                    }    
                }
            }

            if (this.returnTypeLink) {
                var returnType = <PullTypeSymbol>this.returnTypeLink.end;

                return returnType.isFixed();
            }

            return true;
        }

        public invalidate() {

            this.parameterLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.Parameter);
            this.nonOptionalParamCount = 0;
            this.hasOptionalParam = false;
            this.hasAGenericParameter = false;
            this.stringConstantOverload = undefined;

            // re-compute non-optional arg count, etc
            if (this.parameterLinks) {
                for (var i = 0; i < this.parameterLinks.length; i++) {

                    this.parameterLinks[i].end.invalidate();

                    if (!this.parameterLinks[i].end.getIsOptional()) {
                        this.nonOptionalParamCount++;
                    }
                    else {
                        this.hasOptionalParam;
                        break;
                    }
                }
            }

            super.invalidate();
        }

        public isStringConstantOverloadSignature() {
            if (this.stringConstantOverload === undefined) {
                var params = this.getParameters();
                this.stringConstantOverload = false;
                for (var i = 0; i < params.length; i++) {
                    var paramType = params[i].getType();
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
                var overloadString = " (+ " + (foundDefinition ? len - 2 : len - 1) + " overload(s))";
                lastMemberName.add(MemberName.create(overloadString));
            }

            return result;
        }

        public toString(useConstraintInName?: boolean) {
            var s = this.getSignatureTypeNameEx(this.getScopedNameEx().toString(), false, false, undefined, undefined, useConstraintInName).toString();
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

            var params = this.getParameters();
            var paramLen = params.length;
            for (var i = 0; i < paramLen; i++) {
                var paramType = params[i].getType();
                var typeString = paramType ? ": " : "";
                var paramIsVarArg = params[i].getIsVarArg();
                var varArgPrefix = paramIsVarArg ? "..." : "";
                var optionalString = (!paramIsVarArg && params[i].getIsOptional()) ? "?" : "";
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

            var returnType = this.getReturnType();

            if (returnType) {
                builder.add(returnType.getScopedNameEx(scopeSymbol));
            }
            else {
                builder.add(MemberName.create("any"));
            }

            return builder;
        }
    }

    export class PullTypeSymbol extends PullSymbol {
        private memberLinks: PullSymbolLink[] = null;
        private typeParameterLinks: PullSymbolLink[] = null;
        private specializationLinks: PullSymbolLink[] = null;
        private containedByLinks: PullSymbolLink[] = null;

        private memberNameCache: any = null;
        private memberTypeNameCache: any = null;
        private memberTypeParameterNameCache: any = null;
        private containedMemberCache: any = null;

        private typeArguments: PullTypeSymbol[] = null;

        private specializedTypeCache: any = null;

        private memberCache: PullSymbol[] = null;

        private implementedTypeLinks: PullSymbolLink[] = null;
        private extendedTypeLinks: PullSymbolLink[] = null;

        private callSignatureLinks: PullSymbolLink[] = null;
        private constructSignatureLinks: PullSymbolLink[] = null;
        private indexSignatureLinks: PullSymbolLink[] = null;

        private arrayType: PullTypeSymbol = null;

        private hasGenericSignature = false;
        private hasGenericMember = false;
        private knownBaseTypeCount = 0;
        private _hasBaseTypeConflict = false;

        public getKnownBaseTypeCount() { return this.knownBaseTypeCount; }
        public resetKnownBaseTypeCount() { this.knownBaseTypeCount = 0; }
        public incrementKnownBaseCount() { this.knownBaseTypeCount++; }
        public setHasBaseTypeConflict() {
            this._hasBaseTypeConflict = true;
        }
        public hasBaseTypeConflict() {
            return this._hasBaseTypeConflict;
        }

        private invalidatedSpecializations = false;

        private associatedContainerTypeSymbol: PullTypeSymbol = null;

        private constructorMethod: PullSymbol = null;
        private hasDefaultConstructor = false;

        public setUnresolved() {
            super.setUnresolved();

            var specializations = this.getKnownSpecializations();

            for (var i = 0; i < specializations.length; i++) {
                specializations[i].setUnresolved();
            }
        }

        public isType() { return true; }
        public isClass() {
            return this.getKind() == PullElementKind.Class || (this.constructorMethod != null);
        }

        public hasMembers() {
            var thisHasMembers = this.memberLinks && this.memberLinks.length != 0;

            if (thisHasMembers) {
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
        public isFunction() { return false; }
        public isConstructor() { return false; }
        public isTypeParameter() { return false; }
        public isTypeVariable() { return false; }
        public isError() { return false; }

        public setHasGenericSignature() { this.hasGenericSignature = true; }
        public getHasGenericSignature() { return this.hasGenericSignature; }

        public setHasGenericMember() { this.hasGenericMember = true; }
        public getHasGenericMember() { return this.hasGenericMember; }

        public setAssociatedContainerType(type: PullTypeSymbol) {
            this.associatedContainerTypeSymbol = type;
        }

        public getAssociatedContainerType() {
            return this.associatedContainerTypeSymbol;
        }

        public getType() { return this; }

        public getArrayType() { return this.arrayType; }

        public getElementType(): PullTypeSymbol {
            var arrayOfLinks = this.findOutgoingLinks(link => link.kind === SymbolLinkKind.ArrayOf);

            if (arrayOfLinks.length) {
                return <PullTypeSymbol>arrayOfLinks[0].end;
            }

            return null;
        }
        public setArrayType(arrayType: PullTypeSymbol) {
            this.arrayType = arrayType;

            arrayType.addOutgoingLink(this, SymbolLinkKind.ArrayOf);
        }

        public addContainedByLink(containedByLink: PullSymbolLink) {
            if (!this.containedByLinks) {
                this.containedByLinks = [];
            }

            if (!this.containedMemberCache) {
                this.containedMemberCache = new BlockIntrinsics();
            }

            this.containedByLinks[this.containedByLinks.length] = containedByLink;
            this.containedMemberCache[containedByLink.start.getName()] = containedByLink.start;
        }

        public findContainedMember(name: string): PullSymbol {

            if (!this.containedByLinks) {
                this.containedByLinks = this.findIncomingLinks(psl => psl.kind === SymbolLinkKind.ContainedBy);
                this.containedMemberCache = new BlockIntrinsics();

                for (var i = 0; i < this.containedByLinks.length; i++) {
                    this.containedMemberCache[this.containedByLinks[i].start.getName()] = this.containedByLinks[i].start;
                }
            }

            return this.containedMemberCache[name];
        }

        public addMember(memberSymbol: PullSymbol, linkKind: SymbolLinkKind, doNotChangeContainer?: boolean) {

            var link = this.addOutgoingLink(memberSymbol, linkKind);

            if (!doNotChangeContainer) {
                memberSymbol.setContainer(this);
            }

            if (!this.memberLinks) {
                this.memberLinks = [];
            }

            if (!this.memberCache || !this.memberNameCache) {
                this.populateMemberCache();
            }

            if (!memberSymbol.isType()) {
                this.memberLinks[this.memberLinks.length] = link;

                this.memberCache[this.memberCache.length] = memberSymbol;

                if (!this.memberNameCache) {
                    this.populateMemberCache();
                }
                this.memberNameCache[memberSymbol.getName()] = memberSymbol;
            }
            else {
                if ((<PullTypeSymbol>memberSymbol).isTypeParameter()) {
                    if (!this.typeParameterLinks) {
                        this.typeParameterLinks = [];
                    }
                    if (!this.memberTypeParameterNameCache) {
                        this.memberTypeParameterNameCache = new BlockIntrinsics();
                    }
                    this.typeParameterLinks[this.typeParameterLinks.length] = link;
                    this.memberTypeParameterNameCache[memberSymbol.getName()] = memberSymbol;
                }
                else {
                    if (!this.memberTypeNameCache) {
                        this.memberTypeNameCache = new BlockIntrinsics();
                    }
                    this.memberLinks[this.memberLinks.length] = link;
                    this.memberTypeNameCache[memberSymbol.getName()] = memberSymbol;
                    this.memberCache[this.memberCache.length] = memberSymbol;
                }
            }
        }

        public removeMember(memberSymbol: PullSymbol) {
            var memberLink: PullSymbolLink;
            var child: PullSymbol;

            var links = (memberSymbol.isType() && (<PullTypeSymbol>memberSymbol).isTypeParameter()) ? this.typeParameterLinks : this.memberLinks;

            if (links) {
                for (var i = 0; i < links.length; i++) {
                    if (memberSymbol === links[i].end) {
                        memberLink = links[i];
                        child = memberLink.end;
                        child.unsetContainer();
                        this.removeOutgoingLink(memberLink);
                        break;
                    }
                }
            }

            this.invalidate();
        }

        public getMembers(): PullSymbol[] {

            if (this.memberCache) {
                return this.memberCache;
            }
            else {
                var members: PullSymbol[] = [];

                if (this.memberLinks) {
                    for (var i = 0; i < this.memberLinks.length; i++) {
                        members[members.length] = this.memberLinks[i].end;
                    }
                }

                if (members.length) {
                    this.memberCache = members;
                }

                return members;
            }
        }

        public setHasDefaultConstructor(hasOne= true) {
            this.hasDefaultConstructor = hasOne;
        }

        public getHasDefaultConstructor() {
            return this.hasDefaultConstructor;
        }

        public getConstructorMethod() {
            return this.constructorMethod;
        }

        public setConstructorMethod(constructorMethod: PullSymbol) {
            this.constructorMethod = constructorMethod;
        }

        public getTypeParameters(): PullTypeParameterSymbol[] {
            var members: PullTypeParameterSymbol[] = [];

            if (this.typeParameterLinks) {
                for (var i = 0; i < this.typeParameterLinks.length; i++) {
                    members[members.length] = <PullTypeParameterSymbol>this.typeParameterLinks[i].end;
                }
            }

            return members;
        }

        public isGeneric(): boolean {
            return (this.typeParameterLinks && this.typeParameterLinks.length != 0) ||
                this.hasGenericSignature ||
                this.hasGenericMember ||
                (this.typeArguments && this.typeArguments.length);
        }

        public isFixed() {

            if (!this.isGeneric()) {
                return true;
            }

            if (this.typeParameterLinks && this.typeArguments) {
                if (!this.typeArguments.length || this.typeArguments.length < this.typeParameterLinks.length) {
                    return false;
                }

                for (var i = 0; i < this.typeArguments.length; i++) {
                    if (!this.typeArguments[i].isFixed()) {
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

            if (!this.specializedTypeCache) {
                this.specializedTypeCache = new BlockIntrinsics();
            }

            if (!this.specializationLinks) {
                this.specializationLinks = [];
            }

            this.specializationLinks[this.specializationLinks.length] = this.addOutgoingLink(specializedVersionOfThisType, SymbolLinkKind.SpecializedTo);

            this.specializedTypeCache[getIDForTypeSubstitutions(substitutingTypes)] = specializedVersionOfThisType;
        }

        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol {

            if (!substitutingTypes || !substitutingTypes.length) {
                return null;
            }

            if (!this.specializedTypeCache) {
                this.specializedTypeCache = new BlockIntrinsics();

                return null;
            }

            var specialization = <PullTypeSymbol>this.specializedTypeCache[getIDForTypeSubstitutions(substitutingTypes)];

            if (!specialization) {
                return null;
            }

            return specialization;
        }

        public getKnownSpecializations(): PullTypeSymbol[] {
            var specializations: PullTypeSymbol[] = [];

            if (this.specializedTypeCache) {
                for (var specializationID in this.specializedTypeCache) {
                    if (this.specializedTypeCache[specializationID]) {
                        specializations[specializations.length] = this.specializedTypeCache[specializationID];
                    }
                }
            }

            return specializations;
        }

        public invalidateSpecializations() {

            if (this.invalidatedSpecializations) {
                return;
            }

            var specializations = this.getKnownSpecializations();

            for (var i = 0; i < specializations.length; i++) {
                specializations[i].invalidate();
            }

            if (this.specializationLinks && this.specializationLinks.length) {
                
                for (var i = 0; i < this.specializationLinks.length; i++) {
                    this.removeOutgoingLink(this.specializationLinks[i]);
                }
            }

            this.specializationLinks = null;

            this.specializedTypeCache = null;

            this.invalidatedSpecializations = true;
        }

        public removeSpecialization(specializationType: PullTypeSymbol) {
            
            if (this.specializationLinks && this.specializationLinks.length) {
                for (var i = 0; i < this.specializationLinks.length; i++) {
                    if (this.specializationLinks[i].end === specializationType) {
                        this.removeOutgoingLink(this.specializationLinks[i]);
                        break;
                    }
                }
            }

            if (this.specializedTypeCache) {

                for (var specializationID in this.specializedTypeCache) {
                    if (this.specializedTypeCache[specializationID] === specializationType) {
                        this.specializedTypeCache[specializationID] = undefined;
                    }
                }
            }
        }

        public getTypeArguments() { return this.typeArguments; }
        public setTypeArguments(typeArgs: PullTypeSymbol[]) { this.typeArguments = typeArgs; }

        public addCallSignature(callSignature: PullSignatureSymbol) {

            if (!this.callSignatureLinks) {
                this.callSignatureLinks = [];
            }

            var link = this.addOutgoingLink(callSignature, SymbolLinkKind.CallSignature);
            this.callSignatureLinks[this.callSignatureLinks.length] = link;

            if (callSignature.isGeneric()) {
                this.hasGenericSignature = true;
            }
        }

        public addCallSignatures(callSignatures: PullSignatureSymbol[]) {

            if (!this.callSignatureLinks) {
                this.callSignatureLinks = [];
            }

            for (var i = 0; i < callSignatures.length; i++) {
                this.addCallSignature(callSignatures[i]);
            }
        }

        public addConstructSignature(constructSignature: PullSignatureSymbol) {

            if (!this.constructSignatureLinks) {
                this.constructSignatureLinks = [];
            }

            var link = this.addOutgoingLink(constructSignature, SymbolLinkKind.ConstructSignature);
            this.constructSignatureLinks[this.constructSignatureLinks.length] = link;

            if (constructSignature.isGeneric()) {
                this.hasGenericSignature = true;
            }
        }

        public addConstructSignatures(constructSignatures: PullSignatureSymbol[]) {

            if (!this.constructSignatureLinks) {
                this.constructSignatureLinks = [];
            }

            for (var i = 0; i < constructSignatures.length; i++) {
                this.addConstructSignature(constructSignatures[i]);
            }
        }

        public addIndexSignature(indexSignature: PullSignatureSymbol) {
            if (!this.indexSignatureLinks) {
                this.indexSignatureLinks = [];
            }

            var link = this.addOutgoingLink(indexSignature, SymbolLinkKind.IndexSignature);
            this.indexSignatureLinks[this.indexSignatureLinks.length] = link;

            if (indexSignature.isGeneric()) {
                this.hasGenericSignature = true;
            }
        }

        public addIndexSignatures(indexSignatures: PullSignatureSymbol[]) {
            if (!this.indexSignatureLinks) {
                this.indexSignatureLinks = [];
            }

            for (var i = 0; i < indexSignatures.length; i++) {
                this.addIndexSignature(indexSignatures[i]);
            }
        }

        public hasOwnCallSignatures() { return !!this.callSignatureLinks; }

        public getCallSignatures(collectBaseSignatures=true): PullSignatureSymbol[] {
            var members: PullSymbol[] = [];

            if (this.callSignatureLinks) {
                for (var i = 0; i < this.callSignatureLinks.length; i++) {
                    members[members.length] = this.callSignatureLinks[i].end;
                }
            }

            if (collectBaseSignatures) {
                var extendedTypes = this.getExtendedTypes();

                for (var i = 0; i < extendedTypes.length; i++) {
                    if (extendedTypes[i].hasBase(this)) {
                        continue;
                    }
                    members = members.concat(extendedTypes[i].getCallSignatures());
                }
            }

            return <PullSignatureSymbol[]>members;
        }

        public hasOwnConstructSignatures() { return !!this.constructSignatureLinks; }

        public getConstructSignatures(collectBaseSignatures=true): PullSignatureSymbol[] {
            var members: PullSymbol[] = [];

            if (this.constructSignatureLinks) {
                for (var i = 0; i < this.constructSignatureLinks.length; i++) {
                    members[members.length] = this.constructSignatureLinks[i].end;
                }
            }

            // If it's a constructor type, we don't inherit construct signatures
            // (E.g., we'd be looking at the statics on a class, where we want
            // to inherit members, but not construct signatures
            if (collectBaseSignatures) {
                if (!(this.getKind() == PullElementKind.ConstructorType)) {
                    var extendedTypes = this.getExtendedTypes();

                    for (var i = 0; i < extendedTypes.length; i++) {
                        if (extendedTypes[i].hasBase(this)) {
                            continue;
                        }
                        members = members.concat(extendedTypes[i].getConstructSignatures());
                    }
                }
            }

            return <PullSignatureSymbol[]>members;
        }

        public hasOwnIndexSignatures() { return !!this.indexSignatureLinks; }

        public getIndexSignatures(collectBaseSignatures=true): PullSignatureSymbol[] {
            var members: PullSymbol[] = [];

            if (this.indexSignatureLinks) {
                for (var i = 0; i < this.indexSignatureLinks.length; i++) {
                    members[members.length] = this.indexSignatureLinks[i].end;
                }
            }

            if (collectBaseSignatures) {
                var extendedTypes = this.getExtendedTypes();

                for (var i = 0; i < extendedTypes.length; i++) {
                    if (extendedTypes[i].hasBase(this)) {
                        continue;
                    }
                    members = members.concat(extendedTypes[i].getIndexSignatures());
                }
            }

            return <PullSignatureSymbol[]>members;
        }

        public removeCallSignature(signature: PullSignatureSymbol, invalidate = true) {
            var signatureLink: PullSymbolLink;

            if (this.callSignatureLinks) {
                for (var i = 0; i < this.callSignatureLinks.length; i++) {
                    if (signature === this.callSignatureLinks[i].end) {
                        signatureLink = this.callSignatureLinks[i];
                        this.removeOutgoingLink(signatureLink);
                        break;
                    }
                }
            }

            if (invalidate) {
                this.invalidate();
            }
        }

        public recomputeCallSignatures() {
            this.callSignatureLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.CallSignature);
        }

        public removeConstructSignature(signature: PullSignatureSymbol, invalidate = true) {
            var signatureLink: PullSymbolLink;

            if (this.constructSignatureLinks) {
                for (var i = 0; i < this.constructSignatureLinks.length; i++) {
                    if (signature === this.constructSignatureLinks[i].end) {
                        signatureLink = this.constructSignatureLinks[i];
                        this.removeOutgoingLink(signatureLink);
                        break;
                    }
                }
            }

            if (invalidate) {
                this.invalidate();
            }
        }

        public recomputeConstructSignatures() {
            this.constructSignatureLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.ConstructSignature);
        }

        public removeIndexSignature(signature: PullSignatureSymbol, invalidate = true) {
            var signatureLink: PullSymbolLink;

            if (this.indexSignatureLinks) {
                for (var i = 0; i < this.indexSignatureLinks.length; i++) {
                    if (signature === this.indexSignatureLinks[i].end) {
                        signatureLink = this.indexSignatureLinks[i];
                        this.removeOutgoingLink(signatureLink);
                        break;
                    }
                }
            }

            if (invalidate) {
                this.invalidate();
            }
        }

        public recomputeIndexSignatures() {
            this.indexSignatureLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.IndexSignature);
        }

        public addImplementedType(interfaceType: PullTypeSymbol) {
            if (!this.implementedTypeLinks) {
                this.implementedTypeLinks = [];
            }

            var link = this.addOutgoingLink(interfaceType, SymbolLinkKind.Implements);
            this.implementedTypeLinks[this.implementedTypeLinks.length] = link;
        }

        public getImplementedTypes(): PullTypeSymbol[] {
            var members: PullSymbol[] = [];

            if (this.implementedTypeLinks) {
                for (var i = 0; i < this.implementedTypeLinks.length; i++) {
                    members[members.length] = this.implementedTypeLinks[i].end;
                }
            }

            return <PullTypeSymbol[]>members;
        }

        public removeImplementedType(implementedType: PullTypeSymbol) {
            var typeLink: PullSymbolLink;

            if (this.implementedTypeLinks) {
                for (var i = 0; i < this.implementedTypeLinks.length; i++) {
                    if (implementedType === this.implementedTypeLinks[i].end) {
                        typeLink = this.implementedTypeLinks[i];
                        this.removeOutgoingLink(typeLink);
                        break;
                    }
                }
            }

            this.invalidate();
        }

        public addExtendedType(extendedType: PullTypeSymbol) {
            if (!this.extendedTypeLinks) {
                this.extendedTypeLinks = [];
            }

            var link = this.addOutgoingLink(extendedType, SymbolLinkKind.Extends);
            this.extendedTypeLinks[this.extendedTypeLinks.length] = link;

            // var parentMembers = extendedType.getMembers();

            // PULLTODO: Restrict member list to public properties only
            // for (var i = 0; i < parentMembers.length; i++) {
            //     this.addMember(parentMembers[i], SymbolLinkKind.PublicMember);
            // }
        }

        public getExtendedTypes(): PullTypeSymbol[] {
            var members: PullSymbol[] = [];

            if (this.extendedTypeLinks) {
                for (var i = 0; i < this.extendedTypeLinks.length; i++) {
                    members[members.length] = this.extendedTypeLinks[i].end;
                }
            }

            return <PullTypeSymbol[]>members;
        }

        public hasBase(potentialBase: PullTypeSymbol, origin=null) {

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
                    return baseType.getKind() === PullElementKind.Class;
                }
            } else {
                if (!thisIsClass) {
                    // Interface implementing baseType is invalid
                    return false;
                }
            }

            // Interface extending non interface or class 
            // or class implementing non interface or class - are invalid
            return !!(baseType.getKind() & (PullElementKind.Interface | PullElementKind.Class | PullElementKind.Array));
        }

        public removeExtendedType(extendedType: PullTypeSymbol) {
            var typeLink: PullSymbolLink;

            if (this.extendedTypeLinks) {
                for (var i = 0; i < this.extendedTypeLinks.length; i++) {
                    if (extendedType === this.extendedTypeLinks[i].end) {
                        typeLink = this.extendedTypeLinks[i];
                        this.removeOutgoingLink(typeLink);
                        break;
                    }
                }
            }

            this.invalidate();
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            var memberSymbol: PullSymbol;

            if (!this.memberNameCache) {
                this.populateMemberCache();
            }

            memberSymbol = this.memberNameCache[name];

            if (!lookInParent) {
                return memberSymbol;
            }
            else if (memberSymbol) {
                return memberSymbol;
            }

            // check parents
            if (!memberSymbol && this.extendedTypeLinks) {

                for (var i = 0; i < this.extendedTypeLinks.length; i++) {
                    memberSymbol = (<PullTypeSymbol>this.extendedTypeLinks[i].end).findMember(name);

                    if (memberSymbol) {
                        return memberSymbol;
                    }
                }
            }

            // when all else fails, look for a nested type name
            return this.findNestedType(name);
        }

        public findNestedType(name: string, kind = PullElementKind.None): PullTypeSymbol {
            var memberSymbol: PullTypeSymbol;

            if (!this.memberTypeNameCache) {
                this.populateMemberTypeCache();
            }

            memberSymbol = this.memberTypeNameCache[name];

            if (memberSymbol && kind != PullElementKind.None) {
                memberSymbol = ((memberSymbol.getKind() & kind) != 0) ? memberSymbol : null;
            }

            return memberSymbol;
        }

        private populateMemberCache() {
            if (!this.memberNameCache || !this.memberCache) {
                this.memberNameCache = new BlockIntrinsics();
                this.memberCache = [];

                if (this.memberLinks) {
                    for (var i = 0; i < this.memberLinks.length; i++) {
                        this.memberNameCache[this.memberLinks[i].end.getName()] = this.memberLinks[i].end;
                        this.memberCache[this.memberCache.length] = this.memberLinks[i].end;
                    }
                }
            }
        }

        private populateMemberTypeCache() {
            if (!this.memberTypeNameCache) {
                this.memberTypeNameCache = new BlockIntrinsics();

                var setAll = false;

                if (!this.memberCache) {
                    this.memberCache = [];
                    this.memberNameCache = new BlockIntrinsics();
                    setAll = true;
                }

                if (this.memberLinks) {
                    for (var i = 0; i < this.memberLinks.length; i++) {
                        if (this.memberLinks[i].end.isType()) {
                            this.memberTypeNameCache[this.memberLinks[i].end.getName()] = this.memberLinks[i].end;
                            this.memberCache[this.memberCache.length] = this.memberLinks[i].end;
                        }
                        else if (setAll) {
                            this.memberNameCache[this.memberLinks[i].end.getName()] = this.memberLinks[i].end;
                            this.memberCache[this.memberCache.length] = this.memberLinks[i].end;
                        }
                    }
                }
            }
        }

        public getAllMembers(searchDeclKind: PullElementKind, includePrivate: boolean): PullSymbol[] {

            var allMembers: PullSymbol[] = [];
            var i = 0;
            var j = 0;
            var m = 0;
            var n = 0;

            // Update the cache id needed
            if (!this.memberCache) {
                this.populateMemberCache();
            }
            // Update the cache id needed
            if (!this.memberTypeNameCache) {
                this.populateMemberTypeCache();
            }

            if (!this.memberNameCache) {
                this.populateMemberCache();
            }

            // Add members
            for (var i = 0 , n = this.memberCache.length; i < n; i++) {
                var member = this.memberCache[i];
                if ((member.getKind() & searchDeclKind) && (includePrivate || !member.hasFlag(PullElementFlags.Private))) {
                    allMembers[allMembers.length] = member;
                }
            }

            // Add parent members
            if (this.extendedTypeLinks) {

                for (var i = 0 , n = this.extendedTypeLinks.length; i < n; i++) {
                    var extendedMembers = (<PullTypeSymbol>this.extendedTypeLinks[i].end).getAllMembers(searchDeclKind, includePrivate);

                    for (var j = 0 , m = extendedMembers.length; j < m; j++) {
                        var extendedMember = extendedMembers[j];
                        if (!this.memberNameCache[extendedMember.getName()]) {
                            allMembers[allMembers.length] = extendedMember;
                        }
                    }
                }
            }

            return allMembers;
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            var memberSymbol: PullTypeParameterSymbol;

            if (!this.memberTypeParameterNameCache) {
                this.memberTypeParameterNameCache = new BlockIntrinsics();

                if (this.typeParameterLinks) {
                    for (var i = 0; i < this.typeParameterLinks.length; i++) {
                        this.memberTypeParameterNameCache[this.typeParameterLinks[i].end.getName()] = this.typeParameterLinks[i].end;
                    }
                }
            }

            memberSymbol = this.memberTypeParameterNameCache[name];

            return memberSymbol;
        }

        public cleanTypeParameters() {
            if (this.typeParameterLinks) {
                for (var i = 0; i < this.typeParameterLinks.length; i++) {
                    this.removeOutgoingLink(this.typeParameterLinks[i]);
                }
            }

            this.typeParameterLinks = null;
            this.memberTypeParameterNameCache = null;
        }

        public setResolved() {
            this.invalidatedSpecializations = true;
            super.setResolved();
        }

        public invalidate() {

            if (this.constructorMethod) {
                this.constructorMethod.invalidate();
            }

            this.memberNameCache = null;
            this.memberCache = null;
            this.memberTypeNameCache = null;
            this.containedMemberCache = null;

            this.invalidatedSpecializations = false;

            this.containedByLinks = null;

            this.memberLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.PrivateMember ||
            psl.kind === SymbolLinkKind.PublicMember);

            this.typeParameterLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.TypeParameter);

            this.callSignatureLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.CallSignature);

            this.constructSignatureLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.ConstructSignature);

            this.indexSignatureLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.IndexSignature);

            this.implementedTypeLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.Implements);

            this.extendedTypeLinks = this.findOutgoingLinks(psl => psl.kind === SymbolLinkKind.Extends);
            
            this.knownBaseTypeCount = 0;

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
            var kind = this.getKind();
            if (kind === PullElementKind.Primitive || // primitives
            kind === PullElementKind.Class || // class
            kind === PullElementKind.Container || // module
            kind === PullElementKind.DynamicModule || // dynamic module
            kind === PullElementKind.TypeAlias || // dynamic module
            kind === PullElementKind.Enum || // enum
            kind === PullElementKind.TypeParameter || //TypeParameter
            ((kind === PullElementKind.Interface || kind === PullElementKind.ObjectType) && this.getName() != "")) {
                return true;
            }

            return false;
        }

        public toString(useConstraintInName?: boolean) {
            var s = this.getScopedNameEx(null, useConstraintInName).toString();
            return s;
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean) {
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

        public getMemberTypeNameEx(topLevel: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): MemberName {
            var members = this.getMembers();
            var callSignatures = this.getCallSignatures();
            var constructSignatures = this.getConstructSignatures();
            var indexSignatures = this.getIndexSignatures();

            if (members.length > 0 || callSignatures.length > 0 || constructSignatures.length > 0 || indexSignatures.length > 0) {
                var allMemberNames = new MemberNameArray();
                var curlies = !topLevel || indexSignatures.length != 0;
                var delim = "; ";
                for (var i = 0; i < members.length; i++) {
                    var memberTypeName = members[i].getNameAndTypeNameEx(scopeSymbol);

                    if (memberTypeName.isArray() && (<MemberNameArray>memberTypeName).delim === delim) {
                        allMemberNames.addAll((<MemberNameArray>memberTypeName).entries);
                    } else {
                        allMemberNames.add(memberTypeName);
                    }
                    curlies = true;
                }

                // Use pretty Function overload signature if this is just a call overload
                var getPrettyFunctionOverload = getPrettyTypeName && !curlies && this.hasOnlyOverloadCallSignatures();

                var signatureCount = callSignatures.length + constructSignatures.length + indexSignatures.length;
                if (signatureCount != 0 || members.length != 0) {
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

                    return allMemberNames;
                }
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

        public setType(type: PullTypeSymbol) {
            Debug.assert(false, "tried to set type of type");
        }
    }

    export class PullPrimitiveTypeSymbol extends PullTypeSymbol {
        constructor(name: string) {
            super(name, PullElementKind.Primitive);
        }

        public isResolved() { return true; }

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

        constructor(private diagnostic: SemanticDiagnostic, public delegateType: PullTypeSymbol, private _data = null) {
            super("error");
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

        public toString() {
            return this.delegateType.toString();
        }

        public isResolved() {
            return false;
        }

        public setData(data: any) {
            this._data = data;
        }

        public getData() {
            return this._data;
        }
    }

    // PULLTODO: Unify concepts of constructor method and container
    // type instance types
    export class PullClassTypeSymbol extends PullTypeSymbol {

        constructor(name: string) {
            super(name, PullElementKind.Class);
        }
    }

    // represents the module "namespace" type
    export class PullContainerTypeSymbol extends PullTypeSymbol {
        public instanceSymbol: PullSymbol = null;

        private _exportAssignedValueSymbol: PullSymbol = null;
        private _exportAssignedTypeSymbol: PullTypeSymbol = null;
        private _exportAssignedContainerSymbol: PullContainerTypeSymbol = null;

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

        public setExportAssignedValueSymbol(symbol: PullSymbol): void {

            this._exportAssignedValueSymbol = symbol;
        }
        public getExportAssignedValueSymbol(): PullSymbol {
            return this._exportAssignedValueSymbol;
        }

        public setExportAssignedTypeSymbol(type: PullTypeSymbol): void {
            this._exportAssignedTypeSymbol = type;
        }
        public getExportAssignedTypeSymbol(): PullTypeSymbol {
            return this._exportAssignedTypeSymbol;
        }

        public setExportAssignedContainerSymbol(container: PullContainerTypeSymbol): void {
            this._exportAssignedContainerSymbol = container;
        }
        public getExportAssignedContainerSymbol(): PullContainerTypeSymbol {
            return this._exportAssignedContainerSymbol;
        }

        public resetExportAssignedSymbols() {
            this._exportAssignedContainerSymbol = null;
            this._exportAssignedTypeSymbol = null;
            this._exportAssignedValueSymbol = null;
        }

        static usedAsSymbol(containerSymbol: PullSymbol, symbol: PullSymbol) {
            if (!containerSymbol || !containerSymbol.isContainer()) {
                return false;
            }

            if (containerSymbol.getType() == symbol) {
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
    }

    export class PullTypeAliasSymbol extends PullTypeSymbol {

        private typeAliasLink: PullSymbolLink = null;
        private isUsedAsValue = false;
        private typeUsedExternally = false;
        private retrievingExportAssignment = false;

        constructor(name: string) {
            super(name, PullElementKind.TypeAlias);
        }

        public isAlias() { return true; }
        public isContainer() { return true; }

        public setAliasedType(type: PullTypeSymbol) {
            Debug.assert(!type.isError(), "Attempted to alias an error");
            if (this.typeAliasLink) {
                this.removeOutgoingLink(this.typeAliasLink);
            }

            this.typeAliasLink = this.addOutgoingLink(type, SymbolLinkKind.Aliases);
        }

        public getExportAssignedValueSymbol(): PullSymbol {
            if (!this.typeAliasLink) {
                return null;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.typeAliasLink.end.isContainer()) {
                this.retrievingExportAssignment = true;
                var sym = (<PullContainerTypeSymbol>this.typeAliasLink.end).getExportAssignedValueSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public getExportAssignedTypeSymbol(): PullTypeSymbol {
            if (!this.typeAliasLink) {
                return null;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.typeAliasLink.end.isContainer()) {
                this.retrievingExportAssignment = true;
                var sym = (<PullContainerTypeSymbol>this.typeAliasLink.end).getExportAssignedTypeSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public getExportAssignedContainerSymbol(): PullContainerTypeSymbol {
            if (!this.typeAliasLink) {
                return null;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.typeAliasLink.end.isContainer()) {
                this.retrievingExportAssignment = true;
                var sym = (<PullContainerTypeSymbol>this.typeAliasLink.end).getExportAssignedContainerSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public getType(): PullTypeSymbol {

            if (this.typeAliasLink) {
                return <PullTypeSymbol>this.typeAliasLink.end;
            }

            return null;
        }

        public setType(type: PullTypeSymbol) {
            this.setAliasedType(type);
        }

        public setIsUsedAsValue() {
            this.isUsedAsValue = true;
        }

        public getIsUsedAsValue() {
            return this.isUsedAsValue;
        }

        public setIsTypeUsedExternally() {
            this.typeUsedExternally = true;
        }

        public getTypeUsedExternally() {
            return this.typeUsedExternally;
        }

        public getMembers(): PullSymbol[] {
            if (this.typeAliasLink) {
                return (<PullTypeSymbol>this.typeAliasLink.end).getMembers();
            }

            return [];
        }

        public getCallSignatures(): PullSignatureSymbol[] {
            if (this.typeAliasLink) {
                return (<PullTypeSymbol>this.typeAliasLink.end).getCallSignatures();
            }

            return [];
        }

        public getConstructSignatures(): PullSignatureSymbol[] {
            if (this.typeAliasLink) {
                return (<PullTypeSymbol>this.typeAliasLink.end).getConstructSignatures();
            }

            return [];
        }

        public getIndexSignatures(): PullSignatureSymbol[] {
            if (this.typeAliasLink) {
                return (<PullTypeSymbol>this.typeAliasLink.end).getIndexSignatures();
            }

            return [];
        }

        public findMember(name: string): PullSymbol {
            if (this.typeAliasLink) {
                return (<PullTypeSymbol>this.typeAliasLink.end).findMember(name);
            }

            return null;
        }

        public findNestedType(name: string): PullTypeSymbol {
            if (this.typeAliasLink) {
                return (<PullTypeSymbol>this.typeAliasLink.end).findNestedType(name);
            }

            return null;
        }

        public getAllMembers(searchDeclKind: PullElementKind, includePrivate: boolean): PullSymbol[] {
            if (this.typeAliasLink) {
                return (<PullTypeSymbol>this.typeAliasLink.end).getAllMembers(searchDeclKind, includePrivate);
            }

            return [];
        }

        public invalidate() {
            this.isUsedAsValue = false;

            super.invalidate();
        }
    }

    export class PullDefinitionSignatureSymbol extends PullSignatureSymbol {
        public isDefinition() { return true; }
    }

    export class PullFunctionTypeSymbol extends PullTypeSymbol {
        private definitionSignature: PullDefinitionSignatureSymbol = null;

        constructor() {
            super("", PullElementKind.FunctionType);
        }

        public isFunction() { return true; }

        public invalidate() {

            var callSignatures = this.getCallSignatures();

            if (callSignatures.length) {
                for (var i = 0; i < callSignatures.length; i++) {
                    callSignatures[i].invalidate();
                }
            }

            this.definitionSignature = null;

            super.invalidate();
        }

        public addSignature(signature: PullSignatureSymbol) {
            this.addCallSignature(signature);

            if (signature.isDefinition()) {
                this.definitionSignature = <PullDefinitionSignatureSymbol>signature;
            }
        }

        public getDefinitionSignature() { return this.definitionSignature; }
    }

    export class PullConstructorTypeSymbol extends PullTypeSymbol {
        private definitionSignature: PullDefinitionSignatureSymbol = null;

        constructor() {
            super("", PullElementKind.ConstructorType);
        }

        public isFunction() { return true; }
        public isConstructor() { return true; }

        public invalidate() {

            this.definitionSignature = null;

            super.invalidate();
        }

        public addSignature(signature: PullSignatureSymbol) {
            this.addConstructSignature(signature);

            if (signature.isDefinition()) {
                this.definitionSignature = <PullDefinitionSignatureSymbol>signature;
            }
        }

        public addTypeParameter(typeParameter: PullTypeParameterSymbol, doNotChangeContainer?: boolean) {

            this.addMember(typeParameter, SymbolLinkKind.TypeParameter, doNotChangeContainer);

            var constructSignatures = this.getConstructSignatures();

            for (var i = 0; i < constructSignatures.length; i++) {
                constructSignatures[i].addTypeParameter(typeParameter);
            }
        }

        public getDefinitionSignature() { return this.definitionSignature; }
    }

    export class PullTypeParameterSymbol extends PullTypeSymbol {
        private constraintLink: PullSymbolLink = null;

        constructor(name: string, private _isFunctionTypeParameter) {
            super(name, PullElementKind.TypeParameter);
        }

        public isTypeParameter() { return true; }
        public isFunctionTypeParameter() { return this._isFunctionTypeParameter; }

        public isFixed() { return false; }

        public setConstraint(constraintType: PullTypeSymbol) {

            if (this.constraintLink) {
                this.removeOutgoingLink(this.constraintLink);
            }

            this.constraintLink = this.addOutgoingLink(constraintType, SymbolLinkKind.TypeConstraint);
        }

        public getConstraint(): PullTypeSymbol {
            if (this.constraintLink) {
                return <PullTypeSymbol>this.constraintLink.end;
            }

            return null;
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

            if (useConstraintInName && this.constraintLink) {
                name += " extends " + this.constraintLink.end.toString();
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

            if (useConstraintInName && this.constraintLink) {
                name += " extends " + this.constraintLink.end.toString();
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

        private getterSymbolLink: PullSymbolLink = null;
        private setterSymbolLink: PullSymbolLink = null;

        constructor(name: string) {
            super(name, PullElementKind.Property);
        }

        public isAccessor() { return true; }

        public setSetter(setter: PullSymbol) {
            this.setterSymbolLink = this.addOutgoingLink(setter, SymbolLinkKind.SetterFunction);
        }

        public getSetter(): PullSymbol {
            var setter: PullSymbol = null;

            if (this.setterSymbolLink) {
                setter = this.setterSymbolLink.end;
            }

            return setter;
        }

        public removeSetter() {
            if (this.setterSymbolLink) {
                this.removeOutgoingLink(this.setterSymbolLink);
            }
        }

        public setGetter(getter: PullSymbol) {
            this.getterSymbolLink = this.addOutgoingLink(getter, SymbolLinkKind.GetterFunction);
        }

        public getGetter(): PullSymbol {
            var getter: PullSymbol = null;

            if (this.getterSymbolLink) {
                getter = this.getterSymbolLink.end;
            }

            return getter;
        }

        public removeGetter() {
            if (this.getterSymbolLink) {
                this.removeOutgoingLink(this.getterSymbolLink);
            }
        }

        public invalidate() {
            if (this.getterSymbolLink) {
                this.getterSymbolLink.end.invalidate();
            }

            if (this.setterSymbolLink) {
                this.setterSymbolLink.end.invalidate();
            }

            super.invalidate();
        }
    }

    export class PullArrayTypeSymbol extends PullTypeSymbol {
        private elementType: PullTypeSymbol = null;

        public isArray() { return true; }
        public getElementType() { return this.elementType; }
        public isGeneric() { return true; }

        constructor() {
            super("Array", PullElementKind.Array);
        }

        public setElementType(type: PullTypeSymbol) {
            this.elementType = type;
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?:boolean) {
            var elementMemberName = this.elementType ?
                (this.elementType.isArray() || this.elementType.isNamedTypeSymbol() ?
                this.elementType.getScopedNameEx(scopeSymbol, false, getPrettyTypeName, getTypeParamMarkerInfo) :
                this.elementType.getMemberTypeNameEx(false, scopeSymbol, getPrettyTypeName)) :
                MemberName.create("any");
            return MemberName.create(elementMemberName, "", "[]");
        }

        public getMemberTypeNameEx(topLevel: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): MemberName {
            var elementMemberName = this.elementType ? this.elementType.getMemberTypeNameEx(false, scopeSymbol, getPrettyTypeName) : MemberName.create("any");
            return MemberName.create(elementMemberName, "", "[]");
        }
    }

    // PULLTODO: This should be a part of the resolver class
    export function specializeToArrayType(typeToReplace: PullTypeSymbol, typeToSpecializeTo: PullTypeSymbol, resolver: PullTypeResolver, context: PullTypeResolutionContext) {

        var arrayInterfaceType = resolver.getCachedArrayType();

        // For the time-being, only specialize interface types
        // this way we can assume only public members and non-static methods
        if (!arrayInterfaceType || (arrayInterfaceType.getKind() & PullElementKind.Interface) === 0) {
            return null;
        }

        // PULLREVIEW: Accept both generic and non-generic arrays for now
        if (arrayInterfaceType.isGeneric()) {
            var enclosingDecl = arrayInterfaceType.getDeclarations()[0];
            return specializeType(arrayInterfaceType, [typeToSpecializeTo], resolver, enclosingDecl, context);
        }

        if (typeToSpecializeTo.getArrayType()) {
            return typeToSpecializeTo.getArrayType();
        }

        // PULLTODO: Recursive reference bug
        var newArrayType: PullTypeSymbol = new PullArrayTypeSymbol();
        newArrayType.addDeclaration(arrayInterfaceType.getDeclarations()[0]);

        typeToSpecializeTo.setArrayType(newArrayType);
        newArrayType.addOutgoingLink(typeToSpecializeTo, SymbolLinkKind.ArrayOf);

        var field: PullSymbol = null;
        var newField: PullSymbol = null;
        var fieldType: PullTypeSymbol = null;

        var method: PullSymbol = null;
        var methodType: PullFunctionTypeSymbol = null;
        var newMethod: PullSymbol = null;
        var newMethodType: PullFunctionTypeSymbol = null;

        var signatures: PullSignatureSymbol[] = null;
        var newSignature: PullSignatureSymbol = null;

        var parameters: PullSymbol[] = null;
        var newParameter: PullSymbol = null;
        var parameterType: PullTypeSymbol = null;

        var returnType: PullTypeSymbol = null;
        var newReturnType: PullTypeSymbol = null;

        var members = arrayInterfaceType.getMembers();

        for (var i = 0; i < members.length; i++) {
            resolver.resolveDeclaredSymbol(members[i], null, context);

            if (members[i].getKind() === PullElementKind.Method) { // must be a method
                method = <PullFunctionTypeSymbol> members[i];

                resolver.resolveDeclaredSymbol(method, null, context);

                methodType = <PullFunctionTypeSymbol>method.getType();

                newMethod = new PullSymbol(method.getName(), PullElementKind.Method);
                newMethodType = new PullFunctionTypeSymbol();
                newMethod.setType(newMethodType);

                newMethod.addDeclaration(method.getDeclarations()[0]);

                signatures = methodType.getCallSignatures();

                // specialize each signature
                for (var j = 0; j < signatures.length; j++) {

                    newSignature = new PullSignatureSymbol(PullElementKind.CallSignature);
                    newSignature.addDeclaration(signatures[j].getDeclarations()[0]);

                    parameters = signatures[j].getParameters();
                    returnType = signatures[j].getReturnType();

                    if (returnType === typeToReplace) {
                        newSignature.setReturnType(typeToSpecializeTo);
                    }
                    else {
                        newSignature.setReturnType(returnType);
                    }

                    for (var k = 0; k < parameters.length; k++) {
                        newParameter = new PullSymbol(parameters[k].getName(), parameters[k].getKind());

                        parameterType = parameters[k].getType();

                        if (parameterType === null) { continue; }


                        if (parameterType === typeToReplace) {
                            newParameter.setType(typeToSpecializeTo);
                        }
                        else {
                            newParameter.setType(parameterType);
                        }

                        newSignature.addParameter(newParameter);
                    }

                    newMethodType.addSignature(newSignature);
                }

                newArrayType.addMember(newMethod, SymbolLinkKind.PublicMember);
            }

            else { // must be a field
                field = members[i];

                newField = new PullSymbol(field.getName(), field.getKind());
                newField.addDeclaration(field.getDeclarations()[0]);

                fieldType = field.getType();

                if (fieldType === typeToReplace) {
                    newField.setType(typeToSpecializeTo);
                }
                else {
                    newField.setType(fieldType);
                }

                newArrayType.addMember(newField, SymbolLinkKind.PublicMember);
            }
        }
        newArrayType.addOutgoingLink(arrayInterfaceType, SymbolLinkKind.ArrayType);
        return newArrayType;
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

        return (typeToSpecialize.getKind() & (PullElementKind.Class | PullElementKind.Interface)) ? <PullTypeSymbol>decl.getSymbol().getType() : typeToSpecialize;
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
            if (parent.getFlags() & PullElementFlags.Static) {
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
                var elementType = (<PullArrayTypeSymbol>typeToSpecialize).getElementType();

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

        if (searchForExistingSpecialization || context.specializingToAny) {
            if (!typeArguments.length || context.specializingToAny) {
                for (var i = 0; i < typeParameters.length; i++) {
                    typeArguments[typeArguments.length] = resolver.semanticInfoChain.anyTypeSymbol;
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
                        diagnostic = context.postError(enclosingDecl.getScriptName(), declAST.minChar, declAST.getLength(), DiagnosticCode.A_generic_type_may_not_reference_itself_with_its_own_type_parameters, null, enclosingDecl, true);
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
            var diagnostic: SemanticDiagnostic;
            var declAST: AST;

            for (var i = 0; i < typesToReplace.length; i++) {

                if (!typesToReplace[i].isTypeParameter() && (typeArguments[i] == rootType || typeWrapsTypeParameter(typesToReplace[i], typeParameters[i]))) {
                    declAST = resolver.semanticInfoChain.getASTForDecl(newTypeDecl);
                    if (declAST && typeArguments[i] != resolver.getCachedArrayType()) {
                        diagnostic = context.postError(enclosingDecl.getScriptName(), declAST.minChar, declAST.getLength(), DiagnosticCode.A_generic_type_may_not_reference_itself_with_its_own_type_parameters, null, enclosingDecl, true);
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
            if (!newType.isResolved() && !newType.currentlyBeingSpecialized()) {
                typeToSpecialize.invalidateSpecializations();
            }
            else {
                return newType;
            }
        }
        
        var prevInSpecialization = context.inSpecialization;
        context.inSpecialization = true;

        nSpecializationsCreated++;

        newType = typeToSpecialize.isClass() ? new PullClassTypeSymbol(typeToSpecialize.getName()) :
                    isArray ? new PullArrayTypeSymbol() :
                    typeToSpecialize.isTypeParameter() ? // watch out for replacing one tyvar with another
                        new PullTypeVariableSymbol(typeToSpecialize.getName(), (<PullTypeParameterSymbol>typeToSpecialize).isFunctionTypeParameter()) :
                        new PullTypeSymbol(typeToSpecialize.getName(), typeToSpecialize.getKind());
        newType.setRootSymbol(rootType);

        newType.setIsBeingSpecialized();

        newType.setTypeArguments(typeArguments);

        rootType.addSpecialization(newType, typeArguments);

        if (isArray) {
            (<PullArrayTypeSymbol>newType).setElementType(typeArguments[0]);
            typeArguments[0].setArrayType(newType);
        }

        if (typeToSpecialize.currentlyBeingSpecialized()) {
            return newType;
        }

        // If it's a constructor, we want to flag the type as being specialized
        // to prevent stack overflows when specializing the return type
        var prevCurrentlyBeingSpecialized = typeToSpecialize.currentlyBeingSpecialized();
        if (typeToSpecialize.getKind() == PullElementKind.ConstructorType) {
            typeToSpecialize.setIsBeingSpecialized();
        }

        // create the type replacement map

        var typeReplacementMap: any = {};

        for (var i = 0; i < typeParameters.length; i++) {
            if (typeParameters[i] != typeArguments[i]) {
                typeReplacementMap[typeParameters[i].getSymbolID().toString()] = typeArguments[i];
            }
            newType.addMember(typeParameters[i], SymbolLinkKind.TypeParameter, true);
        }

        // specialize any extends/implements types
        var extendedTypesToSpecialize = typeToSpecialize.getExtendedTypes();
        var typeDecl: PullDecl;
        var typeAST: TypeDeclaration;
        var unitPath: string;
        var decls: PullDecl[] = typeToSpecialize.getDeclarations();

        if (extendedTypesToSpecialize.length) {
            for (var i = 0; i < decls.length; i++) {
                typeDecl = decls[i];
                typeAST = <TypeDeclaration>resolver.semanticInfoChain.getASTForDecl(typeDecl);

                // if this is an 'extended' interface declaration, the AST's extends list may not match
                if (typeAST.extendsList) {
                    unitPath = resolver.getUnitPath();
                    resolver.setUnitPath(typeDecl.getScriptName());
                    context.pushTypeSpecializationCache(typeReplacementMap);
                    var extendTypeSymbol = resolver.resolveTypeReference(new TypeReference(typeAST.extendsList.members[0], 0), typeDecl, context).symbol;
                    resolver.setUnitPath(unitPath);
                    context.popTypeSpecializationCache();

                    newType.addExtendedType(extendTypeSymbol);
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
                    context.pushTypeSpecializationCache(typeReplacementMap);
                    var implementedTypeSymbol = resolver.resolveTypeReference(new TypeReference(typeAST.implementsList.members[0], 0), typeDecl, context).symbol;
                    resolver.setUnitPath(unitPath);
                    context.popTypeSpecializationCache();

                    newType.addImplementedType(implementedTypeSymbol);
                }
            }
        }

        var callSignatures = typeToSpecialize.getCallSignatures(false);
        var constructSignatures = typeToSpecialize.getConstructSignatures(false);
        var indexSignatures = typeToSpecialize.getIndexSignatures(false);
        var members = typeToSpecialize.getMembers();

        // specialize call signatures
        var newSignature: PullSignatureSymbol;
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

                newSignature = new PullSignatureSymbol(signature.getKind());
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Call signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);

                // if the signature is not yet specialized, specialize the signature using an empty context first - that way, no type parameters
                // will be accidentally specialized
                if (!(signature.isResolved() || signature.isResolving())) {
                    resolver.resolveDeclaredSymbol(signature, enclosingDecl, new PullTypeResolutionContext());
                }   

                resolver.resolveAST(declAST, false, newTypeDecl, context);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.getParameters();
                newParameters = newSignature.getParameters();

                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].setType(parameters[p].getType());
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.getReturnType();

                if (!returnType) {
                    newSignature.setReturnType(signature.getReturnType());
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

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

            if (newSignature.hasGenericParameter()) {
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

                newSignature = new PullSignatureSymbol(signature.getKind());
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Construct signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);

                if (!(signature.isResolved() || signature.isResolving())) {
                    resolver.resolveDeclaredSymbol(signature, enclosingDecl, new PullTypeResolutionContext());
                } 

                resolver.resolveAST(declAST, false, newTypeDecl, context);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.getParameters();
                newParameters = newSignature.getParameters();

                // we need to clone the parameter types, but the return type
                // was set during resolution
                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].setType(parameters[p].getType());
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.getReturnType();

                if (!returnType) {
                    newSignature.setReturnType(signature.getReturnType());
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

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

            if (newSignature.hasGenericParameter()) {
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

                newSignature = new PullSignatureSymbol(signature.getKind());
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Index signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);

                if (!(signature.isResolved() || signature.isResolving())) {
                    resolver.resolveDeclaredSymbol(signature, enclosingDecl, new PullTypeResolutionContext());
                } 

                resolver.resolveAST(declAST, false, newTypeDecl, context);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.getParameters();
                newParameters = newSignature.getParameters();

                // we need to clone the parameter types, but the return type
                // was set during resolution
                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].setType(parameters[p].getType());
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.getReturnType();

                if (!returnType) {
                    newSignature.setReturnType(signature.getReturnType());
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

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

            if (newSignature.hasGenericParameter()) {
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

            newField = new PullSymbol(field.getName(), field.getKind());

            newField.setRootSymbol(field);

            if (field.getIsOptional()) {
                newField.setIsOptional();
            }

            if (!field.isResolved()) {
                resolver.resolveDeclaredSymbol(field, newTypeDecl, context);
            }            

            fieldType = field.getType();

            if (!fieldType) {
                fieldType = newType; //new PullTypeVariableSymbol("tyvar" + globalTyvarID);
            }

            replacementType = <PullTypeSymbol>typeReplacementMap[fieldType.getSymbolID().toString()];

            if (replacementType) {
                newField.setType(replacementType);
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

                    newField.setType(newFieldType);
                }
                else {
                    newField.setType(fieldType);
                }
            }
            field.setIsSpecialized();
            newType.addMember(newField, (field.hasFlag(PullElementFlags.Private)) ? SymbolLinkKind.PrivateMember : SymbolLinkKind.PublicMember);
        }

        // specialize the constructor and statics, if need be
        if (typeToSpecialize.isClass()) {
            var constructorMethod = (<PullClassTypeSymbol>typeToSpecialize).getConstructorMethod();

            // If we haven't yet resolved the constructor method, we need to resolve it *without* substituting
            // for any type variables, so as to avoid accidentally specializing the root declaration
            if (!constructorMethod.isResolved()) {
                var prevIsSpecializingConstructorMethod = context.isSpecializingConstructorMethod;
                context.isSpecializingConstructorMethod = true;
                resolver.resolveDeclaredSymbol(constructorMethod, enclosingDecl, context);
                context.isSpecializingConstructorMethod = prevIsSpecializingConstructorMethod;
            }

            var newConstructorMethod = new PullSymbol(constructorMethod.getName(), PullElementKind.ConstructorMethod);
            var newConstructorType = specializeType(constructorMethod.getType(), typeArguments, resolver, newTypeDecl, context, ast);

            newConstructorMethod.setType(newConstructorType);

            var constructorDecls: PullDecl[] = constructorMethod.getDeclarations();

            newConstructorMethod.setRootSymbol(constructorMethod);

            (<PullClassTypeSymbol>newType).setConstructorMethod(newConstructorMethod);
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

        if (!signature.isResolved() && !signature.isResolving()) {
            resolver.resolveDeclaredSymbol(signature, enclosingDecl, context);
        }

        var newSignature = signature.getSpecialization(typeArguments);

        if (newSignature) {
            return newSignature;
        }

        signature.setIsBeingSpecialized();

        var prevInSpecialization = context.inSpecialization;
        context.inSpecialization = true;

        newSignature = new PullSignatureSymbol(signature.getKind());
        nSpecializedSignaturesCreated++;
        newSignature.setRootSymbol(signature);

        if (signature.hasVariableParamList()) {
            newSignature.setHasVariableParamList();
        }

        if (signature.hasGenericParameter()) {
            newSignature.setHasGenericParameter();
        }

        signature.addSpecialization(newSignature, typeArguments);      

        var parameters = signature.getParameters();
        var typeParameters = signature.getTypeParameters();
        var returnType = signature.getReturnType();

        for (var i = 0; i < typeParameters.length; i++) {
            newSignature.addTypeParameter(typeParameters[i]);
        }

        if (signature.hasGenericParameter()) {
            newSignature.setHasGenericParameter();
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
                localSkipMap[typeParameters[i].getSymbolID().toString()] = typeParameters[i];
            }
        }

        context.pushTypeSpecializationCache(typeReplacementMap);

        if (skipLocalTypeParameters && localSkipMap) {
            context.pushTypeSpecializationCache(localSkipMap);
        }
        var newReturnType = (!localTypeParameters[returnType.getName()] /*&& typeArguments != null*/) ? specializeType(returnType, null/*typeArguments*/, resolver, enclosingDecl, context, ast) : returnType;
        if (skipLocalTypeParameters && localSkipMap) {
            context.popTypeSpecializationCache();
        }
        context.popTypeSpecializationCache();

        newSignature.setReturnType(newReturnType);

        for (var k = 0; k < parameters.length; k++) {

            newParameter = new PullSymbol(parameters[k].getName(), parameters[k].getKind());
            newParameter.setRootSymbol(parameters[k]);

            parameterType = parameters[k].getType();

            context.pushTypeSpecializationCache(typeReplacementMap);
            if (skipLocalTypeParameters && localSkipMap) {
                context.pushTypeSpecializationCache(localSkipMap);
            }
            newParameterType = !localTypeParameters[parameterType.getName()] ? specializeType(parameterType, null/*typeArguments*/, resolver, enclosingDecl, context, ast) : parameterType;
            if (skipLocalTypeParameters && localSkipMap) {
                context.popTypeSpecializationCache();
            }
            context.popTypeSpecializationCache();

            if (parameters[k].getIsOptional()) {
                newParameter.setIsOptional();
            }

            if (parameters[k].getIsVarArg()) {
                newParameter.setIsVarArg();
                newSignature.setHasVariableParamList();
            }

            if (resolver.isTypeArgumentOrWrapper(newParameterType)) {
                newSignature.setHasGenericParameter();
            }

            newParameter.setType(newParameterType);
            newSignature.addParameter(newParameter, newParameter.getIsOptional());
        }

        signature.setIsSpecialized();

        context.inSpecialization = prevInSpecialization;

        return newSignature;
    }

    export function getIDForTypeSubstitutions(types: PullTypeSymbol[]): string {
        var substitution = "";

        for (var i = 0; i < types.length; i++) {
            substitution += types[i].getSymbolID().toString() + "#";
        }

        return substitution;
    }
}