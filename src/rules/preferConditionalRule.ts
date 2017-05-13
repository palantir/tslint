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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-conditional",
        description: Lint.Utils.dedent`
            Recommends to use a conditional expression instead of assigning to the same thing in each branch of an if statement.`,
        rationale: Lint.Utils.dedent`
            This reduces duplication and can eliminate an unnecessary variable declaration.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(assigned: string): string {
        return `Use a conditional expression instead of assigning to '${assigned}' in multiple places.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (utils.isIfStatement(node)) {
            const assigned = detect(node, sourceFile);
            if (assigned) {
                ctx.addFailureAtNode(
                    Lint.childOfKind(node, ts.SyntaxKind.IfKeyword)!,
                    Rule.FAILURE_STRING(assigned.getText(sourceFile)));
                // Be careful not to fail again for the "else if"
                ts.forEachChild(node.expression, cb);
                ts.forEachChild(node.thenStatement, cb);
                if (node.elseStatement) {
                    ts.forEachChild(node.elseStatement, cb);
                }
                return;
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function detect({ thenStatement, elseStatement }: ts.IfStatement, sourceFile: ts.SourceFile): ts.Expression | undefined {
    if (!elseStatement) {
        return undefined;
    }
    const elze = utils.isIfStatement(elseStatement) ? detect(elseStatement, sourceFile) : getAssigned(elseStatement, sourceFile);
    if (!elze) {
        return undefined;
    }
    const then = getAssigned(thenStatement, sourceFile);
    return then && nodeEquals(elze, then, sourceFile) ? then : undefined;
}

/** Returns the left side of an assignment. */
function getAssigned(node: ts.Statement, sourceFile: ts.SourceFile): ts.Expression | undefined {
    if (utils.isBlock(node)) {
        return node.statements.length === 1 ? getAssigned(node.statements[0], sourceFile) : undefined;
    } else if (utils.isExpressionStatement(node) && utils.isBinaryExpression(node.expression)) {
        const { operatorToken, left, right } = node.expression;
        return operatorToken.kind === ts.SyntaxKind.EqualsToken && !isMultiLine(right, sourceFile) ? left : undefined;
    } else {
        return undefined;
    }
}

function isMultiLine(node: ts.Node, sourceFile: ts.SourceFile): boolean {
    return node.getText(sourceFile).includes("\n");
}

function nodeEquals(a: ts.Node, b: ts.Node, sourceFile: ts.SourceFile): boolean {
    return a.getText(sourceFile) === b.getText(sourceFile);
}
