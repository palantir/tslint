/*
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

describe("TSX syntax", () => {
    const fs = require("fs");
    const path = require("path");
    const fileName = "react.test.tsx";

    it("doesn't blow up linter", () => {
        const validConfiguration = {};
        const lintResult = runLinterWithConfiguration(validConfiguration);
        const parsedResult = JSON.parse(lintResult.output);

        assert.lengthOf(parsedResult, 0);
    });

    describe("catches common lint failures", () => {
        const lintResult = runLinterWithConfiguration({
            rules: {
                "curly": true,
                "eofline": true,
                "indent": [true, "spaces"],
                "max-line-length": true,
                "no-bitwise": true,
                "no-unreachable": true,
                "no-unused-expression": true,
                "no-unused-variable": true,
                "no-use-before-declare": true,
                "quotemark": [true, "double"],
                "semicolon": true,
                "whitespace": [true,
                    "check-branch",
                    "check-decl",
                    "check-operator",
                    "check-module",
                    "check-separator",
                    "check-type",
                    "check-typecast"
                ]
            }
        });
        const parsedResult = JSON.parse(lintResult.output);
        const actualFailures: Lint.RuleFailure[] = [];
        for (let failure of parsedResult) {
            const startArray = [failure.startPosition.line + 1, failure.startPosition.character + 1];
            const endArray = [failure.endPosition.line + 1, failure.endPosition.character + 1];
            actualFailures.push(Lint.Test.createFailure(`tsx/${fileName}`, startArray, endArray, failure.failure));
        }

        it("<indent>", () => {
            const IndentRule = Lint.Test.getRule("indent");
            const indentFailure = Lint.Test.createFailuresOnFile(`tsx/${fileName}`, IndentRule.FAILURE_STRING_SPACES);

            Lint.Test.assertContainsFailure(actualFailures, indentFailure([31, 1], [31, 2]));
        });

        it("<quotemark>", () => {
            const QuotemarkRule = Lint.Test.getRule("quotemark");
            const quotemarkFailure = Lint.Test.createFailuresOnFile(`tsx/${fileName}`, QuotemarkRule.DOUBLE_QUOTE_FAILURE);

            Lint.Test.assertContainsFailure(actualFailures, quotemarkFailure([1, 24], [1, 31]));
        });

        it("<whitespace>", () => {
            const WhitespaceRule = Lint.Test.getRule("whitespace");
            const whitespaceFailure = Lint.Test.createFailuresOnFile(`tsx/${fileName}`, WhitespaceRule.FAILURE_STRING);

            Lint.Test.assertContainsFailure(actualFailures, whitespaceFailure([16, 9], [16, 10]));
        });

        it("with no false positives", () => {
            assert.lengthOf(actualFailures, 3);
        });
    });

    function runLinterWithConfiguration(config: any): Lint.LintResult {
        const relativePath = path.join("test", "files", "tsx", fileName);
        const source = fs.readFileSync(relativePath, "utf8");
        const options: Lint.ILinterOptions = {
            configuration: config,
            formatter: "json",
            formattersDirectory: null,
            rulesDirectory: null
        };
        const ll = new Lint.Linter(relativePath, source, options);
        return ll.lint();
    }
});
