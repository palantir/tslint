/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='../typescript/src/compiler/precompile.ts' />
/// <reference path='../typescript/src/compiler/text/scriptSnapshot.ts' />
/// <reference path='../typescript/src/services/languageService.ts' />

module Lint {

    export class LanguageServiceHost extends TypeScript.NullLogger implements TypeScript.Services.ILanguageServiceHost {
        private compilationSettings: TypeScript.CompilationSettings;
        private diagnostics: TypeScript.Services.ILanguageServicesDiagnostics;
        private fileName: string;
        private scriptSnapshot: TypeScript.IScriptSnapshot;

        constructor(fileName: string, contents: string) {
            super();

            this.compilationSettings = this.createCompilationSettings();
            this.diagnostics = new LanguageServicesDiagnostics();
            this.fileName = fileName;
            this.scriptSnapshot = TypeScript.ScriptSnapshot.fromString(contents);
        }

        public getCompilationSettings(): TypeScript.CompilationSettings {
            return this.compilationSettings;
        }

        public getScriptFileNames(): string[] {
            return [this.fileName];
        }

        public getScriptVersion(fileName: string): number {
            return 0;
        }

        public getScriptIsOpen(fileName: string): boolean {
            return true;
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.scriptSnapshot;
        }

        public getScriptByteOrderMark(fileName: string): TypeScript.ByteOrderMark {
            return TypeScript.ByteOrderMark.None;
        }

        public getDiagnosticsObject(): TypeScript.Services.ILanguageServicesDiagnostics {
            return this.diagnostics;
        }

        public getLocalizedDiagnosticMessages(): any {
            return null;
        }

        public resolveRelativePath(path: string, directory: string): string {
            throw new Error();
        }

        public fileExists(path: string): boolean {
            throw new Error();
        }

        public directoryExists(path: string): boolean {
            throw new Error();
        }

        public getParentDirectory(path: string): string {
            throw new Error();
        }

        private createCompilationSettings(): TypeScript.CompilationSettings {
            var settings = new TypeScript.CompilationSettings();

            // set target to ES5
            settings.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;
            // disable automatic semicolon insertions
            settings.allowAutomaticSemicolonInsertion = false;

            return settings;
        }
      }

    class LanguageServicesDiagnostics implements TypeScript.Services.ILanguageServicesDiagnostics {
        private logger;

        constructor() {
            this.logger = new TypeScript.NullLogger();
        }

        public log(content: string): void {
            this.logger.log(content);
        }
    }

}
