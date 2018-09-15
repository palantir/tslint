/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import { findImports, ImportKind, isNamedImports } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "import-blacklist",
        description: Lint.Utils.dedent`
            Disallows importing the specified module or only certain imports from module via \`import\` and \`require\`.
        `,
        rationale: Lint.Utils.dedent`
            Some libraries allow importing their submodules instead of the entire module.
            This is good practise as it avoids loading unused modules.`,
        optionsDescription: "A list of blacklisted modules.",
        options: {
            type: "array",
            items: [
                {
                    type: "string"
                },
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        importNames: { type: "array", items: { type: "string " } },
                        message: { type: "string" }
                    }
                }
            ],
            minLength: 1
        },
        optionExamples: [
            true,
            [true, "rxjs", "lodash"],
            [
                true,
                "rxjs",
                { name: "underscore", message: "Please use lodash" },
                {
                    name: "react-intl",
                    importNames: ["FormattedHtmlMessage"],
                    message: "Please use react-intl-phraseapp"
                }
            ]
        ],
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_IMPORT_STRING = "This import is blacklisted, import a submodule instead";
    public static FAILURE_IMPORT_NAME_STRING = "This import name is blacklisted";

    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments.length > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}

interface ImportBlacklistObjectOption {
    name: string;
    importNames?: string[];
    message?: string;
}

function walk(ctx: Lint.WalkContext<Array<string | ImportBlacklistObjectOption>>) {
    for (const importName of findImports(ctx.sourceFile, ImportKind.All)) {
        for (const option of ctx.options) {
            if (typeof option === "string") {
                if (importName.text === option) {
                    ctx.addFailure(
                        importName.getStart(ctx.sourceFile) + 1,
                        importName.end - 1,
                        Rule.FAILURE_IMPORT_STRING
                    );
                }
            } else {
                if (importName.text === option.name) {
                    const { importClause } = importName.parent as ts.ImportDeclaration;

                    if (option.importNames !== undefined) {
                        if (
                            importClause !== undefined &&
                            importClause.namedBindings !== undefined &&
                            isNamedImports(importClause.namedBindings)
                        ) {
                            const namedBindings = importClause.namedBindings;

                            for (const importSpecifier of namedBindings.elements) {
                                const name = importSpecifier.name;

                                if (option.importNames.indexOf(name.text) !== -1) {
                                    ctx.addFailure(
                                        name.getStart(ctx.sourceFile),
                                        name.end,
                                        option.message || Rule.FAILURE_IMPORT_NAME_STRING
                                    );
                                }
                            }
                        }
                    } else {
                        ctx.addFailure(
                            importName.getStart(ctx.sourceFile) + 1,
                            importName.end - 1,
                            option.message || Rule.FAILURE_IMPORT_STRING
                        );
                    }
                }
            }
        }
    }
}
