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
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        description: Lint.Utils.dedent`
            Disallows else block when the If block contains control flow statements, such as \`return\`, \`continue\`,
            \`break\` or \`throw\`.`,
        descriptionDetails: "",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent`
            When control flow statements,
            such as \`return\`, \`continue\`, \`break\` or \`throw\` is written inside \`if\` block,
            Then \`else\` block becomes unnecessary.`,
        ruleName: "no-unnecessary-else",
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:disable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string): string {
        return `If block contains \`${name}\` statement. Consider replacing the contents of else block outside of the block.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

type JumpStatement =
    | ts.BreakStatement
    | ts.ContinueStatement
    | ts.ThrowStatement
    | ts.ReturnStatement;

function walk(ctx: Lint.WalkContext<void>): void {
    let inElse = false;
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.IfStatement:
                const { thenStatement, elseStatement } = node as ts.IfStatement;
                if (elseStatement !== undefined) {
                    inElse = true;
                }
                ts.forEachChild(thenStatement, cb);
                break;

            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ContinueStatement:
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.ReturnStatement:
                if (inElse) {
                    ctx.addFailureAtNode(
                        node,
                        Rule.FAILURE_STRING(printJumpKind(node as JumpStatement)),
                    );
                    inElse = false;
                }
                break;

            default:
                return ts.forEachChild(node, cb);
        }
    });
}

function printJumpKind(node: JumpStatement): string {
    switch (node.kind) {
        case ts.SyntaxKind.BreakStatement:
            return "break";
        case ts.SyntaxKind.ContinueStatement:
            return "continue";
        case ts.SyntaxKind.ThrowStatement:
            return "throw";
        case ts.SyntaxKind.ReturnStatement:
            return "return";
    }
}
