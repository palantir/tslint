/**
 * @license
 * Copyright 2015 Palantir Technologies, Inc.
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

import { isCallExpression, isIdentifier, isImportEqualsDeclaration } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-require-imports",
        description: "Disallows invocation of `require()`.",
        rationale: "Prefer the newer ES6-style imports over `require()`.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "require() style import is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isCallExpression(node)) {
            if (node.arguments.length !== 0 &&
                isIdentifier(node.expression) && node.expression.text === "require") {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        } else if (isImportEqualsDeclaration(node) &&
            node.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference) {
                ctx.addFailureAtNode(node.moduleReference, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
