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

interface LanguageServiceEditableHost extends ts.LanguageServiceHost {
    editFile(fileName: string, newContent: string): void;
}

export function wrapProgram(program: ts.Program): ts.LanguageService {
    const files = new Map<string, string>(); // file name -> content
    const fileVersions = new Map<string, number>();
    const host: LanguageServiceEditableHost = {
            getCompilationSettings: () => program.getCompilerOptions(),
            getCurrentDirectory: () => program.getCurrentDirectory(),
            getDefaultLibFileName: () => "lib.d.ts",
            getScriptFileNames: () => program.getSourceFiles().map((sf) => sf.fileName),
            getScriptSnapshot: (name: string) => {
                const file = files.get(name);
                if (file !== undefined) {
                    return ts.ScriptSnapshot.fromString(file);
                }
                if (!program.getSourceFile(name)) {
                    return undefined;
                }
                return ts.ScriptSnapshot.fromString(program.getSourceFile(name).getFullText());
            },
            getScriptVersion: (name: string) => {
                const version = fileVersions.get(name);
                return version === undefined ? "1" : String(version);
            },
            log: () => { /* */ },
            editFile(fileName: string, newContent: string) {
                files.set(fileName, newContent);
                const prevVersion = fileVersions.get(fileName);
                fileVersions.set(fileName, prevVersion === undefined ? 0 : prevVersion + 1);
            },
        };
    const langSvc = ts.createLanguageService(host, ts.createDocumentRegistry());
    (langSvc as any).editFile = host.editFile;
    return langSvc;
}

export function checkEdit(ls: ts.LanguageService, sf: ts.SourceFile, newText: string) {
    if (ls.hasOwnProperty("editFile")) {
        const host = ls as any as LanguageServiceEditableHost;
        host.editFile(sf.fileName, newText);
        const newProgram = ls.getProgram();
        const newSf = newProgram.getSourceFile(sf.fileName);
        const newDiags = ts.getPreEmitDiagnostics(newProgram, newSf);
        // revert
        host.editFile(sf.fileName, sf.getFullText());
        return newDiags;
    }
    return [];
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

export function createLanguageService(fileName: string, source: string) {
    const languageServiceHost = createLanguageServiceHost(fileName, source);
    return ts.createLanguageService(languageServiceHost);
}
