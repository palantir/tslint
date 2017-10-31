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

interface MaxLineLengthRuleOptions {
    limit: number;
    ignorePattern: RegExp | undefined;
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
          * \`limit\` - number < 0 defining max line length
          * \`ignore-pattern\` - string defining ignore pattern for this rule, being parsed by \`new RegExp()\`.
            For example:
             * \`\/\/ \` pattern will ignore all in-line comments.
             * \`^import \` pattern will ignore all import statements.
             * \`^export \{(.*?)\}\` pattern will ignore all multiple export statements.
             * \`class [a-zA-Z] implements \` pattern will ignore all class declarations implementing interfaces.
             * \`^import |^export \{(.*?)\}|class [a-zA-Z] implements |// \` pattern will ignore all the cases listed above.
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
                            "limit": {type: "number"},
                            "ignore-pattern": {type: "string"},
                        },
                        additionalProperties: false,
                    },
                ],
            },
            minLength: 1,
            maxLength: 2,
        },
        optionExamples: [[true, 120], [true, {
            "limit": 120,
            "ignore-pattern": "^import |^export \{(.*?)\}"}]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(lineLimit: number) {
        return `Exceeds maximum line length of ${lineLimit}`;
    }

    public isEnabled(): boolean {
        const argument = this.ruleArguments[0];
        const numberGreaterThan0: boolean = (Number(argument) > 0);
        const limitGreaterTHan0: boolean = (argument instanceof Object && argument.limit > 0);
        return super.isEnabled() && (numberGreaterThan0 || limitGreaterTHan0);
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const argument: any = this.ruleArguments[0];
        const options: MaxLineLengthRuleOptions = {
            ignorePattern: (typeof argument === "object") ? new RegExp(argument["ignore-pattern"]) : undefined,
            limit: (typeof argument !== "object") ? parseInt(argument, 10)
                : parseInt(argument.limit, 10),
        };
        return this.applyWithFunction(sourceFile, walk, options);
    }
}

function walk(ctx: Lint.WalkContext<MaxLineLengthRuleOptions>) {
    const limit = ctx.options.limit;
    const ignorePattern = ctx.options.ignorePattern;
    const lines = (ctx.sourceFile && ctx.sourceFile.text.split("\n") || []);
    const lineRanges = getLineRanges(ctx.sourceFile);
    for (let i = 0; i < lines.length; i++) {
        if (ignorePattern && ignorePattern.test(lines[i])) { continue; }
        if (lineRanges[i].contentLength <= limit) { continue; }
        ctx.addFailureAt(lineRanges[i].pos, lineRanges[i].contentLength, Rule.FAILURE_STRING_FACTORY(limit));
    }
}
