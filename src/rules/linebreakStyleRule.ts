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

import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_LINEBREAK_STYLE_CRLF = "CRLF";
const OPTION_LINEBREAK_STYLE_LF = "LF";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "linebreak-style",
        description: "Enforces a consistent linebreak style.",
        optionsDescription: Lint.Utils.dedent`
            One of the following options must be provided:

            * \`"${OPTION_LINEBREAK_STYLE_LF}"\` requires LF (\`\\n\`) linebreaks
            * \`"${OPTION_LINEBREAK_STYLE_CRLF}"\` requires CRLF (\`\\r\\n\`) linebreaks`,
        options: {
            type: "string",
            enum: [OPTION_LINEBREAK_STYLE_LF, OPTION_LINEBREAK_STYLE_CRLF],
        },
        optionExamples: [[true, OPTION_LINEBREAK_STYLE_LF], [true, OPTION_LINEBREAK_STYLE_CRLF]],
        type: "maintainability",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_CRLF = `Expected linebreak to be '${OPTION_LINEBREAK_STYLE_CRLF}'`;
    public static FAILURE_LF = `Expected linebreak to be '${OPTION_LINEBREAK_STYLE_LF}'`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            this.ruleArguments.indexOf(OPTION_LINEBREAK_STYLE_CRLF) !== -1,
        );
    }
}

function walk(ctx: Lint.WalkContext<boolean>) {
    const expectedCr = ctx.options;
    const sourceText = ctx.sourceFile.text;
    const lineStarts = ctx.sourceFile.getLineStarts();
    for (let i = 1; i < lineStarts.length; ++i) {
        const lineEnd = lineStarts[i] - 1;
        if (sourceText[lineEnd - 1] === "\r") {
            if (!expectedCr) {
                ctx.addFailure(
                    lineStarts[i - 1],
                    lineEnd - 1,
                    Rule.FAILURE_LF,
                    Lint.Replacement.deleteText(lineEnd - 1, 1),
                );
            }
        } else if (expectedCr) {
            ctx.addFailure(
                lineStarts[i - 1],
                lineEnd,
                Rule.FAILURE_CRLF,
                Lint.Replacement.appendText(lineEnd, "\r"),
            );
        }
    }
}
