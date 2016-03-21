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

import {arrayify, objectify} from "./utils";

export interface IConfigFile {
    rulesDirectory?: string | string[];
    rules?: any;
}

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

const PACKAGE_DEPRECATION_MSG = "Configuration of TSLint via package.json has been deprecated, "
   + "please start using a tslint.json file instead (http://palantir.github.io/tslint/usage/tslint-json/).";

/**
 * Searches for a TSLint configuration and returns the data from the config.
 * @param configFile A path to a config file, this can be null if the location of a config is not known
 * @param inputFileLocation A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns A TSLint configuration object
 */
export function findConfiguration(configFile: string, inputFilePath: string): IConfigFile {
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
 * @returns A path to a tslint.json file, a path to a package.json file with a tslintConfig field
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

        // search for package.json with tslintConfig property
        configFilePath = findup("package.json", { cwd: inputFilePath, nocase: true });
        if (configFilePath != null && require(configFilePath).tslintConfig != null) {
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
export function loadConfigurationFromPath(configFilePath: string): IConfigFile {
    if (configFilePath == null) {
        return DEFAULT_CONFIG;
    } else if (path.basename(configFilePath) === "package.json") {
        console.warn(PACKAGE_DEPRECATION_MSG);
        return require(configFilePath).tslintConfig;
    } else {
        let fileData = fs.readFileSync(configFilePath, "utf8");
        // remove BOM if present
        fileData = fileData.replace(/^\uFEFF/, "");
        const configFile: IConfigFile = JSON.parse(fileData);
        configFile.rulesDirectory = getRulesDirectories(configFile.rulesDirectory, path.dirname(configFilePath));
        return configFile;
    }
}

export function extendConfigFile(config: IConfigFile, baseConfig: IConfigFile): IConfigFile {
    let combinedConfig: IConfigFile = {};

    const baseRulesDirectory = arrayify(baseConfig.rulesDirectory);
    const configRulesDirectory = arrayify(config.rulesDirectory);
    combinedConfig.rulesDirectory = configRulesDirectory.concat(baseRulesDirectory);

    combinedConfig.rules = {};
    for (const name of Object.keys(objectify(baseConfig.rules))) {
        combinedConfig.rules[name] = baseConfig.rules[name];
    }
    for (const name of Object.keys(objectify(config.rules))) {
        combinedConfig.rules[name] = config.rules[name];
    }

    return combinedConfig;
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
    const rulesDirectories = arrayify(directories).map((dir) => {
        if (isNodeModulePath(dir)) {
            return resolveNodeModulePath(dir);
        } else {
            return getRelativePath(dir, relativeTo);
        }
    });

    for (const directory of rulesDirectories) {
        if (!fs.existsSync(directory)) {
            throw new Error(`Could not find custom rule directory: ${directory}`);
        }
    }

    return rulesDirectories;
}

function isNodeModulePath(nodeModulePath: string) {
    return nodeModulePath.indexOf("node_module:") === 0;
}

function resolveNodeModulePath(nodeModulePath: string) {
    const packagePath = nodeModulePath.split(":")[1];
    const [packageName, ...insidePackagePathParts] = packagePath.split("/");

    // we don't want the path to the .js module, we just want the path to its directory
    const pathToPackage = path.dirname(require.resolve(packageName));
    const insidePackagePath = insidePackagePathParts.join("/");

    return path.join(pathToPackage, insidePackagePath);
}
