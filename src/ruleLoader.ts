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

/// <reference path='language/rule/rule.ts'/>
/// <reference path='language/walker/ruleWalker.ts'/>

module Lint {
    var fs = require("fs");
    var path = require("path");
    var _s = require("underscore.string");
    var moduleDirectory = path.dirname(module.filename);

    var CORE_RULES_DIRECTORY = path.join("..", "build", "rules");

    export function loadRules(ruleConfiguration, rulesDirectory?: string): Rule[] {
        var rules = [];

        for (var ruleName in ruleConfiguration) {
            if (ruleConfiguration.hasOwnProperty(ruleName)) {
                var ruleValue = ruleConfiguration[ruleName];
                var Rule = findRule(ruleName, rulesDirectory);
                if (Rule !== undefined) {
                    rules.push(new Rule(ruleName, ruleValue));
                }
            }
        }

        return rules;
    }

    export function findRule(name: string, rulesDirectory?: string) {
        var camelizedName = _s.camelize(name + "Rule");

        // first check for core rules
        var Rule = loadRule(CORE_RULES_DIRECTORY, camelizedName);
        if (Rule) {
            return Rule;
        }

        // then check for rules within the first level of rulesDirectory
        if (rulesDirectory) {
            Rule = loadRule(rulesDirectory, camelizedName);
            if (Rule) {
                return Rule;
            }
        }

        // finally check for rules within the first level of directories,
        // using dash prefixes as the sub-directory names
        if (rulesDirectory) {
            var subDirectory = _s.strLeft(rulesDirectory, "-");
            var ruleName = _s.strRight(rulesDirectory, "-");
            if (subDirectory !== rulesDirectory && ruleName !== rulesDirectory) {
                camelizedName = _s.camelize(ruleName + "Rule");
                Rule = loadRule(rulesDirectory, subDirectory, camelizedName);
                if (Rule) {
                    return Rule;
                }
            }
        }

        return undefined;
    }

    function loadRule(...paths: string[]) {
        var rulePath = paths.reduce((p, c) => path.join(p, c), "");
        var fullPath = path.resolve(moduleDirectory, rulePath);

        if (fs.existsSync(fullPath + ".js")) {
            var ruleModule = require(fullPath);
            if (ruleModule && ruleModule.Rule) {
                return ruleModule.Rule;
            }
        }

        return undefined;
    }
}
