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

/// <reference path='references.ts' />

var fs = require("fs");

describe("Enable and Disable Rules", () => {
    var path = require("path");

    it("is enabled and disabled in all the right places", () => {
        var validConfiguration = {rules: {
            "variable-name": true,
            "quotemark": [true, "double"]
        }};

        var relativePath = path.join("test", "files", "rules/enabledisable.test.ts");
        var source = fs.readFileSync(relativePath, "utf8");

        var options = {
            formatter: "json",
            configuration: validConfiguration,
            rulesDirectory: null,
            formattersDirectory: null
        };

        var QuotemarkRule = Lint.Test.getRule("quotemark");
        var VariableNameRule = Lint.Test.getRule("variable-name");

        var quotemarkFailure = Lint.Test.createFailuresOnFile("rules/enabledisable.test.ts", QuotemarkRule.DOUBLE_QUOTE_FAILURE);
        var variableNameFailure = Lint.Test.createFailuresOnFile("rules/enabledisable.test.ts", VariableNameRule.FAILURE_STRING);

        var expectedFailure1 = variableNameFailure([2, 5], [2, 10]);
        var expectedFailure2 = variableNameFailure([10, 5], [10, 10]);

        var expectedFailure3 = quotemarkFailure([2, 13], [2, 19]);
        var expectedFailure4 = quotemarkFailure([8, 13], [8, 19]);
        var expectedFailure5 = quotemarkFailure([10, 13], [10, 19]);
        var expectedFailure6 = quotemarkFailure([16, 13], [16, 19]);


        var ll = new Lint.Linter(relativePath, source, options);
        var result = ll.lint();
        var parsedResult = JSON.parse(result.output);
        var actualFailures: Lint.RuleFailure[] = [];
        parsedResult.forEach((failure) => {
            var startArray = [failure.startPosition.line + 1, failure.startPosition.character + 1];
            var endArray = [failure.endPosition.line + 1, failure.endPosition.character + 1];
            actualFailures.push(Lint.Test.createFailure("rules/enabledisable.test.ts", startArray, endArray, failure.failure));
        });

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure5);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure6);
        assert.lengthOf(actualFailures, 6);
    });
});
