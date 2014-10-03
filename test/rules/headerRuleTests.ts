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

describe("<header>", () => {
    var HeaderRule = Lint.Test.getRule("header");
    var options = [true, "Copyright 2014 Palantir Technologies, Inc."];

    it("forbids the first token from not including the header", () => {
        var fileName = "rules/header1.test.ts";
        var expectedFailure = Lint.Test.createFailuresOnFile(fileName, HeaderRule.NOT_FOUND_FAILURE_STRING)([1, 1], [1, 1]);
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, HeaderRule, options);
        assert.lengthOf(actualFailures, 1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });


    it("forbids whitespace from showing up before a possible header", () => {
        var fileName = "rules/header2.test.ts";
        var expectedFailure = Lint.Test.createFailuresOnFile(fileName, HeaderRule.WHITESPACE_FAILURE_STRING)([1, 1], [1, 1]);
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, HeaderRule, options);
        assert.lengthOf(actualFailures, 1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });


    it("ensures a header that matches a given pattern is included at the top of the file", () => {
        var fileName3 = "rules/header3.test.ts";
        var expectedFailure3 = Lint.Test.createFailuresOnFile(fileName3, HeaderRule.PATTERN_FAILURE_STRING)([1, 1], [15, 3]);
        var actualFailures3 = Lint.Test.applyRuleOnFile(fileName3, HeaderRule, options);
        actualFailures3.forEach(function(f) { console.log(f); });
        assert.lengthOf(actualFailures3, 1);
        Lint.Test.assertContainsFailure(actualFailures3, expectedFailure3);

        var fileName4 = "rules/header4.test.ts";
        var actualFailures4 = Lint.Test.applyRuleOnFile(fileName4, HeaderRule, options);
        assert.lengthOf(actualFailures4, 0);
    });
});
