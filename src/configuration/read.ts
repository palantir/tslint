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
import * as yaml from "js-yaml";
import * as os from "os";
import * as path from "path";
import * as resolve from "resolve";
import { FatalError, showWarningOnce } from "../error";
import { arrayify, stripComments } from "../utils";
import { RawConfigFile } from "./configurationFile";

const BUILT_IN_CONFIG = /^tslint:(.*)$/;

// Note: eslint prefers yaml over json, while tslint prefers json over yaml
// for backward-compatibility.
export const JSON_CONFIG_FILENAME = "tslint.json";
/** @deprecated use `JSON_CONFIG_FILENAME` or `CONFIG_FILENAMES` instead. */
export const CONFIG_FILENAME = JSON_CONFIG_FILENAME;
export const CONFIG_FILENAMES = [JSON_CONFIG_FILENAME, "tslint.yaml", "tslint.yml"];

/**
 * Searches for a TSLint configuration and returns the path to it.
 * Could return undefined if not configuration is found.
 * @param suppliedConfigFilePath A path to an known config file supplied by a user. Pass null here if
 * the location of the config file is not known and you want to search for one.
 * @param inputFilePath A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns An absolute path to a tslint.json or tslint.yml or tslint.yaml file
 * or undefined if neither can be found.
 */
export function findConfigurationPath(suppliedConfigFilePath: string | null, inputFilePath: string): string | undefined;
export function findConfigurationPath(suppliedConfigFilePath: string, inputFilePath?: string): string | undefined;
export function findConfigurationPath(suppliedConfigFilePath: string | null, inputFilePath?: string): string | undefined {
    if (suppliedConfigFilePath != undefined) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new FatalError(`Could not find config file at: ${path.resolve(suppliedConfigFilePath)}`);
        } else {
            return path.resolve(suppliedConfigFilePath);
        }
    } else {
        // convert to dir if it's a file or doesn't exist
        let useDirName = false;
        try {
            const stats = fs.statSync(inputFilePath!);
            if (stats.isFile()) {
                useDirName = true;
            }
        } catch (e) {
            // throws if file doesn't exist
            useDirName = true;
        }
        if (useDirName) {
            inputFilePath = path.dirname(inputFilePath!);
        }

        // search for tslint.json from input file location
        let configFilePath = findup(CONFIG_FILENAMES, path.resolve(inputFilePath!));
        if (configFilePath !== undefined) {
            return configFilePath;
        }

        // search for tslint.json in home directory
        const homeDir = os.homedir();
        for (const configFilename of CONFIG_FILENAMES) {
            configFilePath = path.join(homeDir, configFilename);
            if (fs.existsSync(configFilePath)) {
                return path.resolve(configFilePath);
            }
        }
        // no path could be found
        return undefined;
    }
}

/**
 * Find a file by names in a directory or any ancestor directory.
 * Will try each filename in filenames before recursing to a parent directory.
 * This is case-insensitive, so it can find 'TsLiNt.JsOn' when searching for 'tslint.json'.
 */
function findup(filenames: string[], directory: string): string | undefined {
    while (true) {
        const res = findFile(directory);
        if (res !== undefined) {
            return path.join(directory, res);
        }

        const parent = path.dirname(directory);
        if (parent === directory) {
            return undefined;
        }
        directory = parent;
    }

    function findFile(cwd: string): string | undefined {
        const dirFiles = fs.readdirSync(cwd);
        for (const filename of filenames) {
            const index = dirFiles.indexOf(filename);
            if (index > -1) {
                return filename;
            }
            // TODO: remove in v6.0.0
            // Try reading in the entire directory and looking for a file with different casing.
            const result = dirFiles.find((entry) => entry.toLowerCase() === filename);
            if (result !== undefined) {
                showWarningOnce(`Using mixed case ${filename} is deprecated. Found: ${path.join(cwd, result)}`);
                return result;
            }
        }
        return undefined;
    }
}

/** Reads the configuration file from disk and parses it as raw JSON, YAML or JS depending on the extension. */
export function readConfigurationFile(filepath: string): RawConfigFile {
    const resolvedConfigFileExt = path.extname(filepath);
    if (/\.(json|ya?ml)/.test(resolvedConfigFileExt)) {
        const fileContent = fs.readFileSync(filepath, "utf8").replace(/^\uFEFF/, "");
        try {
            if (resolvedConfigFileExt === ".json") {
                return JSON.parse(stripComments(fileContent)) as RawConfigFile;
            } else {
                return yaml.safeLoad(fileContent, {
                    // Note: yaml.LoadOptions expects a schema value of type "any",
                    // but this trips up the no-unsafe-any rule.
                    // tslint:disable-next-line:no-unsafe-any
                    schema: yaml.JSON_SCHEMA,
                    strict: true,
                }) as RawConfigFile;
            }
        } catch (e) {
            const error = e as Error;
            // include the configuration file being parsed in the error since it may differ from the directly referenced config
            throw new Error(`${error.message} in ${filepath}`);
        }
    } else {
        const rawConfigFile = require(filepath) as RawConfigFile;
        // tslint:disable-next-line no-dynamic-delete
        delete (require.cache as { [key: string]: any })[filepath];
        return rawConfigFile;
    }
}

/**
 * Resolve configuration file path or node_module reference
 * @param filePath Relative ("./path"), absolute ("/path"), node module ("path"), or built-in ("tslint:path")
 */
export function resolveConfigurationPath(filePath: string, relativeTo?: string) {
    const matches = filePath.match(BUILT_IN_CONFIG);
    const isBuiltInConfig = matches !== null && matches.length > 0;
    if (isBuiltInConfig) {
        const configName = matches![1];
        try {
            return require.resolve(`../configs/${configName}`);
        } catch (err) {
            throw new Error(`${filePath} is not a built-in config, try "tslint:recommended" instead.`);
        }
    }

    const basedir = relativeTo !== undefined ? relativeTo : process.cwd();
    try {
        return resolve.sync(filePath, { basedir });
    } catch (err) {
        try {
            return require.resolve(filePath);
        } catch (err) {
            throw new Error(`Invalid "extends" configuration value - could not require "${filePath}". ` +
                "Review the Node lookup algorithm (https://nodejs.org/api/modules.html#modules_all_together) " +
                "for the approximate method TSLint uses to find the referenced configuration file.");
        }
    }
}

/**
 * returns the absolute path (contrary to what the name implies)
 *
 * @deprecated use `path.resolve` instead
 */
export function getRelativePath(directory?: string | null, relativeTo?: string) {
    if (directory != undefined) {
        const basePath = relativeTo !== undefined ? relativeTo : process.cwd();
        return path.resolve(basePath, directory);
    }
    return undefined;
}

// check if directory should be used as path or if it should be resolved like a module
// matches if directory starts with '/', './', '../', 'node_modules/' or equals '.' or '..'
export function useAsPath(directory: string) {
    return /^(?:\.?\.?(?:\/|$)|node_modules\/)/.test(directory);
}

/**
 * @param directories A path(s) to a directory of custom rules
 * @param relativeTo A path that directories provided are relative to.
 * For example, if the directories come from a tslint.json file, this path
 * should be the path to the tslint.json file.
 * @return An array of absolute paths to directories potentially containing rules
 */
export function getRulesDirectories(directories: string | string[] | undefined, relativeTo?: string): string[] {
    return arrayify(directories)
        .map((dir) => {
            if (!useAsPath(dir)) {
                try {
                    return path.dirname(resolve.sync(dir, { basedir: relativeTo }));
                } catch (err) {
                    // swallow error and fallback to using directory as path
                }
            }

            const absolutePath = relativeTo === undefined ? path.resolve(dir) : path.resolve(relativeTo, dir);
            if (absolutePath !== undefined) {
                if (!fs.existsSync(absolutePath)) {
                    throw new FatalError(`Could not find custom rule directory: ${dir}`);
                }
            }
            return absolutePath;
        });
}
