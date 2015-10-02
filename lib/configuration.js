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
var findup = require("findup-sync");
var CONFIG_FILENAME = "tslint.json";
var DEFAULT_CONFIG = {
    "rules": {
        "curly": true,
        "indent": [true, 4],
        "no-duplicate-key": true,
        "no-duplicate-variable": true,
        "no-empty": true,
        "no-eval": true,
        "no-trailing-whitespace": true,
        "no-unreachable": true,
        "no-use-before-declare": true,
        "quotemark": [true, "double"],
        "semicolon": true
    }
};
function findConfiguration(configFile, inputFileLocation) {
    if (configFile) {
        return JSON.parse(fs.readFileSync(configFile, "utf8"));
    }
    // first look for package.json from input file location
    configFile = findup("package.json", { cwd: inputFileLocation, nocase: true });
    if (configFile) {
        var content = require(configFile);
        if (content.tslintConfig) {
            return content.tslintConfig;
        }
    }
    // next look for tslint.json
    var homeDir = getHomeDir();
    if (!homeDir) {
        return undefined;
    }
    var defaultPath = path.join(homeDir, CONFIG_FILENAME);
    configFile = findup(CONFIG_FILENAME, { cwd: inputFileLocation, nocase: true }) || defaultPath;
    if (fs.existsSync(configFile)) {
        return JSON.parse(fs.readFileSync(configFile, "utf8"));
    }
    else {
        return DEFAULT_CONFIG;
    }
}
exports.findConfiguration = findConfiguration;
function getHomeDir() {
    var environment = global.process.env;
    var paths = [environment.USERPROFILE, environment.HOME, environment.HOMEPATH, environment.HOMEDRIVE + environment.HOMEPATH];
    for (var homeIndex in paths) {
        if (paths.hasOwnProperty(homeIndex)) {
            var homePath = paths[homeIndex];
            if (homePath && fs.existsSync(homePath)) {
                return homePath;
            }
        }
    }
}
