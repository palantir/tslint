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
const moduleDirectory = path.dirname(module.filename);

export function findConfiguration(configFile: string, inputFileLocation: string): any {
    if (configFile == null) {
        // first look for package.json from input file location
        configFile = findup("package.json", { cwd: inputFileLocation, nocase: true });

        if (configFile) {
            const content = require(configFile);

            if (content.tslintConfig) {
                return content.tslintConfig;
            }
        }

        // next look for tslint.json
        const homeDir = getHomeDir();
        if (!homeDir) {
            return undefined;
        }

        const defaultPath = path.join(homeDir, CONFIG_FILENAME);

        configFile = findup(CONFIG_FILENAME, { cwd: inputFileLocation, nocase: true }) || defaultPath;
    }

    if (fs.existsSync(configFile)) {
        let fileData = fs.readFileSync(configFile, "utf8");
        // remove BOM if present
        fileData = fileData.replace(/^\uFEFF/, "");
        return JSON.parse(fileData);
    } else {
        return DEFAULT_CONFIG;
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

export function getRelativePath(directory: string): string {
    if (directory != null) {
        return path.relative(moduleDirectory, directory);
    }
}

export function getRulesDirectories(directories: string | string[]): string[] {
    let rulesDirectories: string[] = [];

    if (directories != null) {
        if (typeof directories === "string") {
            rulesDirectories = [getRelativePath(<string>directories)];
        } else {
            rulesDirectories = (<string[]>directories).map((dir) => getRelativePath(dir));
        }
    }

    return rulesDirectories;
}
