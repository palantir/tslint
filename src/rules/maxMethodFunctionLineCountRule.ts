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

import { isFunctionDeclaration, isFunctionWithBody } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

const OPTION_INCLUDE = "include-nested-functions";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-method-function-line-count",
        description: "Requires methods or functions to remain under a certain number of lines",
        rationale: Lint.Utils.dedent`
            Limiting the number of lines allowed in a block allows blocks to remain small,
            single purpose, and maintainable.`,
        optionsDescription: Lint.Utils.dedent`
            An integer indicating the maximum line count of functions and methods.
            An optional string "include-nested-functions" indicating if nested functions of functions are included in the count.`,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                },
                {
                    type: "string",
                    enum: [OPTION_INCLUDE],
                },
            ],
            additionalItems: false,
        },
        optionExamples: [[true, 200, false]],
        type: "maintainability",
        typescriptOnly: false,
    };

    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments[0] as number > 0;
    }

    public includesNested(): boolean {
        if (this.ruleArguments.length > 1) {
            return typeof this.ruleArguments[1] === "string" && this.ruleArguments[1] as string === OPTION_INCLUDE;
        }
        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MaxMethodLine(sourceFile, this.ruleName, {
            limit: this.ruleArguments[0] as number,
            includesNested: this.includesNested(),
        }));
    }
}

function FAILURE_STRING(lineCount: number, lineLimit: number) {
    return `This method or function has ${lineCount} lines, which exceeds the maximum of ${lineLimit} lines allowed. ` +
        "Consider breaking this up into smaller parts.";
}

class MaxMethodLine extends Lint.AbstractWalker<{limit: number; includesNested: boolean}> {

    // cache for line count
    private linesOfCode = new Map<string, number>();

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isFunctionWithBody(node)) {
                const limit = this.options.limit;
                const lines = this.countLines(node.body!);
                if (lines > limit) {
                    this.addFailure(node.getStart(this.sourceFile), node.body!.pos, FAILURE_STRING(lines, limit));
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private countLines(node: ts.Node): number {
        const nodeText = node.getText();
        // check if size of node is already cached
        if (this.linesOfCode.has(nodeText)) {
            const alreadyComputed = this.linesOfCode.get(nodeText);
            return alreadyComputed as number;
        } else {
            // compute the number of lines
            const includesNested = this.options.includesNested;
            let nbLinesToDrop = 0;
            if (!includesNested) {
                const nbLinesToDropFunction = (anode: ts.Node): void => {
                    if (isFunctionDeclaration(anode) || isFunctionWithBody(anode)) {
                        nbLinesToDrop += this.countLines(anode.body!);
                    }
                    ts.forEachChild(anode, nbLinesToDropFunction);
                };
                ts.forEachChild(node, nbLinesToDropFunction);
            }
            const nbLines = ts.getLineAndCharacterOfPosition(this.sourceFile, node.end).line
                - ts.getLineAndCharacterOfPosition(this.sourceFile, node.getStart(this.sourceFile)).line;
            const result = nbLines + 1 - nbLinesToDrop;
            this.linesOfCode.set(nodeText, result);
            return result;
        }
    }
}
