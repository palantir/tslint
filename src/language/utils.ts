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

///<reference path="../../typings/node.d.ts" />
///<reference path="../../typings/typescriptServices.d.ts" />
///<reference path='./rule/rule.ts'/>

module Lint {
    var path = require("path");

    export function getSourceFile(fileName: string, source: string): ts.SourceFile {
        var normalizedName = path.normalize(fileName).replace(/\\/g, "/");
        var compilerOptions = createCompilerOptions();

        // TODO: use ts.createCompilerHost instead
        var compilerHost = {
            getSourceFile: function (filenameToGet: string) {
                if (filenameToGet === normalizedName) {
                    return ts.createSourceFile(filenameToGet, source, compilerOptions.target, true);
                }
            },
            writeFile: () => null,
            getDefaultLibFileName: () => "lib.d.ts",
            useCaseSensitiveFileNames: () => true,
            getCanonicalFileName: (filename: string) => filename,
            getCurrentDirectory: () => "",
            getNewLine: () => "\n"
        };

        var program = ts.createProgram([normalizedName], compilerOptions, compilerHost);

        // TODO: check if this is now necessary, because of setParentNodes in ts.createSourceFile

        // this will force the binder to properly set up parent pointers, which will allow
        // getSourceFile to work on all nodes, and will therefore allow our code to work
        // even if the source doesn't compile
        program.getTypeChecker();

        return program.getSourceFile(normalizedName);
    }

    export function createCompilerOptions(): ts.CompilerOptions {
        return {
            target: ts.ScriptTarget.ES5
        };
    }

    export function doesIntersect(failure: RuleFailure, disabledIntervals: Lint.IDisabledInterval[]) {
        var intersectionExists = false;

        disabledIntervals.forEach((disabledInterval) => {
            var maxStart = Math.max(disabledInterval.startPosition, failure.getStartPosition().getPosition());
            var minEnd = Math.min(disabledInterval.endPosition, failure.getEndPosition().getPosition());
            if (maxStart <= minEnd) {
                // intervals intersect
                intersectionExists = true;
            }
        });
        return intersectionExists;
    }

    export function abstract() {
        return "abstract method not implemented";
    }

    export function scanAllTokens(scanner: ts.Scanner, callback: (scanner: ts.Scanner) => void) {
        var lastStartPos = -1;
        while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
            var startPos = scanner.getStartPos();
            if (startPos === lastStartPos) {
                break;
            }
            lastStartPos = startPos;
            callback(scanner);
        }
    }
}
