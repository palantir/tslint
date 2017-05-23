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

import { isBlock, isCaseBlock } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "switch-final-break",
        description: Lint.Utils.dedent`
            Forbids the final clause of a switch statement to have an unnecessary \`break;\`.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Final clause in 'switch' statement should not end with 'break;'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (isCaseBlock(node)) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });

    function check(node: ts.CaseBlock): void {
        const clause = last(node.clauses);
        if (clause === undefined || clause.statements.length === 0) { return; }

        const block = clause.statements[0];
        const statements = clause.statements.length === 1 && isBlock(block) ? block.statements : clause.statements;
        const lastStatement = last(statements);
        if (lastStatement !== undefined && lastStatement.kind === ts.SyntaxKind.BreakStatement) {
            ctx.addFailureAtNode(lastStatement, Rule.FAILURE_STRING);
        }
    }
}

function last<T>(arr: ReadonlyArray<T>): T | undefined {
    return arr[arr.length - 1];
}
