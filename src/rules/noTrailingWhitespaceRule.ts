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
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-trailing-whitespace",
        description: "Disallows trailing whitespace at the end of a line.",
        rationale: "Keeps version control diffs clean as it prevents accidental whitespace from being committed.",
        optionsDescription: "Not configurable.",
        hasFix: true,
        options: null,
        optionExamples: ["true"],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "trailing whitespace";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoTrailingWhitespaceWalker(sourceFile, this.getOptions()));
    }
}

class NoTrailingWhitespaceWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        let lastSeenWasWhitespace = false;
        let lastSeenWhitespacePosition = 0;
        Lint.forEachToken(node, false, (fullText, kind, pos) => {
            if (kind === ts.SyntaxKind.NewLineTrivia || kind === ts.SyntaxKind.EndOfFileToken) {
                if (lastSeenWasWhitespace) {
                    this.reportFailure(lastSeenWhitespacePosition, pos.tokenStart);
                }
                lastSeenWasWhitespace = false;
            } else if (kind === ts.SyntaxKind.WhitespaceTrivia) {
                lastSeenWasWhitespace = true;
                lastSeenWhitespacePosition = pos.tokenStart;
            } else {
                if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
                    const commentText = fullText.substring(pos.tokenStart + 2, pos.end);
                    const match = /\s+$/.exec(commentText);
                    if (match !== null) {
                        this.reportFailure(pos.end - match[0].length, pos.end);
                    }
                } else if (kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                    let startPos = pos.tokenStart + 2;
                    const commentText = fullText.substring(startPos, pos.end - 2);
                    const lines = commentText.split("\n");
                    // we don't want to check the content of the last comment line, as it is always followed by */
                    const len = lines.length - 1;
                    for (let i = 0; i < len; ++i) {
                        let line = lines[i];
                        // remove carriage return at the end, it is does not account to trailing whitespace
                        if (line.endsWith("\r")) {
                            line = line.substr(0, line.length - 1);
                        }
                        const start = line.search(/\s+$/);
                        if (start !== -1) {
                            this.reportFailure(startPos + start, startPos + line.length);
                        }
                        startPos += lines[i].length + 1;
                    }
                }
                lastSeenWasWhitespace = false;
            }
        });
    }

    private reportFailure(start: number, end: number) {
        this.addFailureFromStartToEnd(
            start,
            end,
            Rule.FAILURE_STRING,
            this.createFix(this.deleteText(start, end - start)),
        );
    }
}
