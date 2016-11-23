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

import {scanAllTokens} from "./language/utils";
import {SkippableTokenAwareRuleWalker} from "./language/walker/skippableTokenAwareRuleWalker";
import {IEnableDisablePosition} from "./ruleLoader";

export class EnableDisableRulesWalker extends SkippableTokenAwareRuleWalker {
    public enableDisableRuleMap: {[rulename: string]: IEnableDisablePosition[]} = {};

    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);
        const scan = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text);

        scanAllTokens(scan, (scanner: ts.Scanner) => {
            const startPos = scanner.getStartPos();
            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                return;
            }

            if (scanner.getToken() === ts.SyntaxKind.MultiLineCommentTrivia ||
                scanner.getToken() === ts.SyntaxKind.SingleLineCommentTrivia) {
                const commentText = scanner.getTokenText();
                const startPosition = scanner.getTokenPos();
                this.handlePossibleTslintSwitch(commentText, startPosition, node, scanner);
            }
        });
    }

    private getStartOfLinePosition(node: ts.SourceFile, position: number, lineOffset = 0) {
        return node.getPositionOfLineAndCharacter(
            node.getLineAndCharacterOfPosition(position).line + lineOffset, 0,
        );
    }

    private handlePossibleTslintSwitch(commentText: string, startingPosition: number, node: ts.SourceFile, scanner: ts.Scanner) {
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
                    rulesList = rulesList.filter((item) => !!item && item.indexOf("*/") === -1);

                    // potentially there were no items, so default to `all`.
                    rulesList = rulesList.length > 0 ? rulesList : ["all"];
                } else if (commentTextParts.length > 2) {
                    // an explicit separator was specified for the rules list.
                    rulesList = commentTextParts[2].split(/\s+/);
                }

                for (const ruleToAdd of rulesList) {
                    if (!(ruleToAdd in this.enableDisableRuleMap)) {
                        this.enableDisableRuleMap[ruleToAdd] = [];
                    }
                    if (isCurrentLine) {
                        // start at the beginning of the current line
                        this.enableDisableRuleMap[ruleToAdd].push({
                            isEnabled,
                            position: this.getStartOfLinePosition(node, startingPosition),
                        });
                        // end at the beginning of the next line
                        this.enableDisableRuleMap[ruleToAdd].push({
                            isEnabled: !isEnabled,
                            position: scanner.getTextPos() + 1,
                        });
                    } else {
                        // start at the current position
                        this.enableDisableRuleMap[ruleToAdd].push({
                            isEnabled,
                            position: startingPosition,
                        });
                        // end at the beginning of the line following the next line
                        if (isNextLine) {
                            this.enableDisableRuleMap[ruleToAdd].push({
                                isEnabled: !isEnabled,
                                position: this.getStartOfLinePosition(node, startingPosition, 2),
                            });
                        }
                    }
                }
            }
        }
    }
}
