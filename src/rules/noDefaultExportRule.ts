/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

const OPTION_IGNORE_PATTERN = "ignore-pattern";

interface Options {
    ignorePattern: RegExp | undefined;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-default-export",
        description: "Disallows default exports in ES6-style modules.",
        descriptionDetails: "Use named exports instead.",
        rationale: Lint.Utils.dedent`
            Named imports/exports [promote clarity](https://github.com/palantir/tslint/issues/1182#issue-151780453).
            In addition, current tooling differs on the correct way to handle default imports/exports.
            Avoiding them all together can help avoid tooling bugs and conflicts.`,
        optionsDescription: Lint.Utils.dedent`
            An optional argument can be provided as an object with:

                * \`"${OPTION_IGNORE_PATTERN}"\`  - regex of files regexp patterns for which default export will be ignored.
            `,
        options: {
            type: "list",
            listType: {
                anyOf: [
                    {
                        type: "object",
                        properties: {
                            ignorePattern: {
                                type: "string",
                            },
                        },
                    },
                ],
            },
        },
        optionExamples: [
            [true, { ignorePattern: "\\.vue$", message: "Skip check for file patterns" }],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use of default exports is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

function parseOptions(options: any[]): Options {
    let ignorePattern: RegExp | undefined;
    for (const o of options) {
        if (typeof o === "object") {
            // tslint:disable-next-line no-unsafe-any no-null-undefined-union
            const ignore = o[OPTION_IGNORE_PATTERN] as string | null | undefined;
            if (ignore != undefined) {
                ignorePattern = new RegExp(ignore);
                break;
            }
        }
    }

    return { ignorePattern };
}

function walk(ctx: Lint.WalkContext<Options>) {
    if (
        ctx.sourceFile.isDeclarationFile ||
        !ts.isExternalModule(ctx.sourceFile) ||
        (ctx.options.ignorePattern !== undefined &&
            ctx.sourceFile.fileName.match(ctx.options.ignorePattern) !== null)
    ) {
        return;
    }
    for (const statement of ctx.sourceFile.statements) {
        if (statement.kind === ts.SyntaxKind.ExportAssignment) {
            if (!(statement as ts.ExportAssignment).isExportEquals) {
                ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING);
            }
        } else if (
            statement.modifiers !== undefined &&
            statement.modifiers.length >= 2 &&
            statement.modifiers[0].kind === ts.SyntaxKind.ExportKeyword &&
            statement.modifiers[1].kind === ts.SyntaxKind.DefaultKeyword
        ) {
            ctx.addFailureAtNode(statement.modifiers[1], Rule.FAILURE_STRING);
        }
    }
}
