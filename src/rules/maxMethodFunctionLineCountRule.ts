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

import { isFunctionWithBody } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

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
            An optional boolean indicating if nested functions of functions are included in the count (default true).`,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                },
                {
                    type: "boolean",
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
            return this.ruleArguments[1] as boolean;
        }
        return true;
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

    private countLines(node: ts.Node) {
        const includesNested = this.options.includesNested;
        let end = node.end;
        if (!includesNested) {
            const firstNestedFunction = (anode: ts.Node): ts.Node => {
                if (isFunctionWithBody(anode)) {
                    return anode;
                }
                return ts.forEachChild(anode, firstNestedFunction);
            };
            const firstNode = ts.forEachChild(node, firstNestedFunction);
            if (firstNode != null) {
                end = firstNode.end;
            }
        }
        return ts.getLineAndCharacterOfPosition(this.sourceFile, end).line
            - ts.getLineAndCharacterOfPosition(this.sourceFile, node.getStart(this.sourceFile)).line
            + 1;
    }
}
