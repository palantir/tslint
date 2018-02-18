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

import * as path from "path";
import { FatalError } from "../error";
import { DEFAULT_CONFIG, EMPTY_CONFIG, IConfigurationFile } from "./configurationFile";
import { parseConfigFile, parseConfigList } from "./parse";
import {
    findConfigurationPath,
    getRelativePath,
    getRulesDirectories,
    JSON_CONFIG_FILENAME,
    RawConfigFile,
    readConfigurationFile,
    resolveConfigurationPath,
} from "./read";

export {
    EMPTY_CONFIG,
    DEFAULT_CONFIG,
    findConfigurationPath,
    IConfigurationFile,
    getRelativePath,
    parseConfigFile,
    getRulesDirectories,
    JSON_CONFIG_FILENAME,
    RawConfigFile,
    parseConfigList,
};

export interface IConfigurationLoadResult {
    path?: string;
    results?: IConfigurationFile;
}

/**
 * Use Node semantics to load a configuration file given configFilePath.
 * For example:
 * '/path/to/config' will be treated as an absolute path
 * './path/to/config' will be treated as a relative path
 * 'path/to/config' will attempt to load a to/config file inside a node module named path
 * @param configFilePath The configuration to load
 * @param originalFilePath (deprecated) The entry point configuration file
 * @returns a configuration object for TSLint loaded from the file at configFilePath
 */
export function loadConfigurationFromPath(configFilePath?: string, _originalFilePath?: string) {
    if (configFilePath == undefined) {
        return parseConfigFile(DEFAULT_CONFIG);
    } else {
        const resolvedConfigFilePath = resolveConfigurationPath(configFilePath);
        const rawConfigFile = readConfigurationFile(resolvedConfigFilePath);

        return parseConfigFile(rawConfigFile, path.dirname(resolvedConfigFilePath), readConfigurationFile);
    }
}

/**
 * Searches for a TSLint configuration and returns the data from the config.
 * @param configFile A path to a config file, this can be null if the location of a config is not known
 * @param inputFilePath A path containing the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns Load status for a TSLint configuration object
 */
export function findConfiguration(configFile: string | null, inputFilePath: string): IConfigurationLoadResult;
export function findConfiguration(configFile: string, inputFilePath?: string): IConfigurationLoadResult;
export function findConfiguration(configFile: string | null, inputFilePath?: string): IConfigurationLoadResult {
    const configPath = findConfigurationPath(configFile, inputFilePath!);
    const loadResult: IConfigurationLoadResult = { path: configPath };

    try {
        loadResult.results = loadConfigurationFromPath(configPath);
        return loadResult;
    } catch (error) {
        throw new FatalError(`Failed to load ${configPath}: ${(error as Error).message}`, error as Error);
    }
}
