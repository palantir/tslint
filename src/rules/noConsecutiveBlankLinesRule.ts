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
    public static FAILURE_STRING = "consecutive blank lines are disallowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConsecutiveBlankLinesWalker(sourceFile, this.getOptions()));
    }
}

class NoConsecutiveBlankLinesWalker extends Lint.SkippableTokenAwareRuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);

        // find all the lines that are blank or only contain whitespace
        let blankLineIndexes: number[] = [];
        node.getFullText().split(/\n/).forEach(function(txt, i){
            if (txt.trim() === "") {
                blankLineIndexes.push(i);
            }
        });

        // console.log("==================")
        // console.log("Blank or whitespace line numbers ", blankLineIndexes.map((n)=>n+1))

        // now only keep the found blank lines that are consecutive
        let consecutiveBlankLineStarts: number[] = [];
        for (let i = 0; i < blankLineIndexes.length; i++) {
            let diff = blankLineIndexes[i + 1] - blankLineIndexes[i];
            if (Math.abs(diff) === 1) {
                consecutiveBlankLineStarts.push(blankLineIndexes[i]);
            }
        }

        // now only keep the beginning number in each sequence of consecutive numbers
        let result: number[] = [];
        let temp: number[] = [];
        let difference: number;
        for (let i = 0; i < consecutiveBlankLineStarts.length; i += 1) {
            if (difference !== (consecutiveBlankLineStarts[i] - i)) {
                if (difference !== undefined) {
                    if (temp.length) {
                        result.push(temp[0]);
                        this.addFailure(this.createFailure(temp[0], 1, Rule.FAILURE_STRING));
                    }
                    temp = [];
                }
                difference = consecutiveBlankLineStarts[i] - i;
            }
            temp.push(consecutiveBlankLineStarts[i]);
        }

        if (temp.length > 0) {
            result.push(temp[0]);
            this.addFailure(this.createFailure(temp[0], 1, Rule.FAILURE_STRING));
        }

        // console.log("==================")
        // console.log("First lines of CONSECUTIVE blank or whitespace lines", result.map((n)=>n+1))
        // console.log("==================")
    }
}
