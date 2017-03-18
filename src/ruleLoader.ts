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

import { getRelativePath } from "./configuration";
import { showWarningOnce } from "./error";
import { IOptions, IRule, RuleStatic } from "./language/rule/rule";
import { arrayify, camelize, dedent, find } from "./utils";

const moduleDirectory = path.dirname(module.filename);
const CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, ".", "rules");
const cachedRules = new Map<string, RuleStatic | null>(); // null indicates that the rule was not found

export function loadRules(ruleOptionsList: IOptions[],
                          rulesDirectories?: string | string[],
                          isJs?: boolean): IRule[] {
    const rules: IRule[] = [];
    const notFoundRules: string[] = [];
    const notAllowedInJsRules: string[] = [];

    for (const ruleOptions of ruleOptionsList) {
        if (ruleOptions.ruleSeverity === "off") {
            // Perf: don't bother finding the rule if it's disabled.
            continue;
        }

        const ruleName = ruleOptions.ruleName;
        const Rule = findRule(ruleName, rulesDirectories);
        if (Rule === undefined) {
            notFoundRules.push(ruleName);
        } else if (isJs && Rule.metadata && Rule.metadata.typescriptOnly) {
            notAllowedInJsRules.push(ruleName);
        } else {
            const rule = new Rule(ruleOptions);
            if (rule.isEnabled()) {
                rules.push(rule);
            }

            if (Rule.metadata && Rule.metadata.deprecationMessage) {
                showWarningOnce(`${Rule.metadata.ruleName} is deprecated. ${Rule.metadata.deprecationMessage}`);
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

export function findRule(name: string, rulesDirectories?: string | string[]): RuleStatic | undefined {
    const camelizedName = transformName(name);
    // first check for core rules
    return loadCachedRule(CORE_RULES_DIRECTORY, camelizedName) ||
        find(arrayify(rulesDirectories), (dir) => loadCachedRule(dir, camelizedName, true));
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
function loadRule(directory: string, ruleName: string): RuleStatic | null {
    const fullPath = path.join(directory, ruleName);
    if (fs.existsSync(fullPath + ".js")) {
        const ruleModule = require(fullPath);
        if (ruleModule && ruleModule.Rule) {
            return ruleModule.Rule;
        }
    }
    return null;
}

function loadCachedRule(directory: string, ruleName: string, isCustomPath = false): RuleStatic | undefined {
    // use cached value if available
    const fullPath = path.join(directory, ruleName);
    const cachedRule = cachedRules.get(fullPath);
    if (cachedRule !== undefined) {
        return cachedRule === null ? undefined : cachedRule;
    }

    // get absolute path
    let absolutePath: string | undefined = directory;
    if (isCustomPath) {
        absolutePath = getRelativePath(directory);
        if (absolutePath !== undefined && !fs.existsSync(absolutePath)) {
            throw new Error(`Could not find custom rule directory: ${directory}`);
        }
    }

    const Rule = absolutePath === undefined ? null : loadRule(absolutePath, ruleName);
    cachedRules.set(fullPath, Rule);
    return Rule === null ? undefined : Rule;
}
