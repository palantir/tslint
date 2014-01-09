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

/// <reference path='language/utils.ts'/>
/// <reference path='language/rule/abstractRule.ts'/>
/// <reference path='language/formatter/abstractFormatter.ts'/>
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

    class EnableDisableRulesWalker extends Lint.RuleWalker {

        public enableDisableRuleMap: {[rulename: string]: Lint.IEnableDisablePosition[]} = {};

        public visitToken(token: TypeScript.ISyntaxToken): void {
            this.findSwitchesInTrivia(token.leadingTrivia().toArray(), this.position());
            this.findSwitchesInTrivia(token.trailingTrivia().toArray(), this.position() + token.leadingTriviaWidth() + token.width());

            super.visitToken(token);
        }

        private findSwitchesInTrivia(triviaList: TypeScript.ISyntaxTrivia[], startingPosition: number) {
            var currentPosition = startingPosition;
            triviaList.forEach((triviaItem) => {
                if (triviaItem.kind() === TypeScript.SyntaxKind.MultiLineCommentTrivia) {
                    var commentText = triviaItem.fullText();
                    // regex is: start of string followed by "/*" followed by any amount of whitespace followed by "tslint:"
                    if (commentText.match(/^\/\*\s*tslint:/)) {
                        var commentTextParts = commentText.split(":");
                        // regex is: start of string followed by either "enable" or "disable"
                        // followed by either whitespace or end of string
                        var enableOrDisableMatch = commentTextParts[1].match(/^(enable|disable)(\s|$)/);
                        if (enableOrDisableMatch != null) {
                            var isEnabled = enableOrDisableMatch[1] === "enable";
                            var position = currentPosition;
                            var rulesList = ["all"];
                            if (commentTextParts.length > 2) {
                                rulesList = commentTextParts[2].split(/\s+/);
                            }
                            rulesList.forEach((ruleToAdd) => {
                                if (!(ruleToAdd in this.enableDisableRuleMap)) {
                                    this.enableDisableRuleMap[ruleToAdd] = [];
                                }
                                this.enableDisableRuleMap[ruleToAdd].push({position: position, isEnabled: isEnabled});
                            });
                        }

                    }
                }
                currentPosition += triviaItem.fullWidth();
            });
        }
    }

    export class Linter {
        private fileName: string;
        private source: string;
        private options: any;

        constructor(fileName: string, source: string, options: any) {
            this.fileName = fileName;
            this.source = source;
            this.options = options;
        }

        public lint(): LintResult {
            var i, failures = [];
            var syntaxTree = Lint.getSyntaxTree(this.fileName, this.source);

            // this walker walks the code first, to find all the intervals where rules are disabled
            var rulesWalker: EnableDisableRulesWalker = new EnableDisableRulesWalker(syntaxTree, {disabledIntervals: []});
            var sourceUnit = syntaxTree.sourceUnit();
            sourceUnit.accept(rulesWalker);
            var enableDisableRuleMap = rulesWalker.enableDisableRuleMap;

            var rulesDirectory = this.getRelativePath(this.options.rulesDirectory);
            var configuredRules = Lint.loadRules(this.options.configuration.rules, enableDisableRuleMap, rulesDirectory);
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
