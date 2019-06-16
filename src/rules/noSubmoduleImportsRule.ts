/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
        ruleName: "no-submodule-imports",
        description: Lint.Utils.dedent`
            Disallows importing any submodule.`,
        rationale: Lint.Utils.dedent`
            Submodules of some packages are treated as private APIs and the import
            paths may change without deprecation periods. It's best to stick with
            top-level package exports.`,
        optionsDescription: "A list of whitelisted package or submodule names.",
        options: {
            type: "array",
            items: {
                type: "string",
            },
        },
        optionExamples: [
            true,
            [true, "rxjs", "@angular/platform-browser", "@angular/core/testing"],
        ],
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING =
        "Submodule import paths from this package are disallowed; import from the root instead";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}

function walk(ctx: Lint.WalkContext<string[]>) {
    for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
        if (
            !ts.isExternalModuleNameRelative(name.text) &&
            isSubmodulePath(name.text) &&
            !isWhitelisted(name.text, ctx.options)
        ) {
            ctx.addFailureAtNode(name, Rule.FAILURE_STRING);
        }
    }
}

function isWhitelisted(path: string, whitelist: string[]): boolean {
    for (const option of whitelist) {
        if (path === option || path.startsWith(`${option}/`)) {
            return true;
        }
    }
    return false;
}

function isSubmodulePath(path: string): boolean {
    return path.split("/").length > (path[0] === "@" ? 2 : 1);
}
