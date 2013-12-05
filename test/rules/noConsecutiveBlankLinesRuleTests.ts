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

describe("<no-consecutive-blank-lines>", () => {
    var NoConsecutiveBlankLinesRule = Lint.Test.getRule("no-consecutive-blank-lines");

    it("ensures comments start with a space and a lowercase letter", () => {
        var fileName = "rules/blanklines.test.ts";
        var createFailure = Lint.Test.createFailuresOnFile(fileName, NoConsecutiveBlankLinesRule.FAILURE_STRING);
        var expectedFailure1 = createFailure([2, 1], [3, 1]);
        var expectedFailure2 = createFailure([9, 1], [10, 1]);
        var expectedFailure3 = createFailure([14, 1], [15, 1]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoConsecutiveBlankLinesRule);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        assert.lengthOf(actualFailures, 3);
    });
});
