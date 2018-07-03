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
        // tslint:disable:max-line-length
        optionsDescription: Lint.Utils.dedent`
            An integer indicating the maximum line count of functions and methods.
            An optional string "include-nested-functions" indicating if nested functions of functions are included in the count.`,
        // tslint:enable:max-line-length
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
        optionExamples: [[true, 200, OPTION_INCLUDE]],
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

interface MaxMethodLineOptions {
    limit: number;
    includesNested: boolean;
}

// tslint:disable-next-line:max-classes-per-file
class MaxMethodLine extends Lint.AbstractWalker<MaxMethodLineOptions> {

    // cache for line count
    private cache = new Map<string, number>();

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isFunctionWithBody(node)) {
                this.applyRule(node);
            }
            ts.forEachChild(node, cb);
        };
        ts.forEachChild(sourceFile, cb);
    }

    private applyRule(node: ts.FunctionLikeDeclaration) {
        const limit = this.options.limit;
        const lines = this.countLines(node.body!);

        if (lines > limit) {
            this.addFailure(node.getStart(this.sourceFile), node.body!.pos, FAILURE_STRING(lines, limit));
        }
    }

    private countLines(node: ts.Node): number {
        const nodeText = node.getText();
        const cachedLineCount = this.cache.get(nodeText);
        let lineCount: number;

        if (cachedLineCount) {
            lineCount = cachedLineCount;
        } else {
            lineCount = this.computeLineCount(node);
            this.cache.set(nodeText, lineCount);
        }

        return lineCount;
    }

    private computeLineCount(node: ts.Node) {
        let lineCount = this.getNodeLineCount(node) + 1;

        if (!this.options.includesNested) {
            lineCount -= this.countNestedFunctionLines(node);
        }

        return lineCount;
    }

    private getNodeLineCount(node: ts.Node): number {
        const firstNodeLine = ts.getLineAndCharacterOfPosition(this.sourceFile, node.getStart(this.sourceFile)).line;
        const lastNodeLine = ts.getLineAndCharacterOfPosition(this.sourceFile, node.end).line;
        const lineCount = lastNodeLine - firstNodeLine;

        return lineCount;
    }

    private countNestedFunctionLines(node: ts.Node): number {
        let nestedLineCount = 0;
        const nbLinesToDropFunction = (anode: ts.Node): void => {
            if (isFunctionDeclaration(anode) || isFunctionWithBody(anode)) {
                nestedLineCount += this.countLines(anode.body!);
            }
            ts.forEachChild(anode, nbLinesToDropFunction);
        };
        ts.forEachChild(node, nbLinesToDropFunction);

        return nestedLineCount;
    }
}
