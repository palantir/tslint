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

import { isConstructorDeclaration, isParameterProperty } from "tsutils";
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
            It's not necessary to manually add one in.
        `,
        ruleName: "unnecessary-constructor",
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "Remove unnecessary empty constructor.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const isEmptyConstructor = (node: ts.ConstructorDeclaration): boolean =>
    node.body !== undefined && node.body.statements.length === 0;

const containsConstructorParameter = (node: ts.ConstructorDeclaration): boolean =>
    // If this has any parameter properties
    node.parameters.some(isParameterProperty);

const isAccessRestrictingConstructor = (node: ts.ConstructorDeclaration): boolean =>
    // No modifiers implies public
    node.modifiers != undefined &&
    // If this has any modifier that isn't public, it's doing something
    node.modifiers.some(modifier => modifier.kind !== ts.SyntaxKind.PublicKeyword);

function walk(context: Lint.WalkContext) {
    const callback = (node: ts.Node): void => {
        if (
            isConstructorDeclaration(node) &&
            isEmptyConstructor(node) &&
            !containsConstructorParameter(node) &&
            !isAccessRestrictingConstructor(node)
        ) {
            context.addFailureAtNode(node, Rule.FAILURE_STRING);
        } else {
            ts.forEachChild(node, callback);
        }
    };

    return ts.forEachChild(context.sourceFile, callback);
}
