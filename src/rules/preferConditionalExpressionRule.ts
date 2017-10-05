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

import { isBinaryExpression, isBlock, isExpressionStatement, isIfStatement, isReturnStatement, isSameLine } from "tsutils";
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
            enum: [OPTION_CHECK_ELSE_IF],
        },
        optionExamples: [true, [true, OPTION_CHECK_ELSE_IF]],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_RETURN = "Use a conditionial expression instead of returning in multiple places.";

    public static FAILURE_STRING(assigned: string): string {
        return `Use a conditional expression instead of assigning to '${assigned}' in multiple places.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            checkElseIf: this.ruleArguments.indexOf(OPTION_CHECK_ELSE_IF) !== -1,
        });
    }
}

enum ConditionExpressionType {
    Assignment,
    Return
}

type ConditionalExpressionWrapper = { type: ConditionExpressionType.Return} | { type:ConditionExpressionType.Assignment, expression: ts.Expression };

function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options: { checkElseIf } } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isIfStatement(node)) {
            const wrapper = detect(node, sourceFile, checkElseIf);
            if (wrapper !== undefined) {
                if (wrapper.type === ConditionExpressionType.Assignment) {
                    ctx.addFailureAtNode(
                        node.getChildAt(0, sourceFile),
                        Rule.FAILURE_STRING(wrapper.expression.getText(sourceFile)));
                } else if (wrapper.type === ConditionExpressionType.Return) {
                    ctx.addFailureAtNode(
                        node.getChildAt(0, sourceFile),
                        Rule.FAILURE_STRING_RETURN);
                }
            }
            if (wrapper !== undefined || !checkElseIf) {
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

function detect({ thenStatement, elseStatement }: ts.IfStatement, sourceFile: ts.SourceFile, elseIf: boolean): ConditionalExpressionWrapper | undefined {
    if (elseStatement === undefined || !elseIf && elseStatement.kind === ts.SyntaxKind.IfStatement) {
        return undefined;
    }
    const elze = isIfStatement(elseStatement) ? detect(elseStatement, sourceFile, elseIf) : getWrapper(elseStatement, sourceFile);
    if (elze === undefined) {
        return undefined;
    }
    const then = getWrapper(thenStatement, sourceFile);
    return then !== undefined && nodeEquals(elze, then, sourceFile) ? then : undefined;
}

function getWrapper(node: ts.Statement, sourceFile: ts.SourceFile): ConditionalExpressionWrapper | undefined {
    if (isBlock(node)) {
        return node.statements.length === 1 ? getWrapper(node.statements[0], sourceFile) : undefined;
    } else if (isExpressionStatement(node) && isBinaryExpression(node.expression)) {
        const { operatorToken: { kind }, left, right } = node.expression;
        return kind === ts.SyntaxKind.EqualsToken && isSameLine(sourceFile, right.getStart(sourceFile), right.end) 
            ? {type: ConditionExpressionType.Assignment, expression: left} 
            : undefined;
    } else if (isReturnStatement(node)) {
        return {type: ConditionExpressionType.Return};
    } else {
        return undefined;
    }
}

function nodeEquals(a: ConditionalExpressionWrapper, b: ConditionalExpressionWrapper, sourceFile: ts.SourceFile): boolean {
    if(a.type !== b.type) {
        return false;
    } else if(a.type === ConditionExpressionType.Assignment && b.type === ConditionExpressionType.Assignment) {
        return a.expression.getText(sourceFile) === b.expression.getText(sourceFile);
    } else {
        return true;
    }
}
