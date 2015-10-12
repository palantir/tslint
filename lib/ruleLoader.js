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
var underscore_string_1 = require("underscore.string");
var moduleDirectory = path.dirname(module.filename);
var CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, "..", "build", "rules");
function loadRules(ruleConfiguration, enableDisableRuleMap, rulesDirectory) {
    var rules = [];
    for (var ruleName in ruleConfiguration) {
        if (ruleConfiguration.hasOwnProperty(ruleName)) {
            var ruleValue = ruleConfiguration[ruleName];
            var Rule = findRule(ruleName, rulesDirectory);
            if (Rule !== undefined) {
                var all = "all";
                var allList = (all in enableDisableRuleMap ? enableDisableRuleMap[all] : []);
                var ruleSpecificList = (ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : []);
                var disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList, allList);
                rules.push(new Rule(ruleName, ruleValue, disabledIntervals));
            }
        }
    }
    return rules;
}
exports.loadRules = loadRules;
function findRule(name, rulesDirectory) {
    var camelizedName = transformName(name);
    var Rule = loadRule(CORE_RULES_DIRECTORY, camelizedName);
    if (Rule) {
        return Rule;
    }
    if (rulesDirectory) {
        Rule = loadRule(rulesDirectory, camelizedName);
        if (Rule) {
            return Rule;
        }
    }
    if (rulesDirectory) {
        var subDirectory = underscore_string_1.strLeft(rulesDirectory, "-");
        var ruleName = underscore_string_1.strRight(rulesDirectory, "-");
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
exports.findRule = findRule;
function transformName(name) {
    var nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
    if (nameMatch == null) {
        return name + "Rule";
    }
    return nameMatch[1] + underscore_string_1.camelize(nameMatch[2]) + nameMatch[3] + "Rule";
}
function loadRule() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i - 0] = arguments[_i];
    }
    var rulePath = paths.reduce(function (p, c) { return path.join(p, c); }, "");
    var fullPath = path.resolve(moduleDirectory, rulePath);
    if (fs.existsSync(fullPath + ".js")) {
        var ruleModule = require(fullPath);
        if (ruleModule && ruleModule.Rule) {
            return ruleModule.Rule;
        }
    }
    return undefined;
}
function buildDisabledIntervalsFromSwitches(ruleSpecificList, allList) {
    var isCurrentlyDisabled = false;
    var disabledStartPosition;
    var disabledIntervalList = [];
    var i = 0;
    var j = 0;
    while (i < ruleSpecificList.length || j < allList.length) {
        var ruleSpecificTopPositon = (i < ruleSpecificList.length ? ruleSpecificList[i].position : Infinity);
        var allTopPositon = (j < allList.length ? allList[j].position : Infinity);
        var newPositionToCheck = void 0;
        if (ruleSpecificTopPositon < allTopPositon) {
            newPositionToCheck = ruleSpecificList[i];
            i++;
        }
        else {
            newPositionToCheck = allList[j];
            j++;
        }
        if (newPositionToCheck.isEnabled === isCurrentlyDisabled) {
            if (!isCurrentlyDisabled) {
                disabledStartPosition = newPositionToCheck.position;
                isCurrentlyDisabled = true;
            }
            else {
                disabledIntervalList.push({
                    endPosition: newPositionToCheck.position,
                    startPosition: disabledStartPosition
                });
                isCurrentlyDisabled = false;
            }
        }
    }
    if (isCurrentlyDisabled) {
        disabledIntervalList.push({
            endPosition: Infinity,
            startPosition: disabledStartPosition
        });
    }
    return disabledIntervalList;
}
