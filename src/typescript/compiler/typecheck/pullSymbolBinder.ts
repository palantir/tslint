// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var globalBindingPhase = 0;

    export function getPathToDecl(decl: PullDecl): PullDecl[]{
        if (!decl) {
            return [];
        }

        var decls: PullDecl[] = decl.getParentPath();

        if (decls) {
            return decls;
        }
        else {
            decls = [decl];
        }

        var parentDecl: PullDecl = decl.getParentDecl();

        while (parentDecl) {
            if (parentDecl && decls[decls.length - 1] != parentDecl && !(parentDecl.getKind() & PullElementKind.ObjectLiteral)) {
                decls[decls.length] = parentDecl;
            }
            parentDecl = parentDecl.getParentDecl();
        }

        decls = decls.reverse();

        // PULLREVIEW: Only cache in batch compilation scenarios?
        decl.setParentPath(decls);

        return decls;
    }

    export function findSymbolInContext(name: string, declKind: PullElementKind, startingDecl: PullDecl): PullSymbol {
        var startTime = new Date().getTime();
        var contextSymbolPath: PullDecl[] = getPathToDecl(startingDecl);
        var copyOfContextSymbolPath: string[] = [];
        var symbol: PullSymbol = null;

        var endTime = 0;

        // next, link back up to the enclosing context
        if (contextSymbolPath.length) {

            for (var i = 0; i < contextSymbolPath.length; i++) {
                copyOfContextSymbolPath[copyOfContextSymbolPath.length] = contextSymbolPath[i].getName();
            }

            copyOfContextSymbolPath[copyOfContextSymbolPath.length] = name;

            while (copyOfContextSymbolPath.length >= 2) {
                symbol = globalSemanticInfoChain.findSymbol(copyOfContextSymbolPath, declKind);

                if (symbol) {
                    endTime = new Date().getTime();
                    time_in_findSymbol += endTime - startTime;

                    return symbol;
                }
                copyOfContextSymbolPath.length -= 2;
                copyOfContextSymbolPath[copyOfContextSymbolPath.length] = name;
            }
        }

        // finally, try searching globally
        symbol = globalSemanticInfoChain.findSymbol([name], declKind);

        endTime = new Date().getTime();
        time_in_findSymbol += endTime - startTime;

        return symbol;
    }    

    export class PullSymbolBinder {

        private bindingPhase = globalBindingPhase++;

        //private staticClassMembers: PullSymbol[] = [];

        private functionTypeParameterCache: any = new BlockIntrinsics();

        private findTypeParameterInCache(name: string) {
            return <PullTypeParameterSymbol>this.functionTypeParameterCache[name];
        }

        private addTypeParameterToCache(typeParameter: PullTypeParameterSymbol) {
            this.functionTypeParameterCache[typeParameter.getName()] = typeParameter;
        }

        private resetTypeParameterCache() {
            this.functionTypeParameterCache = new BlockIntrinsics();
        }

        public semanticInfo: SemanticInfo;

        public reBindingAfterChange = false;
        public startingDeclForRebind = pullDeclID; // note that this gets set on creation
        public startingSymbolForRebind = pullSymbolID; // note that this gets set on creation

        constructor(public semanticInfoChain: SemanticInfoChain) {
        }

        public setUnit(fileName: string) {
            this.semanticInfo = this.semanticInfoChain.getUnit(fileName);
        }

        public getParent(decl: PullDecl, returnInstanceType = false): PullTypeSymbol {

            var parentDecl = decl.getParentDecl();

            if (parentDecl.getKind() == PullElementKind.Script) {
                return null;
            }

            var parent = parentDecl.getSymbol();

            if (!parent && parentDecl && !parentDecl.isBound()) {
                this.bindDeclToPullSymbol(parentDecl);
            }

            parent = parentDecl.getSymbol();
            if (parent) {
                var parentDeclKind = parentDecl.getKind();
                if (parentDeclKind == PullElementKind.GetAccessor) {
                    parent = (<PullAccessorSymbol>parent).getGetter();
                } else if (parentDeclKind == PullElementKind.SetAccessor) {
                    parent = (<PullAccessorSymbol>parent).getSetter();
                }
            }

            if (parent) {
                if (returnInstanceType && parent.isType() && parent.isContainer()) {
                    var instanceSymbol = (<PullContainerTypeSymbol>parent).getInstanceSymbol();

                    if (instanceSymbol) {
                        return instanceSymbol.getType();
                    }
                }

                return parent.getType();
            }

            return null;
        }

        //public getParentDecl(): PullDecl {
        //    return this.parentDeclChain.length ? this.parentDeclChain[this.parentDeclChain.length - 1] : null;
        //}

        //public getDeclPath() { return this.declPath; }

        //public pushParent(parentType: PullTypeSymbol, parentDecl: PullDecl) {
        //    if (parentType) {
        //        this.parentChain[this.parentChain.length] = parentType;
        //        this.parentDeclChain[this.parentDeclChain.length] = parentDecl;
        //        this.declPath[this.declPath.length] = parentType.getName();
        //    }
        //}

        //public popParent() {
        //    if (this.parentChain.length) {
        //        this.parentChain.length--;
        //        this.parentDeclChain.length--;
        //        this.declPath.length--;
        //    }
        //}

        public findDeclsInContext(startingDecl: PullDecl, declKind: PullElementKind, searchGlobally: boolean): PullDecl[]{

            if (!searchGlobally) {
                var parentDecl = startingDecl.getParentDecl();
                return parentDecl.searchChildDecls(startingDecl.getName(), declKind);
            }

            var contextSymbolPath: PullDecl[] = getPathToDecl(startingDecl);

            // next, link back up to the enclosing context
            if (contextSymbolPath.length) {
                var copyOfContextSymbolPath: string[] = [];

                for (var i = 0; i < contextSymbolPath.length; i++) {
                    if (contextSymbolPath[i].getKind() & PullElementKind.Script) {
                        continue;
                    }
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = contextSymbolPath[i].getName();
                }

                return this.semanticInfoChain.findDecls(copyOfContextSymbolPath, declKind);
            }

            // finally, try searching globally
            return this.semanticInfoChain.findDecls([name], declKind);
        }

        public symbolIsRedeclaration(sym: PullSymbol): boolean {
            var symID = sym.getSymbolID();
            return (symID >= this.startingSymbolForRebind) ||
                    ((sym.getRebindingID() === this.bindingPhase) && (symID !== this.startingSymbolForRebind));
        }

        //
        // decl binding
        //

        public bindModuleDeclarationToPullSymbol(moduleContainerDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var modName = moduleContainerDecl.getName();

            var moduleContainerTypeSymbol: PullContainerTypeSymbol = null;
            var moduleInstanceSymbol: PullSymbol = null;
            var moduleInstanceTypeSymbol: PullTypeSymbol = null;

            var moduleInstanceDecl: PullDecl = moduleContainerDecl.getValueDecl();

            var moduleKind = moduleContainerDecl.getKind();

            var parent = this.getParent(moduleContainerDecl);
            var parentInstanceSymbol = this.getParent(moduleContainerDecl, true);
            var parentDecl = moduleContainerDecl.getParentDecl();
            var moduleAST = <ModuleDeclaration>this.semanticInfo.getASTForDecl(moduleContainerDecl);

            var isExported = moduleContainerDecl.getFlags() & PullElementFlags.Exported;
            var isEnum = (moduleKind & PullElementKind.Enum) != 0;
            var searchKind = isEnum ? PullElementKind.Enum : PullElementKind.SomeContainer;
            var isInitializedModule = (moduleContainerDecl.getFlags() & PullElementFlags.SomeInitializedModule) != 0;

            var createdNewSymbol = false;

            if (parent) {
                if (isExported) {
                    moduleContainerTypeSymbol = <PullContainerTypeSymbol>parent.findNestedType(modName, searchKind);
                }
                else {
                    moduleContainerTypeSymbol = <PullContainerTypeSymbol>parent.findContainedMember(modName);

                    if (moduleContainerTypeSymbol && !(moduleContainerTypeSymbol.getKind() & searchKind)) {
                        moduleContainerTypeSymbol = null;
                    }
                }
            }
            else if (!isExported || moduleContainerDecl.getKind() === PullElementKind.DynamicModule) {
                moduleContainerTypeSymbol = <PullContainerTypeSymbol>findSymbolInContext(modName, searchKind, moduleContainerDecl);
            }

            if (moduleContainerTypeSymbol && moduleContainerTypeSymbol.getKind() !== moduleKind) {
                // duplicate symbol error
                if (isInitializedModule) {
                    moduleContainerDecl.addDiagnostic(
                        new SemanticDiagnostic(this.semanticInfo.getPath(), moduleAST.minChar, moduleAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [moduleContainerDecl.getDisplayName()]));
                }

                moduleContainerTypeSymbol = null;
            }

            if (moduleContainerTypeSymbol) {
                moduleInstanceSymbol = moduleContainerTypeSymbol.getInstanceSymbol();
            }
            else { 
                moduleContainerTypeSymbol = new PullContainerTypeSymbol(modName, moduleKind);
                createdNewSymbol = true;

                if (!parent) {
                    this.semanticInfoChain.cacheGlobalSymbol(moduleContainerTypeSymbol, searchKind);
                }
            }

            if (!moduleInstanceSymbol && isInitializedModule) {

                // search for a complementary instance symbol first
                var variableSymbol: PullSymbol = null;
                if (!isEnum) {
                    if (parentInstanceSymbol) {
                        if (isExported) {
                            // We search twice because export visibility does not need to agree
                            variableSymbol = parentInstanceSymbol.findMember(modName, false);

                            if (!variableSymbol) {
                                variableSymbol = parentInstanceSymbol.findContainedMember(modName);
                            }
                        }
                        else {
                            variableSymbol = parentInstanceSymbol.findContainedMember(modName);

                            if (!variableSymbol) {
                                variableSymbol = parentInstanceSymbol.findMember(modName, false);
                            }
                        }

                        if (variableSymbol) {
                            var declarations = variableSymbol.getDeclarations();

                            if (declarations.length) {
                                var variableSymbolParent = declarations[0].getParentDecl();

                                if ((parentDecl !== variableSymbolParent) && (!this.reBindingAfterChange || (variableSymbolParent.getDeclID() >= this.startingDeclForRebind))) {
                                    variableSymbol = null;
                                }
                            }
                        }
                    }
                    else if (!(moduleContainerDecl.getFlags() & PullElementFlags.Exported)) {
                        // Search locally to this file for a previous declaration that's suitable for augmentation
                        var siblingDecls = parentDecl.getChildDecls();
                        var augmentedDecl: PullDecl = null;

                        for (var i = 0; i < siblingDecls.length; i++) {
                            if (siblingDecls[i] == moduleContainerDecl) {
                                break;
                            }

                            if ((siblingDecls[i].getName() == modName) && (siblingDecls[i].getKind() & (PullElementKind.Class | PullElementKind.SomeFunction))) {
                                augmentedDecl = siblingDecls[i];
                                break;
                            }
                        }

                        if (augmentedDecl) {
                            variableSymbol = augmentedDecl.getSymbol();

                            if (variableSymbol && variableSymbol.isType()) {
                                variableSymbol = (<PullTypeSymbol>variableSymbol).getConstructorMethod();
                            }
                        }
                    }
                }

                if (variableSymbol) {
                    var prevKind = variableSymbol.getKind();
                    var acceptableRedeclaration = (prevKind == PullElementKind.Function) || (prevKind == PullElementKind.ConstructorMethod) || variableSymbol.hasFlag(PullElementFlags.ImplicitVariable);

                    if (acceptableRedeclaration) {
                        moduleInstanceTypeSymbol = variableSymbol.getType();
                    }
                    else {
                        variableSymbol = null;
                    }
                }

                if (!moduleInstanceTypeSymbol) {
                    moduleInstanceTypeSymbol = new PullTypeSymbol(modName, PullElementKind.ObjectType);
                }

                moduleInstanceTypeSymbol.addDeclaration(moduleContainerDecl);

                moduleInstanceTypeSymbol.setAssociatedContainerType(moduleContainerTypeSymbol);

                // The instance symbol is further set up in bindVariableDeclaration
                // (We add the declaration there, invalidate previous decls on edit and add the instance symbol to the parent)
                if (variableSymbol) {
                    moduleInstanceSymbol = variableSymbol;
                }
                else {
                    moduleInstanceSymbol = new PullSymbol(modName, PullElementKind.Variable);
                    moduleInstanceSymbol.setType(moduleInstanceTypeSymbol);
                }
                
                moduleContainerTypeSymbol.setInstanceSymbol(moduleInstanceSymbol);

            }

            moduleContainerTypeSymbol.addDeclaration(moduleContainerDecl);
            moduleContainerDecl.setSymbol(moduleContainerTypeSymbol);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(moduleAST.name, SymbolAndDiagnostics.fromSymbol(moduleContainerTypeSymbol));
            this.semanticInfo.setSymbolAndDiagnosticsForAST(moduleAST, SymbolAndDiagnostics.fromSymbol(moduleContainerTypeSymbol));

            // If we have an enum with more than one declaration, then this enum's first element
            // must have an initializer.
            var moduleDeclarations = moduleContainerTypeSymbol.getDeclarations();
            if (isEnum && moduleDeclarations.length > 1 && moduleAST.members.members.length > 0) {
                var multipleEnums = ArrayUtilities.where(moduleDeclarations, d => d.getKind() === PullElementKind.Enum).length > 1;
                if (multipleEnums) {
                    var firstVariable = <VariableStatement>moduleAST.members.members[0];
                    var firstVariableDeclarator = <VariableDeclarator>firstVariable.declaration.declarators.members[0];
                    if (firstVariableDeclarator.isImplicitlyInitialized) {
                        moduleContainerDecl.addDiagnostic(new SemanticDiagnostic(
                            this.semanticInfo.getPath(), firstVariableDeclarator.minChar, firstVariableDeclarator.getLength(), DiagnosticCode.Enums_with_multiple_declarations_must_provide_an_initializer_for_the_first_enum_element, null));
                    }
                }
            }

            if (createdNewSymbol) {

                if (parent) {
                    var linkKind = moduleContainerDecl.getFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                    if (linkKind === SymbolLinkKind.PublicMember) {
                        parent.addMember(moduleContainerTypeSymbol, linkKind);
                    }
                    else {
                        moduleContainerTypeSymbol.setContainer(parent);
                    }
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = moduleContainerTypeSymbol.getDeclarations();
                var scriptName = moduleContainerDecl.getScriptName();

                for (var i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() === scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        moduleContainerTypeSymbol.removeDeclaration(decls[i]);
                    }
                }

                moduleContainerTypeSymbol.invalidate();

                moduleInstanceSymbol = moduleContainerTypeSymbol.getInstanceSymbol();

                if (moduleInstanceSymbol) {
                    var moduleInstanceTypeSymbol = moduleInstanceSymbol.getType();
                    decls = moduleInstanceTypeSymbol.getDeclarations();

                    for (var i = 0; i < decls.length; i++) {
                        if (decls[i].getScriptName() === scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                            moduleInstanceTypeSymbol.removeDeclaration(decls[i]);
                        }
                    }

                    moduleInstanceTypeSymbol.addDeclaration(moduleContainerDecl);
                    moduleInstanceTypeSymbol.invalidate();
                }
            }

            // var childDecls = moduleContainerDecl.getChildDecls();

            // for (var i = 0; i < childDecls.length; i++) {
            //     this.bindDeclToPullSymbol(childDecls[i]);
            // }

            // if it's an enum, freshen the index signature
            if (isEnum) {

                moduleInstanceTypeSymbol = moduleContainerTypeSymbol.getInstanceSymbol().getType();

                if (this.reBindingAfterChange) {
                    var existingIndexSigs = moduleInstanceTypeSymbol.getIndexSignatures();

                    for (var i = 0; i < existingIndexSigs.length; i++) {
                        moduleInstanceTypeSymbol.removeIndexSignature(existingIndexSigs[i]);
                    }
                }

                var enumIndexSignature = new PullSignatureSymbol(PullElementKind.IndexSignature);
                var enumIndexParameterSymbol = new PullSymbol("x", PullElementKind.Parameter);
                enumIndexParameterSymbol.setType(this.semanticInfoChain.numberTypeSymbol);
                enumIndexSignature.addParameter(enumIndexParameterSymbol);
                enumIndexSignature.setReturnType(this.semanticInfoChain.stringTypeSymbol);

                moduleInstanceTypeSymbol.addIndexSignature(enumIndexSignature);

                moduleInstanceTypeSymbol.recomputeIndexSignatures();
            }

            var valueDecl = moduleContainerDecl.getValueDecl();

            if (valueDecl) {
                valueDecl.ensureSymbolIsBound();
            }

            var otherDecls = this.findDeclsInContext(moduleContainerDecl, moduleContainerDecl.getKind(), true);
            
            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        // aliases
        public bindImportDeclaration(importDeclaration: PullDecl) {
            var declFlags = importDeclaration.getFlags();
            var declKind = importDeclaration.getKind();
            var importDeclAST = <VariableDeclarator>this.semanticInfo.getASTForDecl(importDeclaration);

            var isExported = false;
            var linkKind = SymbolLinkKind.PrivateMember;
            var importSymbol: PullTypeAliasSymbol = null;
            var declName = importDeclaration.getName();
            var parentHadSymbol = false;
            var parent = this.getParent(importDeclaration);

            if (parent) {
                importSymbol = <PullTypeAliasSymbol>parent.findMember(declName, false);

                if (!importSymbol) {
                    importSymbol = <PullTypeAliasSymbol>parent.findContainedMember(declName);

                    if (importSymbol) {
                        var declarations = importSymbol.getDeclarations();

                        if (declarations.length) {
                            var importSymbolParent = declarations[0].getParentDecl();

                            if ((importSymbolParent !== importDeclaration.getParentDecl()) && (!this.reBindingAfterChange || (importSymbolParent.getDeclID() >= this.startingDeclForRebind))) {
                                importSymbol = null;
                            }
                        }
                    }
                }
            }
            else if (!(importDeclaration.getFlags() & PullElementFlags.Exported)) {
                importSymbol = <PullTypeAliasSymbol>findSymbolInContext(declName, PullElementKind.SomeContainer, importDeclaration);
            }

            if (importSymbol) {
                parentHadSymbol = true;
            }

            if (importSymbol && this.symbolIsRedeclaration(importSymbol)) {
                importDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), importDeclAST.minChar, importDeclAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [importDeclaration.getDisplayName()]));
                importSymbol = null;
            }

            if (this.reBindingAfterChange && importSymbol) {

                // prune out-of-date decls...
                var decls = importSymbol.getDeclarations();
                var scriptName = importDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        importSymbol.removeDeclaration(decls[j]);
                    }
                }

                importSymbol.setUnresolved();
            }

            if (!importSymbol) {
                importSymbol = new PullTypeAliasSymbol(declName);

                if (!parent) {
                    this.semanticInfoChain.cacheGlobalSymbol(importSymbol, PullElementKind.SomeContainer);
                }
            }

            importSymbol.addDeclaration(importDeclaration);
            importDeclaration.setSymbol(importSymbol);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(importDeclAST, SymbolAndDiagnostics.fromSymbol(importSymbol));

            if (parent && !parentHadSymbol) {

                if (declFlags & PullElementFlags.Exported) {
                    parent.addMember(importSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    importSymbol.setContainer(parent);
                }
            }

            importSymbol.setIsBound(this.bindingPhase);
        }

        private cleanInterfaceSignatures(interfaceSymbol: PullTypeSymbol) {
            var callSigs = interfaceSymbol.getCallSignatures();
            var constructSigs = interfaceSymbol.getConstructSignatures();
            var indexSigs = interfaceSymbol.getIndexSignatures();

            for (var i = 0; i < callSigs.length; i++) {
                if (callSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    interfaceSymbol.removeCallSignature(callSigs[i], false);
                }
            }
            for (var i = 0; i < constructSigs.length; i++) {
                if (constructSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    interfaceSymbol.removeConstructSignature(constructSigs[i], false);
                }
            }
            for (var i = 0; i < indexSigs.length; i++) {
                if (indexSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    interfaceSymbol.removeIndexSignature(indexSigs[i], false);
                }
            }

            interfaceSymbol.recomputeCallSignatures();
            interfaceSymbol.recomputeConstructSignatures();
            interfaceSymbol.recomputeIndexSignatures();
        }

        private cleanClassSignatures(classSymbol: PullClassTypeSymbol) {
            var callSigs = classSymbol.getCallSignatures();
            var constructSigs = classSymbol.getConstructSignatures();
            var indexSigs = classSymbol.getIndexSignatures();

            for (var i = 0; i < callSigs.length; i++) {
                classSymbol.removeCallSignature(callSigs[i], false);
            }
            for (var i = 0; i < constructSigs.length; i++) {
                classSymbol.removeConstructSignature(constructSigs[i], false);
            }
            for (var i = 0; i < indexSigs.length; i++) {
                classSymbol.removeIndexSignature(indexSigs[i], false);
            }

            classSymbol.recomputeCallSignatures();
            classSymbol.recomputeConstructSignatures();
            classSymbol.recomputeIndexSignatures();

            var constructorSymbol = classSymbol.getConstructorMethod();
            var constructorTypeSymbol = <PullConstructorTypeSymbol>(constructorSymbol ? constructorSymbol.getType() : null);

            if (constructorTypeSymbol) {
                constructSigs = constructorTypeSymbol.getConstructSignatures();

                for (var i = 0; i < constructSigs.length; i++) {
                    constructorTypeSymbol.removeConstructSignature(constructSigs[i], false);
                }

                constructorTypeSymbol.recomputeConstructSignatures();
                constructorTypeSymbol.invalidate();
                constructorSymbol.invalidate();
            }

            // just invalidate this once, so we don't pay the cost of rebuilding caches
            // for each signature removed
            classSymbol.invalidate();            
        }

        // classes
        public bindClassDeclarationToPullSymbol(classDecl: PullDecl) {

            var className = classDecl.getName();
            var classSymbol: PullClassTypeSymbol = null;

            var constructorSymbol: PullSymbol = null;
            var constructorTypeSymbol: PullConstructorTypeSymbol = null;

            var classAST = <ClassDeclaration>this.semanticInfo.getASTForDecl(classDecl);
            var parentHadSymbol = false;

            var parent = this.getParent(classDecl);
            var parentDecl = classDecl.getParentDecl();
            var cleanedPreviousDecls = false;
            var isExported = classDecl.getFlags() & PullElementFlags.Exported;
            var isGeneric = false;

            // We're not yet ready to support interfaces augmenting classes (or vice versa)
            var acceptableSharedKind = PullElementKind.Class; // | PullElementKind.Interface;

            if (parent) {
                if (isExported) {
                    classSymbol = <PullClassTypeSymbol>parent.findNestedType(className);

                    if (!classSymbol) {
                        classSymbol = <PullClassTypeSymbol>parent.findMember(className, false);
                    }
                }
                else {
                    classSymbol = <PullClassTypeSymbol>parent.findContainedMember(className);

                    if (classSymbol && (classSymbol.getKind() & acceptableSharedKind)) {

                        var declarations = classSymbol.getDeclarations();

                        if (declarations.length) {

                            var classSymbolParent = declarations[0].getParentDecl();

                            if ((classSymbolParent !== parentDecl) && (!this.reBindingAfterChange || (classSymbolParent.getDeclID() >= this.startingDeclForRebind))) {
                                classSymbol = null;
                            }
                        }
                    }
                    else {
                        classSymbol = null;
                    }
                }
            }
            else {
                classSymbol = <PullClassTypeSymbol>findSymbolInContext(className, acceptableSharedKind, classDecl);
            }

            if (classSymbol && (!(classSymbol.getKind() & acceptableSharedKind) || !this.reBindingAfterChange || this.symbolIsRedeclaration(classSymbol))) {
                classDecl.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), classAST.minChar, classAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [classDecl.getDisplayName()]));
                classSymbol = null;
            }
            else if (classSymbol) {
                parentHadSymbol = true;
            }

            var decls: PullDecl[];

            if (this.reBindingAfterChange && classSymbol) {

                // prune out-of-date decls
                decls = classSymbol.getDeclarations();
                var scriptName = classDecl.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        classSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                constructorSymbol = classSymbol.getConstructorMethod();
                constructorTypeSymbol = <PullConstructorTypeSymbol>constructorSymbol.getType();

                decls = constructorSymbol.getDeclarations();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        constructorSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (constructorSymbol.getIsSynthesized()) {
                    classSymbol.setConstructorMethod(null);
                }

                if (classSymbol.isGeneric()) {
                    //classSymbol.invalidateSpecializations();
                    isGeneric = true;

                    var specializations = classSymbol.getKnownSpecializations();
                    var specialization: PullTypeSymbol = null;

                    for (var i = 0; i < specializations.length; i++) {
                        specializations[i].setUnresolved();
                        specializations[i].invalidate();
                    }

                    classSymbol.cleanTypeParameters();
                    constructorTypeSymbol.cleanTypeParameters();
                }

                classSymbol.setUnresolved();
                constructorSymbol.setUnresolved();
                constructorTypeSymbol.setUnresolved();
            }

            if (!parentHadSymbol) {
                classSymbol = new PullClassTypeSymbol(className);
                
                if (!parent) {
                    this.semanticInfoChain.cacheGlobalSymbol(classSymbol, acceptableSharedKind);
                }
            }

            classSymbol.addDeclaration(classDecl);

            classDecl.setSymbol(classSymbol);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(classAST.name, SymbolAndDiagnostics.fromSymbol(classSymbol));
            this.semanticInfo.setSymbolAndDiagnosticsForAST(classAST, SymbolAndDiagnostics.fromSymbol(classSymbol));

            if (parent && !parentHadSymbol) {
                var linkKind = classDecl.getFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                if (linkKind === SymbolLinkKind.PublicMember) {
                    parent.addMember(classSymbol, linkKind);
                }
                else {
                    classSymbol.setContainer(parent);
                }
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            // PULLTODO: For now, classes should have none of these, though a pre-existing constructor might
            if (parentHadSymbol && cleanedPreviousDecls) {

                this.cleanClassSignatures(classSymbol);

                if (isGeneric) {
                    specializations = classSymbol.getKnownSpecializations();

                    for (var i = 0; i < specializations.length; i++) {
                        this.cleanClassSignatures(<PullClassTypeSymbol>specializations[i]);
                    }                 
                }
            }

            // var childDecls = classDecl.getChildDecls();

            this.resetTypeParameterCache();

            // for (var i = 0; i < childDecls.length; i++) {
            //     this.bindDeclToPullSymbol(childDecls[i]);
            // }

            this.resetTypeParameterCache();

            // create the default constructor symbol, if necessary

            // even if we've already tried to set these, we want to try again after we've walked the class members
            constructorSymbol = classSymbol.getConstructorMethod();
            constructorTypeSymbol = <PullConstructorTypeSymbol>(constructorSymbol ? constructorSymbol.getType() : null);

            if (!constructorSymbol) {
                constructorSymbol = new PullSymbol(className, PullElementKind.ConstructorMethod);
                constructorTypeSymbol = new PullConstructorTypeSymbol();

                constructorSymbol.setIsSynthesized();

                constructorSymbol.setType(constructorTypeSymbol);
                constructorSymbol.addDeclaration(classDecl.getValueDecl());
                classSymbol.setConstructorMethod(constructorSymbol);

                constructorTypeSymbol.addDeclaration(classDecl);

                classSymbol.setHasDefaultConstructor();

                // if (!classAST.extendsList || !classAST.extendsList.members.length) {
                //     var constructorSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);
                //     constructorSignature.setReturnType(classSymbol);
                //     constructorTypeSymbol.addConstructSignature(constructorSignature);
                //     constructorSignature.addDeclaration(classDecl);
                // }

                // set the class decl's AST to the class declaration
                //this.semanticInfo.setASTForDecl(classDecl, classAST);
            }

            constructorTypeSymbol.setAssociatedContainerType(classSymbol);

            // bind statics to the constructor symbol


            var typeParameters = classDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            // PULLREVIEW: Now that we clean type parameters, searching is redundant
            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = classSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), false);

                    classSymbol.addMember(typeParameter, SymbolLinkKind.TypeParameter);
                    constructorTypeSymbol.addTypeParameter(typeParameter, true);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        classDecl.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }


            var valueDecl = classDecl.getValueDecl();

            if (valueDecl) {
                valueDecl.ensureSymbolIsBound();
            }            

            classSymbol.setIsBound(this.bindingPhase);
        }

        // interfaces
        public bindInterfaceDeclarationToPullSymbol(interfaceDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
            var interfaceName = interfaceDecl.getName();
            var interfaceSymbol: PullTypeSymbol = <PullTypeSymbol>findSymbolInContext(interfaceName, PullElementKind.SomeType, interfaceDecl);

            var interfaceAST = <TypeDeclaration>this.semanticInfo.getASTForDecl(interfaceDecl);
            var createdNewSymbol = false;
            var parent = this.getParent(interfaceDecl);

            // We're not yet ready to support interfaces augmenting classes (or vice versa)
            var acceptableSharedKind = PullElementKind.Interface; // | PullElementKind.Class | PullElementKind.Enum;

            if (parent) {
                interfaceSymbol = parent.findNestedType(interfaceName);
            }
            else if (!(interfaceDecl.getFlags() & PullElementFlags.Exported)) {
                interfaceSymbol = <PullClassTypeSymbol>findSymbolInContext(interfaceName, acceptableSharedKind, interfaceDecl);
            }

            if (interfaceSymbol && !(interfaceSymbol.getKind() & acceptableSharedKind)) {
                interfaceDecl.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), interfaceAST.minChar, interfaceAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [interfaceDecl.getDisplayName()]));
                interfaceSymbol = null;
            }

            if (!interfaceSymbol) {
                interfaceSymbol = new PullTypeSymbol(interfaceName, PullElementKind.Interface);
                createdNewSymbol = true;

                if (!parent) {
                    this.semanticInfoChain.cacheGlobalSymbol(interfaceSymbol, acceptableSharedKind);
                }
            }

            interfaceSymbol.addDeclaration(interfaceDecl);
            interfaceDecl.setSymbol(interfaceSymbol);

            if (createdNewSymbol) {

                if (parent) {
                    var linkKind = interfaceDecl.getFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                    if (linkKind === SymbolLinkKind.PublicMember) {
                        parent.addMember(interfaceSymbol, linkKind);
                    }
                    else {
                        interfaceSymbol.setContainer(parent);
                    }
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = interfaceSymbol.getDeclarations();
                var scriptName = interfaceDecl.getScriptName();

                for (var i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() === scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        interfaceSymbol.removeDeclaration(decls[i]);
                    }
                }

                if (interfaceSymbol.isGeneric()) {

                    //interfaceSymbol.invalidateSpecializations();

                    var specializations = interfaceSymbol.getKnownSpecializations();
                    var specialization: PullTypeSymbol = null;

                    for (var i = 0; i < specializations.length; i++) {
                        specialization = specializations[i];

                        this.cleanInterfaceSignatures(specialization);
                        specialization.invalidate();
                    }

                    interfaceSymbol.cleanTypeParameters();
                }

                this.cleanInterfaceSignatures(interfaceSymbol);
                interfaceSymbol.invalidate();
            }

            // var childDecls = interfaceDecl.getChildDecls();

            this.resetTypeParameterCache();

            // for (var i = 0; i < childDecls.length; i++) {
            //     this.bindDeclToPullSymbol(childDecls[i]);
            // }

            this.resetTypeParameterCache();

            var typeParameters = interfaceDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            // PULLREVIEW: Now that we clean type parameters, searching is redundant
            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = interfaceSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), false);

                    interfaceSymbol.addMember(typeParameter, SymbolLinkKind.TypeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        
                        // Because interface declarations can be "split", it's safe to re-use type parameters
                        // of the same name across interface declarations in the same binding phase
                        for (var j = 0; j < typeParameterDecls.length; j++) {
                            var typeParameterDeclParent = typeParameterDecls[j].getParentDecl();

                            if (typeParameterDeclParent && typeParameterDeclParent === interfaceDecl) {
                                var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                                interfaceDecl.addDiagnostic(
                                    new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));

                                break;
                            }
                        }
                    }

                    // clean the decls
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            var otherDecls = this.findDeclsInContext(interfaceDecl, interfaceDecl.getKind(), true);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        public bindObjectTypeDeclarationToPullSymbol(objectDecl: PullDecl) {
            var objectSymbolAST: AST = this.semanticInfo.getASTForDecl(objectDecl);

            var objectSymbol = new PullTypeSymbol("", PullElementKind.ObjectType);

            objectSymbol.addDeclaration(objectDecl);
            objectDecl.setSymbol(objectSymbol);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(objectSymbolAST, SymbolAndDiagnostics.fromSymbol(objectSymbol));

            var childDecls = objectDecl.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            var typeParameters = objectDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = objectSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), false);

                    objectSymbol.addMember(typeParameter, SymbolLinkKind.TypeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        objectDecl.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

        }

        public bindConstructorTypeDeclarationToPullSymbol(constructorTypeDeclaration: PullDecl) {
            var declKind = constructorTypeDeclaration.getKind();
            var declFlags = constructorTypeDeclaration.getFlags();
            var constructorTypeAST = this.semanticInfo.getASTForDecl(constructorTypeDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var constructorTypeSymbol = new PullConstructorTypeSymbol();

            constructorTypeDeclaration.setSymbol(constructorTypeSymbol);
            constructorTypeSymbol.addDeclaration(constructorTypeDeclaration);
            this.semanticInfo.setSymbolAndDiagnosticsForAST(constructorTypeAST, SymbolAndDiagnostics.fromSymbol(constructorTypeSymbol));

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            if ((<FunctionDeclaration>constructorTypeAST).variableArgList) {
                signature.setHasVariableParamList();
            }

            signature.addDeclaration(constructorTypeDeclaration);
            constructorTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(constructorTypeDeclaration), constructorTypeSymbol, signature);

            // add the implicit construct member for this function type
            constructorTypeSymbol.addSignature(signature);

            var typeParameters = constructorTypeDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = constructorTypeSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), false);

                    constructorTypeSymbol.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        constructorTypeDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }
        }

        // variables
        public bindVariableDeclarationToPullSymbol(variableDeclaration: PullDecl) {
            var declFlags = variableDeclaration.getFlags();
            var declKind = variableDeclaration.getKind();
            var varDeclAST = <VariableDeclarator>this.semanticInfo.getASTForDecl(variableDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var linkKind = SymbolLinkKind.PrivateMember;

            var variableSymbol: PullSymbol = null;

            var declName = variableDeclaration.getName();

            var parentHadSymbol = false;

            var parent = this.getParent(variableDeclaration, true);

            var parentDecl = variableDeclaration.getParentDecl();

            var isImplicit = (declFlags & PullElementFlags.ImplicitVariable) !== 0;
            var isModuleValue = (declFlags & (PullElementFlags.InitializedModule | PullElementFlags.InitializedDynamicModule | PullElementFlags.InitializedEnum)) != 0;
            var isEnumValue = (declFlags & PullElementFlags.InitializedEnum) != 0;
            var isClassConstructorVariable = (declFlags & PullElementFlags.ClassConstructorVariable) != 0;

            if (parentDecl && !isImplicit) {
                parentDecl.addVariableDeclToGroup(variableDeclaration);
            }

            // The code below accounts for the variable symbol being a type because
            // modules may create instance variables

            if (parent) {
                if (isExported) {
                    variableSymbol = parent.findMember(declName, false);
                }
                else {
                    variableSymbol = parent.findContainedMember(declName);
                }

                if (variableSymbol) {
                    var declarations = variableSymbol.getDeclarations();

                    if (declarations.length) {
                        var variableSymbolParent = declarations[0].getParentDecl();

                        if ((parentDecl !== variableSymbolParent) && (!this.reBindingAfterChange || (variableSymbolParent.getDeclID() >= this.startingDeclForRebind))) {
                            variableSymbol = null;
                        }
                    }
                }
            }
            else if (!(variableDeclaration.getFlags() & PullElementFlags.Exported)) {
                variableSymbol = findSymbolInContext(declName, PullElementKind.SomeValue, variableDeclaration);
            }

            if (variableSymbol && !variableSymbol.isType()) {
                parentHadSymbol = true;
            }

            var span: TextSpan;
            var decl: PullDecl;
            var decls: PullDecl[];
            var ast: AST;
            var members: PullSymbol[];

            // PULLTODO: Keeping these two error clauses separate for now, so that we can add a better error message later
            if (variableSymbol && this.symbolIsRedeclaration(variableSymbol)) {

                var prevKind = variableSymbol.getKind();
                var prevIsAmbient = variableSymbol.hasFlag(PullElementFlags.Ambient);
                var prevIsEnum = variableSymbol.hasFlag(PullElementFlags.InitializedEnum);
                var prevIsClass = prevKind == PullElementKind.ConstructorMethod;
                var prevIsContainer = variableSymbol.hasFlag(PullElementFlags.InitializedModule | PullElementFlags.InitializedDynamicModule);
                var onlyOneIsEnum = (isEnumValue || prevIsEnum) && !(isEnumValue && prevIsEnum);
                var isAmbient = (variableDeclaration.getFlags() & PullElementFlags.Ambient) != 0;
                var isClass = variableDeclaration.getKind() == PullElementKind.ConstructorMethod;

                var acceptableRedeclaration = isImplicit &&
                    ((!isEnumValue && !isClassConstructorVariable && prevKind == PullElementKind.Function) || // Enums can't mix with functions
                    (!isModuleValue && prevIsContainer && isAmbient) || // an ambient class can be declared after a module
                    (!isModuleValue && prevIsClass) || // the module instance variable can't come after the class instance variable
                    variableSymbol.hasFlag(PullElementFlags.ImplicitVariable));

                // if the previous declaration is a non-ambient class, it must be located in the same file as this declaration
                if (acceptableRedeclaration && prevIsClass && !prevIsAmbient) {
                    if (variableSymbol.getDeclarations()[0].getScriptName() != variableDeclaration.getScriptName()) {
                        acceptableRedeclaration = false;
                    }
                }

                if ((!isModuleValue && !isClass && !isAmbient) || !acceptableRedeclaration || onlyOneIsEnum) {
                    span = variableDeclaration.getSpan();
                    if (!parent || variableSymbol.getIsSynthesized()) {
                        var errorDecl = isImplicit ? variableSymbol.getDeclarations()[0] : variableDeclaration;
                        errorDecl.addDiagnostic(new SemanticDiagnostic(this.semanticInfo.getPath(), span.start(), span.length(), DiagnosticCode.Duplicate_identifier__0_, [variableDeclaration.getDisplayName()]));
                    }

                    variableSymbol = null;
                    parentHadSymbol = false;
                }
            }
            else if (variableSymbol && (variableSymbol.getKind() !== PullElementKind.Variable) && !isImplicit) {
                span = variableDeclaration.getSpan();

                variableDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), span.start(), span.length(), DiagnosticCode.Duplicate_identifier__0_, [variableDeclaration.getDisplayName()]));
                variableSymbol = null;
                parentHadSymbol = false;
            }

            if (this.reBindingAfterChange && variableSymbol && !variableSymbol.isType()) {

                // prune out-of-date decls...
                decls = variableSymbol.getDeclarations();
                var scriptName = variableDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        variableSymbol.removeDeclaration(decls[j]);
                    }
                }

                variableSymbol.invalidate();
            }

            var replaceProperty = false;
            var previousProperty: PullSymbol = null;

            if ((declFlags & PullElementFlags.ImplicitVariable) === 0) {
                if (!variableSymbol) {
                    variableSymbol = new PullSymbol(declName, declKind);
                }

                variableSymbol.addDeclaration(variableDeclaration);
                variableDeclaration.setSymbol(variableSymbol);

                this.semanticInfo.setSymbolAndDiagnosticsForAST(varDeclAST.id, SymbolAndDiagnostics.fromSymbol(variableSymbol));
                this.semanticInfo.setSymbolAndDiagnosticsForAST(varDeclAST, SymbolAndDiagnostics.fromSymbol(variableSymbol));
            }
            else if (!parentHadSymbol) {

                if (isClassConstructorVariable) {
                    // it's really an implicit class decl, so we need to set the type of the symbol to
                    // the constructor type
                    // Note that we would have already found the class symbol in the search above
                    var classTypeSymbol: PullClassTypeSymbol = <PullClassTypeSymbol>variableSymbol;

                    // PULLTODO: In both this case and the case below, we should have already received the
                    // class or module symbol as the variableSymbol found above
                    if (parent) {
                        members = parent.getMembers();

                        for (var i = 0; i < members.length; i++) {
                            if ((members[i].getName() === declName) && (members[i].getKind() === PullElementKind.Class)) {
                                classTypeSymbol = <PullClassTypeSymbol>members[i];
                                break;
                            }
                        }
                    }

                    if (!classTypeSymbol) {
                        var parentDecl = variableDeclaration.getParentDecl();

                        if (parentDecl) {
                            var childDecls = parentDecl.searchChildDecls(declName, PullElementKind.SomeType);

                            if (childDecls.length) {

                                for (var i = 0; i < childDecls.length; i++) {
                                    if (childDecls[i].getValueDecl() === variableDeclaration) {
                                        classTypeSymbol = <PullClassTypeSymbol>childDecls[i].getSymbol();
                                    }
                                }
                            }
                        }

                        if (!classTypeSymbol) {
                            classTypeSymbol = <PullClassTypeSymbol>findSymbolInContext(declName, PullElementKind.SomeType, variableDeclaration);
                        }
                    }

                    if (classTypeSymbol && (classTypeSymbol.getKind() !== PullElementKind.Class)) {
                        classTypeSymbol = null;
                    }

                    if (classTypeSymbol && classTypeSymbol.isClass()) { // protect against duplicate declarations
                        replaceProperty = variableSymbol && variableSymbol.getIsSynthesized();

                        if (replaceProperty) {
                            previousProperty = variableSymbol;
                        }

                        variableSymbol = classTypeSymbol.getConstructorMethod();
                        variableDeclaration.setSymbol(variableSymbol);

                        // set the AST to the constructor method's if possible
                        decls = classTypeSymbol.getDeclarations();

                        if (decls.length) {

                            decl = decls[decls.length - 1];
                            ast = this.semanticInfo.getASTForDecl(decl);

                            if (ast) {
                                this.semanticInfo.setASTForDecl(variableDeclaration, ast);
                            }
                        }
                    }
                    else {
                        // PULLTODO: Clodules/Interfaces on classes
                        if (!variableSymbol) {
                            variableSymbol = new PullSymbol(declName, declKind);
                        }

                        variableSymbol.addDeclaration(variableDeclaration);
                        variableDeclaration.setSymbol(variableSymbol);

                        variableSymbol.setType(this.semanticInfoChain.anyTypeSymbol);
                    }
                }
                else if (declFlags & PullElementFlags.SomeInitializedModule) {
                    var moduleContainerTypeSymbol: PullContainerTypeSymbol = null;
                    var moduleParent = this.getParent(variableDeclaration);

                    if (moduleParent) {
                        members = moduleParent.getMembers();

                        for (var i = 0; i < members.length; i++) {
                            if ((members[i].getName() === declName) && (members[i].isContainer())) {
                                moduleContainerTypeSymbol = <PullContainerTypeSymbol>members[i];
                                break;
                            }
                        }
                    }

                    if (!moduleContainerTypeSymbol) {
                        var parentDecl = variableDeclaration.getParentDecl();

                        if (parentDecl) {
                            var searchKind = (declFlags & (PullElementFlags.InitializedModule | PullElementFlags.InitializedDynamicModule)) ? PullElementKind.SomeContainer : PullElementKind.Enum;
                            var childDecls = parentDecl.searchChildDecls(declName, searchKind);

                            if (childDecls.length) {

                                for (var i = 0; i < childDecls.length; i++) {
                                    if (childDecls[i].getValueDecl() === variableDeclaration) {
                                        moduleContainerTypeSymbol = <PullContainerTypeSymbol>childDecls[i].getSymbol();
                                    }
                                }
                            }
                        }
                        if (!moduleContainerTypeSymbol) {
                            moduleContainerTypeSymbol = <PullContainerTypeSymbol>findSymbolInContext(declName, PullElementKind.SomeContainer, variableDeclaration);
                            
                            if (!moduleContainerTypeSymbol) {
                                moduleContainerTypeSymbol = <PullContainerTypeSymbol>findSymbolInContext(declName, PullElementKind.Enum, variableDeclaration);
                            }
                        }
                    }

                    if (moduleContainerTypeSymbol && (!moduleContainerTypeSymbol.isContainer())) {
                        moduleContainerTypeSymbol = null;
                    }

                    if (moduleContainerTypeSymbol) {
                        variableSymbol = moduleContainerTypeSymbol.getInstanceSymbol();

                        variableSymbol.addDeclaration(variableDeclaration);
                        variableDeclaration.setSymbol(variableSymbol);

                        // set the AST to the constructor method's if possible
                        decls = moduleContainerTypeSymbol.getDeclarations();

                        if (decls.length) {

                            decl = decls[decls.length - 1];
                            ast = this.semanticInfo.getASTForDecl(decl);

                            if (ast) {
                                this.semanticInfo.setASTForDecl(variableDeclaration, ast);
                            }
                        }

                        // we added the variable to the parent when binding the module
                        //parentHadSymbol = true;
                    }
                    else {
                        Debug.assert(false, "Attempted to bind invalid implicit variable symbol");
                    }
                }
            }
            else {
                variableSymbol.addDeclaration(variableDeclaration);
                variableDeclaration.setSymbol(variableSymbol);
            }

            if (parent && !parentHadSymbol) {

                if (declFlags & PullElementFlags.Exported) {
                    parent.addMember(variableSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    variableSymbol.setContainer(parent);
                }
            }
            else if (replaceProperty) {
                parent.removeMember(previousProperty);
                parent.addMember(variableSymbol, linkKind);
            }

            variableSymbol.setIsBound(this.bindingPhase);
        }

        // properties
        public bindPropertyDeclarationToPullSymbol(propertyDeclaration: PullDecl) {
            var declFlags = propertyDeclaration.getFlags();
            var declKind = propertyDeclaration.getKind();
            var propDeclAST = <VariableDeclarator>this.semanticInfo.getASTForDecl(propertyDeclaration);

            var isStatic = false;
            var isOptional = false;

            var linkKind = SymbolLinkKind.PublicMember;

            var propertySymbol: PullSymbol = null;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            if (hasFlag(declFlags, PullElementFlags.Private)) {
                linkKind = SymbolLinkKind.PrivateMember;
            }

            if (hasFlag(declFlags, PullElementFlags.Optional)) {
                isOptional = true;
            }

            var declName = propertyDeclaration.getName();

            var parentHadSymbol = false;

            var parent = this.getParent(propertyDeclaration, true);

            if (parent.isClass() && isStatic) {

                parent = (<PullClassTypeSymbol>parent).getConstructorMethod().getType();

                // for (var i = 0; i < this.staticClassMembers.length; i++) {
                //     if (this.staticClassMembers[i].getName() === declName) {
                //         propertySymbol = this.staticClassMembers[i];
                //         break;
                //     }
                // }


                // if (!propertySymbol && this.reBindingAfterChange) {
                //     var classConstructor = (<PullClassTypeSymbol>parent).getConstructorMethod();

                //     if (classConstructor) {
                //         var classConstructorType = classConstructor.getType();

                //         propertySymbol = classConstructorType.findMember(declName);
                //     }
                // }                
            }
            // else {
                propertySymbol = parent.findMember(declName, false);
            // }

            if (propertySymbol && (!this.reBindingAfterChange || this.symbolIsRedeclaration(propertySymbol))) {

                var span = propertyDeclaration.getSpan();

                propertyDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), span.start(), span.length(), DiagnosticCode.Duplicate_identifier__0_, [propertyDeclaration.getDisplayName()]));

                propertySymbol = null;
            }

            if (propertySymbol) {
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && propertySymbol) {

                // prune out-of-date decls...
                var decls = propertySymbol.getDeclarations();
                var scriptName = propertyDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        propertySymbol.removeDeclaration(decls[j]);
                    }
                }

                propertySymbol.setUnresolved();
            }

            var classTypeSymbol: PullClassTypeSymbol;

            if (!parentHadSymbol) {
                propertySymbol = new PullSymbol(declName, declKind);
            }

            propertySymbol.addDeclaration(propertyDeclaration);
            propertyDeclaration.setSymbol(propertySymbol);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(propDeclAST.id, SymbolAndDiagnostics.fromSymbol(propertySymbol));
            this.semanticInfo.setSymbolAndDiagnosticsForAST(propDeclAST, SymbolAndDiagnostics.fromSymbol(propertySymbol));

            if (isOptional) {
                propertySymbol.setIsOptional();
            }

            if (parent && !parentHadSymbol) {
                if (parent.isClass()) {
                    classTypeSymbol = <PullClassTypeSymbol>parent;

                    // if (isStatic) {
                    //     this.staticClassMembers[this.staticClassMembers.length] = propertySymbol;
                    // }
                    // else {
                        classTypeSymbol.addMember(propertySymbol, linkKind);
                    //}
                }
                else {
                    parent.addMember(propertySymbol, linkKind);
                }
            }

            propertySymbol.setIsBound(this.bindingPhase);
        }

        // parameters
        public bindParameterSymbols(funcDecl: FunctionDeclaration, funcType: PullTypeSymbol, signatureSymbol: PullSignatureSymbol) {
            // create a symbol for each ast
            // if it's a property, add the symbol to the enclosing type's member list
            var parameters: PullSymbol[] = [];
            var decl: PullDecl = null;
            var argDecl: BoundDecl = null;
            var parameterSymbol: PullSymbol = null;
            var isProperty = false;
            var params: any = new BlockIntrinsics();

            if (funcDecl.arguments) {

                for (var i = 0; i < funcDecl.arguments.members.length; i++) {
                    argDecl = <BoundDecl>funcDecl.arguments.members[i];
                    decl = this.semanticInfo.getDeclForAST(argDecl);
                    isProperty = hasFlag(argDecl.getVarFlags(), VariableFlags.Property);
                    parameterSymbol = new PullSymbol(argDecl.id.text, PullElementKind.Parameter);

                    if (funcDecl.variableArgList && i === funcDecl.arguments.members.length - 1) {
                        parameterSymbol.setIsVarArg();
                    }

                    if (decl.getFlags() & PullElementFlags.Optional) {
                        parameterSymbol.setIsOptional();
                    }

                    if (params[argDecl.id.text]) {
                        decl.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), argDecl.minChar, argDecl.getLength(), DiagnosticCode.Duplicate_identifier__0_, [argDecl.id.actualText]));
                    }
                    else {
                        params[argDecl.id.text] = true;
                    }
                    if (decl) {

                        if (isProperty) {
                            decl.ensureSymbolIsBound();
                            var valDecl = decl.getValueDecl();

                            // if this is a parameter property, we still need to set the value decl
                            // for the function parameter
                            if (valDecl) {
                                valDecl.setSymbol(parameterSymbol);
                                parameterSymbol.addDeclaration(valDecl);
                            }                            
                        }
                        else {
                            parameterSymbol.addDeclaration(decl);
                            decl.setSymbol(parameterSymbol);
                        }
                    }
                    //this.semanticInfo.setSymbolAndDiagnosticsForAST(argDecl.id, SymbolAndDiagnostics.fromSymbol(parameterSymbol));
                    //this.semanticInfo.setSymbolAndDiagnosticsForAST(argDecl, SymbolAndDiagnostics.fromSymbol(parameterSymbol));

                    signatureSymbol.addParameter(parameterSymbol, parameterSymbol.getIsOptional());

                    if (signatureSymbol.isDefinition()) {
                        parameterSymbol.setContainer(funcType);
                    }

                    // PULLREVIEW: Shouldn't need this, since parameters are created off of decl collection
                    // add a member to the parent type
                    //if (decl && isProperty) {
                    //    parameterSymbol = new PullSymbol(argDecl.id.text, PullElementKind.Field);

                    //    parameterSymbol.addDeclaration(decl);
                    //    decl.setPropertySymbol(parameterSymbol);

                    //    var linkKind = (decl.getDeclFlags() & PullElementFlags.Private) ? SymbolLinkKind.PrivateProperty : SymbolLinkKind.PublicProperty;
                    //    var parent = context.getParent(1);
                    //    if (parent.hasBrand()) {
                    //        (<PullClassSymbol>parent).getInstanceType().addMember(parameterSymbol, linkKind);
                    //    }
                    //    else {
                    //        // PULLTODO: I don't think we ever even take this branch...
                    //        parent.addMember(parameterSymbol, linkKind);
                    //    }
                    //}
                }
            }
        }

        // function declarations
        public bindFunctionDeclarationToPullSymbol(functionDeclaration: PullDecl) {
            var declKind = functionDeclaration.getKind();
            var declFlags = functionDeclaration.getFlags();
            var funcDeclAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(functionDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var funcName = functionDeclaration.getName();

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;

            var parent = this.getParent(functionDeclaration, true);
            var parentDecl = functionDeclaration.getParentDecl();
            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;

            // PULLREVIEW: On a re-bind, there's no need to search far-and-wide: just look in the parent's member list
            var functionSymbol: PullSymbol = null;
            var functionTypeSymbol: PullTypeSymbol = null;

            if (parent) {
                functionSymbol = parent.findMember(funcName, false);

                if (!functionSymbol) {
                    functionSymbol = parent.findContainedMember(funcName);

                    if (functionSymbol) {
                        var declarations = functionSymbol.getDeclarations();

                        if (declarations.length) {
                            var funcSymbolParent = declarations[0].getParentDecl();

                            if ((parentDecl !== funcSymbolParent) && (!this.reBindingAfterChange || (funcSymbolParent.getDeclID() >= this.startingDeclForRebind))) {
                                functionSymbol = null;
                            }
                        }
                    }
                }
            }
            else if (!(functionDeclaration.getFlags() & PullElementFlags.Exported)) {
                functionSymbol = findSymbolInContext(funcName, PullElementKind.SomeValue, functionDeclaration);
            }

            if (functionSymbol && 
                (functionSymbol.getKind() !== PullElementKind.Function ||
                    (this.symbolIsRedeclaration(functionSymbol) && !isSignature && !functionSymbol.allDeclsHaveFlag(PullElementFlags.Signature)))) {
                functionDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [functionDeclaration.getDisplayName()]));
                functionSymbol = null;
            }

            if (functionSymbol) {
                functionTypeSymbol = <PullFunctionTypeSymbol>functionSymbol.getType();
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && functionSymbol) {

                // prune out-of-date decls...
                var decls = functionSymbol.getDeclarations();
                var scriptName = functionDeclaration.getScriptName();
                var isGeneric = functionTypeSymbol.isGeneric();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        functionSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                decls = functionTypeSymbol.getDeclarations();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        functionTypeSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (isGeneric) {
                    var specializations = functionTypeSymbol.getKnownSpecializations();

                    for (var i = 0; i < specializations.length; i++) {
                        specializations[i].invalidate();
                    }
                }

                functionSymbol.invalidate();
                functionTypeSymbol.invalidate();
            }

            if (!functionSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                functionSymbol = new PullSymbol(funcName, PullElementKind.Function);
            }

            if (!functionTypeSymbol) {
                functionTypeSymbol = new PullFunctionTypeSymbol();
                functionSymbol.setType(functionTypeSymbol);
            }

            functionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionDeclaration);
            functionTypeSymbol.addDeclaration(functionDeclaration);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcDeclAST.name, SymbolAndDiagnostics.fromSymbol(functionSymbol));
            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcDeclAST, SymbolAndDiagnostics.fromSymbol(functionSymbol));

            if (parent && !parentHadSymbol) {
                if (isExported) {
                    parent.addMember(functionSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    functionSymbol.setContainer(parent);
                }
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = functionTypeSymbol.getCallSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    functionTypeSymbol.removeCallSignature(callSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                functionSymbol.invalidate();
                functionTypeSymbol.invalidate();
                functionTypeSymbol.recomputeCallSignatures();

                if (isGeneric) {
                    var specializations = functionTypeSymbol.getKnownSpecializations();

                    for (var j = 0; j < specializations.length; j++) {
                        callSigs = specializations[j].getCallSignatures();

                        for (var i = 0; i < callSigs.length; i++) {
                            callSigs[i].invalidate();
                        }
                    }
                }
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(functionDeclaration);
            functionDeclaration.setSignatureSymbol(signature);

            if (funcDeclAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(functionDeclaration), functionTypeSymbol, signature);

            var typeParameters = functionDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), true);

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        functionDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            // add the implicit call member for this function type
            functionTypeSymbol.addCallSignature(signature);

            if (!isSignature) {
                // var childDecls = functionDeclaration.getChildDecls();

                // for (var i = 0; i < childDecls.length; i++) {
                //     this.bindDeclToPullSymbol(childDecls[i]);
                // }
            }

            functionSymbol.setIsBound(this.bindingPhase);

            var otherDecls = this.findDeclsInContext(functionDeclaration, functionDeclaration.getKind(), false);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        public bindFunctionExpressionToPullSymbol(functionExpressionDeclaration: PullDecl) {
            var declKind = functionExpressionDeclaration.getKind();
            var declFlags = functionExpressionDeclaration.getFlags();
            var funcExpAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(functionExpressionDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionName = declKind == PullElementKind.FunctionExpression ?
                                    (<PullFunctionExpressionDecl>functionExpressionDeclaration).getFunctionExpressionName() :
                                    functionExpressionDeclaration.getName();
            var functionSymbol: PullSymbol = new PullSymbol(functionName, PullElementKind.Function);
            var functionTypeSymbol = new PullFunctionTypeSymbol();

            functionSymbol.setType(functionTypeSymbol);

            functionExpressionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionExpressionDeclaration);
            functionTypeSymbol.addDeclaration(functionExpressionDeclaration);

            if (funcExpAST.name) {
                this.semanticInfo.setSymbolAndDiagnosticsForAST(funcExpAST.name, SymbolAndDiagnostics.fromSymbol(functionSymbol));
            }
            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcExpAST, SymbolAndDiagnostics.fromSymbol(functionSymbol));

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            if (funcExpAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            var typeParameters = functionExpressionDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), true);

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        functionExpressionDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            signature.addDeclaration(functionExpressionDeclaration);
            functionExpressionDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(functionExpressionDeclaration), functionTypeSymbol, signature);

            // add the implicit call member for this function type
            functionTypeSymbol.addSignature(signature);

            // var childDecls = functionExpressionDeclaration.getChildDecls();

            // for (var i = 0; i < childDecls.length; i++) {
            //     this.bindDeclToPullSymbol(childDecls[i]);
            // }
        }

        public bindFunctionTypeDeclarationToPullSymbol(functionTypeDeclaration: PullDecl) {
            var declKind = functionTypeDeclaration.getKind();
            var declFlags = functionTypeDeclaration.getFlags();
            var funcTypeAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(functionTypeDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionTypeSymbol = new PullFunctionTypeSymbol();

            functionTypeDeclaration.setSymbol(functionTypeSymbol);
            functionTypeSymbol.addDeclaration(functionTypeDeclaration);
            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcTypeAST, SymbolAndDiagnostics.fromSymbol(functionTypeSymbol));

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;
            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            if (funcTypeAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            var typeParameters = functionTypeDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), true);

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        functionTypeDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            signature.addDeclaration(functionTypeDeclaration);
            functionTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(functionTypeDeclaration), functionTypeSymbol, signature);

            // add the implicit call member for this function type
            functionTypeSymbol.addSignature(signature);
        }

        // method declarations
        public bindMethodDeclarationToPullSymbol(methodDeclaration: PullDecl) {
            var declKind = methodDeclaration.getKind();
            var declFlags = methodDeclaration.getFlags();
            var methodAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(methodDeclaration);

            var isPrivate = (declFlags & PullElementFlags.Private) !== 0;
            var isStatic = (declFlags & PullElementFlags.Static) !== 0;
            var isOptional = (declFlags & PullElementFlags.Optional) !== 0;

            var methodName = methodDeclaration.getName();

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;

            var parent = this.getParent(methodDeclaration, true);
            var parentHadSymbol = false;

            var cleanedPreviousDecls = false;

            var methodSymbol: PullSymbol = null;
            var methodTypeSymbol: PullFunctionTypeSymbol = null;

            var linkKind = isPrivate ? SymbolLinkKind.PrivateMember : SymbolLinkKind.PublicMember;

            if (parent.isClass() && isStatic) {
                parent = (<PullClassTypeSymbol>parent).getConstructorMethod().getType();
                // for (var i = 0; i < this.staticClassMembers.length; i++) {
                //     if (this.staticClassMembers[i].getName() === methodName) {
                //         methodSymbol = this.staticClassMembers[i];
                //         break;
                //     }
                // }

                // if (!methodSymbol && this.reBindingAfterChange) {
                //     var classConstructor = (<PullClassTypeSymbol>parent).getConstructorMethod();

                //     if (classConstructor) {
                //         var classConstructorType = classConstructor.getType();

                //         methodSymbol = classConstructorType.findMember(methodName);
                //     }
                // }

            }
            //else {
                methodSymbol = parent.findMember(methodName, false);
            //}

            if (methodSymbol &&
                (methodSymbol.getKind() !== PullElementKind.Method ||
                (this.symbolIsRedeclaration(methodSymbol) && !isSignature && !methodSymbol.allDeclsHaveFlag(PullElementFlags.Signature)))) {
                methodDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), methodAST.minChar, methodAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [methodDeclaration.getDisplayName()]));
                methodSymbol = null;
            }

            if (methodSymbol) {
                methodTypeSymbol = <PullFunctionTypeSymbol>methodSymbol.getType();
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && methodSymbol) {

                // prune out-of-date decls...
                var decls = methodSymbol.getDeclarations();
                var scriptName = methodDeclaration.getScriptName();
                var isGeneric = methodTypeSymbol.isGeneric();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        methodSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                decls = methodTypeSymbol.getDeclarations();
                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        methodTypeSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (isGeneric) {
                    var specializations = methodTypeSymbol.getKnownSpecializations();

                    for (var i = 0; i < specializations.length; i++) {
                        specializations[i].invalidate();
                    }
                }

                methodSymbol.invalidate();
                methodTypeSymbol.invalidate();
            }

            if (!methodSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                methodSymbol = new PullSymbol(methodName, PullElementKind.Method);
            }

            if (!methodTypeSymbol) {
                methodTypeSymbol = new PullFunctionTypeSymbol();
                methodSymbol.setType(methodTypeSymbol);
            }

            methodDeclaration.setSymbol(methodSymbol);
            methodSymbol.addDeclaration(methodDeclaration);
            methodTypeSymbol.addDeclaration(methodDeclaration);
            this.semanticInfo.setSymbolAndDiagnosticsForAST(methodAST.name, SymbolAndDiagnostics.fromSymbol(methodSymbol));
            this.semanticInfo.setSymbolAndDiagnosticsForAST(methodAST, SymbolAndDiagnostics.fromSymbol(methodSymbol));

            if (isOptional) {
                methodSymbol.setIsOptional();
            }

            if (!parentHadSymbol) {

                // if (isStatic) {
                //     this.staticClassMembers[this.staticClassMembers.length] = methodSymbol;
                // }
                // else {
                    parent.addMember(methodSymbol, linkKind);
                //}
            }

            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = methodTypeSymbol.getCallSignatures();
                var constructSigs = methodTypeSymbol.getConstructSignatures();
                var indexSigs = methodTypeSymbol.getIndexSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    methodTypeSymbol.removeCallSignature(callSigs[i], false);
                }
                for (var i = 0; i < constructSigs.length; i++) {
                    methodTypeSymbol.removeConstructSignature(constructSigs[i], false);
                }
                for (var i = 0; i < indexSigs.length; i++) {
                    methodTypeSymbol.removeIndexSignature(indexSigs[i], false);
                }

                methodSymbol.invalidate();
                methodTypeSymbol.invalidate();
                methodTypeSymbol.recomputeCallSignatures();
                methodTypeSymbol.recomputeConstructSignatures();
                methodTypeSymbol.recomputeIndexSignatures();

                if (isGeneric) {
                    var specializations = methodTypeSymbol.getKnownSpecializations();

                    for (var j = 0; j < specializations.length; j++) {
                        callSigs = specializations[j].getCallSignatures();

                        for (var i = 0; i < callSigs.length; i++) {
                            callSigs[i].invalidate();
                        }
                    }
                }
            }

            var sigKind = PullElementKind.CallSignature;

            var signature = isSignature ? new PullSignatureSymbol(sigKind) : new PullDefinitionSignatureSymbol(sigKind);

            if (methodAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            var typeParameters = methodDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;
            var typeParameterName: string;
            var typeParameterAST: TypeParameter;

            for (var i = 0; i < typeParameters.length; i++) {
                typeParameterName = typeParameters[i].getName();
                typeParameterAST = <TypeParameter>this.semanticInfo.getASTForDecl(typeParameters[i]);

                typeParameter = signature.findTypeParameter(typeParameterName);


                if (!typeParameter) {

                    if (!typeParameterAST.constraint) {
                        typeParameter = this.findTypeParameterInCache(typeParameterName);
                    }

                    if (!typeParameter) {
                        typeParameter = new PullTypeParameterSymbol(typeParameterName, true);

                        if (!typeParameterAST.constraint) {
                            this.addTypeParameterToCache(typeParameter);
                        }
                    }

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        typeParameterAST = <TypeParameter>this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        methodDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            signature.addDeclaration(methodDeclaration);
            methodDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(methodDeclaration), methodTypeSymbol, signature);

            // add the implicit call member for this function type
            methodTypeSymbol.addSignature(signature);

            if (!isSignature) {
                // var childDecls = methodDeclaration.getChildDecls();

                // for (var i = 0; i < childDecls.length; i++) {
                //     this.bindDeclToPullSymbol(childDecls[i]);
                // }
            }

            //methodSymbol.setIsBound(this.bindingPhase);
            var otherDecls = this.findDeclsInContext(methodDeclaration, methodDeclaration.getKind(), false);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        // class constructor declarations
        public bindConstructorDeclarationToPullSymbol(constructorDeclaration: PullDecl) {
            var declKind = constructorDeclaration.getKind();
            var declFlags = constructorDeclaration.getFlags();
            var constructorAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(constructorDeclaration);

            var constructorName = constructorDeclaration.getName();

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;

            var parent = <PullClassTypeSymbol>this.getParent(constructorDeclaration, true);

            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;

            var constructorSymbol: PullSymbol = parent.getConstructorMethod();
            var constructorTypeSymbol: PullConstructorTypeSymbol = null;

            var linkKind = SymbolLinkKind.ConstructorMethod;
            
            if (constructorSymbol &&
                (constructorSymbol.getKind() !== PullElementKind.ConstructorMethod ||
                (!isSignature && 
                    constructorSymbol.getType() && 
                    constructorSymbol.getType().hasOwnConstructSignatures() && 
                    (<PullConstructorTypeSymbol>constructorSymbol.getType()).getDefinitionSignature() &&
                    !constructorSymbol.allDeclsHaveFlag(PullElementFlags.Signature)))) {

                constructorDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), constructorAST.minChar, constructorAST.getLength(), DiagnosticCode.Multiple_constructor_implementations_are_not_allowed, null));

                constructorSymbol = null;
            }

            if (constructorSymbol) {

                constructorTypeSymbol = <PullConstructorTypeSymbol>constructorSymbol.getType();

                if (this.reBindingAfterChange) {
                    // prune out-of-date decls...
                    var decls = constructorSymbol.getDeclarations();
                    var scriptName = constructorDeclaration.getScriptName();
                    var isGeneric = constructorTypeSymbol.isGeneric();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            constructorSymbol.removeDeclaration(decls[j]);

                            cleanedPreviousDecls = true;
                        }
                    }

                    decls = constructorTypeSymbol.getDeclarations();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            constructorTypeSymbol.removeDeclaration(decls[j]);

                            cleanedPreviousDecls = true;
                        }
                    }

                    if (isGeneric) {
                        var specializations = constructorTypeSymbol.getKnownSpecializations();

                        for (var i = 0; i < specializations.length; i++) {
                            specializations[i].invalidate();
                        }
                    }                          

                    constructorSymbol.invalidate();
                    constructorTypeSymbol.invalidate();
                }
            }

            if (!constructorSymbol) {
                constructorSymbol = new PullSymbol(constructorName, PullElementKind.ConstructorMethod);
                constructorTypeSymbol = new PullConstructorTypeSymbol();
            }

            // Even if we're reusing the symbol, it would have been cleared by the call to invalidate above
            parent.setConstructorMethod(constructorSymbol);
            constructorSymbol.setType(constructorTypeSymbol);

            constructorDeclaration.setSymbol(constructorSymbol);
            constructorSymbol.addDeclaration(constructorDeclaration);
            constructorTypeSymbol.addDeclaration(constructorDeclaration);
            this.semanticInfo.setSymbolAndDiagnosticsForAST(constructorAST, SymbolAndDiagnostics.fromSymbol(constructorSymbol));

            if (parentHadSymbol && cleanedPreviousDecls) {
                var constructSigs = constructorTypeSymbol.getConstructSignatures();

                for (var i = 0; i < constructSigs.length; i++) {
                    constructorTypeSymbol.removeConstructSignature(constructSigs[i]);
                }

                constructorSymbol.invalidate();
                constructorTypeSymbol.invalidate();
                constructorTypeSymbol.recomputeConstructSignatures();

                if (isGeneric) {
                    var specializations = constructorTypeSymbol.getKnownSpecializations();

                    for (var j = 0; j < specializations.length; j++) {
                        constructSigs = specializations[j].getConstructSignatures();

                        for (var i = 0; i < constructSigs.length; i++) {
                            constructSigs[i].invalidate();
                        }
                    }
                }
            }

            // add a call signature to the constructor method, and a construct signature to the parent class type
            var constructSignature = isSignature ? new PullSignatureSymbol(PullElementKind.ConstructSignature) : new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            constructSignature.setReturnType(parent);

            constructSignature.addDeclaration(constructorDeclaration);
            constructorDeclaration.setSignatureSymbol(constructSignature);

            this.bindParameterSymbols(constructorAST, constructorTypeSymbol, constructSignature);

            var typeParameters = constructorTypeSymbol.getTypeParameters();

            for (var i = 0; i < typeParameters.length; i++) {
                constructSignature.addTypeParameter(typeParameters[i]);
            }

            if (constructorAST.variableArgList) {
                constructSignature.setHasVariableParamList();
            }

            constructorTypeSymbol.addSignature(constructSignature);

            if (!isSignature) {
                // var childDecls = constructorDeclaration.getChildDecls();

                // for (var i = 0; i < childDecls.length; i++) {
                //     this.bindDeclToPullSymbol(childDecls[i]);
                // }
            }

            //constructorSymbol.setIsBound(this.bindingPhase);
            var otherDecls = this.findDeclsInContext(constructorDeclaration, constructorDeclaration.getKind(), false);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        public bindConstructSignatureDeclarationToPullSymbol(constructSignatureDeclaration: PullDecl) {
            var parent = this.getParent(constructSignatureDeclaration, true);
            var constructorAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(constructSignatureDeclaration);

            var constructSigs = parent.getConstructSignatures();

            for (var i = 0; i < constructSigs.length; i++) {
                if (constructSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    parent.removeConstructSignature(constructSigs[i], false);
                }
            }

            // update the construct signature list
            parent.recomputeConstructSignatures();
            var constructSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);

            if (constructorAST.variableArgList) {
                constructSignature.setHasVariableParamList();
            }

            var typeParameters = constructSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = constructSignature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), true);

                    constructSignature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        constructSignatureDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            constructSignature.addDeclaration(constructSignatureDeclaration);
            constructSignatureDeclaration.setSignatureSymbol(constructSignature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(constructSignatureDeclaration), null, constructSignature);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(this.semanticInfo.getASTForDecl(constructSignatureDeclaration), SymbolAndDiagnostics.fromSymbol(constructSignature));

            parent.addConstructSignature(constructSignature);
        }

        public bindCallSignatureDeclarationToPullSymbol(callSignatureDeclaration: PullDecl) {
            var parent = this.getParent(callSignatureDeclaration, true);
            var callSignatureAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(callSignatureDeclaration);

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            var callSigs = parent.getCallSignatures();

            for (var i = 0; i < callSigs.length; i++) {
                if (callSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    parent.removeCallSignature(callSigs[i], false);
                }
            }

            // update the call signature list
            parent.recomputeCallSignatures();

            var callSignature = new PullSignatureSymbol(PullElementKind.CallSignature);

            if (callSignatureAST.variableArgList) {
                callSignature.setHasVariableParamList();
            }

            var typeParameters = callSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = callSignature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), true);

                    callSignature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        callSignatureDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            callSignature.addDeclaration(callSignatureDeclaration);
            callSignatureDeclaration.setSignatureSymbol(callSignature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(callSignatureDeclaration), null, callSignature);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(this.semanticInfo.getASTForDecl(callSignatureDeclaration), SymbolAndDiagnostics.fromSymbol(callSignature));

            parent.addCallSignature(callSignature);
        }

        public bindIndexSignatureDeclarationToPullSymbol(indexSignatureDeclaration: PullDecl) {
            var parent = this.getParent(indexSignatureDeclaration, true);

            var indexSigs = parent.getIndexSignatures();

            for (var i = 0; i < indexSigs.length; i++) {
                if (indexSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    parent.removeIndexSignature(indexSigs[i], false);
                }
            }

            // update the index signature list
            parent.recomputeIndexSignatures();

            var indexSignature = new PullSignatureSymbol(PullElementKind.IndexSignature);

            var typeParameters = indexSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = indexSignature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName(), true);

                    indexSignature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    if (this.symbolIsRedeclaration(typeParameter)) {
                        var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                        indexSignatureDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [typeParameter.getName()]));
                    }

                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            indexSignature.addDeclaration(indexSignatureDeclaration);
            indexSignatureDeclaration.setSignatureSymbol(indexSignature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(indexSignatureDeclaration), null, indexSignature);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(this.semanticInfo.getASTForDecl(indexSignatureDeclaration), SymbolAndDiagnostics.fromSymbol(indexSignature));

            parent.addIndexSignature(indexSignature);
        }

        // getters and setters

        public bindGetAccessorDeclarationToPullSymbol(getAccessorDeclaration: PullDecl) {
            var declKind = getAccessorDeclaration.getKind();
            var declFlags = getAccessorDeclaration.getFlags();
            var funcDeclAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(getAccessorDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var funcName = getAccessorDeclaration.getName();

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;
            var isStatic = false;
            var linkKind = SymbolLinkKind.PublicMember;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            if (hasFlag(declFlags, PullElementFlags.Private)) {
                linkKind = SymbolLinkKind.PrivateMember;
            }

            var parent = this.getParent(getAccessorDeclaration, true);
            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;

            var accessorSymbol: PullAccessorSymbol = null;
            var getterSymbol: PullSymbol = null;
            var getterTypeSymbol: PullFunctionTypeSymbol = null;

            if (isStatic) {
                parent = (<PullClassTypeSymbol>parent).getConstructorMethod().getType();
            }

            accessorSymbol = <PullAccessorSymbol>parent.findMember(funcName, false);

            if (accessorSymbol) {
                if (!accessorSymbol.isAccessor()) {
                    getAccessorDeclaration.addDiagnostic(
                        new SemanticDiagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Duplicate_identifier__0_ , [getAccessorDeclaration.getDisplayName()]));
                    accessorSymbol = null;
                }
                else {
                    getterSymbol = accessorSymbol.getGetter();

                    if (getterSymbol && (!this.reBindingAfterChange || this.symbolIsRedeclaration(getterSymbol))) {
                        getAccessorDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(),funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Getter__0__already_declared, [getAccessorDeclaration.getDisplayName()]));
                        accessorSymbol = null;
                        getterSymbol = null;
                    }
                }
            }

            if (accessorSymbol) {
                parentHadSymbol = true;
            }

            // we have an accessor we can use...
            if (accessorSymbol && getterSymbol) {
                getterTypeSymbol = <PullFunctionTypeSymbol>getterSymbol.getType();
            }

            if (this.reBindingAfterChange && accessorSymbol) {

                // prune out-of-date decls...
                var decls = accessorSymbol.getDeclarations();
                var scriptName = getAccessorDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        accessorSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (getterSymbol) {
                    decls = getterSymbol.getDeclarations();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            getterSymbol.removeDeclaration(decls[j]);

                            cleanedPreviousDecls = true;
                        }
                    }
                }

                accessorSymbol.invalidate();
            }

            if (!accessorSymbol) {
                accessorSymbol = new PullAccessorSymbol(funcName);
            }

            if (!getterSymbol) {
                getterSymbol = new PullSymbol(funcName, PullElementKind.Function);
                getterTypeSymbol = new PullFunctionTypeSymbol();

                getterSymbol.setType(getterTypeSymbol);

                accessorSymbol.setGetter(getterSymbol);
            }

            getAccessorDeclaration.setSymbol(accessorSymbol);
            accessorSymbol.addDeclaration(getAccessorDeclaration);
            getterSymbol.addDeclaration(getAccessorDeclaration);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcDeclAST.name, SymbolAndDiagnostics.fromSymbol(getterSymbol));
            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcDeclAST, SymbolAndDiagnostics.fromSymbol(getterSymbol));

            // PULLTODO: Verify parent is a class or object literal
            // PULLTODO: Verify static/non-static between getter and setter

            if (!parentHadSymbol) {
                parent.addMember(accessorSymbol, linkKind);
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = getterTypeSymbol.getCallSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    getterTypeSymbol.removeCallSignature(callSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                getterSymbol.invalidate();
                getterTypeSymbol.invalidate();
                getterTypeSymbol.recomputeCallSignatures();
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(getAccessorDeclaration);
            getAccessorDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(getAccessorDeclaration), getterTypeSymbol, signature);

            var typeParameters = getAccessorDeclaration.getTypeParameters();

            if (typeParameters.length) {
                getAccessorDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Accessor_cannot_have_type_parameters, null));
            }

            // add the implicit call member for this function type
            getterTypeSymbol.addSignature(signature);

            if (!isSignature) {
                // var childDecls = getAccessorDeclaration.getChildDecls();

                // for (var i = 0; i < childDecls.length; i++) {
                //     this.bindDeclToPullSymbol(childDecls[i]);
                // }
            }

            getterSymbol.setIsBound(this.bindingPhase);
        }

        public bindSetAccessorDeclarationToPullSymbol(setAccessorDeclaration: PullDecl) {
            var declKind = setAccessorDeclaration.getKind();
            var declFlags = setAccessorDeclaration.getFlags();
            var funcDeclAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(setAccessorDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var funcName = setAccessorDeclaration.getName();

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;
            var isStatic = false;
            var linkKind = SymbolLinkKind.PublicMember;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            if (hasFlag(declFlags, PullElementFlags.Private)) {
                linkKind = SymbolLinkKind.PrivateMember;
            }

            var parent = this.getParent(setAccessorDeclaration, true);
            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;

            var accessorSymbol: PullAccessorSymbol = null;
            var setterSymbol: PullSymbol = null;
            var setterTypeSymbol: PullFunctionTypeSymbol = null;

            if (isStatic) {
                parent = (<PullClassTypeSymbol>parent).getConstructorMethod().getType();
            }

            accessorSymbol = <PullAccessorSymbol>parent.findMember(funcName, false);

            if (accessorSymbol) {
                if (!accessorSymbol.isAccessor()) {
                    setAccessorDeclaration.addDiagnostic(
                        new SemanticDiagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Duplicate_identifier__0_, [setAccessorDeclaration.getDisplayName()]));
                    accessorSymbol = null;
                }
                else {
                    setterSymbol = accessorSymbol.getSetter();

                    if (setterSymbol && (!this.reBindingAfterChange || this.symbolIsRedeclaration(setterSymbol))) {
                        setAccessorDeclaration.addDiagnostic(
                            new SemanticDiagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Setter__0__already_declared, [setAccessorDeclaration.getDisplayName()]));
                        accessorSymbol = null;
                        setterSymbol = null;
                    }
                }
            }

            if (accessorSymbol) {
                parentHadSymbol = true;
            }

            // we have an accessor we can use...
            if (accessorSymbol && setterSymbol) {
                setterTypeSymbol = <PullFunctionTypeSymbol>setterSymbol.getType();
            }

            if (this.reBindingAfterChange && accessorSymbol) {

                // prune out-of-date decls...
                var decls = accessorSymbol.getDeclarations();
                var scriptName = setAccessorDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        accessorSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (setterSymbol) {
                    decls = setterSymbol.getDeclarations();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() === scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            setterSymbol.removeDeclaration(decls[j]);

                            cleanedPreviousDecls = true;
                        }
                    }
                }

                accessorSymbol.invalidate();
            }

            if (!accessorSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                accessorSymbol = new PullAccessorSymbol(funcName);
            }

            if (!setterSymbol) {
                setterSymbol = new PullSymbol(funcName, PullElementKind.Function);
                setterTypeSymbol = new PullFunctionTypeSymbol();

                setterSymbol.setType(setterTypeSymbol);

                accessorSymbol.setSetter(setterSymbol);
            }

            setAccessorDeclaration.setSymbol(accessorSymbol);
            accessorSymbol.addDeclaration(setAccessorDeclaration);
            setterSymbol.addDeclaration(setAccessorDeclaration);

            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcDeclAST.name, SymbolAndDiagnostics.fromSymbol(setterSymbol));
            this.semanticInfo.setSymbolAndDiagnosticsForAST(funcDeclAST, SymbolAndDiagnostics.fromSymbol(setterSymbol));

            // PULLTODO: Verify parent is a class or object literal
            // PULLTODO: Verify static/non-static between getter and setter

            if (!parentHadSymbol) {
                parent.addMember(accessorSymbol, linkKind);
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = setterTypeSymbol.getCallSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    setterTypeSymbol.removeCallSignature(callSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                setterSymbol.invalidate();
                setterTypeSymbol.invalidate();
                setterTypeSymbol.recomputeCallSignatures();
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(setAccessorDeclaration);
            setAccessorDeclaration.setSignatureSymbol(signature);

            // PULLTODO: setter should not have a parameters
            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(setAccessorDeclaration), setterTypeSymbol, signature);

            var typeParameters = setAccessorDeclaration.getTypeParameters();

            if (typeParameters.length) {
                setAccessorDeclaration.addDiagnostic(
                    new SemanticDiagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Accessor_cannot_have_type_parameters, null));
            }

            // add the implicit call member for this function type
            setterTypeSymbol.addSignature(signature);

            if (!isSignature) {
                // var childDecls = setAccessorDeclaration.getChildDecls();

                // for (var i = 0; i < childDecls.length; i++) {
                //     this.bindDeclToPullSymbol(childDecls[i]);
                // }
            }

            setterSymbol.setIsBound(this.bindingPhase);
        }

        public bindCatchBlockPullSymbols(catchBlockDecl: PullDecl) {
            // var childDecls = catchBlockDecl.getChildDecls();

            // for (var i = 0; i < childDecls.length; i++) {
            //     this.bindDeclToPullSymbol(childDecls[i]);
            // }
        }

        public bindWithBlockPullSymbols(withBlockDecl: PullDecl) {
            // var childDecls = withBlockDecl.getChildDecls();

            // for (var i = 0; i < childDecls.length; i++) {
            //     this.bindDeclToPullSymbol(childDecls[i]);
            // }
        }

        // binding
        public bindDeclToPullSymbol(decl: PullDecl, rebind = false) {

            if (rebind) {
                this.startingDeclForRebind = lastBoundPullDeclId;
                this.startingSymbolForRebind = lastBoundPullSymbolID;
                this.reBindingAfterChange = true;
            }

            if (decl.isBound()) {
                return;
            }

            // if (globalLogger) {
            //     globalLogger.log("Binding " + decl.getName());
            // }

            decl.setIsBound(true);

            switch (decl.getKind()) {

                case PullElementKind.Script:
                    var childDecls = decl.getChildDecls();
                    for (var i = 0; i < childDecls.length; i++) {
                        this.bindDeclToPullSymbol(childDecls[i]);
                    }
                    break;

                case PullElementKind.Enum:
                case PullElementKind.DynamicModule:
                case PullElementKind.Container:
                    this.bindModuleDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Interface:
                    this.bindInterfaceDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Class:
                    this.bindClassDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Function:
                    this.bindFunctionDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Variable:
                    this.bindVariableDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.EnumMember:
                case PullElementKind.Property:
                    this.bindPropertyDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Method:
                    this.bindMethodDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ConstructorMethod:
                    this.bindConstructorDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.CallSignature:
                    this.bindCallSignatureDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ConstructSignature:
                    this.bindConstructSignatureDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.IndexSignature:
                    this.bindIndexSignatureDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.GetAccessor:
                    this.bindGetAccessorDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.SetAccessor:
                    this.bindSetAccessorDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ObjectType:
                    this.bindObjectTypeDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.FunctionType:
                    this.bindFunctionTypeDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ConstructorType:
                    this.bindConstructorTypeDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.FunctionExpression:
                    this.bindFunctionExpressionToPullSymbol(decl);
                    break;

                case PullElementKind.TypeAlias:
                    this.bindImportDeclaration(decl);
                    break;

                case PullElementKind.Parameter:
                case PullElementKind.TypeParameter:
                    // parameters are bound by their enclosing function or type
                    break;

                case PullElementKind.CatchBlock:
                    this.bindCatchBlockPullSymbols(decl);

                case PullElementKind.WithBlock:
                    this.bindWithBlockPullSymbols(decl);
                    break;

                default:
                    throw new Error("Unrecognized type declaration");
            }
        }

        public bindDeclsForUnit(filePath: string, rebind = false) {
            this.setUnit(filePath);

            var topLevelDecls = this.semanticInfo.getTopLevelDecls();

            for (var i = 0; i < topLevelDecls.length; i++) {
                this.bindDeclToPullSymbol(topLevelDecls[i], rebind);
            }
        }
    }
}