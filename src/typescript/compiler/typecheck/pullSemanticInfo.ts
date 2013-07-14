// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    // per-file info on 
    //  decls
    //  bindings
    //  scopes

    // PULLTODO: Get rid of these
    export var declCacheHit = 0;
    export var declCacheMiss = 0;
    export var symbolCacheHit = 0;
    export var symbolCacheMiss = 0;

    export class SemanticInfo {
        private compilationUnitPath: string;  // the "file" this is associated with

        private topLevelDecls: PullDecl[] = [];
        private topLevelSynthesizedDecls: PullDecl[] = [];

        private astDeclMap: DataMap = new DataMap();
        private declASTMap: DataMap = new DataMap();

        private syntaxElementDeclMap: DataMap = new DataMap();
        private declSyntaxElementMap: DataMap = new DataMap();

        private astSymbolMap: DataMap = new DataMap();
        private symbolASTMap: DataMap = new DataMap();

        private syntaxElementSymbolMap: DataMap = new DataMap();
        private symbolSyntaxElementMap: DataMap = new DataMap();

        private properties = new SemanticInfoProperties();

        private hasBeenTypeChecked = false;

        constructor(compilationUnitPath: string) {
            this.compilationUnitPath = compilationUnitPath;
        }

        public addTopLevelDecl(decl: PullDecl) {
            this.topLevelDecls[this.topLevelDecls.length] = decl;
        }

        public setTypeChecked() {
            this.hasBeenTypeChecked = true;
        }
        public getTypeChecked() {
            return this.hasBeenTypeChecked;
        }
        public invalidate() {
            this.astSymbolMap = new DataMap();
            this.symbolASTMap = new DataMap();            
            //this.hasBeenTypeChecked = false;
        }

        public getTopLevelDecls() { return this.topLevelDecls; }

        public getPath(): string {
            return this.compilationUnitPath;
        }

        public addSynthesizedDecl(decl: PullDecl) {
            //if (!decl.getParentDecl()) {
                this.topLevelSynthesizedDecls[this.topLevelSynthesizedDecls.length] = decl;
            //}
        }
        public getSynthesizedDecls() {
            return this.topLevelSynthesizedDecls;
        }

        public getDeclForAST(ast: AST): PullDecl {
            return <PullDecl>this.astDeclMap.read(ast.getID().toString());
        }

        public setDeclForAST(ast: AST, decl: PullDecl): void {
            this.astDeclMap.link(ast.getID().toString(), decl);
        }

        private getDeclKey(decl: PullDecl): string {
            var decl1: any = decl;

            if (!decl1.__declKey) {
                decl1.__declKey = decl.getDeclID().toString() + "-" + decl.getKind().toString();
            }

            return decl1.__declKey;
        }

        public getASTForDecl(decl: PullDecl): AST {
            return <AST>this.declASTMap.read(this.getDeclKey(decl));
        }

        public setASTForDecl(decl: PullDecl, ast: AST): void {
            this.declASTMap.link(this.getDeclKey(decl), ast);
        }

        public setSymbolAndDiagnosticsForAST<TSymbol extends PullSymbol>(ast: AST, symbolAndDiagnostics: SymbolAndDiagnostics<TSymbol>): void {
            this.astSymbolMap.link(ast.getID().toString(), symbolAndDiagnostics);
            this.symbolASTMap.link(symbolAndDiagnostics.symbol.getSymbolID().toString(), ast)
        }

        public getSymbolAndDiagnosticsForAST(ast: AST): SymbolAndDiagnostics<PullSymbol> {
            return <SymbolAndDiagnostics>this.astSymbolMap.read(ast.getID().toString());
        }

        public getASTForSymbol(symbol: PullSymbol): AST {
            return <AST>this.symbolASTMap.read(symbol.getSymbolID().toString());
        }

        public getSyntaxElementForDecl(decl: PullDecl): ISyntaxElement {
            return <ISyntaxElement>this.declSyntaxElementMap.read(this.getDeclKey(decl));
        }

        public setSyntaxElementForDecl(decl: PullDecl, syntaxElement: ISyntaxElement): void {
            this.declSyntaxElementMap.link(this.getDeclKey(decl), syntaxElement);
        }

        public getDeclForSyntaxElement(syntaxElement: ISyntaxElement): PullDecl {
            return <PullDecl>this.syntaxElementDeclMap.read(Collections.identityHashCode(syntaxElement).toString());
        }

        public setDeclForSyntaxElement(syntaxElement: ISyntaxElement, decl: PullDecl): void {
            this.syntaxElementDeclMap.link(Collections.identityHashCode(syntaxElement).toString(), decl);
        }

        public getSyntaxElementForSymbol(symbol: PullSymbol): ISyntaxElement {
            return <ISyntaxElement> this.symbolSyntaxElementMap.read(symbol.getSymbolID().toString());
        }

        public getSymbolForSyntaxElement(syntaxElement: ISyntaxElement): PullSymbol {
            return <PullSymbol>this.syntaxElementSymbolMap.read(Collections.identityHashCode(syntaxElement).toString());
        }

        public setSymbolForSyntaxElement(syntaxElement: ISyntaxElement, symbol: PullSymbol) {
            this.syntaxElementSymbolMap.link(Collections.identityHashCode(syntaxElement).toString(), symbol);
            this.symbolSyntaxElementMap.link(symbol.getSymbolID().toString(), syntaxElement);
        }

        public getDiagnostics(semanticErrors: IDiagnostic[]) {

            for (var i = 0; i < this.topLevelDecls.length; i++) {
                getDiagnosticsFromEnclosingDecl(this.topLevelDecls[i], semanticErrors);
            }
        }
        
        public getProperties() {
            return this.properties;
        }
    }

    /**
     * This class will contain any miscellaneous flags that pertain to the semantic status of the file.
     * This is for properties that are not tied to a specific AST, decl, symbol or syntax element, but are global to the file.
     */
    export class SemanticInfoProperties {
        public unitContainsBool = false;
    }

    export class SemanticInfoChain {
        public units: SemanticInfo[] = [new SemanticInfo("")];
        private declCache = <any>new BlockIntrinsics();
        private symbolCache = <any>new BlockIntrinsics();
        private unitCache = <any>new BlockIntrinsics();
        private declSymbolMap: DataMap = new DataMap();

        public anyTypeSymbol: PullTypeSymbol = null;
        public booleanTypeSymbol: PullTypeSymbol = null;
        public numberTypeSymbol: PullTypeSymbol = null;
        public stringTypeSymbol: PullTypeSymbol = null;
        public nullTypeSymbol: PullTypeSymbol = null;
        public undefinedTypeSymbol: PullTypeSymbol = null;
        public elementTypeSymbol: PullTypeSymbol = null;
        public voidTypeSymbol: PullTypeSymbol = null;

        public addPrimitiveType(name: string, globalDecl: PullDecl) {
            var span = new TextSpan(0, 0);
            var decl = new PullDecl(name, name, PullElementKind.Primitive, PullElementFlags.None, span, "");
            var symbol = new PullPrimitiveTypeSymbol(name);

            symbol.addDeclaration(decl);
            decl.setSymbol(symbol);

            symbol.setResolved();

            if (globalDecl) {
                globalDecl.addChildDecl(decl);
            }

            return symbol;
        }

        public addPrimitiveValue(name: string, type: PullTypeSymbol, globalDecl: PullDecl) {
            var span = new TextSpan(0, 0);
            var decl = new PullDecl(name, name, PullElementKind.Variable, PullElementFlags.Ambient, span, "");
            var symbol = new PullSymbol(name, PullElementKind.Variable);

            symbol.addDeclaration(decl);
            decl.setSymbol(symbol);
            symbol.setType(type);
            symbol.setResolved();

            globalDecl.addChildDecl(decl);
        }

        public getGlobalDecl() {
            var span = new TextSpan(0, 0);
            var globalDecl = new PullDecl("", "", PullElementKind.Global, PullElementFlags.None, span, "");

            // add primitive types
            this.anyTypeSymbol = this.addPrimitiveType("any", globalDecl);
            this.booleanTypeSymbol = this.addPrimitiveType("boolean", globalDecl);
            this.numberTypeSymbol = this.addPrimitiveType("number", globalDecl);
            this.stringTypeSymbol = this.addPrimitiveType("string", globalDecl);
            this.voidTypeSymbol = this.addPrimitiveType("void", globalDecl);
            this.elementTypeSymbol = this.addPrimitiveType("_element", globalDecl);

            // add the global primitive values for "null" and "undefined"
            this.nullTypeSymbol = this.addPrimitiveType("null", null);
            this.undefinedTypeSymbol = this.addPrimitiveType("undefined", null);
            this.addPrimitiveValue("undefined", this.undefinedTypeSymbol, globalDecl);
            this.addPrimitiveValue("null", this.nullTypeSymbol, globalDecl);      

            return globalDecl;      
        }
        

        constructor() {
            if (globalBinder) {
                globalBinder.semanticInfoChain = this;
            }

            var globalDecl = this.getGlobalDecl();
            var globalInfo = this.units[0];
            globalInfo.addTopLevelDecl(globalDecl);
        }

        public addUnit(unit: SemanticInfo) {
            this.units[this.units.length] = unit;
            this.unitCache[unit.getPath()] = unit;
        }

        public getUnit(compilationUnitPath: string) {
            // PULLTODO: Replace this with a hash so we don't have a linear walk going on here.
            for (var i = 0; i < this.units.length; i++) {
                if (this.units[i].getPath() === compilationUnitPath) {
                    return this.units[i];
                }
            }

            return null;
        }

        // PULLTODO: compilationUnitPath is only really there for debug purposes
        public updateUnit(oldUnit: SemanticInfo, newUnit: SemanticInfo) {
            for (var i = 0; i < this.units.length; i++) {
                if (this.units[i].getPath() === oldUnit.getPath()) {
                    this.units[i] = newUnit;
                    this.unitCache[oldUnit.getPath()] = newUnit;
                    return;
                }
            }
        }

        private collectAllTopLevelDecls() {
            var decls: PullDecl[] = [];
            var unitDecls: PullDecl[];

            for (var i = 0; i < this.units.length; i++) {
                unitDecls = this.units[i].getTopLevelDecls();
                for (var j = 0; j < unitDecls.length; j++) {
                    decls[decls.length] = unitDecls[j];
                }
            }

            return decls;
        }

        private collectAllSynthesizedDecls() {
            var decls: PullDecl[] = [];
            var synthDecls: PullDecl[];

            for (var i = 0; i < this.units.length; i++) {
                synthDecls = this.units[i].getSynthesizedDecls();
                for (var j = 0; j < synthDecls.length; j++) {
                    decls[decls.length] = synthDecls[j];
                }
            }

            return decls;
        }        

        private getDeclPathCacheID(declPath: string[], declKind: PullElementKind) {
            var cacheID = "";

            for (var i = 0; i < declPath.length; i++) {
                cacheID += "#" + declPath[i];
            }

            return cacheID + "#" + declKind.toString();
        }

        // a decl path is a list of decls that reference the components of a declaration from the global scope down
        // E.g., string would be "['string']" and "A.B.C" would be "['A','B','C']"
        public findDecls(declPath: string[], declKind: PullElementKind): PullDecl[] {

            var cacheID = this.getDeclPathCacheID(declPath, declKind);

            if (declPath.length) {
                var cachedDecls = this.declCache[cacheID];

                if (cachedDecls && cachedDecls.length) {
                    declCacheHit++;
                    return <PullDecl[]> cachedDecls;
                }
            }

            declCacheMiss++;

            var declsToSearch = this.collectAllTopLevelDecls();

            var decls: PullDecl[] = [];
            var path: string;
            var foundDecls: PullDecl[] = [];
            var keepSearching = (declKind & PullElementKind.Container) || (declKind & PullElementKind.Interface);

            for (var i = 0; i < declPath.length; i++) {
                path = declPath[i];
                decls = [];

                for (var j = 0; j < declsToSearch.length; j++) {
                    //var kind = (i === declPath.length - 1) ? declKind : PullElementKind.SomeType;
                    foundDecls = declsToSearch[j].searchChildDecls(path, declKind);

                    for (var k = 0; k < foundDecls.length; k++) {
                        decls[decls.length] = foundDecls[k];
                    }

                    // Unless we're searching for an interface or module, we've found the one true
                    // decl, so don't bother searching the rest of the top-level decls
                    if (foundDecls.length && !keepSearching) {
                        break;
                    }
                }

                declsToSearch = decls;

                if (!declsToSearch) {
                    break;
                }
            }

            if (decls.length) {
                this.declCache[cacheID] = decls;
            }

            return decls;
        }

        public findSymbol(declPath: string[], declType: PullElementKind): PullSymbol {

            var cacheID = this.getDeclPathCacheID(declPath, declType);

            if (declPath.length) {

                var cachedSymbol = this.symbolCache[cacheID];

                if (cachedSymbol) {
                    symbolCacheHit++;
                    return cachedSymbol;
                }
            }

            symbolCacheMiss++;

            // symbol wasn't cached, so get the decl
            var decls: PullDecl[] = this.findDecls(declPath, declType);
            var symbol: PullSymbol = null;

            if (decls.length) {

                symbol = decls[0].getSymbol();

                if (symbol) {
                    this.symbolCache[cacheID] = symbol;

                    symbol.addCacheID(cacheID);
                }
            }

            return symbol;
        }

        public cacheGlobalSymbol(symbol: PullSymbol, kind: PullElementKind) {
            var cacheID1 = this.getDeclPathCacheID([symbol.getName()], kind);
            var cacheID2 = this.getDeclPathCacheID([symbol.getName()], symbol.getKind());

            if (!this.symbolCache[cacheID1]) {
                this.symbolCache[cacheID1] = symbol;
                symbol.addCacheID(cacheID1);
            }

            if (!this.symbolCache[cacheID2]) {
                this.symbolCache[cacheID2] = symbol;
                symbol.addCacheID(cacheID2);
            }
        }

        private cleanDecl(decl: PullDecl) {
            decl.setSymbol(null);
            decl.setSignatureSymbol(null);
            decl.setSpecializingSignatureSymbol(null);
            decl.setIsBound(false);

            var children = decl.getChildDecls();

            for (var i = 0; i < children.length; i++) {
                this.cleanDecl(children[i]);
            }

            var typeParameters = decl.getTypeParameters();

            for (var i = 0; i < typeParameters.length; i++) {
                this.cleanDecl(typeParameters[i]);
            }

            var valueDecl = decl.getValueDecl();

            if (valueDecl) {
                this.cleanDecl(valueDecl);
            }
        }

        private cleanAllDecls() {
            var topLevelDecls = this.collectAllTopLevelDecls();

            // skip the first tld, which contains global primitive symbols
            for (var i = 1; i < topLevelDecls.length; i++) {
                this.cleanDecl(topLevelDecls[i]);
            }

            var synthesizedDecls = this.collectAllSynthesizedDecls();

            for (var i = 0; i < synthesizedDecls.length; i++) {
                this.cleanDecl(synthesizedDecls[i]);
            }
        }        

        public update() {

            // PULLTODO: Be less aggressive about clearing the cache
            this.declCache = <any>new BlockIntrinsics();
            this.symbolCache = <any>new BlockIntrinsics();
            this.units[0] = new SemanticInfo("");
            this.units[0].addTopLevelDecl(this.getGlobalDecl());
            this.cleanAllDecls();
            //this.symbolCache = <any>{};
            for (var unit in this.unitCache) {
                if (this.unitCache[unit]) {
                    this.unitCache[unit].invalidate();
                }
            }
        }

        public invalidateUnit(compilationUnitPath: string) {
            var unit = this.unitCache[compilationUnitPath];
            if (unit) {
                unit.invalidate();
            }
        }

        public getDeclForAST(ast: AST, unitPath: string): PullDecl {
            var unit = <SemanticInfo>this.unitCache[unitPath];

            if (unit) {
                return unit.getDeclForAST(ast);
            }

            return null;
        }

        public getASTForDecl(decl: PullDecl): AST {
            var unit = <SemanticInfo>this.unitCache[decl.getScriptName()];

            if (unit) {
                return unit.getASTForDecl(decl);
            }

            return null;
        }

        public getSymbolAndDiagnosticsForAST(ast: AST, unitPath: string): SymbolAndDiagnostics<PullSymbol> {
            var unit = <SemanticInfo>this.unitCache[unitPath];

            if (unit) {
                return unit.getSymbolAndDiagnosticsForAST(ast);
            }

            return null;
        }

        public getASTForSymbol(symbol: PullSymbol, unitPath: string) {
            var unit = <SemanticInfo>this.unitCache[unitPath];

            if (unit) {
                return unit.getASTForSymbol(symbol);
            }

            return null;
        }

        public setSymbolAndDiagnosticsForAST(ast: AST, symbolAndDiagnostics: SymbolAndDiagnostics<PullSymbol>, unitPath: string): void {
            var unit = <SemanticInfo>this.unitCache[unitPath];

            if (unit) {
                unit.setSymbolAndDiagnosticsForAST(ast, symbolAndDiagnostics);
            }
        }

        public setSymbolForDecl(decl: PullDecl, symbol: PullSymbol): void {
            this.declSymbolMap.link(decl.getDeclID().toString(), symbol);
        }
        public getSymbolForDecl(decl): PullSymbol {
            return <PullSymbol>this.declSymbolMap.read(decl.getDeclID().toString());
        }

        public removeSymbolFromCache(symbol: PullSymbol) {

            var path = [symbol.getName()];
            var kind = (symbol.getKind() & PullElementKind.SomeType) !== 0 ? PullElementKind.SomeType : PullElementKind.SomeValue;

            var kindID = this.getDeclPathCacheID(path, kind);
            var symID = this.getDeclPathCacheID(path, symbol.getKind());

            symbol.addCacheID(kindID);
            symbol.addCacheID(symID);

            symbol.invalidateCachedIDs(this.symbolCache);
        }

        public postDiagnostics(): IDiagnostic[] {
            var errors: IDiagnostic[] = [];

            // PULLTODO: Why are we indexing from 1?
            for (var i = 1; i < this.units.length; i++) {
                this.units[i].getDiagnostics(errors);
            }

            return errors;
        }
    }
}