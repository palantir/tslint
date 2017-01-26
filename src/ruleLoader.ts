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

import { getRulesDirectories } from "./configuration";
import { AbstractRule } from "./language/rule/abstractRule";
import { IDisabledInterval, IRule } from "./language/rule/rule";
import { camelize, dedent } from "./utils";

const moduleDirectory = path.dirname(module.filename);
const CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, ".", "rules");
const shownDeprecations: string[] = [];
const cachedRules: { [fullPath: string]: IRule | null } = {};

export interface IEnableDisablePosition {
    isEnabled: boolean;
    position: number;
}

export function loadRules(ruleConfiguration: {[name: string]: any},
                          enableDisableRuleMap: {[rulename: string]: IEnableDisablePosition[]},
                          rulesDirectories?: string | string[],
                          isJs?: boolean): IRule[] {
    const rules: IRule[] = [];
    const notFoundRules: string[] = [];
    const notAllowedInJsRules: string[] = [];

    for (const ruleName in ruleConfiguration) {
        if (ruleConfiguration.hasOwnProperty(ruleName)) {
            const ruleValue = ruleConfiguration[ruleName];
            if (AbstractRule.isRuleEnabled(ruleValue) || enableDisableRuleMap.hasOwnProperty(ruleName)) {
                const Rule = findRule(ruleName, rulesDirectories);
                if (Rule == null) {
                    notFoundRules.push(ruleName);
                } else {
                    if (isJs && Rule.metadata && Rule.metadata.typescriptOnly != null && Rule.metadata.typescriptOnly) {
                        notAllowedInJsRules.push(ruleName);
                    } else {
                        const ruleSpecificList = (ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : []);
                        const disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList);
                        rules.push(new Rule(ruleName, ruleValue, disabledIntervals));

                        if (Rule.metadata && Rule.metadata.deprecationMessage && shownDeprecations.indexOf(Rule.metadata.ruleName) === -1) {
                            console.warn(`${Rule.metadata.ruleName} is deprecated. ${Rule.metadata.deprecationMessage}`);
                            shownDeprecations.push(Rule.metadata.ruleName);
                        }
                    }
                }
            }
        }
    }

    if (notFoundRules.length > 0) {
        const warning = dedent`
            Could not find implementations for the following rules specified in the configuration:
                ${notFoundRules.join("\n                ")}
            Try upgrading TSLint and/or ensuring that you have all necessary custom rules installed.
            If TSLint was recently upgraded, you may have old rules configured which need to be cleaned up.
        `;

        console.warn(warning);
    }
    if (notAllowedInJsRules.length > 0) {
        const warning = dedent`
            Following rules specified in configuration couldn't be applied to .js or .jsx files:
                ${notAllowedInJsRules.join("\n                ")}
            Make sure to exclude them from "jsRules" section of your tslint.json.
        `;

        console.warn(warning);
    }
    if (rules.length === 0) {
        console.warn("No valid rules have been specified");
    }
    return rules;
}

export function findRule(name: string, rulesDirectories?: string | string[]) {
    const camelizedName = transformName(name);

    // first check for core rules
    let Rule = loadRule(CORE_RULES_DIRECTORY, camelizedName);
    if (Rule != null) {
        return Rule;
    }

    const directories = getRulesDirectories(rulesDirectories);

    for (const rulesDirectory of directories) {
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
    if (cachedRules[fullPath] !== undefined) {
        return cachedRules[fullPath];
    }

    if (fs.existsSync(fullPath + ".js")) {
        const ruleModule = require(fullPath);
        if (ruleModule && ruleModule.Rule) {
            cachedRules[fullPath] = ruleModule.Rule;
            return ruleModule.Rule;
        }
    }

    cachedRules[fullPath] = null;
    return undefined;
}

/**
 * creates disabled intervals for rule based on list of switchers for it
 * @param ruleSpecificList - contains all switchers for rule states sorted top-down and strictly alternating between enabled and disabled
 */
function buildDisabledIntervalsFromSwitches(ruleSpecificList: IEnableDisablePosition[]) {
    const disabledIntervalList: IDisabledInterval[] = [];
    // starting from second element in the list since first is always enabled in position 0;
    let i = 1;

    while (i < ruleSpecificList.length) {
        const startPosition = ruleSpecificList[i].position;

        // rule enabled state is always alternating therefore we can use position of next switch as end of disabled interval
        // set endPosition as Infinity in case when last switch for rule in a file is disabled
        const endPosition = ruleSpecificList[i + 1] ? ruleSpecificList[i + 1].position : Infinity;

        disabledIntervalList.push({
            endPosition,
            startPosition,
        });

        i += 2;
    }

    return disabledIntervalList;
}
