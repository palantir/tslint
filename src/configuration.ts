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
import * as findup from "findup-sync";

export const CONFIG_FILENAME = "tslint.json";
export const DEFAULT_CONFIG = {
    "rules": {
        "class-name": true,
        "comment-format": [true, "check-space"],
        "indent": [true, "spaces"],
        "no-duplicate-variable": true,
        "no-eval": true,
        "no-internal-module": true,
        "no-trailing-whitespace": true,
        "no-var-keyword": true,
        "one-line": [true, "check-open-brace", "check-whitespace"],
        "quotemark": [true, "double"],
        "semicolon": [true, "always"],
        "triple-equals": [true, "allow-null-check"],
        "typedef-whitespace": [true, {
            "call-signature": "nospace",
            "index-signature": "nospace",
            "parameter": "nospace",
            "property-declaration": "nospace",
            "variable-declaration": "nospace",
        }, ],
        "variable-name": [true, "ban-keywords"],
        "whitespace": [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type",
        ],
    },
};

/**
 * Searches for a TSLint configuration and returns the data from the config.
 * @param configFile A path to a config file, this can be null if the location of a config is not known
 * @param inputFileLocation A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns A TSLint configuration object
 */
export function findConfiguration(configFile: string, inputFilePath: string): any {
    const configPath = findConfigurationPath(configFile, inputFilePath);
    return loadConfigurationFromPath(configPath);
}

/**
 * Searches for a TSLint configuration and returns the path to it.
 * Could return undefined if not configuration is found.
 * @param suppliedConfigFilePath A path to an known config file supplied by a user. Pass null here if
 * the location of the config file is not known and you want to search for one.
 * @param inputFilePath A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns A path to a tslint.json file
 * or undefined if neither can be found.
 */
export function findConfigurationPath(suppliedConfigFilePath: string, inputFilePath: string) {
    if (suppliedConfigFilePath != null) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new Error(`Could not find config file at: ${path.resolve(suppliedConfigFilePath)}`);
        } else {
            return suppliedConfigFilePath;
        }
    } else {
        // search for tslint.json from input file location
        let configFilePath = findup(CONFIG_FILENAME, { cwd: inputFilePath, nocase: true });
        if (configFilePath != null && fs.existsSync(configFilePath)) {
            return configFilePath;
        }

        // search for tslint.json in home directory
        const homeDir = getHomeDir();
        if (homeDir != null) {
            configFilePath = path.join(homeDir, CONFIG_FILENAME);
            if (fs.existsSync(configFilePath)) {
                return configFilePath;
            }
        }

        // no path could be found
        return undefined;
    }
}

/**
 * @returns a configuration object for TSLint loaded form the file at configFilePath
 */
export function loadConfigurationFromPath(configFilePath: string) {
    if (configFilePath == null) {
        return DEFAULT_CONFIG;
    } else {
        let fileData = fs.readFileSync(configFilePath, "utf8");
        // remove BOM if present
        fileData = fileData.replace(/^\uFEFF/, "");
        return JSON.parse(fileData);
    }
}

function getHomeDir() {
    const environment = global.process.env;
    const paths = [
        environment.USERPROFILE,
        environment.HOME,
        environment.HOMEPATH,
        environment.HOMEDRIVE + environment.HOMEPATH,
    ];

    for (const homePath of paths) {
        if (homePath != null && fs.existsSync(homePath)) {
            return homePath;
        }
    }
}

export function getRelativePath(directory: string, relativeTo?: string): string {
    if (directory != null) {
        const basePath = relativeTo || process.cwd();
        return path.resolve(basePath, directory);
    }
}

/**
 * @param directories A path(s) to a directory of custom rules
 * @param relativeTo A path that directories provided are relative to.
 * For example, if the directories come from a tslint.json file, this path
 * should be the path to the tslint.json file.
 * @return An array of absolute paths to directories potentially containing rules
 */
export function getRulesDirectories(directories: string | string[], relativeTo?: string): string[] {
    let rulesDirectories: string[] = [];

    if (directories != null) {
        if (typeof directories === "string") {
            rulesDirectories = [getRelativePath(directories, relativeTo)];
        } else {
            rulesDirectories = directories.map((dir) => getRelativePath(dir, relativeTo));
        }
    }

    for (const directory of rulesDirectories) {
        if (!fs.existsSync(directory)) {
            throw new Error(`Could not find custom rule directory: ${directory}`);
        }
    }

    return rulesDirectories;
}
