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

/// <reference path='language/formatter/formatter.ts'/>

module Lint {
    var fs = require("fs");
    var path = require("path");
    var _s = require("underscore.string");

    var moduleDirectory = path.dirname(module.filename);
    var CORE_FORMATTERS_DIRECTORY = path.resolve(moduleDirectory, "..", "build", "formatters");

    export function findFormatter(name: string, formattersDirectory?: string) {
        if (typeof(name) === "function") {
            return name;
        }

        var camelizedName = _s.camelize(name + "Formatter");

        // first check for core formatters
        var Formatter = loadFormatter(CORE_FORMATTERS_DIRECTORY, camelizedName);
        if (Formatter) {
            return Formatter;
        }

        // then check for rules within the first level of rulesDirectory
        if (formattersDirectory) {
            Formatter = loadFormatter(formattersDirectory, camelizedName);
            if (Formatter) {
                return Formatter;
            }
        }

        // else try to resolve as module
        return loadFormatterModule(name);
    }

    function loadFormatter(...paths: string[]) {
        var formatterPath = paths.reduce((p, c) => path.join(p, c), "");
        var fullPath = path.resolve(moduleDirectory, formatterPath);

        if (fs.existsSync(fullPath + ".js")) {
            var formatterModule = require(fullPath);
            return formatterModule.Formatter;
        }

        return undefined;
    }

    function loadFormatterModule(name: string) {
        var src: string;
        try {
            src = require.resolve(name);
        } catch (e) {
            return undefined;
        }
        return require(src).Formatter;
    }
}
