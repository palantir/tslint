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

/// <reference path='rules/rules.ts'/>

module Lint.Configuration {

    var fs = require("fs");
    var path = require("path");

    var CONFIG_FILENAME1 = ".tslintrc";
    var CONFIG_FILENAME2 = "tslint.json";

    export function findConfiguration(configFile): any {
        if (!configFile) {
            var currentPath = global.process.cwd();
            var parentPath = currentPath;

            while (true) {
                var filePath1 = path.join(currentPath, CONFIG_FILENAME1);
                var filePath2 = path.join(currentPath, CONFIG_FILENAME2);

                if (fs.existsSync(filePath1)) {
                    configFile = filePath1;
                    break;
                } else if(fs.existsSync(filePath2)) {
                    configFile = filePath2;
                    break;
                }

                // check if there's nowhere else to go
                parentPath = path.resolve(currentPath, "..");
                if (parentPath === currentPath) {
                    return undefined;
                }

                currentPath = parentPath;
            }
        }

        return JSON.parse(fs.readFileSync(configFile, "utf8"));
    }

    export function getConfiguredRules(configuration): Rule[] {
        var rules = [];

        for (var ruleName in configuration) {
            if (configuration.hasOwnProperty(ruleName)) {
                var ruleValue = configuration[ruleName];
                var rule = Rules.createRule(ruleName, ruleValue);
                if (rule !== undefined) {
                    rules.push(rule);
                }
            }
        }

        return rules;
    }

}
