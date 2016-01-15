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
        "semicolon": true,
        "triple-equals": [true, "allow-null-check"],
        "typedef-whitespace": [true, {
            "call-signature": "nospace",
            "index-signature": "nospace",
            "parameter": "nospace",
            "property-declaration": "nospace",
            "variable-declaration": "nospace"
        }],
        "variable-name": [true, "ban-keywords"],
        "whitespace": [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type"
        ],
    }
};

export function findConfiguration(configFile: string, inputFileLocation: string): any {
    const configPath = findConfigurationPath(configFile, inputFileLocation);
    return loadConfigurationFromPath(configPath);
}

export function findConfigurationPath(suppliedConfigFilePath: string, inputFilePath: string) {
    if (suppliedConfigFilePath != null) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new Error(`Could not find config file at: ${path.resolve(suppliedConfigFilePath)}`);
        } else {
            return suppliedConfigFilePath;
        }
    } else {
        // search for package.json with tslintConfig property
        let configFilePath = findup("package.json", { cwd: inputFilePath, nocase: true });
        if (configFilePath != null && require(configFilePath).tslintConfig != null) {
            return configFilePath;
        }

        // search for tslint.json from input file location
        configFilePath = findup(CONFIG_FILENAME, { cwd: inputFilePath, nocase: true });
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

export function loadConfigurationFromPath(configFilePath: string) {
    if (configFilePath == null) {
        return DEFAULT_CONFIG;
    } else if (path.basename(configFilePath) === "package.json") {
        return require(configFilePath).tslintConfig;
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
        environment.HOMEDRIVE + environment.HOMEPATH
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
