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

module Lint.Configuration {
    var fs = require("fs");
    var path = require("path");
    var findup = require("findup-sync");

    var CONFIG_FILENAME = "tslint.json";

    export function findConfiguration(configFile: string): any {
        if (configFile) {
            return JSON.parse(fs.readFileSync(configFile, "utf8"));
        }

        // First look for package.json
        configFile = findup("package.json", { nocase: true });

        if (configFile) {
            var content = require(configFile);

            if (content.tslintConfig) {
                return content.tslintConfig;
            }
        }

        // Next look for tslint.json
        var environment = global.process.env;
        var defaultPath = path.join((environment.HOME || environment.HOMEPATH || environment.USERPROFILE),
                                     CONFIG_FILENAME);

        configFile = findup(CONFIG_FILENAME, { nocase: true });

        if (!configFile && fs.existsSync(defaultPath)) {
            configFile = defaultPath;
        }

        return configFile ? JSON.parse(fs.readFileSync(configFile, "utf8")) : undefined;
    }
}
