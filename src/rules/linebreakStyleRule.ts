/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
        optionExamples: [`[true, "${OPTION_LINEBREAK_STYLE_LF}"]`, `[true, "${OPTION_LINEBREAK_STYLE_CRLF}"]`],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRINGS = {
        CRLF: `Expected linebreak to be '${OPTION_LINEBREAK_STYLE_CRLF}'`,
        LF: `Expected linebreak to be '${OPTION_LINEBREAK_STYLE_LF}'`,
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const failures: Lint.RuleFailure[] = [];
        const scanner = ts.createScanner(
            sourceFile.languageVersion,
            false,
            sourceFile.languageVariant,
            sourceFile.getFullText()
        );

        const linebreakStyle = this.getOptions().ruleArguments[0] || OPTION_LINEBREAK_STYLE_LF;
        const expectLF = linebreakStyle === OPTION_LINEBREAK_STYLE_CRLF;
        const expectedEOL = expectLF ? "\r\n" : "\n";
        const failureString = expectLF ? Rule.FAILURE_STRINGS.CRLF : Rule.FAILURE_STRINGS.LF;

        for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
            if (token === ts.SyntaxKind.NewLineTrivia) {
                const text = scanner.getTokenText();
                if (text !== expectedEOL) {
                    failures.push(this.createFailure(sourceFile, scanner, failureString));
                }
            }
        }

        return failures;
    }

    public createFailure(sourceFile: ts.SourceFile, scanner: ts.Scanner, failure: string): Lint.RuleFailure {
        // get the start of the current line
        const start = sourceFile.getPositionOfLineAndCharacter(sourceFile.getLineAndCharacterOfPosition(scanner.getStartPos()).line, 0);
        // since line endings are not visible, we simply end at the beginning of
        // the line ending, which happens to be the start of the token.
        const end = scanner.getStartPos();

        return new Lint.RuleFailure(sourceFile, start, end, failure, this.getOptions().ruleName);
    }
}
