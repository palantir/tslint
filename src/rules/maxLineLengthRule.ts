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

import { getLineRanges } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-line-length",
        description: "Requires lines to be under a certain max length.",
        rationale: Lint.Utils.dedent`
            Limiting the length of a line of code improves code readability.
            It also makes comparing code side-by-side easier and improves compatibility with
            various editors, IDEs, and diff viewers.`,
        optionsDescription: "An integer indicating the max length of lines.",
        options: {
            type: "number",
            minimum: "1",
        },
        optionExamples: [[true, 120]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(lineLimit: number) {
        return `Exceeds maximum line length of ${lineLimit}`;
    }

    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments[0] as number > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments[0] as number);
    }
}

function walk(ctx: Lint.WalkContext<number>) {
    const limit = ctx.options;
    for (const line of getLineRanges(ctx.sourceFile)) {
        if (line.contentLength > limit) {
            ctx.addFailureAt(line.pos, line.contentLength, Rule.FAILURE_STRING_FACTORY(limit));
        }
    }
}
