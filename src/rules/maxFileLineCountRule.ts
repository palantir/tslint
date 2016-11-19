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
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-file-line-count",
        description: "Requires files to remain under a certain number of lines",
        rationale: Lint.Utils.dedent`
            Limiting the number of lines allowed in a file allows files to remain small, 
            single purpose, and maintainable.`,
        optionsDescription: "An integer indicating the maximum number of lines.",
        options: {
            type: "number",
            minimum: "1",
        },
        optionExamples: ["[true, 300]"],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (lineCount: number, lineLimit: number) => {
        let msg = `This file has ${lineCount} lines, which exceeds the maximum of ${lineLimit} lines allowed. `;
        msg += `Consider breaking this file up into smaller parts`;
        return msg;
    }

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            const option = this.getOptions().ruleArguments[0];
            if (typeof option === "number" && option > 0) {
                return true;
            }
        }
        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const ruleFailures: Lint.RuleFailure[] = [];
        const lineLimit: number = this.getOptions().ruleArguments[0];
        const lineCount: number = sourceFile.getLineStarts().length;
        const disabledIntervals = this.getOptions().disabledIntervals;

        if (lineCount > lineLimit && disabledIntervals.length === 0) {
            const errorString = Rule.FAILURE_STRING_FACTORY(lineCount, lineLimit);
            ruleFailures.push(new Lint.RuleFailure(sourceFile, 0, 1, errorString, this.getOptions().ruleName));
        }

        return ruleFailures;
    }
}
