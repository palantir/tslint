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
        optionsDescription: Lint.Utils.dedent`It can take up to 2 arguments, but only first one is required:

        * integer indicating the max length of lines.
        * string defining ignore pattern, being parsed by \`new RegExp()\`.
        For example the \`^import \` pattern will ignore import statements.`,
        options: {
            type: "array",
            items: {
                type: "any",
            },
            minLength: "1",
            maxLength: "2",
        },
        optionExamples: [[true, 120], [true, 120, "^import "]],
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
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}

function walk(ctx: Lint.WalkContext<any[]>) {
    const limit = ctx.options[0];
    const ignorePattern = ctx.options[1] && new RegExp(ctx.options[1]);
    const lines = ctx.sourceFile.text.split("\n");
    const lineRanges = getLineRanges(ctx.sourceFile);
    for (let i = 0; i < lines.length; i++) {
        if (ignorePattern && ignorePattern.test(lines[i])) { continue; }
        if (lineRanges[i].contentLength <= limit) { continue; }
        ctx.addFailureAt(lineRanges[i].pos, lineRanges[i].contentLength, Rule.FAILURE_STRING_FACTORY(limit));
    }
}
