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

import { getLineRanges, LineRange } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface Options {
    limit: number;
    ignoreUrls: boolean;
}

const OPTION_IGNORE_URL = "ignore-urls";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-line-length",
        description: "Requires lines to be under a certain max length.",
        rationale: Lint.Utils.dedent`
            Limiting the length of a line of code improves code readability.
            It also makes comparing code side-by-side easier and improves compatibility with
            various editors, IDEs, and diff viewers.`,
        optionsDescription: Lint.Utils.dedent`
            An integer indicating the max length of lines. Additionally, the \`\"ignore-urls\"\` option
            can be passed to ignore lines with long URLs.
            `,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                    minimum: "1",
                },
                {
                    type: "string",
                    enum: [OPTION_IGNORE_URL],
                },
            ],
        },
        optionExamples: [[true, 120], [true, 140, "ignore-urls"]],
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
        return this.applyWithFunction(sourceFile, walk, {
            ignoreUrls: this.ruleArguments.indexOf(OPTION_IGNORE_URL) > -1,
            limit: this.ruleArguments[0] as number,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    for (const line of getLineRanges(ctx.sourceFile)) {
        if (line.contentLength > ctx.options.limit) {
            if (ctx.options.ignoreUrls) {               //
                if (hasUrl(line, ctx.sourceFile)) {     // To minimize regex searches
                    continue;
                }
            }
            ctx.addFailureAt(line.pos, line.contentLength, Rule.FAILURE_STRING_FACTORY(ctx.options.limit));
        }
    }
}

function hasUrl(line: LineRange, sourceFile: ts.SourceFile): boolean {
    const lineText = sourceFile.text.substr(line.pos, line.contentLength);
    const forUrl = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return lineText.search(forUrl) > -1;
}
