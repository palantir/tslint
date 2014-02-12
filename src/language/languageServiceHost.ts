/*
 * Copyright 2014 Palantir Technologies, Inc.
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

/// <reference path='../typescript/src/services/languageService.ts'/>
/// <reference path='../typescript/src/services/diagnosticServices.ts'/>

/* tslint:disable:no-unused-variable */

module Lint {
    export class LanguageServiceHost extends TypeScript.NullLogger implements TypeScript.Services.ILanguageServiceHost {
        private syntaxTree: TypeScript.SyntaxTree;
        private source: string;

        constructor(syntaxTree: TypeScript.SyntaxTree, source: string) {
            super();
            this.syntaxTree = syntaxTree;
            this.source = source;
        }

        public getCompilationSettings() {
            return Lint.createCompilationSettings();
        }

        public getScriptFileNames() {
            return [ this.syntaxTree.fileName() ];
        }

        public getScriptVersion(fileName: string) {
            return 1;
        }

        public getScriptIsOpen(fileName: string) {
            return false;
        }

        public getScriptByteOrderMark(fileName: string) {
            return TypeScript.ByteOrderMark.None;
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return TypeScript.ScriptSnapshot.fromString(this.syntaxTree.sourceUnit().fullText());
        }

        public getDiagnosticsObject() {
            return new LanguageServicesDiagnostics();
        }

        public getLocalizedDiagnosticMessages() {
            return "";
        }

        public resolveRelativePath(path: string, directory: string) {
            return path;
        }

        public fileExists(path: string) {
            return true;
        }

        public directoryExists(path: string) {
            return true;
        }

        public getParentDirectory(path: string) {
            return path;
        }
    }

    export class LanguageServicesDiagnostics implements TypeScript.Services.ILanguageServicesDiagnostics {
        public log(content: string) {
            // do nothing
        }
    }
}
