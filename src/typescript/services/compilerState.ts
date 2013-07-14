//
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
///<reference path='typescriptServices.ts' />

module Services {

    //
    // An cache entry in HostCache 
    //
    export class HostCacheEntry {
        private _sourceText: TypeScript.IScriptSnapshot;

        constructor(
            private fileName: string,
            private host: ILanguageServiceHost,
            public version: number,
            public isOpen: boolean) {
            this._sourceText = null;
        }
        
        public getScriptSnapshot(): TypeScript.IScriptSnapshot {
            if (this._sourceText === null) {
                this._sourceText = this.host.getScriptSnapshot(this.fileName);
            }

            return this._sourceText;
        }
    }

    //
    // Cache host information about scripts. Should be refreshed 
    // at each language service public entry point, since we don't know when 
    // set of scripts handled by the host changes.
    //
    export class HostCache {
        private map: TypeScript.StringHashTable<HostCacheEntry>;

        constructor(public host: ILanguageServiceHost) {
            // script id => script index
            this.map = new TypeScript.StringHashTable<HostCacheEntry>();

            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                var fileName = fileNames[i];
                this.map.add(fileName, new HostCacheEntry(
                    fileName, this.host, this.host.getScriptVersion(fileName), this.host.getScriptIsOpen(fileName)));
            }
        }

        public contains(fileName: string): boolean {
            return this.map.lookup(fileName) !== null;
        }

        public getFileNames(): string[]{
            return this.map.getAllKeys();
        }

        public getVersion(fileName: string): number {
            return this.map.lookup(fileName).version;
        }

        public isOpen(fileName: string): boolean {
            return this.map.lookup(fileName).isOpen;
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.map.lookup(fileName).getScriptSnapshot();
        }
    }

    export class CompilerState {
        private logger: TypeScript.ILogger;
        private diagnostics: ICompilerDiagnostics;

        //
        // State related to compiler instance
        //
        private compiler: TypeScript.TypeScriptCompiler = null;
        private hostCache: HostCache = null;
        private _compilationSettings: TypeScript.CompilationSettings = null;

        constructor(private host: ILanguageServiceHost) {
            this.logger = this.host;

            //
            // Object for logging user edits into Documents/Diagnostics.txt
            //
            this.diagnostics = new CompilerDiagnostics(host);
        }

        public compilationSettings() {
            return this._compilationSettings;
        }

        public getFileNames(): string[] {
            return this.compiler.fileNameToDocument.getAllKeys();
        }

        public getScript(fileName: string): TypeScript.Script {
            return this.compiler.getDocument(fileName).script;
        }

        public getScripts(): TypeScript.Script[] {
            return this.compiler.getScripts();
        }

        public getScriptVersion(fileName: string) {
            return this.hostCache.getVersion(fileName);
        }

        public getSemanticInfoChain() {
            return this.compiler.semanticInfoChain;
        }

        private addCompilerUnit(compiler: TypeScript.TypeScriptCompiler, fileName: string): void {
            compiler.addSourceUnit(fileName,
                this.hostCache.getScriptSnapshot(fileName),
                ByteOrderMark.None,
                this.hostCache.getVersion(fileName),
                this.hostCache.isOpen(fileName));
        }

        public getHostCompilationSettings(): TypeScript.CompilationSettings {
            var settings = this.host.getCompilationSettings();
            if (settings !== null) {
                return settings;
            }

            // Set "ES5" target by default for language service
            settings = new TypeScript.CompilationSettings();
            settings.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;

            return settings;
        }

        private createCompiler(): void {
            // Create and initialize compiler
            this.logger.log("Initializing compiler");

            this._compilationSettings = new TypeScript.CompilationSettings();

            Services.copyDataObject(this.compilationSettings(), this.getHostCompilationSettings());
            this.compiler = new TypeScript.TypeScriptCompiler(this.logger, this.compilationSettings());

            // Add unit for all source files
            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                this.addCompilerUnit(this.compiler, fileNames[i]);
            }

            // Initial typecheck
            this.compiler.pullTypeCheck();
        }

        public minimalRefresh(): void {
            //if (this.compiler === null) {
            //    this.refresh();
            //    return;
            //}

            // Reset the cache at start of every refresh
            this.hostCache = new HostCache(this.host);
        }

        public refresh(): void {
            // Reset the cache at start of every refresh
            this.hostCache = new HostCache(this.host);

            // If full refresh not needed, attempt partial refresh
            if (!this.fullRefresh()) {
                this.partialRefresh();
            }
        }

        //
        // Re-create a fresh compiler instance if needed. 
        // Return "true" if a fresh compiler instance was created. 
        //
        private fullRefresh(): boolean {
            // Initial state: no compiler yet
            if (this.compiler == null) {
                this.logger.log("Creating new compiler instance because there is no currently active instance");
                this.createCompiler();
                return true;
            }

            // If any compilation settings changes, a new compiler instance is needed
            //if (!Services.compareDataObjects(this.compilationSettings, this.getHostCompilationSettings())) {
            //    this.logger.log("Creating new compiler instance because compilation settings have changed.");
            //    this.createCompiler();
            //    return true;
            //}

            /// If any file was deleted, we need to create a new compiler, because we are not
            /// even close to supporting removing symbols (unitindex will be all over the place
            /// if we remove scripts from the list).
            var fileNames = this.compiler.fileNameToDocument.getAllKeys();
            for (var unitIndex = 0, len = fileNames.length; unitIndex < len; unitIndex++) {
                var fileName = fileNames[unitIndex];

                if (!this.hostCache.contains(fileName)) {
                    this.logger.log("Creating new compiler instance because of unit is not part of program anymore: " + unitIndex + "-" + fileName);
                    this.createCompiler();
                    return true;
                }
            }

            // We can attempt a partial refresh
            return false;
        }

        // Attempt an incremental refresh of the compiler state.
        private partialRefresh(): void {
            this.logger.log("Updating files...");

            var fileAdded: boolean = false;

            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                var fileName = fileNames[i];

                if (this.compiler.getDocument(fileName)) {
                    this.updateCompilerUnit(this.compiler, fileName);
                }
                else {
                    this.addCompilerUnit(this.compiler, fileName);
                    fileAdded = true;
                }
            }

            if (fileAdded) {
                this.compiler.pullTypeCheck();
            }
        }

        public getDocument(fileName: string): TypeScript.Document {
            return this.compiler.getDocument(fileName);
        }

        public getSyntacticDiagnostics(fileName: string): TypeScript.IDiagnostic[] {
            return this.compiler.getSyntacticDiagnostics(fileName);
        }

        public getSemanticDiagnostics(fileName: string): TypeScript.IDiagnostic[] {
            return this.compiler.getSemanticDiagnostics(fileName);
        }

        public getEmitOutput(fileName: string): EmitOutput {
            var result = new EmitOutput();

            // Check for syntactic errors
            var syntacticDiagnostics = this.compiler.getSyntacticDiagnostics(fileName);
            if (this.containErrors(syntacticDiagnostics)) {
                // This file has at least one syntactic error, return and do not emit code.
                return result;
            }
            
            // Force a type check before emit
            this.compiler.getSemanticDiagnostics(fileName);

            var emitterIOHost: TypeScript.EmitterIOHost = {
                writeFile: (fileName: string, contents: string, writeByteOrderMark: boolean) => {
                    var outputFile = new EmitOutputTextWriter(fileName, writeByteOrderMark);
                    outputFile.Write(contents);
                    result.outputFiles.push(outputFile);
                },
                directoryExists: (fileName: string) => true,
                fileExists: (fileName: string) => false,
                resolvePath: (fileName: string) => fileName
            };

            // Call the emitter
            var diagnostics: TypeScript.IDiagnostic[];

            diagnostics = this.compiler.parseEmitOption(emitterIOHost) || [];
            result.diagnostics = result.diagnostics.concat(diagnostics);
            if (this.containErrors(diagnostics)) {
                return result;
            }

            // Emit output files and source maps
            diagnostics = this.compiler.emitUnit(fileName, emitterIOHost) || [];
            result.diagnostics = result.diagnostics.concat(diagnostics);
            if (this.containErrors(diagnostics)) {
                return result;
            }

            // Emit declarations
            if (this.shouldEmitDeclarations(fileName)) {
                diagnostics = this.compiler.emitUnitDeclarations(fileName) || [];
                result.diagnostics = result.diagnostics.concat(diagnostics);
            }

            return result;
        }

        private shouldEmitDeclarations(fileName: string): boolean {
            // Only emit declarations if there are no semantic errors
            var semanticDiagnostics = this.compiler.getSemanticDiagnostics(fileName);
            if (this.containErrors(semanticDiagnostics)) {
                // This file has at least one semantic error, return and do not emit declaration.
                return false;
            }

            return true;
        }


        private containErrors(diagnostics: TypeScript.IDiagnostic[]): boolean {
            if (diagnostics && diagnostics.length > 0) {
                for (var i = 0; i < diagnostics.length; i++) {
                    var diagnosticInfo = TypeScript.getDiagnosticInfoFromCode(diagnostics[i].diagnosticCode());
                    if (diagnosticInfo.category === TypeScript.DiagnosticCategory.Error) {
                        return true;
                    }
                }
            }

            return false;
        }

        public getScriptTextChangeRangeSinceVersion(fileName: string, lastKnownVersion: number): TypeScript.TextChangeRange {
            var currentVersion = this.hostCache.getVersion(fileName);
            if (lastKnownVersion === currentVersion) {
                return TypeScript.TextChangeRange.unchanged; // "No changes"
            }

            var scriptSnapshot = this.hostCache.getScriptSnapshot(fileName);
            return scriptSnapshot.getTextChangeRangeSinceVersion(lastKnownVersion);
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.hostCache.getScriptSnapshot(fileName);
        }

        //
        // New Pull stuff
        //
        public getDeclarationSymbolInformation(path: TypeScript.AstPath, document: TypeScript.Document) {
            return this.compiler.pullGetDeclarationSymbolInformation(path, document);
        }

        public getSymbolInformationFromPath(path: TypeScript.AstPath, document: TypeScript.Document) {
            return this.compiler.pullGetSymbolInformationFromPath(path, document);
        }

        public getCallInformationFromPath(path: TypeScript.AstPath, document: TypeScript.Document) {
            return this.compiler.pullGetCallInformationFromPath(path, document);
        }

        public getVisibleMemberSymbolsFromPath(path: TypeScript.AstPath, document: TypeScript.Document) {
            return this.compiler.pullGetVisibleMemberSymbolsFromPath(path, document);
        }

        public getVisibleDeclsFromPath(path: TypeScript.AstPath, document: TypeScript.Document) {
            return this.compiler.pullGetVisibleDeclsFromPath(path, document);
        }

        public geContextualMembersFromPath(path: TypeScript.AstPath, document: TypeScript.Document) {
            return this.compiler.pullGetContextualMembersFromPath(path, document);
        }

        public pullGetDeclInformation(decl: TypeScript.PullDecl, path: TypeScript.AstPath, document: TypeScript.Document) {
            return this.compiler.pullGetDeclInformation(decl, path, document);
        }

        public getTopLevelDeclarations(fileName: string): TypeScript.PullDecl[]{
            return this.compiler.getTopLevelDeclarations(fileName);
        }

        private updateCompilerUnit(compiler: TypeScript.TypeScriptCompiler, fileName: string): void {
            var document: TypeScript.Document = this.compiler.getDocument(fileName);

            //
            // If the document is the same, assume no update
            //
            var version = this.hostCache.getVersion(fileName);
            var isOpen = this.hostCache.isOpen(fileName);
            if (document.version === version && document.isOpen === isOpen) {
                return;
            }

            var textChangeRange = this.getScriptTextChangeRangeSinceVersion(fileName, document.version);
            compiler.updateSourceUnit(fileName,
                this.hostCache.getScriptSnapshot(fileName),
                version, isOpen, textChangeRange);
        }

        private getDocCommentsOfDecl(decl: TypeScript.PullDecl) {
            var ast = this.compiler.semanticInfoChain.getASTForDecl(decl);
            if (ast && (ast.nodeType != TypeScript.NodeType.ModuleDeclaration || decl.getKind() != TypeScript.PullElementKind.Variable)) {
                return ast.getDocComments();
            }

            return [];
        }

        private getDocCommentArray(symbol: TypeScript.PullSymbol) {
            var docComments: TypeScript.Comment[] = [];
            if (!symbol) {
                return docComments;
            }

            var isParameter = symbol.getKind() == TypeScript.PullElementKind.Parameter;
            var decls = symbol.getDeclarations();
            for (var i = 0; i < decls.length; i++) {
                if (isParameter && decls[i].getKind() == TypeScript.PullElementKind.Property) {
                    // Ignore declaration for property that was defined as parameter because they both 
                    // point to same doc comment
                    continue;
                }
                docComments = docComments.concat(this.getDocCommentsOfDecl(decls[i]));
            }
            return docComments;
        }

        static getDefaultConstructorSymbolForDocComments(classSymbol: TypeScript.PullClassTypeSymbol) {
            if (classSymbol.getHasDefaultConstructor()) {
                // get from parent if possible
                var extendedTypes = classSymbol.getExtendedTypes();
                if (extendedTypes.length) {
                    return CompilerState.getDefaultConstructorSymbolForDocComments(<TypeScript.PullClassTypeSymbol>extendedTypes[0]);
                }
            }

            return classSymbol.getType().getConstructSignatures()[0];
        }

        public getDocComments(symbol: TypeScript.PullSymbol, useConstructorAsClass?: boolean): string {
            if (!symbol) {
                return "";
            }
            var decls = symbol.getDeclarations();
            if (useConstructorAsClass && decls.length && decls[0].getKind() == TypeScript.PullElementKind.ConstructorMethod) {
                var classDecl = decls[0].getParentDecl();
                return TypeScript.Comment.getDocCommentText(this.getDocCommentsOfDecl(classDecl));
            }

            if (symbol.docComments === null) {
                var docComments: string = "";
                if (!useConstructorAsClass && symbol.getKind() == TypeScript.PullElementKind.ConstructSignature &&
                    decls.length && decls[0].getKind() == TypeScript.PullElementKind.Class) {
                    var classSymbol = <TypeScript.PullClassTypeSymbol>(<TypeScript.PullSignatureSymbol>symbol).getReturnType();
                    var extendedTypes = classSymbol.getExtendedTypes();
                    if (extendedTypes.length) {
                        docComments = this.getDocComments((<TypeScript.PullClassTypeSymbol>extendedTypes[0]).getConstructorMethod());
                    } else {
                        docComments = "";
                    }
                } else if (symbol.getKind() == TypeScript.PullElementKind.Parameter) {
                    var parameterComments: string[] = [];
                    var funcContainerList = symbol.findIncomingLinks(link => link.kind == TypeScript.SymbolLinkKind.Parameter);
                    for (var i = 0; i < funcContainerList.length; i++) {
                        var funcContainer = funcContainerList[i].start;
                        var funcDocComments = this.getDocCommentArray(funcContainer);
                        var paramComment = TypeScript.Comment.getParameterDocCommentText(symbol.getDisplayName(), funcDocComments);
                        if (paramComment != "") {
                            parameterComments.push(paramComment);
                        }
                    }
                    var paramSelfComment = TypeScript.Comment.getDocCommentText(this.getDocCommentArray(symbol));
                    if (paramSelfComment != "") {
                        parameterComments.push(paramSelfComment);
                    }
                    docComments = parameterComments.join("\n");
                } else {
                    var getSymbolComments = true;
                    if (symbol.getKind() == TypeScript.PullElementKind.FunctionType) {
                        var declarationList = symbol.findIncomingLinks(link => link.kind == TypeScript.SymbolLinkKind.TypedAs);
                        if (declarationList.length > 0) {
                            docComments = this.getDocComments(declarationList[0].start);
                            getSymbolComments = false;
                        }
                    }
                    if (getSymbolComments) {
                        docComments = TypeScript.Comment.getDocCommentText(this.getDocCommentArray(symbol));
                        if (docComments == "") {
                            if (symbol.getKind() == TypeScript.PullElementKind.CallSignature) {
                                var callList = symbol.findIncomingLinks(link => link.kind == TypeScript.SymbolLinkKind.CallSignature);
                                if (callList.length == 1) {
                                    var callTypeSymbol = <TypeScript.PullTypeSymbol>callList[0].start;
                                    if (callTypeSymbol.getCallSignatures().length == 1) {
                                        docComments = this.getDocComments(callTypeSymbol);
                                    }
                                }
                            }
                        }
                    }
                }
                symbol.docComments = docComments;
            }

            return symbol.docComments;
        }
    }
}
