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
        ruleName: "no-reference-import",
        description: 'Don\'t `<reference types="foo" />` if you import `foo` anyway.',
        optionsDescription: "Not configurable.",
        options: null,
        type: "style",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(moduleReference: string): string {
        return `No need to reference "${moduleReference}", since it is imported.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    if (ctx.sourceFile.typeReferenceDirectives.length === 0) {
        return;
    }
    const imports = new Set(
        findImports(ctx.sourceFile, ImportKind.AllStaticImports).map(name => name.text)
    );
    for (const ref of ctx.sourceFile.typeReferenceDirectives) {
        if (imports.has(ref.fileName)) {
            ctx.addFailure(ref.pos, ref.end, Rule.FAILURE_STRING(ref.fileName));
        }
    }
}
