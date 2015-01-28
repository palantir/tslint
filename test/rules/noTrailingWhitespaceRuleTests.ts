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

describe("<no-trailing-whitespace>", () => {
    it("forbids trailing whitespace", () => {
        var fileName = "rules/trailing.test.ts";
        var NoTrailingWhitespaceRule = Lint.Test.getRule("no-trailing-whitespace");
        var failureString = NoTrailingWhitespaceRule.FAILURE_STRING;
        var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoTrailingWhitespaceRule);
        var expectedFailure1 = createFailure([2, 24], [2, 28]);
        var expectedFailure2 = createFailure([3, 32], [3, 36]);
        var expectedFailure3 = createFailure([5, 1], [5, 5]);
        var expectedFailure4 = createFailure([6, 1], [6, 5]);
        var expectedFailure5 = createFailure([9, 2], [9, 6]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure5);
    });
});
