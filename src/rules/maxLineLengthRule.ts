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

import * as Lint from "../lint";

import { IDisabledInterval } from "../language/rule/rule";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-line-length",
        description: "Requires lines to be under a certain max length.",
        rationale: Lint.Utils.dedent`
            Limiting the length of a line of code improves code readability.
            It also makes comparing code side-by-side easier and improves compatibility with
            various editors, IDEs, and diff viewers.`,
        optionsDescription: "An integer indicating the max length of lines.",
        options: {
            type: "number",
            minimum: "1",
        },
        optionExamples: ["[true, 120]"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static URL_REGEXP = /[^:/?#]:\/\/[^?#]/;

    public static FAILURE_STRING_FACTORY = (lineLimit: number) => {
        return `Exceeds maximum line length of ${lineLimit}`;
    };

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            const option = this.getOptions().ruleArguments[0];
            if (typeof option === "number" && option > 0) {
                return true;
            }
        }
        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const ruleArgs = this.getOptions().ruleArguments;
        const ruleFailures: Lint.RuleFailure[] = [];
        const lineLimit = ruleArgs[0];
        const lineStarts = sourceFile.getLineStarts();
        const errorString = Rule.FAILURE_STRING_FACTORY(lineLimit);
        const disabledIntervals = this.getOptions().disabledIntervals;
        const source = sourceFile.getFullText();

        for (let i = 0; i < lineStarts.length - 1; ++i) {
            const from = lineStarts[i];
            const to = lineStarts[i + 1];
            if ((to - from - 1) > lineLimit && !((to - from - 2) === lineLimit && source[to - 2] === "\r")) {
                // first condition above is whether the line (minus the newline) is larger than the line limit
                // second two check for windows line endings, that is, check to make sure it is not the case
                // that we are only over by the limit by exactly one and that the character we are over the
                // limit by is a '\r' character which does not count against the limit
                // (and thus we are not actually over the limit).
                const ruleFailure = new Lint.RuleFailure(sourceFile, from, to - 1, errorString, this.getOptions().ruleName);
                if (!Lint.doesIntersect(ruleFailure, disabledIntervals)) {
                    let report = true;
                    if (ruleArgs.indexOf("ignoreUrls") > -1) {
                        const lineContent = source.substring(from, to);
                        report = !Rule.URL_REGEXP.test(lineContent);
                    }
                    if (report) {
                        ruleFailures.push(ruleFailure);
                    }
                }
            }
        }
        return this.applyWithWalker(new MaxLineLengthWalker(ruleFailures, sourceFile, this.getOptions()));
    }
}

class MaxLineLengthWalker extends Lint.SkippableTokenAwareRuleWalker {
    protected ruleFailures: Lint.RuleFailure[];
    private ignoredIntervals: IDisabledInterval[] = [];

    constructor(ruleFailures: Lint.RuleFailure[], sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.ruleFailures = ruleFailures;
    }

    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);

        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text), (scanner: ts.Scanner) => {
            const token = scanner.getToken();
            const startPos = scanner.getStartPos();
            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                return;
            }

            if (token === ts.SyntaxKind.SingleLineCommentTrivia || token === ts.SyntaxKind.MultiLineCommentTrivia) {
                const commentText = scanner.getTokenText();
                const width = commentText.length;
                if (this.hasOption("ignoreComments")) {
                    this.ignoredIntervals.push({
                        endPosition: startPos + width,
                        startPosition: startPos,
                    });
                }
            }
        });

        this.ruleFailures.forEach(failure => {
            if (!Lint.doesIntersect(failure, this.ignoredIntervals)) {
                this.addFailure(failure);
            }
        });
    }

    protected visitImportDeclaration(node: ts.ImportDeclaration) {
        super.visitImportDeclaration(node);
        // We only care to see if the module specifier, not the whole import declaration
        const startPos = node.moduleSpecifier.getStart();
        const text = node.moduleSpecifier.getText();
        if (this.hasOption("ignoreImports")) {
            this.ignoredIntervals.push({
                endPosition: startPos + text.length,
                startPosition: startPos,
            });
        }
    }

}
