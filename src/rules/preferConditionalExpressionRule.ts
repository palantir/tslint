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

import {
    isBinaryExpression,
    isBlock,
    isExpressionStatement,
    isIfStatement,
    isSameLine
} from "tsutils";
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
        optionsDescription: `If \`${OPTION_CHECK_ELSE_IF}\` is specified, the rule also checks nested if-else-if statements.`,
        options: {
            type: "string",
            enum: [OPTION_CHECK_ELSE_IF]
        },
        optionExamples: [true, [true, OPTION_CHECK_ELSE_IF]],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(assigned: string): string {
        return `Use a conditional expression instead of assigning to '${assigned}' in multiple places.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            checkElseIf: this.ruleArguments.indexOf(OPTION_CHECK_ELSE_IF) !== -1
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const {
        sourceFile,
        options: { checkElseIf }
    } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isIfStatement(node)) {
            const assigned = detectAssignment(node, sourceFile, checkElseIf);
            if (assigned !== undefined) {
                ctx.addFailureAtNode(
                    node.getChildAt(0, sourceFile),
                    Rule.FAILURE_STRING(assigned.getText(sourceFile))
                );
            }
            if (assigned !== undefined || !checkElseIf) {
                // Be careful not to fail again for the "else if"
                do {
                    ts.forEachChild(node.expression, cb);
                    ts.forEachChild(node.thenStatement, cb);
                    if (node.elseStatement === undefined) {
                        return;
                    }
                    node = node.elseStatement;
                    while (isBlock(node) && node.statements.length === 1) {
                        node = node.statements[0];
                    }
                } while (isIfStatement(node));
            }
        }
        return ts.forEachChild(node, cb);
    });
}

/**
 * @param inElse `undefined` when this is the top level if statement, `false` when inside the then branch, `true` when inside else
 */
function detectAssignment(
    statement: ts.Statement,
    sourceFile: ts.SourceFile,
    checkElseIf: boolean,
    inElse?: boolean
): ts.Expression | undefined {
    if (isIfStatement(statement)) {
        if (inElse === false || (!checkElseIf && inElse) || statement.elseStatement === undefined) {
            return undefined;
        }
        const then = detectAssignment(statement.thenStatement, sourceFile, checkElseIf, false);
        if (then === undefined) {
            return undefined;
        }
        const elze = detectAssignment(statement.elseStatement, sourceFile, checkElseIf, true);
        return elze !== undefined && nodeEquals(then, elze, sourceFile) ? then : undefined;
    } else if (isBlock(statement)) {
        return statement.statements.length === 1
            ? detectAssignment(statement.statements[0], sourceFile, checkElseIf, inElse)
            : undefined;
    } else if (isExpressionStatement(statement) && isBinaryExpression(statement.expression)) {
        const {
            operatorToken: { kind },
            left,
            right
        } = statement.expression;
        return kind === ts.SyntaxKind.EqualsToken &&
            isSameLine(sourceFile, right.getStart(sourceFile), right.end)
            ? left
            : undefined;
    } else {
        return undefined;
    }
}

function nodeEquals(a: ts.Node, b: ts.Node, sourceFile: ts.SourceFile): boolean {
    return a.getText(sourceFile) === b.getText(sourceFile);
}
