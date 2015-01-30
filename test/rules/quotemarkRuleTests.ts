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

/// <reference path='../references.ts' />

describe("<quotemark>", () => {
    var fileName = "rules/quotemark.test.ts";
    var QuoteMarkRule = Lint.Test.getRule("quotemark");
    var singleFailure = QuoteMarkRule.SINGLE_QUOTE_FAILURE;
    var doubleFailure = QuoteMarkRule.DOUBLE_QUOTE_FAILURE;

    it("enforces single quotes", () => {
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, QuoteMarkRule, [true, "single"]);
        var expectedFailure = Lint.Test.createFailure(fileName, [2, 19], [2, 28], singleFailure);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });

    it("enforces double quotes", () => {
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, QuoteMarkRule, [true, "double"]);
        var expectedFailure = Lint.Test.createFailure(fileName, [1, 14], [1, 22], doubleFailure);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
