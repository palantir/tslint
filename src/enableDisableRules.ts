/*
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

/// <reference path='language/walker/skipableTokenAwareRuleWalker.ts'/>

module Lint {
    export class EnableDisableRulesWalker extends Lint.SkipableTokenAwareRuleWalker {
        public enableDisableRuleMap: {[rulename: string]: Lint.IEnableDisablePosition[]} = {};

        public visitSourceFile(node: ts.SourceFile): void {
            super.visitSourceFile(node);
            Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.ES5, false, node.text), (scanner: ts.Scanner) => {
                var startPos = scanner.getStartPos();
                if (this.tokensToSkipStartEndMap[startPos] != null) {
                    // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                    // (specifically, regex, identifiers, and templates). So skip those tokens.
                    scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                    return;
                }

                if (scanner.getToken() === ts.SyntaxKind.MultiLineCommentTrivia) {
                    var commentText = scanner.getTokenText();
                    var startPosition = scanner.getTokenPos();
                    this.handlePossibleTslintSwitch(commentText, startPosition);
                }
            });
        }

        private handlePossibleTslintSwitch(commentText: string, startingPosition: number) {
            var currentPosition = startingPosition;
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
    }
}
