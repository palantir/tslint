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
    endsControlFlow,
    isBlock,
    isBreakStatement,
    isLabeledStatement,
    isSwitchStatement,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALWAYS = "always";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "switch-final-break",
        description: "Checks whether the final clause of a switch statement ends in `break;`.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            If no options are passed, a final 'break;' is forbidden.
            If the "always" option is passed this will require a 'break;' to always be present
            unless control flow is escaped in some other way.`,
        options: {
            type: "string",
            enum: [OPTION_ALWAYS],
        },
        optionExamples: [true, [true, OPTION_ALWAYS]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_ALWAYS =
        "Final clause in 'switch' statement should end with 'break;'.";
    public static FAILURE_STRING_NEVER =
        "Final clause in 'switch' statement should not end with 'break;'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            always: this.ruleArguments.indexOf(OPTION_ALWAYS) !== -1,
        });
    }
}

interface Options {
    always: boolean;
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const {
        sourceFile,
        options: { always },
    } = ctx;
    ts.forEachChild(sourceFile, function cb(node) {
        if (isSwitchStatement(node)) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });

    function check(node: ts.SwitchStatement): void {
        const clause = last(node.caseBlock.clauses);
        if (clause === undefined) {
            return;
        }

        if (always) {
            if (!endsControlFlow(clause)) {
                ctx.addFailureAtNode(
                    clause.getChildAt(0),
                    Rule.FAILURE_STRING_ALWAYS,
                    createAddFix(clause),
                );
            }
            return;
        }

        const lastStatement = getLastStatement(clause);
        if (lastStatement === undefined || !isBreakStatement(lastStatement)) {
            return;
        }

        if (lastStatement.label !== undefined) {
            const parent = node.parent;
            if (!isLabeledStatement(parent) || parent.label === lastStatement.label) {
                // break jumps somewhere else, don't complain
                return;
            }
        }

        ctx.addFailureAtNode(
            lastStatement,
            Rule.FAILURE_STRING_NEVER,
            createRemoveFix(lastStatement),
        );
    }

    function createAddFix(clause: ts.CaseClause | ts.DefaultClause) {
        const lastStatement = getLastStatement(clause);
        if (lastStatement === undefined) {
            return Lint.Replacement.appendText(clause.end, " break;");
        }

        const fullText = lastStatement.getFullText(ctx.sourceFile);
        const indentation = fullText.slice(0, fullText.search(/\S+/));

        return Lint.Replacement.appendText(lastStatement.end, `${indentation}break;`);
    }

    function createRemoveFix(lastStatement: ts.BreakStatement) {
        return Lint.Replacement.replaceFromTo(lastStatement.getFullStart(), lastStatement.end, "");
    }
}

function getLastStatement(clause: ts.CaseClause | ts.DefaultClause): ts.Statement | undefined {
    if (clause.statements.length === 0) {
        return undefined;
    }

    const block = clause.statements[0];
    const statements =
        clause.statements.length === 1 && isBlock(block) ? block.statements : clause.statements;

    return last(statements);
}

function last<T>(arr: ReadonlyArray<T>): T | undefined {
    return arr[arr.length - 1];
}
