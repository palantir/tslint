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

import { getLineRanges, LineRange, getTokenAtPosition } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface MaxLineLengthRuleOptions {
    limit: number;
    ignorePattern?: RegExp;
    checkStrings?: boolean;
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
          * \`limit\` - number greater than 0 defining the max line length
          * \`ignore-pattern\` - string defining ignore pattern for this rule, being parsed by \`new RegExp()\`.
            For example:
             * \`\/\/ \` pattern will ignore all in-line comments.
             * \`^import \` pattern will ignore all import statements.
             * \`^export \{(.*?)\}\` pattern will ignore all multiple export statements.
             * \`class [a-zA-Z]+ implements \` pattern will ignore all class declarations implementing interfaces.
             * \`^import |^export \{(.*?)\}|class [a-zA-Z]+ implements |// \` pattern will ignore all the cases listed above.
          * \`check-strings\` - determines if strings should be checked, \`false\` by default.
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
                            limit: { type: "number" },
                            "ignore-pattern": { type: "string" },
                            "check-strings": { type: "boolean" }
                        }
                    }
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
                    limit: 120,
                    "ignore-pattern": "^import |^export {(.*?)}",
                },
            ],
            [
                true,
                {
                    limit: 120,
                    "check-strings": true
                }
            ]
        ],
        type: "formatting",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(lineLimit: number) {
        return `Exceeds maximum line length of ${lineLimit}`;
    }

    public isEnabled(): boolean {
        const limit = this.getRuleOptions().limit;
        return super.isEnabled() && limit > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions());
    }

    private getRuleOptions(): MaxLineLengthRuleOptions {
        const argument = this.ruleArguments[0];
        let options: MaxLineLengthRuleOptions = { limit: 0 };

        if (typeof argument === "number") {
            options.limit = argument;
        } else {
            const {
                "limit": limit,
                "ignore-pattern": ignorePattern,
                "check-strings": checkStrings
            } = argument as { 
                "limit": number,
                "ignore-pattern"?: string,
                "check-strings"?: boolean
             };

            options.limit = Number(limit);

            options.ignorePattern =
                typeof ignorePattern === "string" ? new RegExp(ignorePattern) : undefined;

            options.checkStrings = Boolean(checkStrings);
        }

        return options;
    }
}

function walk(ctx: Lint.WalkContext<MaxLineLengthRuleOptions>) {
    const { limit, ignorePattern, checkStrings } = ctx.options;

    getLineRanges(ctx.sourceFile)
        .filter(({ contentLength }: LineRange): boolean => contentLength > limit)
        .filter(
            ({ pos, contentLength }: LineRange): boolean => {
                let shouldIgnoreLine: boolean = false;

                if (ignorePattern !== undefined) {
                    shouldIgnoreLine =
                        shouldIgnoreLine ||
                        ignorePattern.test(ctx.sourceFile.text.substr(pos, contentLength));
                }

                if (!checkStrings) {
                    const nodeAtLimit: ts.Node | undefined = getTokenAtPosition(
                        ctx.sourceFile,
                        pos + limit,
                    );

                    if (nodeAtLimit) {
                        shouldIgnoreLine = shouldIgnoreLine || isPartOfStringOrTemplate(nodeAtLimit, ctx.sourceFile);
                    }
                }

                return !shouldIgnoreLine;
            },
        )
        .forEach(({ pos, contentLength }: LineRange) =>
            ctx.addFailureAt(pos, contentLength, Rule.FAILURE_STRING_FACTORY(limit)),
        );

    return;
}

function isPartOfStringOrTemplate(node: ts.Node, root: ts.Node): boolean {
    let nodeReference: ts.Node = node;

    while (nodeReference !== root) {
        if (
            ts.isStringLiteralLike(nodeReference) ||
            ts.isTemplateExpression(nodeReference)
        ) {
            return true;
        }

        nodeReference = nodeReference.parent;
    }

    return false;
}
