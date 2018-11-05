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

import { isLabeledStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "label-position",
        description: "Only allows labels in sensible locations.",
        descriptionDetails:
            "This rule only allows labels to be on `do/for/while/switch` statements.",
        rationale: Lint.Utils.dedent`
            Labels in JavaScript only can be used in conjunction with \`break\` or \`continue\`,
            constructs meant to be used for loop flow control. While you can theoretically use
            labels on any block statement in JS, it is considered poor code structure to do so.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "unexpected label on statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isLabeledStatement(node) && !isLabelable(node.statement)) {
            ctx.addFailureAtNode(node.label, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}

function isLabelable(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.SwitchStatement:
            return true;
        default:
            return false;
    }
}
