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

import {
    collectVariableUsage,
    getDeclarationOfBindingElement,
    isReassignmentTarget,
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-parameter-reassignment",
        description: "Disallows reassigning parameters.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string) {
        return `Reassigning parameter '${name}' is forbidden.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    collectVariableUsage(ctx.sourceFile).forEach((variable, identifier) => {
        if (!isParameter(identifier.parent)) {
            return;
        }
        for (const use of variable.uses) {
            if (isReassignmentTarget(use.location)) {
                ctx.addFailureAtNode(use.location, Rule.FAILURE_STRING(identifier.text));
            }
        }
    });
}

function isParameter(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.Parameter:
            return true;
        case ts.SyntaxKind.BindingElement:
            return (
                getDeclarationOfBindingElement(node as ts.BindingElement).kind ===
                ts.SyntaxKind.Parameter
            );
        default:
            return false;
    }
}
