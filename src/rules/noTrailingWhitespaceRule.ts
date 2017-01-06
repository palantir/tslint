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
        const scan = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text);
        let lastSeenWasWhitespace = false;
        let lastSeenWhitespacePosition = 0;
        Lint.scanAllTokensWithSkip(scan, Lint.getSkippableTokens(node), (scanner: ts.Scanner) => {
            if (scanner.getToken() === ts.SyntaxKind.NewLineTrivia) {
                if (lastSeenWasWhitespace) {
                    this.addFailureFromStartToEnd(lastSeenWhitespacePosition, scanner.getStartPos(), Rule.FAILURE_STRING);
                }
                lastSeenWasWhitespace = false;
            } else if (scanner.getToken() === ts.SyntaxKind.WhitespaceTrivia) {
                lastSeenWasWhitespace = true;
                lastSeenWhitespacePosition = scanner.getStartPos();
            } else {
                lastSeenWasWhitespace = false;
            }
        });
    }
}
