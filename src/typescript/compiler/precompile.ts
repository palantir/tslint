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

    /// Compiler settings
    export class CompilationSettings {
        public propagateConstants = false;
        public minWhitespace = false;
        public emitComments = false;
        public watch = false;
        public exec = false;
        public resolve = true;
        public disallowBool = false;
        public allowAutomaticSemicolonInsertion = true;
        public allowModuleKeywordInExternalModuleReference = true;

        public useDefaultLib = true;

        public codeGenTarget = LanguageVersion.EcmaScript3;
        public moduleGenTarget = ModuleGenTarget.Synchronous;

        // --out option passed. 
        // Default is the "" which leads to multiple files generated next to the.ts files
        public outputOption: string = "";
        public mapSourceFiles = false;
        public emitFullSourceMapPath = false; // By default emit relative path of the soucemap
        public generateDeclarationFiles = false;

        public useCaseSensitiveFileResolution = false;
        public gatherDiagnostics = false;

        public updateTC = false;

        public implicitAny = false;
    }

    ///
    /// Preprocessing
    ///
    export interface IPreProcessedFileInfo {
        settings: CompilationSettings;
        referencedFiles: IFileReference[];
        importedFiles: IFileReference[];
        isLibFile: boolean;
    }

    interface ITripleSlashDirectiveProperties {
        noDefaultLib: boolean;
    }

    function getFileReferenceFromReferencePath(comment: string): IFileReference {
        var referencesRegEx = /^(\/\/\/\s*<reference\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*\/>/gim;
        var match = referencesRegEx.exec(comment);

        if (match) {
            var path: string = normalizePath(match[3]);
            var adjustedPath = normalizePath(path);
    
            var isResident = match.length >= 7 && match[6] === "true";
            if (isResident) {
                CompilerDiagnostics.debugPrint(path + " is resident");
            }
            return {
                line: 0,
                character: 0,
                position: 0,
                length: 0,
                path: switchToForwardSlashes(adjustedPath),
                isResident: isResident
            };
        }
        else {
            return null;
        }
    }

    export function getImplicitImport(comment: string): boolean {
        var implicitImportRegEx = /^(\/\/\/\s*<implicit-import\s*)*\/>/gim;
        var match = implicitImportRegEx.exec(comment);

        if (match) {
            return true;
        }
        
        return false;
    }

    export function getReferencedFiles(fileName: string, sourceText: IScriptSnapshot): IFileReference[] {
        var preProcessInfo = preProcessFile(fileName, sourceText, null, false);
        return preProcessInfo.referencedFiles;
    }

    var scannerWindow = ArrayUtilities.createArray(2048, 0);
    var scannerDiagnostics = [];

    function processImports(lineMap: LineMap, scanner: Scanner, token: ISyntaxToken, importedFiles: IFileReference[]): void {
        var position = 0;
        var lineChar = { line: -1, character: -1 };

        // Look for: 
        // import foo = module("foo")
        while (token.tokenKind !== SyntaxKind.EndOfFileToken) {
            if (token.tokenKind === SyntaxKind.ImportKeyword) {
                var importStart = position + token.leadingTriviaWidth();
                token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                if (SyntaxFacts.isIdentifierNameOrAnyKeyword(token)) {
                    token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                    if (token.tokenKind === SyntaxKind.EqualsToken) {
                        token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                        if (token.tokenKind === SyntaxKind.ModuleKeyword || token.tokenKind === SyntaxKind.RequireKeyword) {
                            token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                            if (token.tokenKind === SyntaxKind.OpenParenToken) {
                                var afterOpenParenPosition = scanner.absoluteIndex();
                                token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                                lineMap.fillLineAndCharacterFromPosition(importStart, lineChar);

                                if (token.tokenKind === SyntaxKind.StringLiteral) {
                                    var ref = {
                                        line: lineChar.line,
                                        character: lineChar.character,
                                        position: afterOpenParenPosition + token.leadingTriviaWidth(),
                                        length: token.width(),
                                        path: stripQuotes(switchToForwardSlashes(token.text())),
                                        isResident: false
                                    };
                                    importedFiles.push(ref);
                                }
                            }
                        }
                    }
                }
            }

            position = scanner.absoluteIndex();
            token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);
        }
    }

    function processTripleSlashDirectives(lineMap: LineMap, firstToken: ISyntaxToken, settings: CompilationSettings, referencedFiles: IFileReference[]): ITripleSlashDirectiveProperties {
        var leadingTrivia = firstToken.leadingTrivia();

        var position = 0;
        var lineChar = { line: -1, character: -1 };
        var noDefaultLib = false;

        for (var i = 0, n = leadingTrivia.count(); i < n; i++) {
            var trivia = leadingTrivia.syntaxTriviaAt(i);

            if (trivia.kind() === SyntaxKind.SingleLineCommentTrivia) {
                var triviaText = trivia.fullText();
                var referencedCode = getFileReferenceFromReferencePath(triviaText);

                if (referencedCode) {
                    lineMap.fillLineAndCharacterFromPosition(position, lineChar);
                    referencedCode.position = position;
                    referencedCode.length = trivia.fullWidth();
                    referencedCode.line = lineChar.line;
                    referencedCode.character = lineChar.character;

                    referencedFiles.push(referencedCode);
                }

                if (settings) {
                    // is it a lib file?
                    var isNoDefaultLibRegex = /^(\/\/\/\s*<reference\s+no-default-lib=)('|")(.+?)\2\s*\/>/gim;
                    var isNoDefaultLibMatch: any = isNoDefaultLibRegex.exec(triviaText);
                    if (isNoDefaultLibMatch) {
                        noDefaultLib = (isNoDefaultLibMatch[3] === "true");
                    }
                }
            }

            position += trivia.fullWidth();
        }

        return { noDefaultLib: noDefaultLib};
    }

    export function preProcessFile(fileName: string, sourceText: IScriptSnapshot, settings?: CompilationSettings, readImportFiles = true): IPreProcessedFileInfo {
        settings = settings || new CompilationSettings();
        var text = SimpleText.fromScriptSnapshot(sourceText);
        var scanner = new Scanner(fileName, text, settings.codeGenTarget, scannerWindow);

        var firstToken = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

        // only search out dynamic mods
        // if you find a dynamic mod, ignore every other mod inside, until you balance rcurlies
        // var position

        var importedFiles: IFileReference[] = [];
        if (readImportFiles) {
            processImports(text.lineMap(), scanner, firstToken, importedFiles);
        }
        
        var referencedFiles: IFileReference[] = [];
        var properties  = processTripleSlashDirectives(text.lineMap(), firstToken, settings, referencedFiles);

        scannerDiagnostics.length = 0;
        return { settings:settings, referencedFiles: referencedFiles, importedFiles: importedFiles, isLibFile: properties.noDefaultLib };
    }

    export function getParseOptions(settings: CompilationSettings): ParseOptions {
        return new ParseOptions(settings.allowAutomaticSemicolonInsertion, settings.allowModuleKeywordInExternalModuleReference);
    }

} // Tools