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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_TRIM_LEFT_PATTERN = "trim-left-pattern";

export class Rule extends Lint.Rules.AbstractRule {
    public static DEFAULT_ALLOWED_BLANKS = 1;

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-consecutive-blank-lines",
        description: "Disallows one or more blank lines in a row.",
        hasFix: true,
        rationale: Lint.Utils.dedent`
            Helps maintain a readable style in your codebase.

            Extra blank lines take up extra space and add little to a semantic understanding of the code.
            It can be harder to read through files when fewer components can fit into the screen.
            If you find a file is so large you feel a need to split them up with extra blank lines or comments,
            consider splitting your file into smaller files.
        `,
        optionsDescription: Lint.Utils.dedent`
            Two arguments may be optionally provided:
            
            An optional number of maximum allowed sequential blanks can be specified. If no value
            is provided, a default of ${Rule.DEFAULT_ALLOWED_BLANKS} will be used.
            
            An optional object can be provided with:

                * \`"${OPTION_TRIM_LEFT_PATTERN}"\`  - regex of files patterns which blank lines at the start of the file will be ignored. This can be used to ignore blank lines in .vue templates.
            `,
        options: {
            type: "list",
            listType: {
                anyOf: [
                    {
                        type: "number",
                        minimum: "1",
                    },
                    {
                        type: "object",
                        properties: {
                            trimLeftPattern: {
                                type: "string",
                            },
                        },
                    },
                ],
            },
        },
        optionExamples: [true, [true, 2], [true, 2, { [OPTION_TRIM_LEFT_PATTERN]: "\\.vue$" }]],
        type: "formatting",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(allowed: number) {
        return allowed === 1
            ? "Consecutive blank lines are forbidden"
            : `Exceeds the ${allowed} allowed consecutive blank lines`;
    }

    /**
     * Disable the rule if the option is provided but non-numeric or less than the minimum.
     */
    public isEnabled(): boolean {
        const option = this.ruleArguments[0] as number | undefined;
        return super.isEnabled() && (option === undefined || option > 0);
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}


interface Options {
    limit: number;
    trimLeftPattern: RegExp | undefined;
}

function parseOptions(options: any[]): Options {
    let trimLeftPattern: RegExp | undefined;
    let limitStart: number | undefined;
    for (const o of options) {
        if (typeof o === "object") {
            // tslint:disable-next-line no-unsafe-any no-null-undefined-union
            const ignore = o[OPTION_TRIM_LEFT_PATTERN] as string | null | undefined;
            if (ignore != undefined) {
                trimLeftPattern = new RegExp(ignore);
                break;
            }
        } else if (typeof o === "number") {
            limitStart = o;
        }
    }
    const limit: number =
        limitStart !== undefined ? (limitStart as number) : Rule.DEFAULT_ALLOWED_BLANKS;
    return { trimLeftPattern, limit };
}

function walk(ctx: Lint.WalkContext<Options>) {
    const sourceText = ctx.sourceFile.text;
    const threshold = ctx.options.limit + 1;
    const possibleFailures: ts.TextRange[] = [];
    let consecutiveBlankLines = 0;

    const lineRanges = utils.getLineRanges(ctx.sourceFile);
    if (ctx.options.trimLeftPattern && ctx.sourceFile.fileName.match(ctx.options.trimLeftPattern)) {
        const deleteCount = sourceText.search(/\w+/g);
        if (deleteCount > 0) {
            lineRanges.splice(0, deleteCount);
        }
    }

    for (const line of lineRanges) {
        if (
            line.contentLength === 0 ||
            sourceText.substr(line.pos, line.contentLength).search(/\S/) === -1
        ) {
            ++consecutiveBlankLines;
            if (consecutiveBlankLines === threshold) {
                possibleFailures.push({
                    end: line.end,
                    pos: line.pos,
                });
            } else if (consecutiveBlankLines > threshold) {
                possibleFailures[possibleFailures.length - 1].end = line.end;
            }
        } else {
            consecutiveBlankLines = 0;
        }
    }

    if (possibleFailures.length === 0) {
        return;
    }
    const failureString = Rule.FAILURE_STRING_FACTORY(ctx.options.limit);
    const templateRanges = getTemplateRanges(ctx.sourceFile);
    for (const possibleFailure of possibleFailures) {
        if (
            !templateRanges.some(
                template =>
                    template.pos < possibleFailure.pos && possibleFailure.pos < template.end,
            )
        ) {
            ctx.addFailureAt(possibleFailure.pos, 1, failureString, [
                Lint.Replacement.deleteFromTo(
                    // special handling for fixing blank lines at the end of the file
                    // to fix this we need to cut off the line break of the last allowed blank line, too
                    possibleFailure.end === sourceText.length
                        ? getStartOfLineBreak(sourceText, possibleFailure.pos)
                        : possibleFailure.pos,
                    possibleFailure.end,
                ),
            ]);
        }
    }
}

function getStartOfLineBreak(sourceText: string, pos: number) {
    return sourceText[pos - 2] === "\r" ? pos - 1 : pos - 1;
}

export function getTemplateRanges(sourceFile: ts.SourceFile): ts.TextRange[] {
    const intervals: ts.TextRange[] = [];
    const cb = (node: ts.Node): void => {
        if (
            node.kind >= ts.SyntaxKind.FirstTemplateToken &&
            node.kind <= ts.SyntaxKind.LastTemplateToken
        ) {
            intervals.push({
                end: node.end,
                pos: node.getStart(sourceFile),
            });
        } else {
            return ts.forEachChild(node, cb);
        }
    };
    ts.forEachChild(sourceFile, cb);
    return intervals;
}
