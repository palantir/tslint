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

import * as utils from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

type Option = "never";

/* tslint:disable:object-literal-sort-keys */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "space-after-branch",
        description:
            "Requires or restricts whitespace after branching keywords (`for`, `if`, `switch`, ...)",
        optionsDescription: Lint.Utils.dedent`
            By default one whitespace is allowed after branching keywords.
            Optional argument \`'never'\` checks that branching keywords are not followed by whitespace.
        `,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["never"]
            },
            maxLength: 1
        },
        optionExamples: [[true, "never"]],
        type: "style",
        typescriptOnly: false,
        hasFix: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_INVALID_SPACE = "invalid whitespace after keyword";
    public static FAILURE_MISSING_SPACE = "missing whitespace after keyword";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.ruleArguments[0];

        return this.applyWithWalker(new SpaceAfterBranchWalker(sourceFile, this.ruleName, options));
    }
}

class SpaceAfterBranchWalker extends Lint.AbstractWalker<Option> {
    public walk(sourceFile: ts.SourceFile): void {
        utils.forEachToken(sourceFile, (node: ts.Node) => {
            switch (node.kind) {
                case ts.SyntaxKind.CatchKeyword:
                case ts.SyntaxKind.ForKeyword:
                case ts.SyntaxKind.IfKeyword:
                case ts.SyntaxKind.SwitchKeyword:
                case ts.SyntaxKind.WhileKeyword:
                case ts.SyntaxKind.WithKeyword:
                    this.countSpaces(node);
            }
        });
    }

    private countSpaces(node: ts.Node): void {
        const { text } = this.sourceFile;
        let currentIndex = node.end;
        let currentChar = text.charCodeAt(node.end);

        while (ts.isWhiteSpaceLike(currentChar)) {
            currentChar = text.charCodeAt(++currentIndex);
        }

        return this.validateRule(node.end, currentIndex);
    }

    private validateRule(start: number, end: number): void {
        if (this.options === "never") {
            if (start !== end) {
                this.addFailure(
                    start,
                    end,
                    Rule.FAILURE_INVALID_SPACE,
                    Lint.Replacement.deleteFromTo(start, end)
                );
            }
        } else {
            switch (end - start) {
                case 0:
                    this.addFailure(
                        end,
                        end,
                        Rule.FAILURE_MISSING_SPACE,
                        Lint.Replacement.appendText(end, " ")
                    );
                    break;
                case 1:
                    break;
                default:
                    this.addFailure(
                        start + 1,
                        end,
                        Rule.FAILURE_INVALID_SPACE,
                        Lint.Replacement.deleteFromTo(start + 1, end)
                    );
            }
        }
    }
}
