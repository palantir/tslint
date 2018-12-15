/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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
import { isFunctionScopeBoundary } from "../utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unsafe-finally",
        description: Lint.Utils.dedent`
            Disallows control flow statements, such as \`return\`, \`continue\`,
            \`break\` and \`throws\` in finally blocks.`,
        descriptionDetails: "",
        rationale: Lint.Utils.dedent`
            When used inside \`finally\` blocks, control flow statements,
            such as \`return\`, \`continue\`, \`break\` and \`throws\`
            override any other control flow statements in the same try/catch scope.
            This is confusing and unexpected behavior.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string): string {
        return `'${name}' statements in finally blocks are forbidden.`;
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
    let inFinally = false;
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.TryStatement:
                const { tryBlock, catchClause, finallyBlock } = node as ts.TryStatement;
                ts.forEachChild(tryBlock, cb);
                if (catchClause !== undefined) {
                    ts.forEachChild(catchClause, cb);
                }
                if (finallyBlock !== undefined) {
                    const old = inFinally;
                    inFinally = true;
                    cb(finallyBlock);
                    inFinally = old;
                }
                break;

            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ContinueStatement:
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.ReturnStatement:
                if (inFinally && !jumpIsLocalToFinallyBlock(node as JumpStatement)) {
                    ctx.addFailureAtNode(
                        node,
                        Rule.FAILURE_STRING(printJumpKind(node as JumpStatement)),
                    );
                }
            // falls through

            default:
                return ts.forEachChild(node, cb);
        }
    });
}

function jumpIsLocalToFinallyBlock(jump: JumpStatement): boolean {
    const isBreakOrContinue = utils.isBreakOrContinueStatement(jump);
    const label = isBreakOrContinue ? (jump as ts.BreakOrContinueStatement).label : undefined;

    let node: ts.Node = jump;
    // This should only be called inside a finally block, so we'll eventually reach the TryStatement case and return.
    while (true) {
        const parent = node.parent;
        switch (parent.kind) {
            case ts.SyntaxKind.TryStatement:
                if ((parent as ts.TryStatement).finallyBlock === node) {
                    return false;
                }
                break;

            case ts.SyntaxKind.SwitchStatement:
                if (jump.kind === ts.SyntaxKind.BreakStatement && label === undefined) {
                    return true;
                }
                break;

            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement:
            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.DoStatement:
                if (isBreakOrContinue && label === undefined) {
                    return true;
                }
                break;

            case ts.SyntaxKind.LabeledStatement: {
                const { text } = (parent as ts.LabeledStatement).label;
                if (label !== undefined && label.text === text) {
                    return true;
                }
                break;
            }

            default:
                // tslint:disable:deprecation This is needed for https://github.com/palantir/tslint/pull/4274 and will be fixed once TSLint
                // requires tsutils > 3.0.
                if (isFunctionScopeBoundary(parent)) {
                    // tslint:enable:deprecation
                    // Haven't seen TryStatement yet, so the function is inside it.
                    // No jump statement can escape a function, so the jump is local.
                    return true;
                }
        }

        node = parent;
    }
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
