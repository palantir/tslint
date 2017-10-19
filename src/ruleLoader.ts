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
import { FatalError, showWarningOnce } from "./error";
import { IOptions, IRule, RuleConstructor } from "./language/rule/rule";
import { arrayify, camelize, dedent, find } from "./utils";

const moduleDirectory = path.dirname(module.filename);
const CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, ".", "rules");
const cachedRules = new Map<string, RuleConstructor | "not-found">();

export function loadRules(ruleOptionsList: IOptions[],
                          rulesDirectories?: string | string[],
                          isJs = false): IRule[] {
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
        } else if (isJs && Rule.metadata !== undefined && Rule.metadata.typescriptOnly) {
            notAllowedInJsRules.push(ruleName);
        } else {
            const rule = new Rule(ruleOptions);
            if (rule.isEnabled()) {
                rules.push(rule);
            }

            if (Rule.metadata !== undefined && Boolean(Rule.metadata.deprecationMessage)) {
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

        showWarningOnce(warning);
    }
    if (notAllowedInJsRules.length > 0) {
        const warning = dedent`
            Following rules specified in configuration couldn't be applied to .js or .jsx files:
                ${notAllowedInJsRules.join("\n                ")}
            Make sure to exclude them from "jsRules" section of your tslint.json.
        `;

        showWarningOnce(warning);
    }
    if (rules.length === 0) {
        showWarningOnce("No valid rules have been specified");
    }
    return rules;
}

export function findRule(name: string, rulesDirectories?: string | string[]): RuleConstructor | undefined {
    const camelizedName = transformName(name);
    // first check for core rules
    const Rule = loadCachedRule(CORE_RULES_DIRECTORY, camelizedName);
    return Rule !== undefined ? Rule :
        // then check for rules within the first level of rulesDirectory
        find(arrayify(rulesDirectories), (dir) => loadCachedRule(dir, camelizedName, true));
}

function transformName(name: string): string {
    // camelize strips out leading and trailing underscores and dashes, so make sure they aren't passed to camelize
    // the regex matches the groups (leading underscores and dashes)(other characters)(trailing underscores and dashes)
    const nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
    if (nameMatch === null) {
        return `${name}Rule`;
    }
    return `${nameMatch[1]}${camelize(nameMatch[2])}${nameMatch[3]}Rule`;
}

/**
 * @param directory - An absolute path to a directory of rules
 * @param ruleName - A name of a rule in filename format. ex) "someLintRule"
 */
function loadRule(directory: string, ruleName: string): RuleConstructor | "not-found" {
    const ruleFullPath = getRuleFullPath(directory, ruleName);
    if (ruleFullPath !== undefined) {
        const ruleModule = require(ruleFullPath) as { Rule: RuleConstructor } | undefined;
        if (ruleModule !== undefined) {
            return ruleModule.Rule;
        }
    }
    return "not-found";
}

/**
 * Returns the full path to a rule file. Path to rules are resolved using nodes path resolution.
 * This allows developers to write custom rules in TypeScript, which then can be loaded by TS-Node.
 * @param directory - An absolute path to a directory of rules
 * @param ruleName - A name of a rule in filename format. ex) "someLintRule"
 */
function getRuleFullPath(directory: string, ruleName: string): string | undefined {
    try {
        return require.resolve(path.join(directory, ruleName));
    } catch (e) {
        return undefined;
    }
}

function loadCachedRule(directory: string, ruleName: string, isCustomPath?: boolean): RuleConstructor | undefined {
    // use cached value if available
    const fullPath = path.join(directory, ruleName);
    const cachedRule = cachedRules.get(fullPath);
    if (cachedRule !== undefined) {
        return cachedRule === "not-found" ? undefined : cachedRule;
    }

    // get absolute path
    let absolutePath: string | undefined = directory;
    if (isCustomPath) {
        absolutePath = getRelativePath(directory);
        if (absolutePath !== undefined && !fs.existsSync(absolutePath)) {
            throw new FatalError(`Could not find custom rule directory: ${directory}`);
        }
    }

    const Rule = absolutePath === undefined ? "not-found" : loadRule(absolutePath, ruleName);

    cachedRules.set(fullPath, Rule);
    return Rule === "not-found" ? undefined : Rule;
}
