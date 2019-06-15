/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { Replacement } from "../language/rule/rule";

import { codeExamples } from "./code-examples/staticThis.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "static-this",
        description: "Ban the use of `this` in static methods.",
        hasFix: true,
        options: null,
        optionsDescription: "",
        optionExamples: [true],
        /* tslint:disable:max-line-length */
        rationale: Lint.Utils.dedent`
            Static \`this\` usage can be confusing for newcomers.
            It can also become imprecise when used with extended classes when a static \`this\` of a parent class no longer specifically refers to the parent class.
        `,
        /* tslint:enable:max-line-length */
        type: "functionality",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Use the parent class name instead of `this` when in a `static` context.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext) {
    let currentParentClass: ts.ClassLikeDeclaration | undefined;

    const cb = (node: ts.Node): void => {
        const originalParentClass = currentParentClass;

        if (utils.isClassLikeDeclaration(node.parent)) {
            currentParentClass = undefined;

            if (utils.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
                currentParentClass = node.parent;
            }

            ts.forEachChild(node, cb);
            currentParentClass = originalParentClass;

            return;
        }

        if (node.kind === ts.SyntaxKind.ThisKeyword && currentParentClass !== undefined) {
            let fix: Replacement | undefined;
            if (currentParentClass.name !== undefined) {
                fix = Lint.Replacement.replaceNode(node, currentParentClass.name.text);
            }

            ctx.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
            return;
        }

        ts.forEachChild(node, cb);
    };

    ts.forEachChild(ctx.sourceFile, cb);
}
