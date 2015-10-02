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
var Lint = require("../lint");
var ts = require("typescript");
function createLanguageServiceHost(fileName, source) {
    var host = {
        getCompilationSettings: function () { return Lint.createCompilerOptions(); },
        getCurrentDirectory: function () { return ""; },
        getDefaultLibFileName: function () { return "lib.d.ts"; },
        getScriptFileNames: function () { return [fileName]; },
        getScriptSnapshot: function (name) { return ts.ScriptSnapshot.fromString(name === fileName ? source : ""); },
        getScriptVersion: function () { return "1"; },
        log: function (message) { }
    };
    return host;
}
exports.createLanguageServiceHost = createLanguageServiceHost;
function createLanguageService(fileName, source) {
    var languageServiceHost = Lint.createLanguageServiceHost(fileName, source);
    return ts.createLanguageService(languageServiceHost);
}
exports.createLanguageService = createLanguageService;
