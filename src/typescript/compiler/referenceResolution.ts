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

///<reference path='typescript.ts' />

module TypeScript {

    export interface IResolvedFile {
        fileInformation: FileInformation;
        path: string;
    }

    /// This class acts as a convenience class to store path and content information in places
    /// where we need an ISourceText object
    export class SourceUnit implements IScriptSnapshot, IResolvedFile {
        public referencedFiles: IFileReference[] = null;
        private lineStarts: number[] = null;

        constructor(public path: string,
                    public fileInformation: FileInformation) {
        }

        public getText(start: number, end: number): string {
            return this.fileInformation.contents().substring(start, end);
        }

        public getLength(): number {
            return this.fileInformation.contents().length;
        }

        public getLineStartPositions(): number[]{
            if (this.lineStarts === null) {
                this.lineStarts = LineMap.fromString(this.fileInformation.contents()).lineStarts();
            }

            return this.lineStarts;
        }

        public getTextChangeRangeSinceVersion(scriptVersion: number): TypeScript.TextChangeRange {
            throw Errors.notYetImplemented();
        }
    }

    // Note: This is being using by the host (VS) and is marshaled back and forth. When changing this make sure the changes 
    // are reflected in the managed side as well.
    export interface IFileReference extends ILineAndCharacter {
        path: string;
        isResident: boolean;
        position: number;
        length: number;
    }

    /// Limited API for file system manipulation
    export interface IFileSystemObject {
        resolvePath(path: string): string;
        readFile(path: string): FileInformation;
        findFile(rootPath: string, partialFilePath: string): IResolvedFile;
        dirName(path: string): string;
    }

    export class CompilationEnvironment {
        constructor (public compilationSettings: CompilationSettings, public ioHost: IFileSystemObject) { }
        public code: SourceUnit[] = [];
        public inputFileNameToOutputFileName = new StringHashTable<string>();
        public getSourceUnit(path: string): SourceUnit {
            var normalizedPath = switchToForwardSlashes(path.toUpperCase());
            for (var i = 0, n = this.code.length; i < n; i++) {
                var sourceUnit = this.code[i];
                var soruceUnitNormalizedPath = switchToForwardSlashes(sourceUnit.path.toUpperCase());
                if (normalizedPath === soruceUnitNormalizedPath) {
                    return sourceUnit;
                }
            }

            return null;
        }
    }

    export interface IResolutionDispatcher {
        errorReporter: TypeScript.IDignosticsReporter;
        postResolution(path: string, source: IScriptSnapshot): void;
    }

    export interface ICodeResolver {
        resolveCode(referencePath: string, rootPath: string, performSearch:boolean, state: IResolutionDispatcher): void;
    }

    export interface IResolverHost {
        resolveCompilationEnvironment(preEnvironment: CompilationEnvironment, resolver: ICodeResolver, traceDependencies: boolean): CompilationEnvironment;
    }

    export class CodeResolver implements TypeScript.ICodeResolver {
        public visited: any = { };

        constructor (public environment: CompilationEnvironment) { }

        public resolveCode(referencePath: string, parentPath: string, performSearch: boolean, resolutionDispatcher: TypeScript.IResolutionDispatcher): boolean {
            var resolvedFile: IResolvedFile = { fileInformation: null, path: referencePath };
            
            var ioHost = this.environment.ioHost;
            
            // If the path is relative, normalize it, based on the root
            var isRelativePath = TypeScript.isRelative(referencePath);
            var isRootedPath = isRelativePath ? false : isRooted(referencePath);
            var normalizedPath: string = 
                isRelativePath ? ioHost.resolvePath(parentPath + "/" + referencePath) : 
                // we only follow the second clause if the path is a non-rooted triple-slash reference path
                (isRootedPath || !parentPath || performSearch ? referencePath : parentPath + "/" + referencePath);

            // We use +=.ts to make sure we don't accidentally pick up ".js" files or the like
            if (!isTSFile(normalizedPath)) {
                normalizedPath += ".ts";  //changePathToSTR(normalizedPath);
            }

            normalizedPath = switchToForwardSlashes(stripQuotes(normalizedPath));
            var absoluteModuleID = this.environment.compilationSettings.useCaseSensitiveFileResolution ? normalizedPath : normalizedPath.toLocaleUpperCase();

            // read the file contents - if it doesn't exist, trigger a resolution error
            if (!this.visited[absoluteModuleID]) {
                // if the path is relative, or came from a reference tag, we don't perform a search
                if (isRelativePath || isRootedPath || !performSearch) {
                    try {
                        CompilerDiagnostics.debugPrint("   Reading code from " + normalizedPath);
                            
                        // Look for the .ts file first - if not present, the .d.ts
                        try {
                            resolvedFile.fileInformation = ioHost.readFile(normalizedPath);
                        }
                        catch (err1) {
                            if (err1.isUnsupportedEncoding) {
                                resolutionDispatcher.errorReporter.addDiagnostic(
                                    new TypeScript.Diagnostic(null, 0, 0, DiagnosticCode.Unsupported_encoding_for_file__0, [normalizedPath]));
                                return;
                            }

                            if (isTSFile(normalizedPath)) {
                                normalizedPath = changePathToDTS(normalizedPath);
                                CompilerDiagnostics.debugPrint("   Reading code from " + normalizedPath);
                                resolvedFile.fileInformation = ioHost.readFile(normalizedPath);
                            }
                        }

                        CompilerDiagnostics.debugPrint("   Found code at " + normalizedPath);

                        resolvedFile.path = normalizedPath;
                        this.visited[absoluteModuleID] = true;
                    }
                    catch (err4) {
                        if (err4.isUnsupportedEncoding) {
                            resolutionDispatcher.errorReporter.addDiagnostic(
                                new TypeScript.Diagnostic(null, 0, 0, DiagnosticCode.Unsupported_encoding_for_file__0, [normalizedPath]));
                            return;
                        }

                        CompilerDiagnostics.debugPrint("   Did not find code for " + referencePath);
                        // Resolution failed
                        return false;
                    }
                }
                else {

                    // if the path is non-relative, we should attempt to search on the relative path
                    try {
                        resolvedFile = ioHost.findFile(parentPath, normalizedPath);

                        if (!resolvedFile) {
                            if (isTSFile(normalizedPath)) {
                                normalizedPath = changePathToDTS(normalizedPath);
                                resolvedFile = ioHost.findFile(parentPath, normalizedPath);
                            }
                        }
                    }
                    catch (e) {
                        CompilerDiagnostics.debugPrint("   Did not find code for " + normalizedPath);
                        // Resolution failed
                        return false;
                    }

                    if (resolvedFile) {
                        resolvedFile.path = switchToForwardSlashes(TypeScript.stripQuotes(resolvedFile.path));
                        CompilerDiagnostics.debugPrint(referencePath + " resolved to: " + resolvedFile.path);
                        resolvedFile.fileInformation = resolvedFile.fileInformation;
                        this.visited[absoluteModuleID] = true;
                    }
                    else {
                        CompilerDiagnostics.debugPrint("Could not find " + referencePath);
                    }
                }

                if (resolvedFile && resolvedFile.fileInformation !== null) {
                    // preprocess the file, to gather dependencies
                    var rootDir = ioHost.dirName(resolvedFile.path);
                    var sourceUnit = new SourceUnit(resolvedFile.path, resolvedFile.fileInformation);
                    var preProcessedFileInfo = preProcessFile(resolvedFile.path, sourceUnit, this.environment.compilationSettings);
                    var resolvedFilePath = ioHost.resolvePath(resolvedFile.path);
                    var resolutionResult: boolean;

                    sourceUnit.referencedFiles = preProcessedFileInfo.referencedFiles;

                    // resolve explicit references
                    for (var i = 0; i < preProcessedFileInfo.referencedFiles.length; i++) {
                        var fileReference = preProcessedFileInfo.referencedFiles[i];

                        normalizedPath = isRooted(fileReference.path) ? fileReference.path : rootDir + "/" + fileReference.path;
                        normalizedPath = ioHost.resolvePath(normalizedPath);

                        if (resolvedFilePath === normalizedPath) {
                            resolutionDispatcher.errorReporter.addDiagnostic(
                                new TypeScript.Diagnostic(normalizedPath, fileReference.position, fileReference.length, DiagnosticCode.A_file_cannot_have_a_reference_itself, null));
                            continue;
                        }

                        resolutionResult = this.resolveCode(fileReference.path, rootDir, false, resolutionDispatcher);

                        if (!resolutionResult) {
                            resolutionDispatcher.errorReporter.addDiagnostic(
                                new TypeScript.Diagnostic(resolvedFilePath, fileReference.position, fileReference.length, DiagnosticCode.Cannot_resolve_referenced_file___0_, [fileReference.path]));
                        }
                    }
                    
                    // resolve imports
                    for (var i = 0; i < preProcessedFileInfo.importedFiles.length; i++) {
                        var fileImport = preProcessedFileInfo.importedFiles[i];

                        resolutionResult = this.resolveCode(fileImport.path, rootDir, true, resolutionDispatcher);

                        if (!resolutionResult) {
                            resolutionDispatcher.errorReporter.addDiagnostic(
                                new TypeScript.Diagnostic(resolvedFilePath, fileImport.position, fileImport.length, DiagnosticCode.Cannot_resolve_imported_file___0_, [fileImport.path]));
                        }
                    }

                    // add the file to the appropriate code list
                    resolutionDispatcher.postResolution(sourceUnit.path, sourceUnit);
                }
            }
            return true;
        }
    }
}