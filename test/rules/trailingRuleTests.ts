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

describe("<trailing>", () => {
    it("forbids trailing whitespace", () => {
        var fileName = "rules/trailing.test.ts";
        var TrailingRule = Lint.Test.getRule("trailing");
        var failureString = TrailingRule.FAILURE_STRING;
        var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, TrailingRule);
        var expectedFailure1 = createFailure([2, 24], [2, 28]);
        var expectedFailure2 = createFailure([3, 32], [3, 36]);
        var expectedFailure3 = createFailure([5, 2], [5, 6]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });
});
