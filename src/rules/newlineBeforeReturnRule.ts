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

import { getPreviousStatement } from "tsutils";
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
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Missing blank line before return";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NewlineBeforeReturnWalker(sourceFile, this.ruleName, undefined),
        );
    }
}

class NewlineBeforeReturnWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (node.kind === ts.SyntaxKind.ReturnStatement) {
                this.visitReturnStatement(node as ts.ReturnStatement);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private visitReturnStatement(node: ts.ReturnStatement) {
        const prev = getPreviousStatement(node);
        if (prev === undefined) {
            // return is not within a block (e.g. the only child of an IfStatement) or the first statement of the block
            // no need to check for preceding newline
            return;
        }

        let start = node.getStart(this.sourceFile);
        let line = ts.getLineAndCharacterOfPosition(this.sourceFile, start).line;
        const comments = ts.getLeadingCommentRanges(this.sourceFile.text, node.pos);
        if (comments !== undefined) {
            // check for blank lines between comments
            for (let i = comments.length - 1; i >= 0; --i) {
                const endLine = ts.getLineAndCharacterOfPosition(this.sourceFile, comments[i].end)
                    .line;
                if (endLine < line - 1) {
                    return;
                }
                start = comments[i].pos;
                line = ts.getLineAndCharacterOfPosition(this.sourceFile, start).line;
            }
        }
        const prevLine = ts.getLineAndCharacterOfPosition(this.sourceFile, prev.end).line;

        if (prevLine >= line - 1) {
            // Previous statement is on the same or previous line
            this.addFailure(start, start, Rule.FAILURE_STRING);
        }
    }
}
