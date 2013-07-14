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

///<reference path='typescript.ts'/>
///<reference path='io.ts'/>
///<reference path='optionsParser.ts'/>

declare var localizedDiagnosticMessages: TypeScript.IDiagnosticMessages;

class DiagnosticsLogger implements TypeScript.ILogger {
    constructor(public ioHost: IIO) {
    }
    public information(): boolean { return false; }
    public debug(): boolean { return false; }
    public warning(): boolean { return false; }
    public error(): boolean { return false; }
    public fatal(): boolean { return false; }
    public log(s: string): void {
        this.ioHost.stdout.WriteLine(s);
    }
}

class ErrorReporter implements TypeScript.IDignosticsReporter {
    private compilationEnvironment: TypeScript.CompilationEnvironment
    public hasErrors: boolean;

    constructor(public ioHost: IIO, compilationEnvironment: TypeScript.CompilationEnvironment) {
        this.hasErrors = false;
        this.setCompilationEnvironment(compilationEnvironment);
    }

    public addDiagnostic(diagnostic: TypeScript.IDiagnostic) {
        this.hasErrors = true;

        if (diagnostic.fileName()) {
            var soruceUnit = this.compilationEnvironment.getSourceUnit(diagnostic.fileName());
            if (!soruceUnit) {
                soruceUnit = new TypeScript.SourceUnit(diagnostic.fileName(), this.ioHost.readFile(diagnostic.fileName()));
            }
            var lineMap = new TypeScript.LineMap(soruceUnit.getLineStartPositions(), soruceUnit.getLength());
            var lineCol = { line: -1, character: -1 };
            lineMap.fillLineAndCharacterFromPosition(diagnostic.start(), lineCol);

            this.ioHost.stderr.Write(diagnostic.fileName() + "(" + (lineCol.line + 1) + "," + (lineCol.character+1) + "): ");
        }

        this.ioHost.stderr.WriteLine(diagnostic.message());
    }

    public setCompilationEnvironment(compilationEnvironment: TypeScript.CompilationEnvironment): void {
        this.compilationEnvironment = compilationEnvironment;
    }

    public reset() {
        this.hasErrors = false;
    }
}

class CommandLineHost implements TypeScript.IResolverHost {

    public pathMap: any = {};
    public resolvedPaths: any = {};

    constructor(public compilationSettings: TypeScript.CompilationSettings, public errorReporter: ErrorReporter) { 
    }

    public getPathIdentifier(path: string) {
        return this.compilationSettings.useCaseSensitiveFileResolution ? path : path.toLocaleUpperCase();
    }

    public isResolved(path: string) {
        return this.resolvedPaths[this.getPathIdentifier(this.pathMap[path])] != undefined;
    }

    public resolveCompilationEnvironment(preEnv: TypeScript.CompilationEnvironment,
                                         resolver: TypeScript.ICodeResolver,
                                         traceDependencies: boolean): TypeScript.CompilationEnvironment {
        var resolvedEnv = new TypeScript.CompilationEnvironment(preEnv.compilationSettings, preEnv.ioHost);

        var nCode = preEnv.code.length;
        var path = "";

        this.errorReporter.setCompilationEnvironment(resolvedEnv);

        var resolutionDispatcher: TypeScript.IResolutionDispatcher = {
            errorReporter: this.errorReporter,
            postResolution: (path: string, code: TypeScript.IScriptSnapshot) => {
                var pathId = this.getPathIdentifier(path);
                if (!this.resolvedPaths[pathId]) {
                    resolvedEnv.code.push(<TypeScript.SourceUnit>code);
                    this.resolvedPaths[pathId] = true;
                }
            }
        };

        for (var i = 0; i < nCode; i++) {
            path = TypeScript.switchToForwardSlashes(preEnv.ioHost.resolvePath(preEnv.code[i].path));
            this.pathMap[preEnv.code[i].path] = path;
            resolver.resolveCode(path, "", false, resolutionDispatcher);
        }

        return resolvedEnv;
    }
}

class BatchCompiler {
    public compilationSettings: TypeScript.CompilationSettings;
    public compilationEnvironment: TypeScript.CompilationEnvironment;
    public resolvedEnvironment: TypeScript.CompilationEnvironment = null;
    public hasResolveErrors: boolean = false;
    public compilerVersion = "0.9.0.1";
    public printedVersion = false;
    public errorReporter: ErrorReporter = null;

    constructor(public ioHost: IIO) {
        this.compilationSettings = new TypeScript.CompilationSettings();
        this.compilationEnvironment = new TypeScript.CompilationEnvironment(this.compilationSettings, this.ioHost);
        this.errorReporter = new ErrorReporter(this.ioHost, this.compilationEnvironment);
    }

    public resolve() {
        var resolver = new TypeScript.CodeResolver(this.compilationEnvironment);
        var commandLineHost = new CommandLineHost(this.compilationSettings, this.errorReporter);
        var ret = commandLineHost.resolveCompilationEnvironment(this.compilationEnvironment, resolver, true);

        for (var i = 0; i < this.compilationEnvironment.code.length; i++) {
            if (!commandLineHost.isResolved(this.compilationEnvironment.code[i].path)) {
                var path = this.compilationEnvironment.code[i].path;
                if (!TypeScript.isTSFile(path) && !TypeScript.isDTSFile(path)) {
                    this.errorReporter.addDiagnostic(
                        new TypeScript.Diagnostic(null, 0, 0, TypeScript.DiagnosticCode.Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed, [path]));
                }
                else {
                    this.errorReporter.addDiagnostic(
                        new TypeScript.Diagnostic(null, 0, 0, TypeScript.DiagnosticCode.Could_not_find_file___0_, [path]));
                }
            }
        }

        return ret;
    }
    
    /// Do the actual compilation reading from input files and
    /// writing to output file(s).
    public compile(): boolean {
        if (typeof localizedDiagnosticMessages === "undefined") {
            localizedDiagnosticMessages = null;
        }

        var logger = this.compilationSettings.gatherDiagnostics ? <TypeScript.ILogger>new DiagnosticsLogger(this.ioHost) : new TypeScript.NullLogger();
        var compiler = new TypeScript.TypeScriptCompiler(logger, this.compilationSettings, localizedDiagnosticMessages);

        var anySyntacticErrors = false;
        var anySemanticErrors = false;

        for (var iCode = 0 ; iCode < this.resolvedEnvironment.code.length; iCode++) {
            var code = this.resolvedEnvironment.code[iCode];

            // if file resolving is disabled, the file's content will not yet be loaded

            if (!this.compilationSettings.resolve) {
                try {
                    code.fileInformation = this.ioHost.readFile(code.path);
                }
                catch (e) {
                    if (e.isUnsupportedEncoding) {
                        this.errorReporter.addDiagnostic(
                            new TypeScript.Diagnostic(null, 0, 0, TypeScript.DiagnosticCode.Unsupported_encoding_for_file__0, [code.path]));
                    }
                }

                // If declaration files are going to be emitted, 
                // preprocess the file contents and add in referenced files as well
                if (this.compilationSettings.generateDeclarationFiles) {
                    TypeScript.CompilerDiagnostics.assert(code.referencedFiles === null, "With no resolve option, referenced files need to null");
                    code.referencedFiles = TypeScript.getReferencedFiles(code.path, code);
                }
            }

            if (code.fileInformation != null) {
                compiler.addSourceUnit(code.path, TypeScript.ScriptSnapshot.fromString(code.fileInformation.contents()),
                    code.fileInformation.byteOrderMark(), /*version:*/ 0, /*isOpen:*/ false, code.referencedFiles);

                var syntacticDiagnostics = compiler.getSyntacticDiagnostics(code.path);
                compiler.reportDiagnostics(syntacticDiagnostics, this.errorReporter);

                if (syntacticDiagnostics.length > 0) {
                    anySyntacticErrors = true;
                }
            }
        }

        if (anySyntacticErrors) {
            return true;
        }

        compiler.pullTypeCheck();
        var fileNames = compiler.fileNameToDocument.getAllKeys();
        
        for (var i = 0, n = fileNames.length; i < n; i++) {
            var fileName = fileNames[i];
            var semanticDiagnostics = compiler.getSemanticDiagnostics(fileName);
            if (semanticDiagnostics.length > 0) {
                anySemanticErrors = true;
                compiler.reportDiagnostics(semanticDiagnostics, this.errorReporter);
            }
        }  

        var emitterIOHost = {
            writeFile: (fileName: string, contents: string, writeByteOrderMark: boolean) => IOUtils.writeFileAndFolderStructure(this.ioHost, fileName, contents, writeByteOrderMark),
            directoryExists: this.ioHost.directoryExists,
            fileExists: this.ioHost.fileExists,
            resolvePath: this.ioHost.resolvePath
        } ;

        var mapInputToOutput = (inputFile: string, outputFile: string): void => {
            this.resolvedEnvironment.inputFileNameToOutputFileName.addOrUpdate(inputFile, outputFile);
        };

        // TODO: if there are any emit diagnostics.  Don't proceed.
        var emitDiagnostics = compiler.emitAll(emitterIOHost, mapInputToOutput);
        compiler.reportDiagnostics(emitDiagnostics, this.errorReporter);
        if (emitDiagnostics.length > 0) {
            return true;
        }

        // Don't emit declarations if we have any semantic diagnostics.
        if (anySemanticErrors) {
            return true;
        }

        var emitDeclarationsDiagnostics = compiler.emitAllDeclarations();
        compiler.reportDiagnostics(emitDeclarationsDiagnostics, this.errorReporter);
        if (emitDeclarationsDiagnostics.length > 0) {
            return true;
        }

        return false;
    }

    public updateCompile(): boolean {
        if (typeof localizedDiagnosticMessages === "undefined") {
            localizedDiagnosticMessages = null;
        }

        var logger = this.compilationSettings.gatherDiagnostics ? <TypeScript.ILogger>new DiagnosticsLogger(this.ioHost) : new TypeScript.NullLogger();
        var compiler = new TypeScript.TypeScriptCompiler(logger, this.compilationSettings, localizedDiagnosticMessages);

        var anySyntacticErrors = false;
        var foundLib = false;

        for (var iCode = 0; iCode <= this.resolvedEnvironment.code.length; iCode++) {
            var code = this.resolvedEnvironment.code[iCode];

            if (code.path.indexOf("lib.d.ts") != -1) {
                foundLib = true;
            }
            else if ((foundLib && iCode > 1) || (!foundLib && iCode > 0)) {
                break;
            }

            this.ioHost.stdout.WriteLine("Consuming " + this.resolvedEnvironment.code[iCode].path + "...");

            // if file resolving is disabled, the file's content will not yet be loaded

            if (!this.compilationSettings.resolve) {
                try {
                    code.fileInformation = this.ioHost.readFile(code.path);
                }
                catch (e) {
                    if (e.isUnsupportedEncoding) {
                        this.errorReporter.addDiagnostic(
                            new TypeScript.Diagnostic(null, 0, 0, TypeScript.DiagnosticCode.Unsupported_encoding_for_file__0, [code.path]));
                    }
                }
                // If declaration files are going to be emitted, 
                // preprocess the file contents and add in referenced files as well
                if (this.compilationSettings.generateDeclarationFiles) {
                    TypeScript.CompilerDiagnostics.assert(code.referencedFiles === null, "With no resolve option, referenced files need to null");
                    code.referencedFiles = TypeScript.getReferencedFiles(code.path, code);
                }
            }

            if (code.fileInformation != null) {
                compiler.addSourceUnit(code.path, TypeScript.ScriptSnapshot.fromString(code.fileInformation.contents()),
                    code.fileInformation.byteOrderMark(), /*version:*/ 0, /*isOpen:*/ true, code.referencedFiles);

                var syntacticDiagnostics = compiler.getSyntacticDiagnostics(code.path);
                compiler.reportDiagnostics(syntacticDiagnostics, this.errorReporter);

                if (syntacticDiagnostics.length > 0) {
                    anySyntacticErrors = true;
                }
            }
        }

        //if (anySyntacticErrors) {
        //    return true;
        //}

        this.ioHost.stdout.WriteLine("**** Initial type check errors:");
        compiler.pullTypeCheck();

        var semanticDiagnostics: TypeScript.IDiagnostic[];

        for (var i = 0; i < iCode; i++) {
            semanticDiagnostics = compiler.getSemanticDiagnostics(this.resolvedEnvironment.code[i].path);
            compiler.reportDiagnostics(semanticDiagnostics, this.errorReporter);
        }

        // Note: we continue even if there were type check warnings.

        // ok, now we got through the remaining files, 1-by-1, substituting the new code in for the old
        if (iCode && iCode <= this.resolvedEnvironment.code.length - 1) {
            var lastTypecheckedFileName = this.resolvedEnvironment.code[iCode - 1].path;
            var snapshot: TypeScript.IScriptSnapshot;

            for (; iCode < this.resolvedEnvironment.code.length; iCode++) {
                this.ioHost.stdout.WriteLine("**** Update type check and errors for " + this.resolvedEnvironment.code[iCode].path + ":");
                var text = this.resolvedEnvironment.code[iCode].getText(0, this.resolvedEnvironment.code[iCode].getLength());
                snapshot = TypeScript.ScriptSnapshot.fromString(text);
                compiler.updateSourceUnit(lastTypecheckedFileName, snapshot, /*version:*/ 0, /*isOpen:*/ true, null);
                // resolve the file to simulate an IDE-driven pull
                //compiler.pullResolveFile(lastTypecheckedFileName);
                semanticDiagnostics = compiler.getSemanticDiagnostics(lastTypecheckedFileName);
                compiler.reportDiagnostics(semanticDiagnostics, this.errorReporter);
            }
        }

        return false;    
    }

    // Execute the provided inputs
    private run() {
        for (var i in this.resolvedEnvironment.code) {
            var outputFileName: string = this.resolvedEnvironment.inputFileNameToOutputFileName.lookup(this.resolvedEnvironment.code[i].path) || undefined;
            if (this.ioHost.fileExists(outputFileName)) {
                var unitRes = this.ioHost.readFile(outputFileName);
                this.ioHost.run(unitRes.contents(), outputFileName);
            }
        }
    }

    /// Begin batch compilation
    public batchCompile() {
        TypeScript.CompilerDiagnostics.diagnosticWriter = { Alert: (s: string) => { this.ioHost.printLine(s); } }

        var code: TypeScript.SourceUnit;

        var opts = new OptionsParser(this.ioHost);

        opts.option('out', {
            usage: 'Concatenate and emit output to single file | Redirect output structure to the directory',
            type: 'file|directory',
            set: (str) => {
                this.compilationSettings.outputOption = str;
            }
        });

        opts.flag('sourcemap', {
            usage: 'Generates corresponding .map file',
            set: () => {
                this.compilationSettings.mapSourceFiles = true;
            }
        });

        opts.flag('fullSourceMapPath', {
            usage: 'Writes the full path of map file in the generated js file',
            experimental: true,
            set: () => {
                this.compilationSettings.emitFullSourceMapPath = true;
            }
        });

        opts.flag('declaration', {
            usage: 'Generates corresponding .d.ts file',
            set: () => {
                this.compilationSettings.generateDeclarationFiles = true;
            }
        }, 'd');

        if (this.ioHost.watchFile) {
            opts.flag('watch', {
                usage: 'Watch input files',
                set: () => {
                    this.compilationSettings.watch = true;
                }
            }, 'w');
        }

        opts.flag('exec', {
            usage: 'Execute the script after compilation',
            set: () => {
                this.compilationSettings.exec = true;
            }
        }, 'e');

        opts.flag('minw', {
            usage: 'Minimize whitespace',
            experimental: true,
            set: () => { this.compilationSettings.minWhitespace = true; }
        }, 'mw');

        opts.flag('const', {
            usage: 'Propagate constants to emitted code',
            experimental: true,
            set: () => { this.compilationSettings.propagateConstants = true; }
        });

        opts.flag('comments', {
            usage: 'Emit comments to output',
            set: () => {
                this.compilationSettings.emitComments = true;
            }
        }, 'c');

        opts.flag('noresolve', {
            usage: 'Skip resolution and preprocessing',
            experimental: true,
            set: () => {
                this.compilationSettings.resolve = false;
            }
        });

        opts.flag('debug', {
            usage: 'Print debug output',
            experimental: true,
            set: () => {
                TypeScript.CompilerDiagnostics.debug = true;
            }
        });

        opts.flag('nolib', {
            usage: 'Do not include a default lib.d.ts with global declarations',
            set: () => {
                this.compilationSettings.useDefaultLib = false;
            }
        });

        opts.flag('diagnostics', {
            usage: 'gather diagnostic info about the compilation process',
            experimental: true,
            set: () => {
                this.compilationSettings.gatherDiagnostics = true;
            }
        });

        opts.flag('update', {
            usage: 'Typecheck each file as an update on the first',
            experimental: true,
            set: () => {
                this.compilationSettings.updateTC = true;
            }
        });

        opts.option('target', {
            usage: 'Specify ECMAScript target version: "ES3" (default), or "ES5"',
            type: 'VER',
            set: (type) => {
                type = type.toLowerCase();

                if (type === 'es3') {
                    this.compilationSettings.codeGenTarget = TypeScript.LanguageVersion.EcmaScript3;
                }
                else if (type === 'es5') {
                    this.compilationSettings.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;
                }
                else {
                    this.errorReporter.addDiagnostic(
                        new TypeScript.Diagnostic(null, 0, 0, TypeScript.DiagnosticCode.ECMAScript_target_version__0__not_supported___Using_default__1__code_generation, [type, "ES3"]));
                }
            }
        });

        opts.option('module', {
            usage: 'Specify module code generation: "commonjs" (default) or "amd"',
            type: 'kind',
            set: (type) => {
                type = type.toLowerCase();

                if (type === 'commonjs' || type === 'node') {
                    this.compilationSettings.moduleGenTarget = TypeScript.ModuleGenTarget.Synchronous;
                }
                else if (type === 'amd') {
                    this.compilationSettings.moduleGenTarget = TypeScript.ModuleGenTarget.Asynchronous;
                }
                else {
                    this.errorReporter.addDiagnostic(
                        new TypeScript.Diagnostic(null, 0, 0, TypeScript.DiagnosticCode.Module_code_generation__0__not_supported___Using_default__1__code_generation, [type, "commonjs"]));
                }
            }
        });

        var printedUsage = false;

        opts.flag('help', {
            usage: 'Print this message',
            set: () => {
                this.printVersion();
                opts.printUsage();
                printedUsage = true;
            }
        }, 'h');

        opts.flag('useCaseSensitiveFileResolution', {
            usage: 'Force file resolution to be case sensitive',
            experimental: true,
            set: () => {
                this.compilationSettings.useCaseSensitiveFileResolution = true;
            }
        });

        opts.flag('version', {
            usage: 'Print the compiler\'s version: ' + this.compilerVersion,
            set: () => {
                this.printVersion();
            }
        }, 'v');

        opts.flag('disallowbool', {
            usage: 'Throw error for use of deprecated "bool" type',
            set: () => {
                this.compilationSettings.disallowBool = true;
            }
        }, 'b');

        opts.flag('disallowimportmodule', {
            usage: 'Throw error for use of deprecated "module" keyword when referencing an external module. Only allow "require" keyword.',
            set: () => {
                this.compilationSettings.allowModuleKeywordInExternalModuleReference = false;
            }
        }, 'm');

        opts.parse(this.ioHost.arguments);
        
        if (this.compilationSettings.useDefaultLib) {
            var compilerFilePath = this.ioHost.getExecutingFilePath()
            var binDirPath = this.ioHost.dirName(compilerFilePath);
            var libStrPath = this.ioHost.resolvePath(binDirPath + "/lib.d.ts");
            code = new TypeScript.SourceUnit(libStrPath, null);
            this.compilationEnvironment.code.push(code);
        }

        for (var i = 0; i < opts.unnamed.length; i++) {
            code = new TypeScript.SourceUnit(opts.unnamed[i], null);
            this.compilationEnvironment.code.push(code);
        }

        // If no source files provided to compiler - print usage information
        if (this.compilationEnvironment.code.length === (this.compilationSettings.useDefaultLib ? 1 : 0)) {
            if (!printedUsage && !this.printedVersion) {
                this.printVersion();
                opts.printUsage();
                this.ioHost.quit(1);
            }
            return;
        }

        if (this.compilationSettings.watch) {
            // Watch will cause the program to stick around as long as the files exist
            this.watchFiles(this.compilationEnvironment.code.slice(0));
        }
        else {
            // Resolve file dependencies, if requested
            this.resolvedEnvironment = this.compilationSettings.resolve ? this.resolve() : this.compilationEnvironment;

            if (!this.compilationSettings.updateTC) {
                this.compile();
            }
            else {
                this.updateCompile();
            }

            if (!this.errorReporter.hasErrors) {
                if (this.compilationSettings.exec) {
                    this.run();
                }
            }

            // Exit with the appropriate error code
            this.ioHost.quit(this.errorReporter.hasErrors ? 1 : 0);
        }
    }

    public printVersion() {
        if (!this.printedVersion) {
            this.ioHost.printLine("Version " + this.compilerVersion);
            this.printedVersion = true;
        }
    }

    private watchFiles(sourceFiles: TypeScript.SourceUnit[]) {
        if (!this.ioHost.watchFile) {
            this.errorReporter.addDiagnostic(
                new TypeScript.SemanticDiagnostic(null, 0, 0, TypeScript.DiagnosticCode.Current_host_does_not_support__w_atch_option, null));
            return;
        }

        var resolvedFiles: string[] = []
        var watchers: { [x: string]: IFileWatcher; } = {};
        var firstTime = true;

        var addWatcher = (fileName: string) => {
            if (!watchers[fileName]) {
                var watcher = this.ioHost.watchFile(fileName, onWatchedFileChange);
                watchers[fileName] = watcher;
            }
            else {
                TypeScript.CompilerDiagnostics.debugPrint("Cannot watch file, it is already watched.");
            }
        };

        var removeWatcher = (fileName: string) => {
            if (watchers[fileName]) {
                watchers[fileName].close();
                delete watchers[fileName];
            }
            else {
                TypeScript.CompilerDiagnostics.debugPrint("Cannot stop watching file, it is not being watched.");
            }
        };

        var onWatchedFileChange = () => {
            // Reset the state
            this.compilationEnvironment.code = sourceFiles;

            // Clean errors for previous compilation
            this.errorReporter.reset();

            // Resolve file dependencies, if requested
            this.resolvedEnvironment = this.compilationSettings.resolve ? this.resolve() : this.compilationEnvironment;

            // Check if any new files were added to the environment as a result of the file change
            var oldFiles = resolvedFiles;
            var newFiles: string[] = [];
            this.resolvedEnvironment.code.forEach((sf) => newFiles.push(sf.path));
            newFiles = newFiles.sort();

            var i = 0, j = 0;
            while (i < oldFiles.length && j < newFiles.length) {

                var compareResult = oldFiles[i].localeCompare(newFiles[j]);
                if (compareResult === 0) {
                    // No change here
                    i++;
                    j++;
                }
                else if (compareResult < 0) {
                    // Entry in old list does not exist in the new one, it was removed
                    removeWatcher(oldFiles[i]);
                    i++;
                }
                else {
                    // Entry in new list does exist in the new one, it was added
                    addWatcher(newFiles[j]);
                    j++;
                }
            }

            // All remaining unmatched items in the old list have been removed
            for (var k = i; k < oldFiles.length; k++) {
                removeWatcher(oldFiles[k]);
            }

            // All remaing unmatched items in the new list have been added
            for (k = j; k < newFiles.length; k++) {
                addWatcher(newFiles[k]);
            }

            // Update the state
            resolvedFiles = newFiles;

            // Print header
            if (!firstTime) {
                this.ioHost.printLine("");
                this.ioHost.printLine("Recompiling (" + new Date() + "): ");
                resolvedFiles.forEach((f) => this.ioHost.printLine("    " + f));
            }

            // Trigger a new compilation
            this.compile();

            if (!this.errorReporter.hasErrors && this.compilationSettings.exec) {
                try {
                    this.run();
                }
                catch (e) {
                    if (e.stack) {
                        this.ioHost.stderr.WriteLine('\n' + e.stack);
                    }
                }
            }

            firstTime = false;
        };

        // Switch to using stdout for all error messages
        this.ioHost.stderr = this.ioHost.stdout;
        onWatchedFileChange();
    }
}

// Start the batch compilation using the current hosts IO
var batch = new BatchCompiler(IO);
batch.batchCompile();
