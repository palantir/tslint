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

import findup = require("findup-sync");
import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";
import { FatalError } from "./error";

import {arrayify, objectify, stripComments} from "./utils";

export interface IConfigurationFile {
    extends?: string | string[];
    jsRules?: any;
    linterOptions?: {
        typeCheck?: boolean,
    };
    rulesDirectory?: string | string[];
    rules?: any;
}

export interface IConfigurationLoadResult {
    path?: string;
    results?: IConfigurationFile;
}

export const CONFIG_FILENAME = "tslint.json";
/* tslint:disable:object-literal-key-quotes */
export const DEFAULT_CONFIG = {
    "jsRules": {
        "class-name": true,
        "comment-format": [true, "check-space"],
        "indent": [true, "spaces"],
        "no-duplicate-variable": true,
        "no-eval": true,
        "no-trailing-whitespace": true,
        "no-unsafe-finally": true,
        "one-line": [true, "check-open-brace", "check-whitespace"],
        "quotemark": [true, "double"],
        "semicolon": [true, "always"],
        "triple-equals": [true, "allow-null-check"],
        "variable-name": [true, "ban-keywords"],
        "whitespace": [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type",
        ],
    },
    "rules": {
        "class-name": true,
        "comment-format": [true, "check-space"],
        "indent": [true, "spaces"],
        "no-eval": true,
        "no-internal-module": true,
        "no-trailing-whitespace": true,
        "no-unsafe-finally": true,
        "no-var-keyword": true,
        "one-line": [true, "check-open-brace", "check-whitespace"],
        "quotemark": [true, "double"],
        "semicolon": [true, "always"],
        "triple-equals": [true, "allow-null-check"],
        "typedef-whitespace": [
            true, {
                "call-signature": "nospace",
                "index-signature": "nospace",
                "parameter": "nospace",
                "property-declaration": "nospace",
                "variable-declaration": "nospace",
            },
        ],
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
/* tslint:enable:object-literal-key-quotes */

const BUILT_IN_CONFIG = /^tslint:(.*)$/;

/**
 * Searches for a TSLint configuration and returns the data from the config.
 * @param configFile A path to a config file, this can be null if the location of a config is not known
 * @param inputFileLocation A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns Load status for a TSLint configuration object
 */
export function findConfiguration(configFile: string | null, inputFilePath: string): IConfigurationLoadResult {
    const path = findConfigurationPath(configFile, inputFilePath);
    const loadResult: IConfigurationLoadResult = { path };

    try {
        loadResult.results = loadConfigurationFromPath(path);
        return loadResult;
    } catch (error) {
        throw new FatalError(`Failed to load ${path}: ${error.message}`, error);
    }
}

/**
 * Searches for a TSLint configuration and returns the path to it.
 * Could return undefined if not configuration is found.
 * @param suppliedConfigFilePath A path to an known config file supplied by a user. Pass null here if
 * the location of the config file is not known and you want to search for one.
 * @param inputFilePath A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns An absolute path to a tslint.json file
 * or undefined if neither can be found.
 */
export function findConfigurationPath(suppliedConfigFilePath: string | null, inputFilePath: string) {
    if (suppliedConfigFilePath != null) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new Error(`Could not find config file at: ${path.resolve(suppliedConfigFilePath)}`);
        } else {
            return path.resolve(suppliedConfigFilePath);
        }
    } else {
        // search for tslint.json from input file location
        let configFilePath = findup(CONFIG_FILENAME, { cwd: inputFilePath, nocase: true });
        if (configFilePath != null && fs.existsSync(configFilePath)) {
            return path.resolve(configFilePath);
        }

        // search for tslint.json in home directory
        const homeDir = getHomeDir();
        if (homeDir != null) {
            configFilePath = path.join(homeDir, CONFIG_FILENAME);
            if (fs.existsSync(configFilePath)) {
                return path.resolve(configFilePath);
            }
        }

        // no path could be found
        return undefined;
    }
}

/**
 * Used Node semantics to load a configuration file given configFilePath.
 * For example:
 * '/path/to/config' will be treated as an absolute path
 * './path/to/config' will be treated as a relative path
 * 'path/to/config' will attempt to load a to/config file inside a node module named path
 * @returns a configuration object for TSLint loaded from the file at configFilePath
 */
export function loadConfigurationFromPath(configFilePath?: string): IConfigurationFile {
    if (configFilePath == null) {
        return DEFAULT_CONFIG;
    } else {
        const resolvedConfigFilePath = resolveConfigurationPath(configFilePath);
        let configFile: IConfigurationFile;
        if (path.extname(resolvedConfigFilePath) === ".json") {
            const fileContent = stripComments(fs.readFileSync(resolvedConfigFilePath)
            .toString()
            .replace(/^\uFEFF/, ""));
            configFile = JSON.parse(fileContent);
        } else {
            configFile = require(resolvedConfigFilePath);
            delete require.cache[resolvedConfigFilePath];
        }

        const configFileDir = path.dirname(resolvedConfigFilePath);

        configFile.rulesDirectory = getRulesDirectories(configFile.rulesDirectory, configFileDir);
        // load configurations, in order, using their identifiers or relative paths
        // apply the current configuration last by placing it last in this array
        const configs = arrayify(configFile.extends).map((name) => {
            const nextConfigFilePath = resolveConfigurationPath(name, configFileDir);
            return loadConfigurationFromPath(nextConfigFilePath);
        }).concat([configFile]);

        return configs.reduce(extendConfigurationFile, {});
    }
}

/**
 * Resolve configuration file path or node_module reference
 * @param filePath Relative ("./path"), absolute ("/path"), node module ("path"), or built-in ("tslint:path")
 */
function resolveConfigurationPath(filePath: string, relativeTo?: string) {
    const matches = filePath.match(BUILT_IN_CONFIG);
    const isBuiltInConfig = matches != null && matches.length > 0;
    if (isBuiltInConfig) {
        const configName = matches![1];
        try {
            return require.resolve(`./configs/${configName}`);
        } catch (err) {
            throw new Error(`${filePath} is not a built-in config, try "tslint:recommended" instead.`);
        }
    }

    const basedir = relativeTo || process.cwd();
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

export function extendConfigurationFile(targetConfig: IConfigurationFile,
                                        nextConfigSource: IConfigurationFile): IConfigurationFile {
    const combinedConfig: IConfigurationFile = {};

    const configRulesDirectory = arrayify(targetConfig.rulesDirectory);
    const nextConfigRulesDirectory = arrayify(nextConfigSource.rulesDirectory);
    combinedConfig.rulesDirectory = configRulesDirectory.concat(nextConfigRulesDirectory);

    const combineProperties = (targetProperty: any, nextProperty: any) => {
        const combinedProperty: any = {};
        for (const name of Object.keys(objectify(targetProperty))) {
            combinedProperty[name] = targetProperty[name];
        }
        // next config source overwrites the target config object
        for (const name of Object.keys(objectify(nextProperty))) {
            combinedProperty[name] = nextProperty[name];
        }
        return combinedProperty;
    };

    combinedConfig.rules = combineProperties(targetConfig.rules, nextConfigSource.rules);
    combinedConfig.jsRules = combineProperties(targetConfig.jsRules, nextConfigSource.jsRules);
    combinedConfig.linterOptions = combineProperties(targetConfig.linterOptions, nextConfigSource.linterOptions);

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

export function getRelativePath(directory?: string | null, relativeTo?: string) {
    if (directory != null) {
        const basePath = relativeTo || process.cwd();
        return path.resolve(basePath, directory);
    }
    return undefined;
}

/**
 * @param directories A path(s) to a directory of custom rules
 * @param relativeTo A path that directories provided are relative to.
 * For example, if the directories come from a tslint.json file, this path
 * should be the path to the tslint.json file.
 * @return An array of absolute paths to directories potentially containing rules
 */
export function getRulesDirectories(directories?: string | string[], relativeTo?: string): string[] {
    const rulesDirectories = arrayify(directories)
        .map((dir) => getRelativePath(dir, relativeTo))
        .filter((dir) => dir !== undefined) as string[];

    for (const directory of rulesDirectories) {
        if (directory != null && !fs.existsSync(directory)) {
            throw new Error(`Could not find custom rule directory: ${directory}`);
        }
    }

    return rulesDirectories;
}
