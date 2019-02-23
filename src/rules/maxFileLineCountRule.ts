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
        optionExamples: [[true, 300]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(lineCount: number, lineLimit: number) {
        return (
            `This file has ${lineCount} lines, which exceeds the maximum of ${lineLimit} lines allowed. ` +
            "Consider breaking this file up into smaller parts"
        );
    }

    public isEnabled(): boolean {
        return super.isEnabled() && (this.ruleArguments[0] as number) > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const lineLimit = this.ruleArguments[0] as number;
        const lineCount = sourceFile.getLineStarts().length;
        if (lineCount <= lineLimit) {
            return [];
        }

        const len = sourceFile.text.length;
        return [
            new Lint.RuleFailure(
                sourceFile,
                len - 1,
                len,
                Rule.FAILURE_STRING(lineCount, lineLimit),
                this.ruleName,
            ),
        ];
    }
}
