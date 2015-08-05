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

    it("doesn't blow up", () => {
        const validConfiguration = {};
        const result = runLinterWithConfiguration(validConfiguration);
        const parsedResult = JSON.parse(result.output);

        assert.lengthOf(parsedResult, 0);
    });

    it("catches common lint failures", () => {
        const QuotemarkRule = Lint.Test.getRule("quotemark");
        const quotemarkFailure = Lint.Test.createFailuresOnFile(`tsx/${fileName}`, QuotemarkRule.DOUBLE_QUOTE_FAILURE);

        const result = runLinterWithConfiguration({
            rules: {
                "quotemark": [true, "double"]
            }
        });
        const parsedResult = JSON.parse(result.output);
        const actualFailures: Lint.RuleFailure[] = [];
        for (let failure of parsedResult) {
            const startArray = [failure.startPosition.line + 1, failure.startPosition.character + 1];
            const endArray = [failure.endPosition.line + 1, failure.endPosition.character + 1];
            actualFailures.push(Lint.Test.createFailure(`tsx/${fileName}`, startArray, endArray, failure.failure));
        }
        const expectedFailure1 = quotemarkFailure([1, 24], [1, 31]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        assert.lengthOf(actualFailures, 1);
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
