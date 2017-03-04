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

import * as utils from "tsutils";
import * as ts from "typescript";

import {AbstractRule} from "./language/rule/abstractRule";
import {IEnableDisablePosition} from "./ruleLoader";

export class EnableDisableRulesWalker {
    private enableDisableRuleMap: {[rulename: string]: IEnableDisablePosition[]};
    private enabledRules: string[];

    constructor(private sourceFile: ts.SourceFile, rules: {[name: string]: any}) {
        this.enableDisableRuleMap = {};
        this.enabledRules = [];
        if (rules) {
            for (const rule of Object.keys(rules)) {
                if (AbstractRule.isRuleEnabled(rules[rule])) {
                    this.enabledRules.push(rule);
                    this.enableDisableRuleMap[rule] = [{
                        isEnabled: true,
                        position: 0,
                    }];
                }
            }
        }
    }

    public getEnableDisableRuleMap() {
        utils.forEachComment(this.sourceFile, (fullText, comment) => {
            const commentText = comment.kind === ts.SyntaxKind.SingleLineCommentTrivia
                ? fullText.substring(comment.pos + 2, comment.end)
                : fullText.substring(comment.pos + 2, comment.end - 2);
            return this.handleComment(commentText, comment);
        });

        return this.enableDisableRuleMap;
    }

    private getStartOfLinePosition(position: number, lineOffset = 0) {
        const line = ts.getLineAndCharacterOfPosition(this.sourceFile, position).line + lineOffset;
        const lineStarts = this.sourceFile.getLineStarts();
        if (line >= lineStarts.length) {
            // next line ends with eof or there is no next line
            // undefined switches the rule until the end and avoids an extra array entry
            return undefined;
        }
        return lineStarts[line];
    }

    private switchRuleState(ruleName: string, isEnabled: boolean, start: number, end?: number): void {
        const ruleStateMap = this.enableDisableRuleMap[ruleName];
        if (ruleStateMap === undefined || // skip switches for unknown or disabled rules
            isEnabled === ruleStateMap[ruleStateMap.length - 1].isEnabled // no need to add switch points if there is no change
        ) {
            return;
        }

        ruleStateMap.push({
            isEnabled,
            position: start,
        });

        if (end) {
            // we only get here when rule state changes therefore we can safely use opposite state
            ruleStateMap.push({
                isEnabled: !isEnabled,
                position: end,
            });
        }
    }

    private handleComment(commentText: string, range: ts.TextRange) {
        // regex is: start of string followed by any amount of whitespace
        // followed by tslint and colon
        // followed by either "enable" or "disable"
        // followed optionally by -line or -next-line
        // followed by either colon, whitespace or end of string
        const match = /^\s*tslint:(enable|disable)(?:-(line|next-line))?(:|\s|$)/.exec(commentText);
        if (match !== null) {
            // remove everything matched by the previous regex to get only the specified rules
            // split at whitespaces
            // filter empty items coming from whitespaces at start, at end or empty list
            let rulesList = commentText.substr(match[0].length)
                                       .split(/\s+/)
                                       .filter((rule) => !!rule);
            if (rulesList.length === 0 && match[3] === ":") {
                // nothing to do here: an explicit separator was specified but no rules to switch
                return;
            }
            if (rulesList.length === 0 ||
                rulesList.indexOf("all") !== -1) {
                // if list is empty we default to all enabled rules
                // if `all` is specified we ignore the other rules and take all enabled rules
                rulesList = this.enabledRules;
            }

            this.handleTslintLineSwitch(rulesList, match[1] === "enable", match[2], range);
        }
    }

    private handleTslintLineSwitch(rules: string[], isEnabled: boolean, modifier: string, range: ts.TextRange) {
        let start: number | undefined;
        let end: number | undefined;

        if (modifier === "line") {
            // start at the beginning of the line where comment starts
            start = this.getStartOfLinePosition(range.pos)!;
            // end at the beginning of the line following the comment
            end = this.getStartOfLinePosition(range.end, 1);
        } else if (modifier === "next-line") {
            // start at the beginning of the line following the comment
            start = this.getStartOfLinePosition(range.end, 1);
            if (start === undefined) {
                // no need to switch anything, there is no next line
                return;
            }
            // end at the beginning of the line following the next line
            end = this.getStartOfLinePosition(range.end, 2);
        } else {
            // switch rule for the rest of the file
            // start at the current position, but skip end position
            start = range.pos;
            end = undefined;
        }

        for (const ruleToSwitch of rules) {
            this.switchRuleState(ruleToSwitch, isEnabled, start, end);
        }
    }
}
