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
import * as Lint from "./lint";

describe("Enable and Disable Rules", () => {
    const {readFileSync} = require("fs");
    const {join} = require("path");

    it("is enabled and disabled in all the right places", () => {
        const validConfiguration = {rules: {
            "variable-name": true,
            "quotemark": [true, "double"]
        }};

        const relativePath = join("test", "files", "enabledisable.test.ts");
        const source = readFileSync(relativePath, "utf8");

        const options: Lint.ILinterOptions = {
            configuration: validConfiguration,
            formatter: "json",
            formattersDirectory: null,
            rulesDirectory: null
        };

        const QuotemarkRule = Lint.Test.getRule("quotemark");
        const VariableNameRule = Lint.Test.getRule("variable-name");

        const quotemarkFailure = Lint.Test.createFailuresOnFile("enabledisable.test.ts", QuotemarkRule.DOUBLE_QUOTE_FAILURE);
        const variableNameFailure = Lint.Test.createFailuresOnFile("enabledisable.test.ts", VariableNameRule.FAILURE_STRING);

        const expectedFailure1 = variableNameFailure([2, 5], [2, 10]);
        const expectedFailure2 = variableNameFailure([10, 5], [10, 10]);

        const expectedFailure3 = quotemarkFailure([2, 13], [2, 19]);
        const expectedFailure4 = quotemarkFailure([8, 13], [8, 19]);
        const expectedFailure5 = quotemarkFailure([10, 13], [10, 19]);
        const expectedFailure6 = quotemarkFailure([16, 13], [16, 19]);

        const ll = new Lint.Linter(relativePath, source, options);
        const result = ll.lint();
        const parsedResult = JSON.parse(result.output);
        const actualFailures: Lint.RuleFailure[] = [];
        for (let failure of parsedResult) {
            const startArray = [failure.startPosition.line + 1, failure.startPosition.character + 1];
            const endArray = [failure.endPosition.line + 1, failure.endPosition.character + 1];
            actualFailures.push(Lint.Test.createFailure("enabledisable.test.ts", startArray, endArray, failure.failure));
        }

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure5);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure6);
        assert.lengthOf(actualFailures, 6);
    });
});
