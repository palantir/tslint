/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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

import * as ts from "typescript";

import {AbstractRule} from "./language/rule/abstractRule";
import {IOptions} from "./language/rule/rule";
import {forEachComment, TokenPosition} from "./language/utils";
import {RuleWalker} from "./language/walker/ruleWalker";
import {IEnableDisablePosition} from "./ruleLoader";

export class EnableDisableRulesWalker extends RuleWalker {
    public enableDisableRuleMap: {[rulename: string]: IEnableDisablePosition[]} = {};

    constructor(sourceFile: ts.SourceFile, options: IOptions, rules: {[name: string]: any}) {
        super(sourceFile, options);

        if (rules) {
            for (const rule in rules) {
                if (rules.hasOwnProperty(rule) && AbstractRule.isRuleEnabled(rules[rule])) {
                    this.enableDisableRuleMap[rule] = [{
                        isEnabled: true,
                        position: 0,
                    }];
                }
            }
        }
    }

    public visitSourceFile(node: ts.SourceFile) {
        forEachComment(node, (fullText, _kind, pos) => {
            return this.handlePossibleTslintSwitch(fullText.substring(pos.tokenStart, pos.end), node, pos);
        });
    }

    private getStartOfLinePosition(node: ts.SourceFile, position: number, lineOffset = 0) {
        const line = ts.getLineAndCharacterOfPosition(node, position).line + lineOffset;
        const lineStarts = node.getLineStarts();
        if (line >= lineStarts.length) {
            // next line ends with eof or there is no next line
            return node.getFullWidth();
        }
        return lineStarts[line];
    }

    private switchRuleState(ruleName: string, isEnabled: boolean, start: number, end?: number): void {
        const ruleStateMap = this.enableDisableRuleMap[ruleName];

        ruleStateMap.push({
            isEnabled,
            position: start,
        });

        if (end) {
            // switchRuleState method is only called when rule state changes therefore we can safely use opposite state
            ruleStateMap.push({
                isEnabled: !isEnabled,
                position: end,
            });
        }
    }

    private getLatestRuleState(ruleName: string): boolean {
        const ruleStateMap = this.enableDisableRuleMap[ruleName];

        return ruleStateMap[ruleStateMap.length - 1].isEnabled;
    }

    private handlePossibleTslintSwitch(commentText: string, node: ts.SourceFile, pos: TokenPosition) {
        // regex is: start of string followed by "/*" or "//" followed by any amount of whitespace followed by "tslint:"
        if (commentText.match(/^(\/\*|\/\/)\s*tslint:/)) {
            const commentTextParts = commentText.split(":");
            // regex is: start of string followed by either "enable" or "disable"
            // followed optionally by -line or -next-line
            // followed by either whitespace or end of string
            const enableOrDisableMatch = commentTextParts[1].match(/^(enable|disable)(-(line|next-line))?(\s|$)/);

            if (enableOrDisableMatch != null) {
                const isEnabled = enableOrDisableMatch[1] === "enable";
                const isCurrentLine = enableOrDisableMatch[3] === "line";
                const isNextLine = enableOrDisableMatch[3] === "next-line";

                let rulesList = ["all"];

                if (commentTextParts.length === 2) {
                    // an implicit whitespace separator is used for the rules list.
                    rulesList = commentTextParts[1].split(/\s+/).slice(1);

                    // remove empty items and potential comment end.
                    rulesList = rulesList.filter((item) => !!item && !item.includes("*/"));

                    // potentially there were no items, so default to `all`.
                    rulesList = rulesList.length > 0 ? rulesList : ["all"];
                } else if (commentTextParts.length > 2) {
                    // an explicit separator was specified for the rules list.
                    rulesList = commentTextParts[2].split(/\s+/);
                }

                if (rulesList.indexOf("all") !== -1) {
                    // iterate over all enabled rules
                    rulesList = Object.keys(this.enableDisableRuleMap);
                }

                for (const ruleToSwitch of rulesList) {
                    if (!(ruleToSwitch in this.enableDisableRuleMap)) {
                        // all rules enabled in configuration are already in map - skip switches for disabled rules
                        continue;
                    }

                    const previousState = this.getLatestRuleState(ruleToSwitch);

                    if (previousState === isEnabled) {
                        // no need to add switch points if there is no change in rule state
                        continue;
                    }

                    let start: number;
                    let end: number | undefined;

                    if (isCurrentLine) {
                        // start at the beginning of the current line
                        start = this.getStartOfLinePosition(node, pos.tokenStart);
                        // end at the beginning of the next line
                        end = pos.end + 1;
                    } else if (isNextLine) {
                        // start at the current position
                        start = pos.tokenStart;
                        // end at the beginning of the line following the next line
                        end = this.getStartOfLinePosition(node, pos.tokenStart, 2);
                    } else {
                        // disable rule for the rest of the file
                        // start at the current position, but skip end position
                        start = pos.tokenStart;
                        end = undefined;
                    }

                    this.switchRuleState(ruleToSwitch, isEnabled, start, end);
                }
            }
        }
    }
}
