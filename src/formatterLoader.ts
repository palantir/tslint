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

import * as fs from "fs";
import * as path from "path";
import {camelize} from "underscore.string";

const moduleDirectory = path.dirname(module.filename);
const CORE_FORMATTERS_DIRECTORY = path.resolve(moduleDirectory, ".", "formatters");

export function findFormatter(name: string, formattersDirectory?: string) {
    if (typeof(name) === "function") {
        return name;
    }

    const camelizedName = camelize(name + "Formatter");

    // first check for core formatters
    let Formatter = loadFormatter(CORE_FORMATTERS_DIRECTORY, camelizedName);
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
    const formatterPath = paths.reduce((p, c) => path.join(p, c), "");
    const fullPath = path.resolve(moduleDirectory, formatterPath);

    if (fs.existsSync(fullPath + ".js")) {
        const formatterModule = require(fullPath);
        return formatterModule.Formatter;
    }

    return undefined;
}

function loadFormatterModule(name: string) {
    let src: string;
    try {
        src = require.resolve(name);
    } catch (e) {
        return undefined;
    }
    return require(src).Formatter;
}
