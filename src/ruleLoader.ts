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
import {camelize} from "underscore.string";
import {getRulesDirectories} from "./configuration";
import {IRule, IDisabledInterval} from "./language/rule/rule";

const moduleDirectory = path.dirname(module.filename);
const CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, ".", "rules");

export interface IEnableDisablePosition {
    isEnabled: boolean;
    position: number;
}

export function loadRules(ruleConfiguration: {[name: string]: any},
                          enableDisableRuleMap: {[rulename: string]: IEnableDisablePosition[]},
                          rulesDirectories?: string | string[]): IRule[] {
    const rules: IRule[] = [];
    const notFoundRules: string[] = [];

    for (const ruleName in ruleConfiguration) {
        if (ruleConfiguration.hasOwnProperty(ruleName)) {
            const ruleValue = ruleConfiguration[ruleName];
            const Rule = findRule(ruleName, rulesDirectories);
            if (Rule == null) {
                notFoundRules.push(ruleName);
            } else {
                const all = "all"; // make the linter happy until we can turn it on and off
                const allList = (all in enableDisableRuleMap ? enableDisableRuleMap[all] : []);
                const ruleSpecificList = (ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : []);
                const disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList, allList);
                rules.push(new Rule(ruleName, ruleValue, disabledIntervals));
            }
        }
    }

    if (notFoundRules.length > 0) {
        const ERROR_MESSAGE = `
            Could not find implementations for the following rules specified in the configuration:
            ${notFoundRules.join("\n")}
            Try upgrading TSLint and/or ensuring that you have all necessary custom rules installed.
            If TSLint was recently upgraded, you may have old rules configured which need to be cleaned up.
        `;
        throw new Error(ERROR_MESSAGE);
    } else {
        return rules;
    }
}

export function findRule(name: string, rulesDirectories?: string | string[]) {
    let camelizedName = transformName(name);

    // first check for core rules
    let Rule = loadRule(CORE_RULES_DIRECTORY, camelizedName);
    if (Rule != null) {
        return Rule;
    }

    let directories = getRulesDirectories(rulesDirectories);

    for (let rulesDirectory of directories) {
        // then check for rules within the first level of rulesDirectory
        if (rulesDirectory != null) {
            Rule = loadRule(rulesDirectory, camelizedName);
            if (Rule != null) {
                return Rule;
            }
        }
    }

    return undefined;
}

function transformName(name: string) {
    // camelize strips out leading and trailing underscores and dashes, so make sure they aren't passed to camelize
    // the regex matches the groups (leading underscores and dashes)(other characters)(trailing underscores and dashes)
    const nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
    if (nameMatch == null) {
        return name + "Rule";
    }
    return nameMatch[1] + camelize(nameMatch[2]) + nameMatch[3] + "Rule";
}

/**
 * @param directory - An absolute path to a directory of rules
 * @param ruleName - A name of a rule in filename format. ex) "someLintRule"
 */
function loadRule(directory: string, ruleName: string) {
    const fullPath = path.join(directory, ruleName);

    if (fs.existsSync(fullPath + ".js")) {
        const ruleModule = require(fullPath);
        if (ruleModule && ruleModule.Rule) {
            return ruleModule.Rule;
        }
    }

    return undefined;
}

/*
 * We're assuming both lists are already sorted top-down so compare the tops, use the smallest of the two,
 * and build the intervals that way.
 */
function buildDisabledIntervalsFromSwitches(ruleSpecificList: IEnableDisablePosition[], allList: IEnableDisablePosition[]) {
    let isCurrentlyDisabled = false;
    let disabledStartPosition: number;
    const disabledIntervalList: IDisabledInterval[] = [];
    let i = 0;
    let j = 0;

    while (i < ruleSpecificList.length || j < allList.length) {
        const ruleSpecificTopPositon = (i < ruleSpecificList.length ? ruleSpecificList[i].position : Infinity);
        const allTopPositon = (j < allList.length ? allList[j].position : Infinity);
        let newPositionToCheck: IEnableDisablePosition;
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
                disabledIntervalList.push({
                    endPosition: newPositionToCheck.position,
                    startPosition: disabledStartPosition,
                });
                isCurrentlyDisabled = false;
            }
        }
    }

    if (isCurrentlyDisabled) {
        // we started an interval but didn't finish one -- so finish it with an Infinity
        disabledIntervalList.push({
            endPosition: Infinity,
            startPosition: disabledStartPosition,
        });
    }

    return disabledIntervalList;
}
