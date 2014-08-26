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

describe("<no-duplicate-key>", () => {
    it("forbids duplicate keys in object literals", () => {
        var fileName = "rules/dupkey.test.ts";
        var NoDuplicateKeyRule = Lint.Test.getRule("no-duplicate-key");
        var failureString = NoDuplicateKeyRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoDuplicateKeyRule);
        var createFailure1 = Lint.Test.createFailuresOnFile(fileName, failureString + "axa'");
        var createFailure2 = Lint.Test.createFailuresOnFile(fileName, failureString + "bd'");
        var createFailure3 = Lint.Test.createFailuresOnFile(fileName, failureString + "duplicated'");
        var expectedFailures = [
            createFailure1([10, 5], [10, 8]),
            createFailure2([13, 5], [13, 7]),
            createFailure1([14, 5], [14, 8]),
            createFailure3([31, 5], [31, 15])
        ];

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
