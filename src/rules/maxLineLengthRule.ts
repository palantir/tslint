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

const OPTION_ALWAYS = "always";
const OPTION_NEVER = "never";
const OPTION_IGNORE_URLS: string = "ignore-urls";
const OPTION_IGNORE_COMMENTS: string = "ignore-comments";
const OPTION_IGNORE_IMPORTS: string = "ignore-imports";
const OPTION_IGNORE_PATTERN: string = "ignore-pattern";
const OPTION_CODE: string = "code";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-line-length",
        description: "Requires lines to be under a certain max length.",
        rationale: Lint.Utils.dedent`
            Limiting the length of a line of code improves code readability.
            It also makes comparing code side-by-side easier and improves compatibility with
            various editors, IDEs, and diff viewers.`,
        optionsDescription: Lint.Utils.dedent`
            An integer indicating the maximum length of lines.

            The following arguments may be optionally provided:

            * \`"${OPTION_IGNORE_URLS}"\` ignores lines that contain a URL.
            * \`"${OPTION_IGNORE_COMMENTS}"\` ignores all trailing and block comments.
            * \`"${OPTION_IGNORE_IMPORTS}"\` ignores lines that contain an import module specifier.

            An object may also be provided with the above options as keys and "${OPTION_ALWAYS}" or
            "${OPTION_NEVER}" as their values. When using an object the following options become
            available:
            
            * \`"${OPTION_IGNORE_PATTERN}"\` ignores lines matching a regular expression; can only
               match a single line and needs to be double escaped when written in JSON.
            * \`"${OPTION_CODE}"\` an integer indicating the maximum length of lines.`,
        options: {
            type: "array",
            items: [{
                type: "number",
                minimum: "1",
            }, {
                type: "string",
                enum: [OPTION_IGNORE_URLS, OPTION_IGNORE_COMMENTS, OPTION_IGNORE_IMPORTS],
            }, {
                type: "object",
                properties: {
                    [OPTION_IGNORE_URLS]: {
                        type: "string",
                        enum: [OPTION_ALWAYS, OPTION_NEVER],
                    },
                    [OPTION_IGNORE_COMMENTS]: {
                        type: "string",
                        enum: [OPTION_ALWAYS, OPTION_NEVER],
                    },
                    [OPTION_IGNORE_IMPORTS]: {
                        type: "string",
                        enum: [OPTION_ALWAYS, OPTION_NEVER],
                    },
                    [OPTION_IGNORE_PATTERN]: {
                        type: "string",
                    },
                    [OPTION_CODE]: {
                        type: "number",
                        minumum: "1",
                    },
                },
                additionalProperties: false,
            }],
            minLength: 1,
            maxLength: 5,
        },
        optionExamples: [
            "[true, 120]",
            `[true, 120, "${OPTION_IGNORE_URLS}"]`,
            `[true, 120, "${OPTION_IGNORE_COMMENTS}"]`,
            `[true, 120, "${OPTION_IGNORE_IMPORTS}"]`,
            `[true, 120, "${OPTION_IGNORE_URLS}", "${OPTION_IGNORE_COMMENTS}", "${OPTION_IGNORE_IMPORTS}"]`,
            Lint.Utils.dedent`
                [
                    true,
                    120,
                    "${OPTION_IGNORE_IMPORTS}",
                    {
                        "${OPTION_IGNORE_URLS}": "${OPTION_NEVER}",
                        "${OPTION_IGNORE_PATTERN}": "^\\\\s*(let|const)\\\\s.+=\\\\s*require\\\\s*\\\\("
                    }
                ]`,
            Lint.Utils.dedent`
                [
                    true,
                    {
                        "${OPTION_CODE}": 120,
                        "${OPTION_IGNORE_IMPORTS}": "${OPTION_ALWAYS}",
                        "${OPTION_IGNORE_URLS}": "${OPTION_NEVER}",
                        "${OPTION_IGNORE_PATTERN}": "^\\\\s*(let|const)\\\\s.+=\\\\s*require\\\\s*\\\\("
                    }
                ]`,
        ],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static URL_REGEXP = /[^:/?#]:\/\/[^?#]/;

    public static FAILURE_STRING_FACTORY = (lineLimit: number) => {
        return `Exceeds maximum line length of ${lineLimit}`;
    };

    public static mergeOptions(options: any[]): { [key: string]: any } {
        const optionsObj: { [key: string]: any } = {};
        options.forEach((opt) => {
            if (typeof opt === "number") {
                optionsObj[OPTION_CODE] = opt;
            } else if (typeof opt === "string") {
                optionsObj[opt] = OPTION_ALWAYS;
            } else if (typeof opt === "object" && !Array.isArray(opt)) {
                Object.keys(opt).forEach((key) => {
                    optionsObj[key] = opt[key];
                });
            }
        });
        return optionsObj;
    }

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            const options = this.getOptions().ruleArguments;
            const option = options[0];
            if (typeof option === "number" && option > 0) {
                return true;
            }
            // Check if using objects
            const optionsObj = Rule.mergeOptions(options);
            if (optionsObj[OPTION_CODE]) {
                return true;
            }
        }
        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MaxLineLengthWalker(sourceFile, this.getOptions()));
    }
}

class MaxLineLengthWalker extends Lint.SkippableTokenAwareRuleWalker {
    private ignoredIntervals: IDisabledInterval[] = [];
    private optionsObj: { [key: string]: any } = {};

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.optionsObj = Rule.mergeOptions(this.getOptions());
    }

    public hasOption(option: string): boolean {
        if (this.optionsObj[option] && this.optionsObj[option] === OPTION_ALWAYS) {
            return true;
        }
        return false;
    }

    public getOption(option: string): any {
        return this.optionsObj[option];
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
                if (this.hasOption(OPTION_IGNORE_COMMENTS)) {
                    this.ignoredIntervals.push({
                        endPosition: startPos + width,
                        startPosition: startPos,
                    });
                }
            }
        });
        // We should have all the ignored intervals at this point.
        this.findFailures(node);
    }

    protected visitImportDeclaration(node: ts.ImportDeclaration) {
        super.visitImportDeclaration(node);
        /* We only care to see the module specifier, not the whole import declaration. This covers
           the following case:

             import {
               ...
             } from 'this is the module specifier, this line should be ignored only, not the rest of the import';

         */
        const startPos = node.moduleSpecifier.getStart();
        const text = node.moduleSpecifier.getText();
        const width = text.length;
        if (this.hasOption(OPTION_IGNORE_IMPORTS)) {
            this.ignoredIntervals.push({
                endPosition: startPos + width,
                startPosition: startPos,
            });
        }
    }

    public findFailures(sourceFile: ts.SourceFile) {
        const lineLimit: number = this.optionsObj[OPTION_CODE];
        const lineStarts = sourceFile.getLineStarts();
        const errorString = Rule.FAILURE_STRING_FACTORY(lineLimit);
        const source = sourceFile.getFullText();
        const pattern = this.getOption(OPTION_IGNORE_PATTERN);

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
                if (!Lint.doesIntersect(ruleFailure, this.ignoredIntervals)) {
                    const lineContent = source.substring(from, to);
                    let report = true;
                    if (this.hasOption(OPTION_IGNORE_URLS) && Rule.URL_REGEXP.test(lineContent)) {
                        report = false;
                    } else if (pattern && new RegExp(pattern).test(lineContent)) {
                        report = false;
                    }
                    if (report) {
                        this.addFailure(ruleFailure);
                    }
                }
            }
        }
    }
}
