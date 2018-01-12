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

import { isConstructorDeclaration } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Prevents blank constructors, as they are redundant.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent`
            JavaScript implicitly adds a blank constructor when there isn't one.
            It's not necessary to manually one in.
        `,
        ruleName: "no-unnecessary-constructor",
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "There's no need to add an empty constructor to a class.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const isEmptyConstructor = (node: ts.ConstructorDeclaration): boolean =>
    node.parameters.length === 0 && node.body !== undefined && node.body.statements.length === 0;

const createFix = (node: ts.ConstructorDeclaration): Lint.Replacement =>
    Lint.Replacement.deleteFromTo(node.pos, node.end);

function walk(context: Lint.WalkContext<void>) {
    const callback = (node: ts.Node): void => {
        if (isConstructorDeclaration(node) && isEmptyConstructor(node)) {
            context.addFailureAtNode(node, Rule.FAILURE_STRING, createFix(node));
        } else {
            ts.forEachChild(node, callback);
        }
    };

    return ts.forEachChild(context.sourceFile, callback);
}
