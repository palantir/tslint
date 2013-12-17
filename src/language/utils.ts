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

/// <reference path='../typescript/src/compiler/pathUtils.ts'/>
/// <reference path='../typescript/src/compiler/text/scriptSnapshot.ts' />

module Lint {
    export function getSyntaxTree(fileName: string, source: string): TypeScript.SyntaxTree {
        var isDTSFile = TypeScript.isDTSFile(fileName);
        var scriptSnapshot = TypeScript.ScriptSnapshot.fromString(source);

        var text = TypeScript.SimpleText.fromScriptSnapshot(scriptSnapshot);
        var compilationSettings = createCompilationSettings();
        var settings = TypeScript.ImmutableCompilationSettings.fromCompilationSettings(compilationSettings);

        return TypeScript.Parser.parse(fileName, text, isDTSFile, TypeScript.getParseOptions(settings));
    }

    function createCompilationSettings(): TypeScript.CompilationSettings {
        var settings = new TypeScript.CompilationSettings();

        // set target to ES5
        settings.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;
        // disable automatic semicolon insertions
        settings.allowAutomaticSemicolonInsertion = false;

        return settings;
    }

    export function intersectionExists(failure: RuleFailure, disabledIntervals: Lint.IDisabledInterval[]) {
        var intersectionExists = false;

        disabledIntervals.forEach((disabledInterval) => {
            var maxStart = Math.max(disabledInterval.startPosition, failure.getStartPosition().getPosition());
            var minEnd = Math.min(disabledInterval.endPosition, failure.getEndPosition().getPosition());
            if (maxStart < minEnd) {
                // intervals intersect
                intersectionExists = true;
            }
        });
        return intersectionExists;
    }
}
