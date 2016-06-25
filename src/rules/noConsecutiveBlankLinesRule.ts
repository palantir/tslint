/**
 * @license
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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-consecutive-blank-lines",
        description: "Disallows more than one blank line in a row.",
        rationale: "Helps maintain a readable style in your codebase.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Consecutive blank lines are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConsecutiveBlankLinesWalker(sourceFile, this.getOptions()));
    }
}

class NoConsecutiveBlankLinesWalker extends Lint.SkippableTokenAwareRuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);

        const sourceFileText = node.getFullText();
        const soureFileLines = sourceFileText.split(/\n/);

        // find all the lines that are blank or only contain whitespace
        let blankLineIndexes: number[] = [];
        soureFileLines.forEach(function(txt, i){
            if (txt.trim() === "") {
                blankLineIndexes.push(i);
            }
        });

        // now only throw failures for the fisrt number from groups of consecutive blank line indexes
        const sequences: number[][] = [];
        let lastVal = -2;
        for (const line of blankLineIndexes) {
            line > lastVal + 1 ? sequences.push([line]) : sequences[sequences.length - 1].push(line);
            lastVal = line;
        }
        sequences
            .filter((arr) => arr.length > 1).map((arr) => arr[0])
            .forEach((startLineNum: number) => {
                let startCharPos = node.getPositionOfLineAndCharacter(startLineNum + 1, 0);
                this.addFailure(this.createFailure(startCharPos, 1, Rule.FAILURE_STRING));
            });
    }
}
