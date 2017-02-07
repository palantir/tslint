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
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "newline-before-return",
        description: "Enforces blank line before return when not the only line in the block.",
        rationale: "Helps maintain a readable style in your codebase.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY() {
        return "Missing blank line before return";
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NewlineBeforeReturnWalker(sourceFile, this.getOptions()));
    }
}

class NewlineBeforeReturnWalker extends Lint.RuleWalker {

    public visitReturnStatement(node: ts.ReturnStatement) {
        super.visitReturnStatement(node);

        const parent = node.parent!;
        if (!isBlockLike(parent)) {
            // `node` is the only statement within this "block scope". No need to do any further validation.
            return;
        }

        const index = parent.statements.indexOf(node as ts.Statement);
        if (index === 0) {
            // First element in the block so no need to check for the blank line.
            return;
        }

        let start = node.getStart();
        const comments = ts.getLeadingCommentRanges(this.getSourceFile().text, node.getFullStart());
        if (comments) {
            // In case the return statement is preceded by a comment, we use comments start as the starting position
            start = comments[0].pos;
        }
        const lc = this.getLineAndCharacterOfPosition(start);

        const prev = parent.statements[index - 1];
        const prevLine = this.getLineAndCharacterOfPosition(prev.getEnd()).line;

        if (prevLine >= lc.line - 1) {
            // Previous statement is on the same or previous line
            this.addFailureFromStartToEnd(start, start, Rule.FAILURE_STRING_FACTORY());
        }
    }
}

function isBlockLike(node: ts.Node): node is ts.BlockLike {
    return "statements" in node;
}
