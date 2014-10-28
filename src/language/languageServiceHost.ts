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

/* tslint:disable:no-unused-variable */

module Lint {
    export class LanguageServiceHost extends TypeScript.NullLogger implements ts.LanguageServiceHost {
        private syntaxTree: TypeScript.SyntaxTree;
        private source: string;

        constructor(syntaxTree: TypeScript.SyntaxTree, source: string) {
            super();
            this.syntaxTree = syntaxTree;
            this.source = source;
        }

        public getCompilationSettings() {
            return Lint.createCompilerOptions();
        }

        public getCurrentDirectory(): string {
            return "";
        }

        public getDefaultLibFilename(): string {
            return "";
        }

        public getScriptFileNames() {
            return [ this.syntaxTree.fileName() ];
        }

        public getScriptVersion(fileName: string) {
            return "0";
        }

        public getScriptIsOpen(fileName: string) {
            return false;
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            var sourceUnit = this.syntaxTree.sourceUnit();
            return TypeScript.ScriptSnapshot.fromString(TypeScript.fullText(sourceUnit));
        }

        public getLocalizedDiagnosticMessages() {
            return "";
        }

        public getCancellationToken() {
            return {
                isCancellationRequested() {
                    return false;
                }
            };
        }
    }
}
