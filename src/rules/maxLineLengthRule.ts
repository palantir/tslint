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
import * as urlRegex from "url-regex";
import * as Lint from "..";

interface Options {
    limit: number;
    ignoreUrls: boolean;
}

const DEFAULT_LIMIT = 140;

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
            An integer indicating the max length of lines, or a configuration object with two
            properties: \`\"ignoreUrls\"\` and \`\"limit\"\`.
            `,
        options: {
            anyOf: [
                {
                    type: "number",
                },
                {
                    type: "object",
                    properties: {
                        limit: {
                            type: "number",
                            minimum: "1",
                        },
                        ignoreUrls: {
                            type: "boolean",
                        },
                    },
                },
            ],
        },
        optionExamples: [[true, 120], [true, { limit: 140, ignoreUrls: true }]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(lineLimit: number) {
        return `Exceeds maximum line length of ${lineLimit}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    for (const line of getLineRanges(ctx.sourceFile)) {
        if (line.contentLength > ctx.options.limit) {
            if (
                ctx.options.ignoreUrls &&
                hasUrl(line, ctx.sourceFile) &&
                lineLengthMinusUrl(line, ctx.sourceFile) < ctx.options.limit) {
                continue;
            }
            ctx.addFailureAt(
                line.pos,
                line.contentLength,
                Rule.FAILURE_STRING_FACTORY(ctx.options.limit),
            );
        }
    }
}

function hasUrl(line: LineRange, sourceFile: ts.SourceFile): boolean {
    return urlRegex().test(sourceFile
                            .text.substr(line.pos, line.contentLength));
}

function lineLengthMinusUrl(line: LineRange, sourceFile: ts.SourceFile): number {
    return sourceFile
            .text
            .substr(line.pos, line.contentLength)
            .replace(urlRegex(), "")
            .length;
}

function parseOptions(args: number[] | Options[]): Options {
    if (typeof args[0] === "number") {
        return { ignoreUrls: false, limit: args[0] as number };
    } else if (typeof args[0] === "object") {
        return {
            ignoreUrls: (args[0] as Options).ignoreUrls,
            limit: (args[0] as Options).limit,
        };
    }
    return { ignoreUrls: false, limit: DEFAULT_LIMIT };
}
