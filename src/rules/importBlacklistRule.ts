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

import { findImports, ImportKind } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "import-blacklist",
        description: Lint.Utils.dedent`
            Disallows importing the specified modules directly via \`import\` and \`require\`.`,
        rationale: Lint.Utils.dedent`
            Some projects may wish to exclude imports matching certain patterns.

            Examples:
            ^loadsh$ Blacklist any import of the entire lodash module.
            Since lodash allows importing submodules, a better practice
            would be to import the desired submodule instead.

            .*\\.temp$ Blacklist any imports ending in .temp`,
        optionsDescription: Lint.Utils.dedent`
            A list of blacklist pattern strings to be compiled to regular expressions.
            The corresponding regular expressions will be tested against the imports.`,
        options: {
            type: "array",
            items: {
                type: "string",
            },
            minLength: 1,
        },
        optionExamples: [true, [true, "^rxjs$", "^lodash$", ".*\\.temp$"]],
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "This import is blacklisted by ";

    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments.length > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}

function walk(ctx: Lint.WalkContext<string[]>) {
    const regexOptions = [];
    for (const option of ctx.options) {
        if (typeof option === "string") {
            regexOptions.push(RegExp(option));
        }
    }
    for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
        for (const regex of regexOptions) {
            if (regex.test(name.text)) {
                ctx.addFailure(name.getStart(ctx.sourceFile) + 1, name.end - 1, Rule.FAILURE_STRING + regex.toString());
            }
        }
    }
}
