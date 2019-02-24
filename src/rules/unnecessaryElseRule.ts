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

import { codeExamples } from "./code-examples/unnecessaryElse.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        description: Lint.Utils.dedent`
        Disallows \`else\` blocks following \`if\` blocks ending with a \`break\`, \`continue\`, \`return\`, or \`throw\` statement.`,
        descriptionDetails: "",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent`
        When an \`if\` block is guaranteed to exit control flow when entered,
        it is unnecessary to add an \`else\` statement.
        The contents that would be in the \`else\` block can be placed after the end of the \`if\` block.`,
        ruleName: "unnecessary-else",
        type: "functionality",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:disable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string): string {
        return `The preceding \`if\` block ends with a \`${name}\` statement. This \`else\` block is unnecessary.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (utils.isIfStatement(node)) {
            let jumpStatement;
            if (
                node.thenStatement.kind !== ts.SyntaxKind.Block &&
                !utils.isSameLine(ctx.sourceFile, node.thenStatement.pos, node.thenStatement.end)
            ) {
                jumpStatement = getJumpStatement(
                    node.thenStatement.getChildAt(0, ctx.sourceFile).parent,
                );
            } else if (
                utils.isSameLine(ctx.sourceFile, node.thenStatement.pos, node.thenStatement.end)
            ) {
                jumpStatement = getJumpStatement(node.thenStatement);
            } else {
                jumpStatement = getJumpStatement(getLastStatement(node.thenStatement as ts.Block));
            }
            if (jumpStatement !== undefined && node.elseStatement !== undefined) {
                const elseKeyword = getPositionOfElseKeyword(node, ts.SyntaxKind.ElseKeyword);
                ctx.addFailureAtNode(elseKeyword, Rule.FAILURE_STRING(jumpStatement));
            }
            ts.forEachChild(node.expression, cb);
            ts.forEachChild(node.thenStatement, cb);
            if (node.elseStatement !== undefined) {
                ts.forEachChild(node.elseStatement, cb);
            }
        } else {
            return ts.forEachChild(node, cb);
        }
    });
}

function getPositionOfElseKeyword(node: ts.Node, kind: ts.SyntaxKind) {
    return node.getChildren().filter(child => child.kind === kind)[0];
}

function getJumpStatement(node: ts.Statement | ts.Node): string | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.BreakStatement:
            return "break";
        case ts.SyntaxKind.ContinueStatement:
            return "continue";
        case ts.SyntaxKind.ThrowStatement:
            return "throw";
        case ts.SyntaxKind.ReturnStatement:
            return "return";
        default:
            return undefined;
    }
}

function getLastStatement(clause: ts.Block): ts.Statement {
    const block = clause.statements[0];
    const statements =
        clause.statements.length === 1 && utils.isBlock(block)
            ? block.statements
            : clause.statements;

    return last(statements);
}

function last<T>(arr: ReadonlyArray<T>): T {
    return arr[arr.length - 1];
}
