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
    export function createLanguageServiceHost(fileName: string, source: string) {
        var host: ts.LanguageServiceHost = {
            getScriptFileNames: () => [fileName],
            getScriptVersion: () => "1",
            getScriptSnapshot: () => {
                return {
                    getText: (start, end) => source.substring(start, end),
                    getLength: () => source.length,
                    getLineStartPositions: () => ts.computeLineStarts(source),
                    getChangeRange: (oldSnapshot) => undefined
                };
            },
            getCurrentDirectory: () => "",
            getScriptIsOpen: () => true,
            getCompilationSettings: () => Lint.createCompilerOptions(),
            getDefaultLibFilename: (options) => "lib.d.ts",
            log: (message) => { /* */ }
        };

        return host;
    }
}
