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

describe("<sort-object-literal-keys>", () => {
    it("forbids unsorted keys in object literals", () => {
        var fileName = "rules/sortedkey.test.ts";
        var SortedKeyRule = Lint.Test.getRule("sort-object-literal-keys");
        var failureString = SortedKeyRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, SortedKeyRule);
        var createFailure1 = Lint.Test.createFailuresOnFile(fileName, failureString + "a'");
        var createFailure2 = Lint.Test.createFailuresOnFile(fileName, failureString + "a'");
        var createFailure3 = Lint.Test.createFailuresOnFile(fileName, failureString + "aa'");
        var createFailure4 = Lint.Test.createFailuresOnFile(fileName, failureString + "asdf'");
        var createFailure5 = Lint.Test.createFailuresOnFile(fileName, failureString + "asdfn'");
        var expectedFailures = [
            createFailure1([8, 5], [8, 6]),
            createFailure2([20, 5], [20, 6]),
            createFailure3([37, 9], [37, 11]),
            createFailure4([50, 5], [50, 9]),
            createFailure5([60, 5], [60, 10])
        ];

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
