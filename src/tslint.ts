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

import {IFormatter} from "./language/formatter/formatter";
import {RuleFailure} from "./language/rule/rule";
import {getSourceFile} from "./language/utils";
import {
    DEFAULT_CONFIG,
    findConfiguration,
    findConfigurationPath,
    getRelativePath,
    getRulesDirectories,
    loadConfigurationFromPath,
} from "./configuration";
import {EnableDisableRulesWalker} from "./enableDisableRules";
import {findFormatter} from "./formatterLoader";
import {ILinterOptionsRaw, ILinterOptions, LintResult} from "./lint";
import {loadRules} from "./ruleLoader";
import {arrayify} from "./utils";

class Linter {
    public static VERSION = "3.10.0";

    public static findConfiguration = findConfiguration;
    public static findConfigurationPath = findConfigurationPath;
    public static getRulesDirectories = getRulesDirectories;
    public static loadConfigurationFromPath = loadConfigurationFromPath;

    private fileName: string;
    private source: string;
    private options: ILinterOptions;

    constructor(fileName: string, source: string, options: ILinterOptionsRaw) {
        this.fileName = fileName;
        this.source = source;
        this.options = this.computeFullOptions(options);
    }

    public lint(): LintResult {
        const failures: RuleFailure[] = [];
        const sourceFile = getSourceFile(this.fileName, this.source);

        // walk the code first to find all the intervals where rules are disabled
        const rulesWalker = new EnableDisableRulesWalker(sourceFile, {
            disabledIntervals: [],
            ruleName: "",
        });
        rulesWalker.walk(sourceFile);
        const enableDisableRuleMap = rulesWalker.enableDisableRuleMap;

        const rulesDirectories = this.options.rulesDirectory;
        const configuration = this.options.configuration.rules;
        const configuredRules = loadRules(configuration, enableDisableRuleMap, rulesDirectories);
        const enabledRules = configuredRules.filter((r) => r.isEnabled());
        for (let rule of enabledRules) {
            const ruleFailures = rule.apply(sourceFile);
            for (let ruleFailure of ruleFailures) {
                if (!this.containsRule(failures, ruleFailure)) {
                    failures.push(ruleFailure);
                }
            }
        }

        let formatter: IFormatter;
        const formattersDirectory = getRelativePath(this.options.formattersDirectory);

        const Formatter = findFormatter(this.options.formatter, formattersDirectory);
        if (Formatter) {
            formatter = new Formatter();
        } else {
            throw new Error(`formatter '${this.options.formatter}' not found`);
        }

        const output = formatter.format(failures);
        return {
            failureCount: failures.length,
            failures: failures,
            format: this.options.formatter,
            output: output,
        };
    }

    private containsRule(rules: RuleFailure[], rule: RuleFailure) {
        return rules.some((r) => r.equals(rule));
    }

    private computeFullOptions(options: ILinterOptionsRaw = {}): ILinterOptions {
        if (typeof options !== "object") {
            throw new Error("Unknown Linter options type: " + typeof options);
        }

        let { configuration, formatter, formattersDirectory, rulesDirectory } = options;

        return {
            configuration: configuration || DEFAULT_CONFIG,
            formatter: formatter || "prose",
            formattersDirectory: formattersDirectory,
            rulesDirectory: arrayify(rulesDirectory).concat(arrayify(configuration.rulesDirectory)),
        };
    }
}

namespace Linter {}
export = Linter;
