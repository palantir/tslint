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

module Lint {
    const path = require("path");
    const moduleDirectory = path.dirname(module.filename);

    export interface LintResult {
        failureCount: number;
        failures: RuleFailure[];
        format: string;
        output: string;
    }

    export interface ILinterOptions {
        configuration: any;
        formatter: string;
        formattersDirectory: string;
        rulesDirectory: string;
    }

    export class Linter {
        public static VERSION = "2.4.3";

        private fileName: string;
        private source: string;
        private options: ILinterOptions;

        constructor(fileName: string, source: string, options: ILinterOptions) {
            this.fileName = fileName;
            this.source = source;
            this.options = options;
        }

        public lint(): LintResult {
            const failures: RuleFailure[] = [];
            const sourceFile = Lint.getSourceFile(this.fileName, this.source);

            // walk the code first to find all the intervals where rules are disabled
            const rulesWalker = new EnableDisableRulesWalker(sourceFile, {
                disabledIntervals: [],
                ruleName: ""
            });
            rulesWalker.walk(sourceFile);
            const enableDisableRuleMap = rulesWalker.enableDisableRuleMap;

            const rulesDirectory = this.getRelativePath(this.options.rulesDirectory);
            const configuration = this.options.configuration.rules;
            const configuredRules = Lint.loadRules(configuration, enableDisableRuleMap, rulesDirectory);
            for (let rule of configuredRules) {
                if (rule.isEnabled()) {
                    const ruleFailures = rule.apply(sourceFile);
                    for (let ruleFailure of ruleFailures) {
                        if (!this.containsRule(failures, ruleFailure)) {
                            failures.push(ruleFailure);
                        }
                    }
                }
            }

            let formatter: Lint.IFormatter;
            const formattersDirectory = this.getRelativePath(this.options.formattersDirectory);

            const Formatter = Lint.findFormatter(this.options.formatter, formattersDirectory);
            if (Formatter) {
                formatter = new Formatter();
            } else {
                throw new Error("formatter '" + this.options.formatter + "' not found");
            }

            const output = formatter.format(failures);
            return {
                failureCount: failures.length,
                failures: failures,
                format: this.options.formatter,
                output: output
            };
        }

        private getRelativePath(directory: string): string {
            if (directory) {
                return path.relative(moduleDirectory, directory);
            }

            return undefined;
        }

        private containsRule(rules: RuleFailure[], rule: RuleFailure) {
            return rules.some((r) => r.equals(rule));
        }
    }
}

// add the Lint and TypeScript modules to global for pluggable formatters/rules
global.Lint = Lint;
global.ts = ts;

// export Lint.Linter as the API interface for this module
module.exports = Lint.Linter;
// also export Lint.Configuration.findConfiguration so implementers can consume
module.exports.findConfiguration = Lint.Configuration.findConfiguration;

declare module "tslint" {
    export = Lint;
}
