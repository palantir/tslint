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

// tslint:disable object-literal-sort-keys

import * as utils from "tsutils";
import * as ts from "typescript";
import { RuleFailure } from "./language/rule/rule";

export interface RuleDisabler {
    /** True if there is a `tslint:disable` in the range of the failure. */
    isDisabled(failure: RuleFailure): boolean;
    /** True if there is an explicit `tslint:enable` for a rule even if it is not turned on in tslint.json. */
    isExplicitlyEnabled(ruleName: string): boolean;
}

export function getDisabler(sourceFile: ts.SourceFile, enabledRules: string[]): RuleDisabler {
    const map = getDisableMap(sourceFile, enabledRules);
    return {
        isExplicitlyEnabled(ruleName) {
            return map.has(ruleName);
        },
        isDisabled(failure) {
            const disabledIntervals = map.get(failure.getRuleName());
            return !!disabledIntervals && disabledIntervals.some(({ pos, end }) => {
                const failPos = failure.getStartPosition().getPosition();
                const failEnd = failure.getEndPosition().getPosition();
                return failEnd >= pos && (end === -1 || failPos <= end);
            });
        },
    };
}

/**
 * The map will have an array of TextRange for each disable of a rule in a file.
 * (It will have no entry if the rule is never disabled, meaning all arrays are non-empty.)
 */
function getDisableMap(sourceFile: ts.SourceFile, enabledRules: string[]): ReadonlyMap<string, ts.TextRange[]> {
    const enabledRulesSet = new Set(enabledRules);
    const map = new Map<string, ts.TextRange[]>();

    utils.forEachComment(sourceFile, (fullText, comment) => {
        const commentText = comment.kind === ts.SyntaxKind.SingleLineCommentTrivia
            ? fullText.substring(comment.pos + 2, comment.end)
            : fullText.substring(comment.pos + 2, comment.end - 2);
        const parsed = parseComment(commentText);
        if (parsed) {
            const { rulesList, isEnabled, modifier } = parsed;
            const switchRange = getSwitchRange(modifier, comment, sourceFile);
            if (switchRange) {
                for (const ruleToSwitch of (rulesList === "all" ? enabledRules : rulesList)) {
                    switchRuleState(ruleToSwitch, isEnabled, switchRange.pos, switchRange.end);
                }
            }
        }
    });

    return map;

    function switchRuleState(ruleName: string, isEnable: boolean, start: number, end: number): void {
        const disableRanges = map.get(ruleName);

        if (isEnable) {
            if (disableRanges) {
                const lastDisable = disableRanges[disableRanges.length - 1];
                if (lastDisable.end === -1) {
                    lastDisable.end = start;
                    if (end !== -1) {
                        // Disable it again after the enable range is over.
                        disableRanges.push({ pos: end, end: -1 });
                    }
                }
            } else if (!enabledRulesSet.has(ruleName)) {
                // This rule is being explicitly enabled. Disable it outside of this particular range.
                const ranges = [{ pos: 0, end: start }];
                map.set(ruleName, ranges);
                if (end !== -1) {
                    // If enabled just for this line, disable after.
                    ranges.push({ pos: end, end: -1 });
                }
            }
        } else { // disable
            if (!disableRanges) {
                map.set(ruleName, [{ pos: start, end }]);
            } else if (disableRanges[disableRanges.length - 1].end !== -1) {
                disableRanges.push({ pos: start, end });
            }
        }
    }
}

/** End will be -1 to indicate no end. */
function getSwitchRange(modifier: Modifier, range: ts.TextRange, sourceFile: ts.SourceFile): ts.TextRange | undefined {
    const lineStarts = sourceFile.getLineStarts();

    switch (modifier) {
        case "line":
            return {
                // start at the beginning of the line where comment starts
                pos: getStartOfLinePosition(range.pos),
                // end at the beginning of the line following the comment
                end: getStartOfLinePosition(range.end, 1),
            };
        case "next-line":
            // start at the beginning of the line following the comment
            const pos = getStartOfLinePosition(range.end, 1);
            if (pos === -1) {
                // no need to switch anything, there is no next line
                return undefined;
            }
            // end at the beginning of the line following the next line
            return { pos, end: getStartOfLinePosition(range.end, 2) };
        default:
            // switch rule for the rest of the file
            // start at the current position, but skip end position
            return { pos: range.pos, end: -1 };
    }

    /** Returns -1 for last line. */
    function getStartOfLinePosition(position: number, lineOffset = 0): number {
        const line = ts.getLineAndCharacterOfPosition(sourceFile, position).line + lineOffset;
        return line >= lineStarts.length ? -1 : lineStarts[line];
    }
}

type Modifier = "line" | "next-line" | undefined;
function parseComment(commentText: string): { rulesList: string[] | "all", isEnabled: boolean, modifier: Modifier } | undefined {
    // regex is: start of string followed by any amount of whitespace
    // followed by tslint and colon
    // followed by either "enable" or "disable"
    // followed optionally by -line or -next-line
    // followed by either colon, whitespace or end of string
    const match = /^\s*tslint:(enable|disable)(?:-(line|next-line))?(:|\s|$)/.exec(commentText);
    if (match === null) {
        return undefined;
    }

    // remove everything matched by the previous regex to get only the specified rules
    // split at whitespaces
    // filter empty items coming from whitespaces at start, at end or empty list
    let rulesList: string[] | "all" = commentText.substr(match[0].length)
        .split(/\s+/)
        .filter((rule) => !!rule);
    if (rulesList.length === 0 && match[3] === ":") {
        // nothing to do here: an explicit separator was specified but no rules to switch
        return undefined;
    }
    if (rulesList.length === 0 ||
        rulesList.indexOf("all") !== -1) {
        // if list is empty we default to all enabled rules
        // if `all` is specified we ignore the other rules and take all enabled rules
        rulesList = "all";
    }

    return { rulesList, isEnabled: match[1] === "enable", modifier: match[2] as Modifier };
}
