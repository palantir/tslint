/**
 * @license
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

import { FormatterConstructor } from "./index";
import { camelize, tryResolvePackage } from "./utils";

const CORE_FORMATTERS_DIRECTORY = path.resolve(__dirname, "formatters");

export function findFormatter(
    name: string | FormatterConstructor,
    formattersDirectory?: string,
): FormatterConstructor | undefined {
    if (typeof name === "function") {
        return name;
    } else if (typeof name === "string") {
        name = name.trim();
        const camelizedName = camelize(`${name}Formatter`);

        // first check for core formatters
        let Formatter = loadFormatter(CORE_FORMATTERS_DIRECTORY, camelizedName, true);
        if (Formatter !== undefined) {
            return Formatter;
        }

        // then check for rules within the first level of rulesDirectory
        if (formattersDirectory !== undefined) {
            Formatter = loadFormatter(formattersDirectory, camelizedName);
            if (Formatter !== undefined) {
                return Formatter;
            }
        }

        // else try to resolve as module
        return loadFormatterModule(name);
    } else {
        // If an something else is passed as a name (e.g. object)
        throw new Error(`Name of type ${typeof name} is not supported.`);
    }
}

function loadFormatter(
    directory: string,
    name: string,
    isCore?: boolean,
): FormatterConstructor | undefined {
    const formatterPath = path.resolve(path.join(directory, name));
    let fullPath: string;
    if (isCore) {
        fullPath = `${formatterPath}.js`;
        if (!fs.existsSync(fullPath)) {
            return undefined;
        }
    } else {
        // Resolve using node's path resolution to allow developers to write custom formatters in TypeScript which can be loaded by TS-Node
        try {
            fullPath = require.resolve(formatterPath);
        } catch {
            return undefined;
        }
    }
    return (require(fullPath) as { Formatter: FormatterConstructor }).Formatter;
}

function loadFormatterModule(name: string): FormatterConstructor | undefined {
    let src: string | undefined;
    try {
        // first try to find a module in the dependencies of the currently linted project
        src = tryResolvePackage(name, process.cwd());
        if (src === undefined) {
            // if there is no local module, try relative to the installation of TSLint (might be global)
            src = require.resolve(name);
        }
    } catch {
        return undefined;
    }

    return (require(src) as { Formatter: FormatterConstructor }).Formatter;
}
