// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    export function getPathToDecl(decl: PullDecl): PullDecl[] {
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
            if (parentDecl && decls[decls.length - 1] != parentDecl && !(parentDecl.kind & PullElementKind.ObjectLiteral)) {
                decls[decls.length] = parentDecl;
            }
            parentDecl = parentDecl.getParentDecl();
        }

        decls = decls.reverse();

        // PULLREVIEW: Only cache in batch compilation scenarios?
        decl.setParentPath(decls);

        return decls;
    }

    export class PullSymbolBinder {

        private functionTypeParameterCache: any = new BlockIntrinsics();

        private findTypeParameterInCache(name: string) {
            return <PullTypeParameterSymbol>this.functionTypeParameterCache[name];
        }

        private addTypeParameterToCache(typeParameter: PullTypeParameterSymbol) {
            this.functionTypeParameterCache[typeParameter.getName()] = typeParameter;
        }

        public resetTypeParameterCache() {
            this.functionTypeParameterCache = new BlockIntrinsics();
        }

        public semanticInfo: SemanticInfo = null;

        constructor(public semanticInfoChain: SemanticInfoChain) {
        }

        public setUnit(fileName: string) {
            this.semanticInfo = this.semanticInfoChain.getUnit(fileName);
        }

        public getParent(decl: PullDecl, returnInstanceType = false): PullTypeSymbol {

            var parentDecl = decl.getParentDecl();

            if (parentDecl.kind == PullElementKind.Script) {
                return null;
            }

            var parent = parentDecl.getSymbol();

            if (!parent && parentDecl && !parentDecl.isBound()) {
                this.bindDeclToPullSymbol(parentDecl);
            }

            parent = parentDecl.getSymbol();
            if (parent) {
                var parentDeclKind = parentDecl.kind;
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
                        return instanceSymbol.type;
                    }
                }

                return parent.type;
            }

            return null;
        }

        public findDeclsInContext(startingDecl: PullDecl, declKind: PullElementKind, searchGlobally: boolean): PullDecl[] {

            if (!searchGlobally) {
                var parentDecl = startingDecl.getParentDecl();
                return parentDecl.searchChildDecls(startingDecl.name, declKind);
            }

            var contextSymbolPath: PullDecl[] = getPathToDecl(startingDecl);

            // next, link back up to the enclosing context
            if (contextSymbolPath.length) {
                var copyOfContextSymbolPath: string[] = [];

                for (var i = 0; i < contextSymbolPath.length; i++) {
                    if (contextSymbolPath[i].kind & PullElementKind.Script) {
                        continue;
                    }
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = contextSymbolPath[i].name;
                }

                return this.semanticInfoChain.findDecls(copyOfContextSymbolPath, declKind);
            }

            // finally, try searching globally
            return this.semanticInfoChain.findDecls([name], declKind);
        }

        //
        // decl binding
        //

        public bindModuleDeclarationToPullSymbol(moduleContainerDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var modName = moduleContainerDecl.name;

            var moduleContainerTypeSymbol: PullContainerTypeSymbol = null;
            var moduleInstanceSymbol: PullSymbol = null;
            var moduleInstanceTypeSymbol: PullTypeSymbol = null;

            var moduleInstanceDecl: PullDecl = moduleContainerDecl.getValueDecl();

            var moduleKind = moduleContainerDecl.kind;

            var parent = this.getParent(moduleContainerDecl);
            var parentInstanceSymbol = this.getParent(moduleContainerDecl, true);
            var parentDecl = moduleContainerDecl.getParentDecl();
            var moduleAST = <ModuleDeclaration>this.semanticInfo.getASTForDecl(moduleContainerDecl);

            var isExported = moduleContainerDecl.flags & PullElementFlags.Exported;
            var isEnum = (moduleKind & PullElementKind.Enum) != 0;
            var searchKind = isEnum ? PullElementKind.Enum : PullElementKind.SomeContainer;
            var isInitializedModule = (moduleContainerDecl.flags & PullElementFlags.SomeInitializedModule) != 0;

            var createdNewSymbol = false;

            if (parent) {
                if (isExported) {
                    moduleContainerTypeSymbol = <PullContainerTypeSymbol>parent.findNestedType(modName, searchKind);
                }
                else {
                    moduleContainerTypeSymbol = <PullContainerTypeSymbol>parent.findContainedNonMemberType(modName);

                    if (moduleContainerTypeSymbol && !(moduleContainerTypeSymbol.kind & searchKind)) {
                        moduleContainerTypeSymbol = null;
                    }
                }
            }
            else if (!isExported || moduleContainerDecl.kind === PullElementKind.DynamicModule) {
                moduleContainerTypeSymbol = <PullContainerTypeSymbol>this.semanticInfoChain.findTopLevelSymbol(modName, searchKind, this.semanticInfo.getPath());
            }

            if (moduleContainerTypeSymbol && moduleContainerTypeSymbol.kind !== moduleKind) {
                // duplicate symbol error
                if (isInitializedModule) {
                    moduleContainerDecl.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), moduleAST.minChar, moduleAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [moduleContainerDecl.getDisplayName()]));
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
                                variableSymbol = parentInstanceSymbol.findContainedNonMember(modName);
                            }
                        }
                        else {
                            variableSymbol = parentInstanceSymbol.findContainedNonMember(modName);

                            if (!variableSymbol) {
                                variableSymbol = parentInstanceSymbol.findMember(modName, false);
                            }
                        }

                        if (variableSymbol) {
                            var declarations = variableSymbol.getDeclarations();

                            if (declarations.length) {
                                var variableSymbolParentDecl = declarations[0].getParentDecl();

                                if (parentDecl !== variableSymbolParentDecl) {
                                    variableSymbol = null;
                                }
                            }
                        }
                    }
                    else if (!(moduleContainerDecl.flags & PullElementFlags.Exported)) {
                        // Search locally to this file for a previous declaration that's suitable for augmentation
                        var siblingDecls = parentDecl.getChildDecls();
                        var augmentedDecl: PullDecl = null;

                        for (var i = 0; i < siblingDecls.length; i++) {
                            if (siblingDecls[i] == moduleContainerDecl) {
                                break;
                            }

                            if ((siblingDecls[i].name == modName) && (siblingDecls[i].kind & (PullElementKind.Class | PullElementKind.SomeFunction))) {
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
                    var prevKind = variableSymbol.kind;
                    var acceptableRedeclaration = (prevKind == PullElementKind.Function) || (prevKind == PullElementKind.ConstructorMethod) || variableSymbol.hasFlag(PullElementFlags.ImplicitVariable);

                    if (acceptableRedeclaration) {
                        moduleInstanceTypeSymbol = variableSymbol.type;
                    }
                    else {
                        variableSymbol = null;
                    }
                }

                if (!moduleInstanceTypeSymbol) {
                    moduleInstanceTypeSymbol = new PullTypeSymbol("", PullElementKind.ObjectType);
                }

                moduleInstanceTypeSymbol.addDeclaration(moduleContainerDecl);

                if (!moduleInstanceTypeSymbol.getAssociatedContainerType()) {
                    moduleInstanceTypeSymbol.setAssociatedContainerType(moduleContainerTypeSymbol);
                }

                // The instance symbol is further set up in bindVariableDeclaration
                // (We add the declaration there, invalidate previous decls on edit and add the instance symbol to the parent)
                if (variableSymbol) {
                    moduleInstanceSymbol = variableSymbol;
                }
                else {
                    moduleInstanceSymbol = new PullSymbol(modName, PullElementKind.Variable);
                    moduleInstanceSymbol.type = moduleInstanceTypeSymbol;
                }

                moduleContainerTypeSymbol.setInstanceSymbol(moduleInstanceSymbol);
            }

            moduleContainerTypeSymbol.addDeclaration(moduleContainerDecl);
            moduleContainerDecl.setSymbol(moduleContainerTypeSymbol);

            this.semanticInfo.setSymbolForAST(moduleAST.name, moduleContainerTypeSymbol);
            this.semanticInfo.setSymbolForAST(moduleAST, moduleContainerTypeSymbol);

            // If we have an enum with more than one declaration, then this enum's first element
            // must have an initializer.
            var moduleDeclarations = moduleContainerTypeSymbol.getDeclarations();

            if (isEnum && moduleDeclarations.length > 1 && moduleAST.members.members.length > 0) {
                var multipleEnums = ArrayUtilities.where(moduleDeclarations, d => d.kind === PullElementKind.Enum).length > 1;
                if (multipleEnums) {
                    var firstVariable = <VariableStatement>moduleAST.members.members[0];
                    var firstVariableDeclarator = <VariableDeclarator>firstVariable.declaration.declarators.members[0];
                    if (!firstVariableDeclarator.init) {
                        moduleContainerDecl.addDiagnostic(new Diagnostic(
                            this.semanticInfo.getPath(), firstVariableDeclarator.minChar, firstVariableDeclarator.getLength(), DiagnosticCode.Enums_with_multiple_declarations_must_provide_an_initializer_for_the_first_enum_element, null));
                    }
                }
            }

            if (createdNewSymbol) {
                if (parent) {
                    if (moduleContainerDecl.flags & PullElementFlags.Exported) {
                        parent.addEnclosedMemberType(moduleContainerTypeSymbol);
                    }
                    else {
                        parent.addEnclosedNonMemberType(moduleContainerTypeSymbol);
                    }
                }
            }

            // if it's an enum, freshen the index signature
            if (isEnum) {

                moduleInstanceTypeSymbol = moduleContainerTypeSymbol.getInstanceSymbol().type;

                var enumIndexSignature = new PullSignatureSymbol(PullElementKind.IndexSignature);
                var enumIndexParameterSymbol = new PullSymbol("x", PullElementKind.Parameter);
                enumIndexParameterSymbol.type = this.semanticInfoChain.numberTypeSymbol;
                enumIndexSignature.addParameter(enumIndexParameterSymbol);
                enumIndexSignature.returnType = this.semanticInfoChain.stringTypeSymbol;

                moduleInstanceTypeSymbol.addIndexSignature(enumIndexSignature);
            }

            var valueDecl = moduleContainerDecl.getValueDecl();

            if (valueDecl) {
                valueDecl.ensureSymbolIsBound();
            }

            var otherDecls = this.findDeclsInContext(moduleContainerDecl, moduleContainerDecl.kind, true);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        // aliases
        public bindImportDeclaration(importDeclaration: PullDecl) {
            var declFlags = importDeclaration.flags;
            var declKind = importDeclaration.kind;
            var importDeclAST = <VariableDeclarator>this.semanticInfo.getASTForDecl(importDeclaration);

            var isExported = false;
            var importSymbol: PullTypeAliasSymbol = null;
            var declName = importDeclaration.name;
            var parentHadSymbol = false;
            var parent = this.getParent(importDeclaration);

            if (parent) {
                importSymbol = <PullTypeAliasSymbol>parent.findMember(declName, false);

                if (!importSymbol) {
                    importSymbol = <PullTypeAliasSymbol>parent.findContainedNonMemberType(declName);

                    if (importSymbol) {
                        var declarations = importSymbol.getDeclarations();

                        if (declarations.length) {
                            var importSymbolParent = declarations[0].getParentDecl();

                            if (importSymbolParent !== importDeclaration.getParentDecl()) {
                                importSymbol = null;
                            }
                        }
                    }
                }
            }
            else if (!(importDeclaration.flags & PullElementFlags.Exported)) {
                importSymbol = <PullTypeAliasSymbol>this.semanticInfoChain.findTopLevelSymbol(declName, PullElementKind.SomeContainer, this.semanticInfo.getPath());
            }

            if (importSymbol) {
                parentHadSymbol = true;
            }

            if (importSymbol) {
                importDeclaration.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), importDeclAST.minChar, importDeclAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [importDeclaration.getDisplayName()]));
                importSymbol = null;
            }

            if (!importSymbol) {
                importSymbol = new PullTypeAliasSymbol(declName);

                if (!parent) {
                    this.semanticInfoChain.cacheGlobalSymbol(importSymbol, PullElementKind.SomeContainer);
                }
            }

            importSymbol.addDeclaration(importDeclaration);
            importDeclaration.setSymbol(importSymbol);

            this.semanticInfo.setSymbolForAST(importDeclAST, importSymbol);

            if (parent && !parentHadSymbol) {

                if (declFlags & PullElementFlags.Exported) {
                    parent.addEnclosedMemberType(importSymbol);
                }
                else {
                    parent.addEnclosedNonMemberType(importSymbol);
                }
            }
        }

        // classes
        public bindClassDeclarationToPullSymbol(classDecl: PullDecl) {

            var className = classDecl.name;
            var classSymbol: PullTypeSymbol = null;

            var constructorSymbol: PullSymbol = null;
            var constructorTypeSymbol: PullTypeSymbol = null;

            var classAST = <ClassDeclaration>this.semanticInfo.getASTForDecl(classDecl);

            var parent = this.getParent(classDecl);
            var parentDecl = classDecl.getParentDecl();
            var isExported = classDecl.flags & PullElementFlags.Exported;
            var isGeneric = false;

            if (parent) {
                if (isExported) {
                    classSymbol = parent.findNestedType(className);

                    if (!classSymbol) {
                        classSymbol = <PullTypeSymbol>parent.findMember(className, false);
                    }
                }
                else {
                    classSymbol = <PullTypeSymbol>parent.findContainedNonMemberType(className);

                    if (classSymbol && (classSymbol.kind & PullElementKind.Class)) {

                        var declarations = classSymbol.getDeclarations();

                        if (declarations.length) {

                            var classSymbolParentDecl = declarations[0].getParentDecl();

                            if (classSymbolParentDecl !== parentDecl) {
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
                classSymbol = <PullTypeSymbol>this.semanticInfoChain.findTopLevelSymbol(className, PullElementKind.Class, this.semanticInfo.getPath());
            }

            if (classSymbol) {
                classDecl.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), classAST.minChar, classAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [classDecl.getDisplayName()]));
                classSymbol = null;
            }

            var decls: PullDecl[];

            classSymbol = new PullTypeSymbol(className, PullElementKind.Class);

            if (!parent) {
                this.semanticInfoChain.cacheGlobalSymbol(classSymbol, PullElementKind.Class);
            }

            classSymbol.addDeclaration(classDecl);

            classDecl.setSymbol(classSymbol);

            this.semanticInfo.setSymbolForAST(classAST.name, classSymbol);
            this.semanticInfo.setSymbolForAST(classAST, classSymbol);

            if (parent) {
                if (classDecl.flags & PullElementFlags.Exported) {
                    parent.addEnclosedMemberType(classSymbol);
                }
                else {
                    parent.addEnclosedNonMemberType(classSymbol);
                }
            }

            this.resetTypeParameterCache();

            // create the default constructor symbol, if necessary

            // even if we've already tried to set these, we want to try again after we've walked the class members
            constructorSymbol = classSymbol.getConstructorMethod();
            constructorTypeSymbol = constructorSymbol ? constructorSymbol.type : null;

            if (!constructorSymbol) {
                constructorSymbol = new PullSymbol(className, PullElementKind.ConstructorMethod);
                constructorTypeSymbol = new PullTypeSymbol("", PullElementKind.ConstructorType);

                constructorSymbol.setIsSynthesized();

                constructorSymbol.type = constructorTypeSymbol;
                classSymbol.setConstructorMethod(constructorSymbol);

                classSymbol.setHasDefaultConstructor();
            }

            if (constructorSymbol.getIsSynthesized()) {
                constructorSymbol.addDeclaration(classDecl.getValueDecl());
                constructorTypeSymbol.addDeclaration(classDecl);
            }
            else {
                classSymbol.setHasDefaultConstructor(false);
            }

            constructorTypeSymbol.setAssociatedContainerType(classSymbol);

            var typeParameters = classDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            // PULLREVIEW: Now that we clean type parameters, searching is redundant
            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = classSymbol.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, false);

                    classSymbol.addTypeParameter(typeParameter);
                    constructorTypeSymbol.addConstructorTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    classDecl.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.getName()]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }


            var valueDecl = classDecl.getValueDecl();

            if (valueDecl) {
                valueDecl.ensureSymbolIsBound();
            }
        }

        // interfaces
        public bindInterfaceDeclarationToPullSymbol(interfaceDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
            var interfaceName = interfaceDecl.name;
            var interfaceSymbol: PullTypeSymbol = null;

            var interfaceAST = <TypeDeclaration>this.semanticInfo.getASTForDecl(interfaceDecl);
            var createdNewSymbol = false;
            var parent = this.getParent(interfaceDecl);

            // We're not yet ready to support interfaces augmenting classes (or vice versa)
            var acceptableSharedKind = PullElementKind.Interface; // | PullElementKind.Class | PullElementKind.Enum;

            if (parent) {
                interfaceSymbol = parent.findNestedType(interfaceName, PullElementKind.SomeType);
            }
            else if (!(interfaceDecl.flags & PullElementFlags.Exported)) {
                interfaceSymbol = <PullTypeSymbol>this.semanticInfoChain.findTopLevelSymbol(interfaceName, PullElementKind.Interface, this.semanticInfo.getPath());
            }

            if (interfaceSymbol && !(interfaceSymbol.kind & acceptableSharedKind)) {
                interfaceDecl.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), interfaceAST.minChar, interfaceAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [interfaceDecl.getDisplayName()]));
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
                    if (interfaceDecl.flags & PullElementFlags.Exported) {
                        parent.addEnclosedMemberType(interfaceSymbol);
                    }
                    else {
                        parent.addEnclosedNonMemberType(interfaceSymbol);
                    }
                }
            }

            this.resetTypeParameterCache();

            var typeParameters = interfaceDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            // PULLREVIEW: Now that we clean type parameters, searching is redundant
            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = interfaceSymbol.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, false);

                    interfaceSymbol.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    // Because interface declarations can be "split", it's safe to re-use type parameters
                    // of the same name across interface declarations in the same binding phase
                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        var typeParameterDeclParent = typeParameterDecls[j].getParentDecl();

                        if (typeParameterDeclParent && typeParameterDeclParent === interfaceDecl) {
                            var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                            interfaceDecl.addDiagnostic(
                                new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.getName()]));

                            break;
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            var otherDecls = this.findDeclsInContext(interfaceDecl, interfaceDecl.kind, true);

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

            this.semanticInfo.setSymbolForAST(objectSymbolAST, objectSymbol);

            var childDecls = objectDecl.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            var typeParameters = objectDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = objectSymbol.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, false);

                    objectSymbol.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    objectDecl.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.name]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

        }

        public bindConstructorTypeDeclarationToPullSymbol(constructorTypeDeclaration: PullDecl) {
            var declKind = constructorTypeDeclaration.kind;
            var declFlags = constructorTypeDeclaration.flags;
            var constructorTypeAST = this.semanticInfo.getASTForDecl(constructorTypeDeclaration);

            var constructorTypeSymbol = new PullTypeSymbol("", PullElementKind.ConstructorType);

            constructorTypeDeclaration.setSymbol(constructorTypeSymbol);
            constructorTypeSymbol.addDeclaration(constructorTypeDeclaration);
            this.semanticInfo.setSymbolForAST(constructorTypeAST, constructorTypeSymbol);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            if ((<FunctionDeclaration>constructorTypeAST).variableArgList) {
                signature.hasVarArgs = true;
            }

            signature.addDeclaration(constructorTypeDeclaration);
            constructorTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(constructorTypeDeclaration), constructorTypeSymbol, signature);

            // add the implicit construct member for this function type
            constructorTypeSymbol.addConstructSignature(signature);

            var typeParameters = constructorTypeDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = constructorTypeSymbol.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, false);

                    constructorTypeSymbol.addConstructorTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    constructorTypeDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.name]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }
        }

        // variables
        public bindVariableDeclarationToPullSymbol(variableDeclaration: PullDecl) {
            var declFlags = variableDeclaration.flags;
            var declKind = variableDeclaration.kind;
            var varDeclAST = <VariableDeclarator>this.semanticInfo.getASTForDecl(variableDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var variableSymbol: PullSymbol = null;

            var declName = variableDeclaration.name;

            var parentHadSymbol = false;

            var parent = this.getParent(variableDeclaration, true);

            var parentDecl = variableDeclaration.getParentDecl();

            var isImplicit = (declFlags & PullElementFlags.ImplicitVariable) !== 0;
            var isModuleValue = (declFlags & (PullElementFlags.SomeInitializedModule)) != 0;
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
                    variableSymbol = parent.findContainedNonMember(declName);
                }

                if (variableSymbol) {
                    var declarations = variableSymbol.getDeclarations();

                    if (declarations.length) {
                        var variableSymbolParentDecl = declarations[0].getParentDecl();

                        if (parentDecl !== variableSymbolParentDecl) {
                            variableSymbol = null;
                        }
                    }
                }
            }
            else if (!(variableDeclaration.flags & PullElementFlags.Exported)) {
                variableSymbol = this.semanticInfoChain.findTopLevelSymbol(declName, PullElementKind.SomeValue, this.semanticInfo.getPath());
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
            if (variableSymbol) {

                var prevKind = variableSymbol.kind;
                var prevIsAmbient = variableSymbol.hasFlag(PullElementFlags.Ambient);
                var prevIsEnum = variableSymbol.hasFlag(PullElementFlags.InitializedEnum);
                var prevIsClassConstructorVariable = variableSymbol.hasFlag(PullElementFlags.ClassConstructorVariable);
                var prevIsModuleValue = variableSymbol.hasFlag(PullElementFlags.SomeInitializedModule);
                var prevIsImplicit = variableSymbol.hasFlag(PullElementFlags.ImplicitVariable);
                var onlyOneIsEnum = (isEnumValue || prevIsEnum) && !(isEnumValue && prevIsEnum);
                var isAmbient = (variableDeclaration.flags & PullElementFlags.Ambient) != 0;
                var prevDecl = variableSymbol.getDeclarations()[0];
                var bothAreGlobal = parentDecl && (parentDecl.kind == PullElementKind.Script) && (declKind == prevKind);
                var shareParent = bothAreGlobal || prevDecl.getParentDecl() == variableDeclaration.getParentDecl();
                var prevIsParam = shareParent && prevKind == PullElementKind.Parameter && declKind == PullElementKind.Variable;

                var acceptableRedeclaration = (!shareParent || prevIsParam) ||
                    (isImplicit &&
                    ((!isEnumValue && !isClassConstructorVariable && prevKind == PullElementKind.Function) || // Enums can't mix with functions
                    (isModuleValue && prevIsModuleValue) || // modules and enums can mix freely
                    (isClassConstructorVariable && prevIsModuleValue && isAmbient) || // an ambient class can be declared after a module
                    (isModuleValue && prevIsClassConstructorVariable))); // the module variable can come after the class constructor variable

                // if the previous declaration is a non-ambient class, it must be located in the same file as this declaration
                if (acceptableRedeclaration && prevIsClassConstructorVariable && !prevIsAmbient) {
                    if (prevDecl.getScriptName() != variableDeclaration.getScriptName()) {
                        acceptableRedeclaration = false;
                    }
                }

                if (shareParent && !prevIsParam && (!acceptableRedeclaration || onlyOneIsEnum)) {
                    // If neither of them are implicit (both explicitly declared as vars), we won't error now. We'll check that the types match during type check.
                    // However, we will error when a variable clobbers a function.
                    if (isImplicit || prevIsImplicit || (prevKind & PullElementKind.SomeFunction) !== 0) {
                        span = variableDeclaration.getSpan();
                        var errorDecl = isImplicit ? variableSymbol.getDeclarations()[0] : variableDeclaration;
                        errorDecl.addDiagnostic(new Diagnostic(this.semanticInfo.getPath(), span.start(), span.length(), DiagnosticCode.Duplicate_identifier_0, [variableDeclaration.getDisplayName()]));
                    }

                    variableSymbol = null;
                    parentHadSymbol = false;
                }
            }
            else if (variableSymbol && (variableSymbol.kind !== PullElementKind.Variable) && !isImplicit) {
                span = variableDeclaration.getSpan();

                variableDeclaration.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), span.start(), span.length(), DiagnosticCode.Duplicate_identifier_0, [variableDeclaration.getDisplayName()]));
                variableSymbol = null;
                parentHadSymbol = false;
            }

            if ((declFlags & PullElementFlags.ImplicitVariable) === 0) {
                if (!variableSymbol) {
                    variableSymbol = new PullSymbol(declName, declKind);
                    this.semanticInfoChain.cacheGlobalSymbol(variableSymbol, declKind);
                }

                variableSymbol.addDeclaration(variableDeclaration);
                variableDeclaration.setSymbol(variableSymbol);

                this.semanticInfo.setSymbolForAST(varDeclAST.id, variableSymbol);
                this.semanticInfo.setSymbolForAST(varDeclAST, variableSymbol);
            }
            else if (!parentHadSymbol) {

                if (isClassConstructorVariable) {
                    // it's really an implicit class decl, so we need to set the type of the symbol to
                    // the constructor type
                    // Note that we would have already found the class symbol in the search above
                    var classTypeSymbol: PullTypeSymbol = <PullTypeSymbol>variableSymbol;

                    // PULLTODO: In both this case and the case below, we should have already received the
                    // class or module symbol as the variableSymbol found above
                    if (parent) {
                        members = parent.getMembers();

                        for (var i = 0; i < members.length; i++) {
                            if ((members[i].name === declName) && (members[i].kind === PullElementKind.Class)) {
                                classTypeSymbol = <PullTypeSymbol>members[i];
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
                                        classTypeSymbol = <PullTypeSymbol>childDecls[i].getSymbol();
                                    }
                                }
                            }
                        }

                        if (!classTypeSymbol) {
                            classTypeSymbol = <PullTypeSymbol>this.semanticInfoChain.findTopLevelSymbol(declName, PullElementKind.SomeType, this.semanticInfo.getPath());
                        }
                    }

                    if (classTypeSymbol && (classTypeSymbol.kind !== PullElementKind.Class)) {
                        classTypeSymbol = null;
                    }

                    if (classTypeSymbol && classTypeSymbol.isClass()) { // protect against duplicate declarations
                        //replaceProperty = variableSymbol && variableSymbol.getIsSynthesized();

                        //if (replaceProperty) {
                        //    previousProperty = variableSymbol;
                        //}

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

                        variableSymbol.type = this.semanticInfoChain.anyTypeSymbol;
                    }
                }
                else if (declFlags & PullElementFlags.SomeInitializedModule) {
                    var moduleContainerTypeSymbol: PullContainerTypeSymbol = null;
                    var moduleParent = this.getParent(variableDeclaration);

                    if (moduleParent) {
                        members = moduleParent.getMembers();

                        for (var i = 0; i < members.length; i++) {
                            if ((members[i].name === declName) && (members[i].isContainer())) {
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
                            moduleContainerTypeSymbol = <PullContainerTypeSymbol>this.semanticInfoChain.findTopLevelSymbol(declName, PullElementKind.SomeContainer, this.semanticInfo.getPath());

                            if (!moduleContainerTypeSymbol) {
                                moduleContainerTypeSymbol = <PullContainerTypeSymbol>this.semanticInfoChain.findTopLevelSymbol(declName, PullElementKind.Enum, this.semanticInfo.getPath());
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
                    parent.addMember(variableSymbol);
                }
                else {
                    parent.addEnclosedNonMember(variableSymbol);
                }
            }
        }

        // properties
        public bindPropertyDeclarationToPullSymbol(propertyDeclaration: PullDecl) {
            var declFlags = propertyDeclaration.flags;
            var declKind = propertyDeclaration.kind;
            var propDeclAST = <VariableDeclarator>this.semanticInfo.getASTForDecl(propertyDeclaration);

            var isStatic = false;
            var isOptional = false;

            var propertySymbol: PullSymbol = null;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            if (hasFlag(declFlags, PullElementFlags.Optional)) {
                isOptional = true;
            }

            var declName = propertyDeclaration.name;

            var parentHadSymbol = false;

            var parent = this.getParent(propertyDeclaration, true);

            if (parent.isClass() && isStatic) {
                parent = parent.getConstructorMethod().type;           
            }

            propertySymbol = parent.findMember(declName, false);

            if (propertySymbol) {

                var span = propertyDeclaration.getSpan();

                propertyDeclaration.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), span.start(), span.length(), DiagnosticCode.Duplicate_identifier_0, [propertyDeclaration.getDisplayName()]));

                propertySymbol = null;
            }

            if (propertySymbol) {
                parentHadSymbol = true;
            }

            var classTypeSymbol: PullTypeSymbol;

            if (!parentHadSymbol) {
                propertySymbol = new PullSymbol(declName, declKind);
            }

            propertySymbol.addDeclaration(propertyDeclaration);
            propertyDeclaration.setSymbol(propertySymbol);

            this.semanticInfo.setSymbolForAST(propDeclAST.id, propertySymbol);
            this.semanticInfo.setSymbolForAST(propDeclAST, propertySymbol);

            if (isOptional) {
                propertySymbol.isOptional = true;
            }

            if (parent && !parentHadSymbol) {
                parent.addMember(propertySymbol);
            }
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
                    parameterSymbol = new PullSymbol(argDecl.id.text(), PullElementKind.Parameter);

                    if (funcDecl.variableArgList && i === funcDecl.arguments.members.length - 1) {
                        parameterSymbol.isVarArg = true;
                    }

                    if (decl.flags & PullElementFlags.Optional) {
                        parameterSymbol.isOptional = true;
                    }

                    if (params[argDecl.id.text()]) {
                        decl.addDiagnostic(
                            new Diagnostic(this.semanticInfo.getPath(), argDecl.minChar, argDecl.getLength(), DiagnosticCode.Duplicate_identifier_0, [argDecl.id.actualText]));
                    }
                    else {
                        params[argDecl.id.text()] = true;
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

                    signatureSymbol.addParameter(parameterSymbol, parameterSymbol.isOptional);

                    if (signatureSymbol.isDefinition()) {
                        funcType.addEnclosedNonMember(parameterSymbol);
                    }
                }
            }
        }

        // function declarations
        public bindFunctionDeclarationToPullSymbol(functionDeclaration: PullDecl) {
            var declKind = functionDeclaration.kind;
            var declFlags = functionDeclaration.flags;
            var funcDeclAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(functionDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var funcName = functionDeclaration.name;

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;

            var parent = this.getParent(functionDeclaration, true);
            var parentDecl = functionDeclaration.getParentDecl();
            var parentHadSymbol = false;

            // PULLREVIEW: On a re-bind, there's no need to search far-and-wide: just look in the parent's member list
            var functionSymbol: PullSymbol = null;
            var functionTypeSymbol: PullTypeSymbol = null;

            if (parent) {
                functionSymbol = parent.findMember(funcName, false);

                if (!functionSymbol) {
                    functionSymbol = parent.findContainedNonMember(funcName);

                    if (functionSymbol) {
                        var declarations = functionSymbol.getDeclarations();

                        if (declarations.length) {
                            var funcSymbolParentDecl = declarations[0].getParentDecl();

                            if (parentDecl !== funcSymbolParentDecl) {
                                functionSymbol = null;
                            }
                        }
                    }
                }
            }
            else if (!(functionDeclaration.flags & PullElementFlags.Exported)) {
                functionSymbol = this.semanticInfoChain.findTopLevelSymbol(funcName, PullElementKind.SomeValue, this.semanticInfo.getPath());
            }

            if (functionSymbol &&
                (functionSymbol.kind !== PullElementKind.Function ||
                (!isSignature && !functionSymbol.allDeclsHaveFlag(PullElementFlags.Signature)))) {
                functionDeclaration.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [functionDeclaration.getDisplayName()]));
                functionSymbol = null;
            }

            if (functionSymbol) {
                functionTypeSymbol = functionSymbol.type;
                parentHadSymbol = true;
            }

            if (!functionSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                functionSymbol = new PullSymbol(funcName, PullElementKind.Function);
            }

            if (!functionTypeSymbol) {
                functionTypeSymbol = new PullTypeSymbol("", PullElementKind.FunctionType);
                functionSymbol.type = functionTypeSymbol;
                functionTypeSymbol.setFunctionSymbol(functionSymbol);
            }

            functionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionDeclaration);
            functionTypeSymbol.addDeclaration(functionDeclaration);

            this.semanticInfo.setSymbolForAST(funcDeclAST.name, functionSymbol);
            this.semanticInfo.setSymbolForAST(funcDeclAST, functionSymbol);

            if (parent && !parentHadSymbol) {
                if (isExported) {
                    parent.addMember(functionSymbol);
                }
                else {
                    parent.addEnclosedNonMember(functionSymbol);
                }
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(functionDeclaration);
            functionDeclaration.setSignatureSymbol(signature);

            if (funcDeclAST.variableArgList) {
                signature.hasVarArgs = true;
            }

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(functionDeclaration), functionTypeSymbol, signature);

            var typeParameters = functionDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, true);

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    functionDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.name]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            // add the implicit call member for this function type
            functionTypeSymbol.addCallSignature(signature);

            var otherDecls = this.findDeclsInContext(functionDeclaration, functionDeclaration.kind, false);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        public bindFunctionExpressionToPullSymbol(functionExpressionDeclaration: PullDecl) {
            var declKind = functionExpressionDeclaration.kind;
            var declFlags = functionExpressionDeclaration.flags;
            var funcExpAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(functionExpressionDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionName = declKind == PullElementKind.FunctionExpression ?
                (<PullFunctionExpressionDecl>functionExpressionDeclaration).getFunctionExpressionName() :
                functionExpressionDeclaration.name;
            var functionSymbol: PullSymbol = new PullSymbol(functionName, PullElementKind.Function);
            var functionTypeSymbol = new PullTypeSymbol("", PullElementKind.FunctionType);
            functionTypeSymbol.setFunctionSymbol(functionSymbol);

            functionSymbol.type = functionTypeSymbol;

            functionExpressionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionExpressionDeclaration);
            functionTypeSymbol.addDeclaration(functionExpressionDeclaration);

            if (funcExpAST.name) {
                this.semanticInfo.setSymbolForAST(funcExpAST.name, functionSymbol);
            }
            this.semanticInfo.setSymbolForAST(funcExpAST, functionSymbol);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            if (funcExpAST.variableArgList) {
                signature.hasVarArgs = true;
            }

            var typeParameters = functionExpressionDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, true);

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    functionExpressionDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.getName()]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            signature.addDeclaration(functionExpressionDeclaration);
            functionExpressionDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(functionExpressionDeclaration), functionTypeSymbol, signature);

            // add the implicit call member for this function type
            functionTypeSymbol.addCallSignature(signature);
        }

        public bindFunctionTypeDeclarationToPullSymbol(functionTypeDeclaration: PullDecl) {
            var declKind = functionTypeDeclaration.kind;
            var declFlags = functionTypeDeclaration.flags;
            var funcTypeAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(functionTypeDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionTypeSymbol = new PullTypeSymbol("", PullElementKind.FunctionType);

            functionTypeDeclaration.setSymbol(functionTypeSymbol);
            functionTypeSymbol.addDeclaration(functionTypeDeclaration);
            this.semanticInfo.setSymbolForAST(funcTypeAST, functionTypeSymbol);

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;
            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            if (funcTypeAST.variableArgList) {
                signature.hasVarArgs = true;
            }

            var typeParameters = functionTypeDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, true);

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    functionTypeDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.name]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            signature.addDeclaration(functionTypeDeclaration);
            functionTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(functionTypeDeclaration), functionTypeSymbol, signature);

            // add the implicit call member for this function type
            functionTypeSymbol.addCallSignature(signature);
        }

        // method declarations
        public bindMethodDeclarationToPullSymbol(methodDeclaration: PullDecl) {
            var declKind = methodDeclaration.kind;
            var declFlags = methodDeclaration.flags;
            var methodAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(methodDeclaration);

            var isPrivate = (declFlags & PullElementFlags.Private) !== 0;
            var isStatic = (declFlags & PullElementFlags.Static) !== 0;
            var isOptional = (declFlags & PullElementFlags.Optional) !== 0;

            var methodName = methodDeclaration.name;

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;

            var parent = this.getParent(methodDeclaration, true);
            var parentHadSymbol = false;

            var methodSymbol: PullSymbol = null;
            var methodTypeSymbol: PullTypeSymbol = null;

            if (parent.isClass() && isStatic) {
                parent = parent.getConstructorMethod().type;
            }

            methodSymbol = parent.findMember(methodName, false);

            if (methodSymbol &&
                (methodSymbol.kind !== PullElementKind.Method ||
                (!isSignature && !methodSymbol.allDeclsHaveFlag(PullElementFlags.Signature)))) {
                methodDeclaration.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), methodAST.minChar, methodAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [methodDeclaration.getDisplayName()]));
                methodSymbol = null;
            }

            if (methodSymbol) {
                methodTypeSymbol = methodSymbol.type;
                parentHadSymbol = true;
            }

            if (!methodSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                methodSymbol = new PullSymbol(methodName, PullElementKind.Method);
            }

            if (!methodTypeSymbol) {
                methodTypeSymbol = new PullTypeSymbol("", PullElementKind.FunctionType);
                methodSymbol.type = methodTypeSymbol;
                methodTypeSymbol.setFunctionSymbol(methodSymbol);
            }

            methodDeclaration.setSymbol(methodSymbol);
            methodSymbol.addDeclaration(methodDeclaration);
            methodTypeSymbol.addDeclaration(methodDeclaration);
            this.semanticInfo.setSymbolForAST(methodAST.name, methodSymbol);
            this.semanticInfo.setSymbolForAST(methodAST, methodSymbol);

            if (isOptional) {
                methodSymbol.isOptional = true;
            }

            if (!parentHadSymbol) {
                parent.addMember(methodSymbol);
            }

            var sigKind = PullElementKind.CallSignature;

            var signature = isSignature ? new PullSignatureSymbol(sigKind) : new PullDefinitionSignatureSymbol(sigKind);

            if (methodAST.variableArgList) {
                signature.hasVarArgs = true;
            }

            var typeParameters = methodDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;
            var typeParameterName: string;
            var typeParameterAST: TypeParameter;

            for (var i = 0; i < typeParameters.length; i++) {
                typeParameterName = typeParameters[i].name;
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

                    typeParameterAST = <TypeParameter>this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    methodDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.getName()]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            signature.addDeclaration(methodDeclaration);
            methodDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(methodDeclaration), methodTypeSymbol, signature);

            // add the implicit call member for this function type
            methodTypeSymbol.addCallSignature(signature);

            var otherDecls = this.findDeclsInContext(methodDeclaration, methodDeclaration.kind, false);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        // class constructor declarations
        public bindConstructorDeclarationToPullSymbol(constructorDeclaration: PullDecl) {
            var declKind = constructorDeclaration.kind;
            var declFlags = constructorDeclaration.flags;
            var constructorAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(constructorDeclaration);

            var constructorName = constructorDeclaration.name;

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;

            var parent = this.getParent(constructorDeclaration, true);

            var parentHadSymbol = false;

            var constructorSymbol: PullSymbol = parent.getConstructorMethod();
            var constructorTypeSymbol: PullTypeSymbol = null;

            if (constructorSymbol &&
                (constructorSymbol.kind !== PullElementKind.ConstructorMethod ||
                (!isSignature &&
                constructorSymbol.type &&
                constructorSymbol.type.hasOwnConstructSignatures()))) {

                var hasDefinitionSignature = false;
                var constructorSigs = constructorSymbol.type.getConstructSignatures();

                for (var i = 0; i < constructorSigs.length; i++) {
                    if (!constructorSigs[i].hasFlag(PullElementFlags.Signature)) {
                        hasDefinitionSignature = true;
                        break;
                    }
                }

                if (hasDefinitionSignature) {
                    constructorDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), constructorAST.minChar, constructorAST.getLength(), DiagnosticCode.Multiple_constructor_implementations_are_not_allowed, null));

                    constructorSymbol = null;
                }
            }

            if (constructorSymbol) {
                constructorTypeSymbol = constructorSymbol.type;
            }
            else {
                constructorSymbol = new PullSymbol(constructorName, PullElementKind.ConstructorMethod);
                constructorTypeSymbol = new PullTypeSymbol("", PullElementKind.ConstructorType);
            }

            // Even if we're reusing the symbol, it would have been cleared by the call to invalidate above
            parent.setConstructorMethod(constructorSymbol);
            constructorSymbol.type = constructorTypeSymbol;

            constructorDeclaration.setSymbol(constructorSymbol);
            constructorSymbol.addDeclaration(constructorDeclaration);
            constructorTypeSymbol.addDeclaration(constructorDeclaration);
            constructorSymbol.setIsSynthesized(false);
            this.semanticInfo.setSymbolForAST(constructorAST, constructorSymbol);

            // add a call signature to the constructor method, and a construct signature to the parent class type
            var constructSignature = isSignature ? new PullSignatureSymbol(PullElementKind.ConstructSignature) : new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            constructSignature.returnType = parent;

            constructSignature.addDeclaration(constructorDeclaration);
            constructorDeclaration.setSignatureSymbol(constructSignature);

            this.bindParameterSymbols(constructorAST, constructorTypeSymbol, constructSignature);

            var typeParameters = constructorTypeSymbol.getTypeParameters();

            for (var i = 0; i < typeParameters.length; i++) {
                constructSignature.addTypeParameter(typeParameters[i]);
            }

            if (constructorAST.variableArgList) {
                constructSignature.hasVarArgs = true;
            }

            constructorTypeSymbol.addConstructSignature(constructSignature);

            var otherDecls = this.findDeclsInContext(constructorDeclaration, constructorDeclaration.kind, false);

            if (otherDecls && otherDecls.length) {
                for (var i = 0; i < otherDecls.length; i++) {
                    otherDecls[i].ensureSymbolIsBound();
                }
            }
        }

        public bindConstructSignatureDeclarationToPullSymbol(constructSignatureDeclaration: PullDecl) {
            var parent = this.getParent(constructSignatureDeclaration, true);
            var constructorAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(constructSignatureDeclaration);

            var constructSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);

            if (constructorAST.variableArgList) {
                constructSignature.hasVarArgs = true;
            }

            var typeParameters = constructSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = constructSignature.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, true);

                    constructSignature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    constructSignatureDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.getName()]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            constructSignature.addDeclaration(constructSignatureDeclaration);
            constructSignatureDeclaration.setSignatureSymbol(constructSignature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(constructSignatureDeclaration), null, constructSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(constructSignatureDeclaration), constructSignature);

            parent.addConstructSignature(constructSignature);
        }

        public bindCallSignatureDeclarationToPullSymbol(callSignatureDeclaration: PullDecl) {
            var parent = this.getParent(callSignatureDeclaration, true);
            var callSignatureAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(callSignatureDeclaration);

            var callSignature = new PullSignatureSymbol(PullElementKind.CallSignature);

            if (callSignatureAST.variableArgList) {
                callSignature.hasVarArgs = true;
            }

            var typeParameters = callSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = callSignature.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, true);

                    callSignature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    callSignatureDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.getName()]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            callSignature.addDeclaration(callSignatureDeclaration);
            callSignatureDeclaration.setSignatureSymbol(callSignature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(callSignatureDeclaration), null, callSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(callSignatureDeclaration), callSignature);

            parent.addCallSignature(callSignature);
        }

        public bindIndexSignatureDeclarationToPullSymbol(indexSignatureDeclaration: PullDecl) {
            var parent = this.getParent(indexSignatureDeclaration, true);

            var indexSignature = new PullSignatureSymbol(PullElementKind.IndexSignature);

            var typeParameters = indexSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = indexSignature.findTypeParameter(typeParameters[i].name);

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].name, true);

                    indexSignature.addTypeParameter(typeParameter);
                }
                else {
                    typeParameterDecls = typeParameter.getDeclarations();

                    var typeParameterAST = this.semanticInfoChain.getASTForDecl(typeParameterDecls[0]);
                    indexSignatureDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), typeParameterAST.minChar, typeParameterAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [typeParameter.name]));
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            indexSignature.addDeclaration(indexSignatureDeclaration);
            indexSignatureDeclaration.setSignatureSymbol(indexSignature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(indexSignatureDeclaration), null, indexSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(indexSignatureDeclaration), indexSignature);

            parent.addIndexSignature(indexSignature);
        }

        // getters and setters

        public bindGetAccessorDeclarationToPullSymbol(getAccessorDeclaration: PullDecl) {
            var declKind = getAccessorDeclaration.kind;
            var declFlags = getAccessorDeclaration.flags;
            var funcDeclAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(getAccessorDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var funcName = getAccessorDeclaration.name;

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;
            var isStatic = false;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            var parent = this.getParent(getAccessorDeclaration, true);
            var parentHadSymbol = false;

            var accessorSymbol: PullAccessorSymbol = null;
            var getterSymbol: PullSymbol = null;
            var getterTypeSymbol: PullTypeSymbol = null;

            if (isStatic) {
                parent = parent.getConstructorMethod().type;
            }

            accessorSymbol = <PullAccessorSymbol>parent.findMember(funcName, false);

            if (accessorSymbol) {
                if (!accessorSymbol.isAccessor()) {
                    getAccessorDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [getAccessorDeclaration.getDisplayName()]));
                    accessorSymbol = null;
                }
                else {
                    getterSymbol = accessorSymbol.getGetter();

                    if (getterSymbol) {
                        getAccessorDeclaration.addDiagnostic(
                            new Diagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Getter_0_already_declared, [getAccessorDeclaration.getDisplayName()]));
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
                getterTypeSymbol = getterSymbol.type;
            }

            if (!accessorSymbol) {
                accessorSymbol = new PullAccessorSymbol(funcName);
            }

            if (!getterSymbol) {
                getterSymbol = new PullSymbol(funcName, PullElementKind.Function);
                getterTypeSymbol = new PullTypeSymbol("", PullElementKind.FunctionType);
                getterTypeSymbol.setFunctionSymbol(getterSymbol);

                getterSymbol.type = getterTypeSymbol;

                accessorSymbol.setGetter(getterSymbol);
            }

            getAccessorDeclaration.setSymbol(accessorSymbol);
            accessorSymbol.addDeclaration(getAccessorDeclaration);
            getterSymbol.addDeclaration(getAccessorDeclaration);

            this.semanticInfo.setSymbolForAST(funcDeclAST.name, getterSymbol);
            this.semanticInfo.setSymbolForAST(funcDeclAST, getterSymbol);

            if (!parentHadSymbol) {
                parent.addMember(accessorSymbol);
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(getAccessorDeclaration);
            getAccessorDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(getAccessorDeclaration), getterTypeSymbol, signature);

            var typeParameters = getAccessorDeclaration.getTypeParameters();

            if (typeParameters.length) {
                getAccessorDeclaration.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(),
                        DiagnosticCode.Accessors_cannot_have_type_parameters, null));
            }

            // add the implicit call member for this function type
            getterTypeSymbol.addCallSignature(signature);
        }

        public bindSetAccessorDeclarationToPullSymbol(setAccessorDeclaration: PullDecl) {
            var declKind = setAccessorDeclaration.kind;
            var declFlags = setAccessorDeclaration.flags;
            var funcDeclAST = <FunctionDeclaration>this.semanticInfo.getASTForDecl(setAccessorDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) !== 0;

            var funcName = setAccessorDeclaration.name;

            var isSignature: boolean = (declFlags & PullElementFlags.Signature) !== 0;
            var isStatic = false;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            var parent = this.getParent(setAccessorDeclaration, true);
            var parentHadSymbol = false;

            var accessorSymbol: PullAccessorSymbol = null;
            var setterSymbol: PullSymbol = null;
            var setterTypeSymbol: PullTypeSymbol = null;

            if (isStatic) {
                parent = parent.getConstructorMethod().type;
            }

            accessorSymbol = <PullAccessorSymbol>parent.findMember(funcName, false);

            if (accessorSymbol) {
                if (!accessorSymbol.isAccessor()) {
                    setAccessorDeclaration.addDiagnostic(
                        new Diagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Duplicate_identifier_0, [setAccessorDeclaration.getDisplayName()]));
                    accessorSymbol = null;
                }
                else {
                    setterSymbol = accessorSymbol.getSetter();

                    if (setterSymbol) {
                        setAccessorDeclaration.addDiagnostic(
                            new Diagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Setter_0_already_declared, [setAccessorDeclaration.getDisplayName()]));
                        accessorSymbol = null;
                        setterSymbol = null;
                    }
                }
            }

            if (accessorSymbol) {
                parentHadSymbol = true;
                // we have an accessor we can use...
                if (setterSymbol) {
                    setterTypeSymbol = setterSymbol.type;
                }
            }

            if (!accessorSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                accessorSymbol = new PullAccessorSymbol(funcName);
            }

            if (!setterSymbol) {
                setterSymbol = new PullSymbol(funcName, PullElementKind.Function);
                setterTypeSymbol = new PullTypeSymbol("", PullElementKind.FunctionType);
                setterTypeSymbol.setFunctionSymbol(setterSymbol);

                setterSymbol.type = setterTypeSymbol;

                accessorSymbol.setSetter(setterSymbol);
            }

            setAccessorDeclaration.setSymbol(accessorSymbol);
            accessorSymbol.addDeclaration(setAccessorDeclaration);
            setterSymbol.addDeclaration(setAccessorDeclaration);

            this.semanticInfo.setSymbolForAST(funcDeclAST.name, setterSymbol);
            this.semanticInfo.setSymbolForAST(funcDeclAST, setterSymbol);

            if (!parentHadSymbol) {
                parent.addMember(accessorSymbol);
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(setAccessorDeclaration);
            setAccessorDeclaration.setSignatureSymbol(signature);

            // PULLTODO: setter should not have a parameters
            this.bindParameterSymbols(<FunctionDeclaration>this.semanticInfo.getASTForDecl(setAccessorDeclaration), setterTypeSymbol, signature);

            var typeParameters = setAccessorDeclaration.getTypeParameters();

            if (typeParameters.length) {
                setAccessorDeclaration.addDiagnostic(
                    new Diagnostic(this.semanticInfo.getPath(), funcDeclAST.minChar, funcDeclAST.getLength(), DiagnosticCode.Accessors_cannot_have_type_parameters, null));
            }

            // add the implicit call member for this function type
            setterTypeSymbol.addCallSignature(signature);
        }

        // binding
        public bindDeclToPullSymbol(decl: PullDecl) {

            if (decl.isBound()) {
                return;
            }

            // if (globalLogger) {
            //     globalLogger.log("Binding " + decl.getName());
            // }

            decl.setIsBound(true);

            switch (decl.kind) {

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
                case PullElementKind.WithBlock:
                    // since we don't bind eagerly, there's nothing to do here
                    break;

                default:
                    CompilerDiagnostics.assert(false, "Unrecognized type declaration");
            }
        }

        public bindDeclsForUnit(filePath: string) {
            this.setUnit(filePath);

            var topLevelDecls = this.semanticInfo.getTopLevelDecls();

            for (var i = 0; i < topLevelDecls.length; i++) {
                this.bindDeclToPullSymbol(topLevelDecls[i]);
            }
        }
    }
}