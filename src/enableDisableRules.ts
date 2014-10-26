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

/// <reference path='language/walker/ruleWalker.ts'/>

module Lint {
    export class EnableDisableRulesWalker extends Lint.RuleWalker {
        public enableDisableRuleMap: {[rulename: string]: Lint.IEnableDisablePosition[]} = {};

        public visitToken(token: TypeScript.ISyntaxToken): void {
            this.findSwitchesInTrivia(token.leadingTrivia().toArray(), this.getPosition());

            var remainingWidth = token.fullWidth() - token.trailingTriviaWidth();
            this.findSwitchesInTrivia(token.trailingTrivia().toArray(), this.getPosition() + remainingWidth);

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
}
