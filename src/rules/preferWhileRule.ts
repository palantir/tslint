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

import { isForStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/preferWhile.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-while",
        description:
            "Prefer `while` loops instead of `for` loops without an initializer and incrementor.",
        rationale:
            "Simplifies the readability of the loop statement, while maintaining the same functionality.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        hasFix: true,
        type: "style",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Prefer `while` loops instead of `for` loops without an initializer and incrementor.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const failures: Lint.RuleFailure[] = [];

        const cb = (node: ts.Node): void => {
            if (isForStatement(node) && this.doesNodeViolateRule(node)) {
                failures.push(this.createFailure(sourceFile, node));
            }
            return ts.forEachChild(node, cb);
        };

        ts.forEachChild(sourceFile, cb);
        return failures;
    }

    private doesNodeViolateRule(node: ts.ForStatement) {
        return node.initializer === undefined && node.incrementor === undefined;
    }

    private createFailure(sourceFile: ts.SourceFile, node: ts.ForStatement): Lint.RuleFailure {
        const start = node.getStart(sourceFile);
        const end = node.statement.pos;

        let fix: Lint.Fix;
        if (node.condition === undefined) {
            fix = Lint.Replacement.replaceFromTo(start, end, "while (true)");
        } else {
            fix = [
                Lint.Replacement.replaceFromTo(
                    start,
                    node.condition.getStart(sourceFile),
                    "while (",
                ),
                Lint.Replacement.deleteFromTo(node.condition.end, end - 1),
            ];
        }
        return new Lint.RuleFailure(
            sourceFile,
            start,
            end,
            Rule.FAILURE_STRING,
            this.ruleName,
            fix,
        );
    }
}
