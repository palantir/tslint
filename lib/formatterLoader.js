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
var fs = require("fs");
var path = require("path");
var underscore_string_1 = require("underscore.string");
var moduleDirectory = path.dirname(module.filename);
var CORE_FORMATTERS_DIRECTORY = path.resolve(moduleDirectory, ".", "formatters");
function findFormatter(name, formattersDirectory) {
    if (typeof (name) === "function") {
        return name;
    }
    var camelizedName = underscore_string_1.camelize(name + "Formatter");
    var Formatter = loadFormatter(CORE_FORMATTERS_DIRECTORY, camelizedName);
    if (Formatter) {
        return Formatter;
    }
    if (formattersDirectory) {
        Formatter = loadFormatter(formattersDirectory, camelizedName);
        if (Formatter) {
            return Formatter;
        }
    }
    return loadFormatterModule(name);
}
exports.findFormatter = findFormatter;
function loadFormatter() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i - 0] = arguments[_i];
    }
    var formatterPath = paths.reduce(function (p, c) { return path.join(p, c); }, "");
    var fullPath = path.resolve(moduleDirectory, formatterPath);
    if (fs.existsSync(fullPath + ".js")) {
        var formatterModule = require(fullPath);
        return formatterModule.Formatter;
    }
    return undefined;
}
function loadFormatterModule(name) {
    var src;
    try {
        src = require.resolve(name);
    }
    catch (e) {
        return undefined;
    }
    return require(src).Formatter;
}
