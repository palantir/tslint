/**
 * @license
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

import * as ts from "typescript";

import {createCompilerOptions} from "./utils";

export interface LanguageServiceEditableHost extends ts.LanguageServiceHost {
    editFile(fileName: string, newContent: string): void;
}

export function hostFromProgram(program: ts.Program): LanguageServiceEditableHost {
    const files: {[name: string]: string} = {};
    const fileVersions: {[name: string]: number} = {};
    return {
            getCompilationSettings: () => program.getCompilerOptions(),
            getCurrentDirectory: () => program.getCurrentDirectory(),
            getDefaultLibFileName: () => "lib.d.ts",
            getScriptFileNames: () => program.getRootFileNames(),
            getScriptSnapshot: (name: string) => ts.ScriptSnapshot.fromString(
                files.hasOwnProperty(name) ? files[name] :
                program.getSourceFile(name).getFullText()
            ),
            getScriptVersion: (name: string) => fileVersions.hasOwnProperty(name) ? fileVersions[name] + "" : "1",
            log: () => { /* */ },
            editFile(fileName: string, newContent: string) {
                files[fileName] = newContent;
                if (fileVersions.hasOwnProperty(fileName)) {
                    fileVersions[fileName]++;
                } else {
                    fileVersions[fileName] = 0;
                }
            },
        };
}

export function createLanguageServiceHost(fileName: string, source: string): ts.LanguageServiceHost {
    return {
        getCompilationSettings: () => createCompilerOptions(),
        getCurrentDirectory: () => "",
        getDefaultLibFileName: () => "lib.d.ts",
        getScriptFileNames: () => [fileName],
        getScriptSnapshot: (name: string) => ts.ScriptSnapshot.fromString(name === fileName ? source : ""),
        getScriptVersion: () => "1",
        log: () => { /* */ },
    };
}

export function createLanguageService(fileName: string, source: string, program?: ts.Program) {
    const languageServiceHost = program ? hostFromProgram(program) : createLanguageServiceHost(fileName, source);
    return ts.createLanguageService(languageServiceHost);
}
