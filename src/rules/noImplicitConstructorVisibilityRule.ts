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

import * as utils from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Forces specifying a visibility modifier for constructor statements.",
        options: null,
        optionsDescription: "Not configurable.",
        ruleName: "no-implicit-constructor-visibility",
        type: "style",
        typescriptOnly: true,
    };

    public static FAILURE_STRING = "Constructor visibility must be specified";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const isConstructorVisibilityDefined = (node: ts.ConstructorDeclaration): boolean =>
    node.modifiers !== undefined;

const createFix = (node: ts.ConstructorDeclaration): Lint.Replacement =>
    Lint.Replacement.appendText(node.getStart(), "public ");

function walk(context: Lint.WalkContext<void>) {
    const callback = (node: ts.Node): void => {
        if (utils.isConstructorDeclaration(node) && !isConstructorVisibilityDefined(node)) {
            context.addFailureAtNode(node.getFirstToken(), Rule.FAILURE_STRING, createFix(node));
        } else {
            ts.forEachChild(node, callback);
        }
    };

    return ts.forEachChild(context.sourceFile, callback);
}
