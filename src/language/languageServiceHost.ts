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

module Lint {
    export function createLanguageServiceHost(fileName: string, source: string) {
        const host: ts.LanguageServiceHost = {
            getCompilationSettings: () => Lint.createCompilerOptions(),
            getCurrentDirectory: () => "",
            getDefaultLibFileName: () => "lib.d.ts",
            getScriptFileNames: () => [fileName],
            getScriptSnapshot: () => ts.ScriptSnapshot.fromString(source),
            getScriptVersion: () => "1",
            log: (message) => { /* */ }
        };

        return host;
    }

    export function createLanguageService(fileName: string, source: string) {
        const documentRegistry = ts.createDocumentRegistry();
        const languageServiceHost = Lint.createLanguageServiceHost(fileName, source);
        return ts.createLanguageService(languageServiceHost, documentRegistry);
    }
}
