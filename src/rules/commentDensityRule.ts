/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import * as Lint from "../index";

// Logic
export class Rule extends Lint.Rules.AbstractRule {
    // tslint:disable:object-literal-sort-keys
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "comment-density",
        description: "Allows a minimum percentage of comment in the file",
        optionsDescription: Lint.Utils.dedent`
            Density of comment lines = Comment lines / (Lines of code + Comment lines) * 100
            With such a formula:
            50% means that the number of lines of code equals the number of comment lines
            100% means that the file only contains comment lines
        `,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                    minimum: 0
                }
            ],
            uniqueItems: true
        },
        optionExamples: [[true, 0], [true, 20]],
        hasFix: false,
        type: "style",
        typescriptOnly: true
    };

    public static FAILURE_STRING(lineCount: number, percentLimit: number) {
        return `This file has ${lineCount}% of comments, which is lower than the minimum of ${percentLimit}% allowed`;
    }

    public isEnabled(): boolean {
        return super.isEnabled() && (this.ruleArguments[0] as number) >= 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const minPercent = this.ruleArguments[0] as number;
        const lineCount = sourceFile.getLineStarts().length;
        let numberOfLinesOfComments = 0;

        utils.forEachComment(sourceFile, (fullText, { kind, pos, end }) => {
            if (
                kind === ts.SyntaxKind.SingleLineCommentTrivia ||
                kind === ts.SyntaxKind.MultiLineCommentTrivia
            ) {
                const substring = fullText.substring(pos, end);
                const splittedSubstring = substring.split("\n");
                numberOfLinesOfComments += splittedSubstring.length;
            }
        });
        const percentage = Math.round((numberOfLinesOfComments / lineCount) * 100);
        if (percentage >= minPercent) {
            return [];
        } else {
            const len = sourceFile.text.length;
            return [
                new Lint.RuleFailure(
                    sourceFile,
                    len - 1,
                    len,
                    Rule.FAILURE_STRING(percentage, minPercent),
                    this.ruleName
                )
            ];
        }
    }
}
