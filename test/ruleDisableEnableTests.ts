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

import {ILinterOptions, Linter, RuleFailure, TestUtils} from "./lint";

describe("Enable and Disable Rules", () => {
    const {readFileSync} = require("fs");
    const {join} = require("path");

    it("is enabled and disabled in all the right places", () => {
        const validConfiguration = {rules: {
            "variable-name": true,
            "quotemark": [true, "double"],
        }};

        const relativePath = join("test", "files", "enabledisable.test.ts");
        const source = readFileSync(relativePath, "utf8");

        const options: ILinterOptions = {
            configuration: validConfiguration,
            formatter: "json",
            formattersDirectory: null,
            rulesDirectory: null,
        };

        const QuotemarkRule = TestUtils.getRule("quotemark");
        const VariableNameRule = TestUtils.getRule("variable-name");

        const quotemarkFailure = TestUtils.createFailuresOnFile("enabledisable.test.ts", QuotemarkRule.DOUBLE_QUOTE_FAILURE);
        const variableNameFailure = TestUtils.createFailuresOnFile("enabledisable.test.ts", VariableNameRule.FORMAT_FAILURE);

        const expectedFailure1 = variableNameFailure([2, 5], [2, 10]);
        const expectedFailure2 = variableNameFailure([10, 5], [10, 10]);

        const expectedFailure3 = quotemarkFailure([2, 13], [2, 19]);
        const expectedFailure4 = quotemarkFailure([8, 13], [8, 19]);
        const expectedFailure5 = quotemarkFailure([10, 13], [10, 19]);
        const expectedFailure6 = quotemarkFailure([16, 13], [16, 19]);

        const expectedFailure7 = quotemarkFailure([39, 13], [39, 19]);
        const expectedFailure8 = variableNameFailure([41, 5], [41, 10]);

        const ll = new Linter(relativePath, source, options);
        const result = ll.lint();
        const parsedResult = JSON.parse(result.output);
        const actualFailures: RuleFailure[] = [];
        for (let failure of parsedResult) {
            const startArray = [failure.startPosition.line + 1, failure.startPosition.character + 1];
            const endArray = [failure.endPosition.line + 1, failure.endPosition.character + 1];
            actualFailures.push(TestUtils.createFailure("enabledisable.test.ts", startArray, endArray, failure.failure));
        }

        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure2);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure3);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure4);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure5);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure6);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure7);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure8);
        assert.lengthOf(actualFailures, 8);
    });
});
