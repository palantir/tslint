/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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
    public static DEFAULT_ALLOWED_BLANKS = 1;
    public static MINIMUM_ALLOWED_BLANKS = 1;

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-consecutive-blank-lines",
        description: "Disallows one or more blank lines in a row.",
        rationale: "Helps maintain a readable style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            An optional number of maximum allowed sequential blanks can be specified. If no value
            is provided, a default of $(Rule.DEFAULT_ALLOWED_BLANKS) will be used.`,
        options: {
            type: "number",
            minimum: "$(Rule.MINIMUM_ALLOWED_BLANKS)",
        },
        optionExamples: ["true", "[true, 2]"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(allowed: number) {
        return allowed === 1
            ? "Consecutive blank lines are forbidden"
            : `Exceeds the ${allowed} allowed consecutive blank lines`;
    };

    /**
     * Disable the rule if the option is provided but non-numeric or less than the minimum.
     */
    public isEnabled(): boolean {
        if (!super.isEnabled()) {
            return false;
        }
        const options = this.getOptions();
        const allowedBlanks = options.ruleArguments && options.ruleArguments[0] || Rule.DEFAULT_ALLOWED_BLANKS;
        return typeof allowedBlanks === "number" && allowedBlanks >= Rule.MINIMUM_ALLOWED_BLANKS;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConsecutiveBlankLinesWalker(sourceFile, this.getOptions()));
    }
}

class NoConsecutiveBlankLinesWalker extends Lint.RuleWalker {
    public walk(node: ts.SourceFile) {
        const templateIntervals = this.getTemplateIntervals(node);
        const lineStarts = node.getLineStarts();

        const options = this.getOptions();
        const allowedBlanks = options && options[0] || Rule.DEFAULT_ALLOWED_BLANKS;
        const failureMessage = Rule.FAILURE_STRING_FACTORY(allowedBlanks);
        const sourceFileText = node.getFullText();
        const soureFileLines = sourceFileText.split(/\n/);

        // find all the lines that are blank or only contain whitespace
        const blankLineIndexes: number[] = [];
        soureFileLines.forEach((txt, i) => {
            if (txt.trim() === "") {
                blankLineIndexes.push(i);
            }
        });

        // now only throw failures for the fisrt number from groups of consecutive blank line indexes
        const sequences: number[][] = [];
        let lastVal = -2;
        for (const line of blankLineIndexes) {
            line > lastVal + 1 ? sequences.push([line]) : sequences[sequences.length - 1].push(line);
            lastVal = line;
        }

        for (const arr of sequences) {
            if (arr.length <= allowedBlanks) {
                continue;
            }

            const startLineNum = arr[0];
            const pos = lineStarts[startLineNum + 1];
            const isInTemplate = templateIntervals.some((interval) => pos >= interval.startPosition && pos < interval.endPosition);
            if (!isInTemplate) {
                this.addFailureAt(pos, 1, failureMessage);
            }
        }
    }

    private getTemplateIntervals(sourceFile: ts.SourceFile): Lint.IDisabledInterval[] {
        const intervals: Lint.IDisabledInterval[] = [];
        const cb = (node: ts.Node) => {
            if (node.kind >= ts.SyntaxKind.FirstTemplateToken &&
                node.kind <= ts.SyntaxKind.LastTemplateToken) {
                intervals.push({
                    endPosition: node.getEnd(),
                    startPosition: node.getStart(sourceFile),
                });
            } else {
                ts.forEachChild(node, cb);
            }
        };
        ts.forEachChild(sourceFile, cb);
        return intervals;
    }
}
