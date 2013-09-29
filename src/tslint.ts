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

/// <reference path='configuration.ts' />
/// <reference path='formatters/formatters.ts' />
/// <reference path='language/languageServiceHost.ts' />

/// <reference path='language/rule/abstractRule.ts' />
/// <reference path='language/walker/scopeAwareRuleWalker.ts' />
/// <reference path='language/walker/stateAwareRuleWalker.ts' />

module Lint {

    export interface LintResult {
        failureCount: number;
        format: string;
        output: string;
    }

    export class Linter {
        private fileName: string;
        private source: string;
        private options: any;

        constructor(fileName: string, source: string, options: any) {
            this.fileName = fileName;
            this.source = source;
            this.options = options;

            Lint.Formatters.createAllFormatters();
        }

        public lint(): LintResult {
            var i, failures = [];

            var languageServiceHost = new Lint.LanguageServiceHost(this.fileName, this.source);
            var languageService = new Services.LanguageService(languageServiceHost);
            var syntaxTree = languageService.getSyntaxTree(this.fileName);
            var configuredRules = Lint.Configuration.getConfiguredRules(this.options.configuration);

            for (i = 0; i < configuredRules.length; ++i) {
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

            var formatter = Lint.Formatters.getFormatterForName(this.options.formatter);
            if (formatter === undefined) {
                formatter = new Lint.Formatters.ProseFormatter();
            }

            var output = formatter.format(failures);
            return {
                failureCount: failures.length,
                format: this.options.formatter,
                output: output
            };
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

module.exports = Lint.Linter;
