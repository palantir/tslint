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

import { isClassLikeDeclaration, isInterfaceDeclaration } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isPascalCased } from "../utils";

import { codeExamples } from "./code-examples/className.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "class-name",
        description: "Enforces PascalCased class and interface names.",
        rationale: Lint.Utils.dedent`
            Makes it easy to differentiate classes from regular variables at a glance.

            JavaScript and general programming convention is to refer to classes in PascalCase.
            It's confusing to use camelCase or other conventions for class names.
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Class name must be in pascal case";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            (isClassLikeDeclaration(node) && node.name !== undefined) ||
            isInterfaceDeclaration(node)
        ) {
            if (!isPascalCased(node.name!.text)) {
                ctx.addFailureAtNode(node.name!, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
