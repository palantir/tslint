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

import { isBinaryExpression, isBlock, isExpressionStatement, isIfStatement, isSameLine } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_CHECK_ELSE_IF = "check-else-if";

interface Options {
    checkElseIf: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-conditional-expression",
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
        return this.applyWithFunction(sourceFile, walk, {
            checkElseIf: this.ruleArguments.indexOf(OPTION_CHECK_ELSE_IF) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options: { checkElseIf } } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isIfStatement(node)) {
            const assigned = detect(node, sourceFile, checkElseIf);
            if (assigned !== undefined) {
                ctx.addFailureAtNode(
                    node.getChildAt(0, sourceFile),
                    Rule.FAILURE_STRING(assigned.getText(sourceFile)));
            }
            if (assigned !== undefined || !checkElseIf) {
                // Be careful not to fail again for the "else if"
                ts.forEachChild(node.expression, cb);
                ts.forEachChild(node.thenStatement, cb);
                if (node.elseStatement !== undefined) {
                    ts.forEachChild(node.elseStatement, cb);
                }
                return;
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function detect({ thenStatement, elseStatement }: ts.IfStatement, sourceFile: ts.SourceFile, elseIf: boolean): ts.Expression | undefined {
    if (elseStatement === undefined || !elseIf && elseStatement.kind === ts.SyntaxKind.IfStatement) {
        return undefined;
    }
    const elze = isIfStatement(elseStatement) ? detect(elseStatement, sourceFile, elseIf) : getAssigned(elseStatement, sourceFile);
    if (elze === undefined) {
        return undefined;
    }
    const then = getAssigned(thenStatement, sourceFile);
    return then !== undefined && nodeEquals(elze, then, sourceFile) ? then : undefined;
}

/** Returns the left side of an assignment. */
function getAssigned(node: ts.Statement, sourceFile: ts.SourceFile): ts.Expression | undefined {
    if (isBlock(node)) {
        return node.statements.length === 1 ? getAssigned(node.statements[0], sourceFile) : undefined;
    } else if (isExpressionStatement(node) && isBinaryExpression(node.expression)) {
        const { operatorToken: { kind }, left, right } = node.expression;
        return kind === ts.SyntaxKind.EqualsToken && isSameLine(sourceFile, right.getStart(sourceFile), right.end) ? left : undefined;
    } else {
        return undefined;
    }
}

function nodeEquals(a: ts.Node, b: ts.Node, sourceFile: ts.SourceFile): boolean {
    return a.getText(sourceFile) === b.getText(sourceFile);
}
