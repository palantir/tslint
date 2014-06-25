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
    var CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, "..", "build", "rules");

    export interface IEnableDisablePosition {
        isEnabled: boolean;
        position: number;
    }

    export function loadRules(ruleConfiguration: {[name: string]: any},
                              enableDisableRuleMap: {[rulename: string]: Lint.IEnableDisablePosition[]},
                              rulesDirectory?: string): IRule[] {
        var rules: IRule[] = [];
        for (var ruleName in ruleConfiguration) {
            if (ruleConfiguration.hasOwnProperty(ruleName)) {
                var ruleValue = ruleConfiguration[ruleName];
                var Rule = findRule(ruleName, rulesDirectory);
                if (Rule !== undefined) {
                    var all = "all"; // make the linter happy until we can turn it on and off
                    var allList = (all in enableDisableRuleMap ? enableDisableRuleMap[all] : []);
                    var ruleSpecificList = (ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : []);
                    var disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList, allList);
                    rules.push(new Rule(ruleName, ruleValue, disabledIntervals));
                }
            }
        }

        return rules;
    }

    export function findRule(name: string, rulesDirectory?: string) {
        var camelizedName = transformName(name);

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
                camelizedName = transformName(ruleName);
                Rule = loadRule(rulesDirectory, subDirectory, camelizedName);
                if (Rule) {
                    return Rule;
                }
            }
        }

        return undefined;
    }

    function transformName(name: string) {
        // camelize strips out leading and trailing underscores and dashes, so make sure they aren't passed to camelize
        // the regex matches the groups (leading underscores and dashes)(other characters)(trailing underscores and dashes)
        var nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
        if (nameMatch == null) {
            return name + "Rule";
        }
        return nameMatch[1] + _s.camelize(nameMatch[2]) + nameMatch[3] + "Rule";
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

    /*
     * we're assuming both lists are already sorted top-down
     * so compare the tops, use the smallest of the two, and build the intervals that way
     */
    function buildDisabledIntervalsFromSwitches(ruleSpecificList: IEnableDisablePosition[], allList: IEnableDisablePosition[]) {

        var isCurrentlyDisabled = false;
        var disabledStartPosition: number;
        var disabledIntervalList: Lint.IDisabledInterval[] = [];
        var i = 0;
        var j = 0;
        while (i < ruleSpecificList.length || j < allList.length) {
            var ruleSpecificTopPositon = (i < ruleSpecificList.length ? ruleSpecificList[i].position : Infinity);
            var allTopPositon = (j < allList.length ? allList[j].position : Infinity);
            var newPositionToCheck: IEnableDisablePosition;
            if (ruleSpecificTopPositon < allTopPositon) {
                newPositionToCheck = ruleSpecificList[i];
                i++;
            } else {
                newPositionToCheck = allList[j];
                j++;
            }

            // we're currently disabled and enabling, or currently enabled and disabling -- a switch
            if (newPositionToCheck.isEnabled === isCurrentlyDisabled) {
                if (!isCurrentlyDisabled) {
                    // start a new interval
                    disabledStartPosition = newPositionToCheck.position;
                    isCurrentlyDisabled = true;
                } else {
                    // we're currently disabled and about to enable -- end the interval
                    disabledIntervalList.push({startPosition: disabledStartPosition, endPosition: newPositionToCheck.position});
                    isCurrentlyDisabled = false;
                }
            }

        }

        if (isCurrentlyDisabled) {
            // we started an interval but didn't finish one -- so finish it with an Infinity
            disabledIntervalList.push({startPosition: disabledStartPosition, endPosition: Infinity});
        }

        return disabledIntervalList;
    }
}
