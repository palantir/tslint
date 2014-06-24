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

/// <reference path='ruleLoader.ts'/>
/// <reference path='configuration.ts'/>
/// <reference path='formatterLoader.ts'/>
/// <reference path='enableDisableRules.ts'/>

/// <reference path='language/languageServiceHost.ts'/>
/// <reference path='language/utils.ts'/>
/// <reference path='language/formatter/abstractFormatter.ts'/>
/// <reference path='language/rule/abstractRule.ts'/>
/// <reference path='language/walker/ruleWalker.ts'/>
/// <reference path='language/walker/scopeAwareRuleWalker.ts'/>
/// <reference path='language/walker/stateAwareRuleWalker.ts'/>

module Lint {
    var path = require("path");
    var moduleDirectory = path.dirname(module.filename);

    export interface LintResult {
        failureCount: number;
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
        private fileName: string;
        private source: string;
        private options: ILinterOptions;

        public static VERSION = "0.4.10";

        constructor(fileName: string, source: string, options: ILinterOptions) {
            this.fileName = fileName;
            this.source = source;
            this.options = options;
        }

        public lint(): LintResult {
            var failures: RuleFailure[] = [];
            var syntaxTree = Lint.getSyntaxTree(this.fileName, this.source);

            // walk the code first to find all the intervals where rules are disabled
            var rulesWalker = new EnableDisableRulesWalker(syntaxTree, {ruleName: "", disabledIntervals: []});
            var sourceUnit = syntaxTree.sourceUnit();
            sourceUnit.accept(rulesWalker);
            var enableDisableRuleMap = rulesWalker.enableDisableRuleMap;

            var rulesDirectory = this.getRelativePath(this.options.rulesDirectory);
            var configuration = this.options.configuration.rules;
            var configuredRules = Lint.loadRules(configuration, enableDisableRuleMap, rulesDirectory);
            for (var i = 0; i < configuredRules.length; ++i) {
                var rule = configuredRules[i];
                if (rule.isEnabled()) {
                    var ruleFailures = rule.apply(syntaxTree);
                    ruleFailures.forEach ((ruleFailure) => {
                        if (!this.containsRule(failures, ruleFailure)) {
                            failures.push(ruleFailure);
                        }
                    });
                }
            }

            var formatter: Lint.Formatter;
            var formattersDirectory = this.getRelativePath(this.options.formattersDirectory);

            var Formatter = Lint.findFormatter(this.options.formatter, formattersDirectory);
            if (Formatter) {
                formatter = new Formatter();
            } else {
                throw new Error("formatter '" + this.options.formatter + "' not found");
            }

            var output = formatter.format(failures);
            return {
                failureCount: failures.length,
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
            for (var i = 0; i < rules.length; ++i) {
                if (rules[i].equals(rule)) {
                    return true;
                }
            }

            return false;
        }
    }
}

// add the Lint and TypeScript modules to global for pluggable formatters/rules
global.Lint = Lint;
global.TypeScript = TypeScript;

// export Lint.Linter as the API interface for this module
module.exports = Lint.Linter;
