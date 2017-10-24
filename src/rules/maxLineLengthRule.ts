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
    ignoreLongUrls: boolean;
}

const DEFAULT_LIMIT = 140;
const URL_REGEX = urlRegex();

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
            properties:  \`\"limit\"\` and \`\"ignoreLongUrls\"\`. A URL is considered "long" if
            its length exceeds half of the configured limit.

            If no configuration is provided, a default limit of 140 is used.
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
                        ignoreLongUrls: {
                            type: "boolean",
                        },
                    },
                },
            ],
        },
        optionExamples: [[true, 120], [true, { limit: 140, ignoreLongUrls: true }]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(lineLimit: number) {
        return `Exceeds maximum line length of ${lineLimit}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile, walk, parseOptions(
                this.ruleArguments[0] as number | Options,
            ),
        );
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    for (const line of getLineRanges(ctx.sourceFile)) {
        if (
            line.contentLength > ctx.options.limit &&
            !(
                ctx.options.ignoreLongUrls &&
                hasUrl(line, ctx.sourceFile) &&
                lineLengthMinusUrl(
                    line,
                    ctx.sourceFile,
                    Math.round(ctx.options.limit / 2),
                ) <= ctx.options.limit
            )
        ) {
            ctx.addFailureAt(
                line.pos,
                line.contentLength,
                Rule.FAILURE_STRING_FACTORY(ctx.options.limit),
            );
        }
    }
}

function buildOptions(options: Partial<Options>): Options {
    return {
        ignoreLongUrls:
            options.ignoreLongUrls === undefined
                ? false
                : options.ignoreLongUrls,
        limit: options.limit === undefined ? DEFAULT_LIMIT : options.limit,
    };
}

function hasUrl(line: LineRange, sourceFile: ts.SourceFile): boolean {
    return URL_REGEX.test(sourceFile.text.substr(line.pos, line.contentLength));
}

function isOptions(arg: number | Options): arg is Options {
    return (
        (arg as Options).limit !== undefined ||
        (arg as Options).ignoreLongUrls !== undefined
    );
}

function lineLengthMinusUrl(
    line: LineRange,
    sourceFile: ts.SourceFile,
    minUrlLength: number,
): number {
    let longUrlLength = 0;
    const lineText = sourceFile.text.substr(line.pos, line.contentLength);
    for (const url of lineText.match(URL_REGEX)!) {
        if (url.length >= minUrlLength) {
            longUrlLength += url.length;
        }
    }
    return lineText.length - longUrlLength;
}

function parseOptions(args: number | Options): Options {
    return isOptions(args)
        ? buildOptions(args)
        : buildOptions({ limit: args });
}
