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

    public static FAILURE_STRING = (className?: string) => {
        let message =
            "`this` usage in static context could be a potential reason of runtime errors.";
        if (className !== undefined) {
            /* tslint:disable-next-line:prefer-template */
            message = "`this` should be replaced with `" + className + "`.";
        }

        return message;
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    let currentParentClass: ts.ClassLikeDeclaration | undefined;

    const cb = (node: ts.Node): void => {
        const originalParentClass = currentParentClass;

        if (
            utils.isClassLikeDeclaration(node.parent) &&
            utils.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)
        ) {
            currentParentClass = node.parent;
            ts.forEachChild(node, cb);
            currentParentClass = originalParentClass;
        }

        if (node.kind === ts.SyntaxKind.ThisKeyword && currentParentClass) {
            let className: string | undefined;
            if (currentParentClass.name !== undefined) {
                className = currentParentClass.name.text;
            }

            const fix = className
                ? Lint.Replacement.replaceNode(node, className)
                : undefined;

            ctx.addFailureAtNode(node, Rule.FAILURE_STRING(className), fix);
            return;
        }

        ts.forEachChild(node, cb);
    };

    ts.forEachChild(ctx.sourceFile, cb);
}
