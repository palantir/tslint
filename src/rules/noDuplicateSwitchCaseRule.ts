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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Prevents duplicate cases in switch statements.",
        optionExamples: [true],
        options: null,
        optionsDescription: "",
        ruleName: "no-duplicate-switch-case",
        type: "functionality",
        typescriptOnly: false
    };

    public static readonly FAILURE_STRING_FACTORY = (text: string) =>
        `Duplicate switch case: '${text}'.`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.CaseBlock) {
            visitCaseBlock(node as ts.CaseBlock);
        }

        ts.forEachChild(node, cb);
    });

    function visitCaseBlock(node: ts.CaseBlock): void {
        const previousCases = new Set<string>();

        for (const clause of node.clauses) {
            if (clause.kind === ts.SyntaxKind.DefaultClause) {
                continue;
            }

            const text = clause.expression.getText(ctx.sourceFile);
            if (!previousCases.has(text)) {
                previousCases.add(text);
                continue;
            }

            ctx.addFailureAtNode(clause.expression, Rule.FAILURE_STRING_FACTORY(text));
        }
    }
}
