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

import { getLineRanges, getTokenAtPosition, LineRange } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_LIMIT = "limit";
const OPTION_IGNORE_PATTERN = "ignore-pattern";
const OPTION_CHECK_STRINGS = "check-strings";
const OPTION_CHECK_REGEX = "check-regex";

interface MaxLineLengthRuleOptions {
    limit: number;
    ignorePattern?: RegExp;
    checkStrings?: boolean;
    checkRegex?: boolean;
}

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
        It can take one argument, which can be any of the following:
        * integer indicating maximum length of lines.
        * object with keys:
          * \`${OPTION_LIMIT}\` - number greater than 0 defining the max line length
          * \`${OPTION_IGNORE_PATTERN}\` - string defining ignore pattern for this rule, being parsed by \`new RegExp()\`.
            For example:
             * \`\/\/ \` pattern will ignore all in-line comments.
             * \`^import \` pattern will ignore all import statements.
             * \`^export \{(.*?)\}\` pattern will ignore all multiple export statements.
             * \`class [a-zA-Z]+ implements \` pattern will ignore all class declarations implementing interfaces.
             * \`^import |^export \{(.*?)\}|class [a-zA-Z]+ implements |// \` pattern will ignore all the cases listed above.
          * \`${OPTION_CHECK_STRINGS}\` - determines if strings should be checked, \`false\` by default.
          * \`${OPTION_CHECK_REGEX}\` - determines if regular expressions should be checked, \`false\` by default.
         `,
        options: {
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "number",
                    },
                    {
                        type: "object",
                        properties: {
                            [OPTION_LIMIT]: { type: "number" },
                            [OPTION_IGNORE_PATTERN]: { type: "string" },
                            [OPTION_CHECK_STRINGS]: { type: "boolean" },
                            [OPTION_CHECK_REGEX]: { type: "boolean" },
                        },
                        additionalProperties: false,
                    },
                ],
            },
            minLength: 1,
            maxLength: 2,
        },
        optionExamples: [
            [true, 120],
            [
                true,
                {
                    [OPTION_LIMIT]: 120,
                    [OPTION_IGNORE_PATTERN]: "^import |^export {(.*?)}",
                    [OPTION_CHECK_STRINGS]: true,
                    [OPTION_CHECK_REGEX]: true,
                },
            ],
        ],
        type: "formatting",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(lineLimit: number) {
        return `Exceeds maximum line length of ${lineLimit}`;
    }

    public isEnabled(): boolean {
        const limit = this.getRuleOptions()[OPTION_LIMIT];
        return super.isEnabled() && limit > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions());
    }

    private getRuleOptions(): MaxLineLengthRuleOptions {
        const argument = this.ruleArguments[0] as { [key: string]: any } | number;

        if (typeof argument === "number") {
            return { limit: argument };
        } else {
            const {
                [OPTION_CHECK_REGEX]: checkRegex,
                [OPTION_CHECK_STRINGS]: checkStrings,
                [OPTION_IGNORE_PATTERN]: ignorePattern,
                [OPTION_LIMIT]: limit,
            } = argument;

            return {
                checkRegex: Boolean(checkRegex),
                checkStrings: Boolean(checkStrings),
                ignorePattern:
                    typeof ignorePattern === "string" ? new RegExp(ignorePattern) : undefined,
                limit: Number(limit),
            };
        }
    }
}

function walk(ctx: Lint.WalkContext<MaxLineLengthRuleOptions>) {
    const { limit } = ctx.options;

    getLineRanges(ctx.sourceFile)
        .filter(
            (line: LineRange): boolean =>
                line.contentLength > limit && !shouldIgnoreLine(line, ctx),
        )
        .forEach(({ pos, contentLength }: LineRange) =>
            ctx.addFailureAt(pos, contentLength, Rule.FAILURE_STRING_FACTORY(limit)),
        );

    return;
}

function shouldIgnoreLine(
    { pos, contentLength }: LineRange,
    { options, sourceFile }: Lint.WalkContext<MaxLineLengthRuleOptions>,
): boolean {
    const { checkRegex, checkStrings, ignorePattern, limit } = options;

    let shouldOmitLine = false;

    if (ignorePattern !== undefined) {
        shouldOmitLine =
            shouldOmitLine || ignorePattern.test(sourceFile.text.substr(pos, contentLength));
    }

    if (!checkStrings) {
        const nodeAtLimit: ts.Node | undefined = getTokenAtPosition(sourceFile, pos + limit);

        if (nodeAtLimit !== undefined) {
            shouldOmitLine =
                shouldOmitLine ||
                nodeAtLimit.kind === ts.SyntaxKind.StringLiteral ||
                nodeAtLimit.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
                hasParentMatchingTypes(nodeAtLimit, sourceFile, [ts.SyntaxKind.TemplateExpression]);
        }
    }

    if (!checkRegex) {
        const nodeAtLimit: ts.Node | undefined = getTokenAtPosition(sourceFile, pos + limit);

        if (nodeAtLimit !== undefined) {
            shouldOmitLine =
                shouldOmitLine || nodeAtLimit.kind === ts.SyntaxKind.RegularExpressionLiteral;
        }
    }

    return shouldOmitLine;
}

function hasParentMatchingTypes(
    node: ts.Node,
    root: ts.Node,
    parentTypes: ts.SyntaxKind[],
): boolean {
    let nodeReference: ts.Node = node;

    while (nodeReference !== root) {
        if (parentTypes.indexOf(nodeReference.kind) >= 0) {
            return true;
        }

        nodeReference = nodeReference.parent;
    }

    return false;
}
