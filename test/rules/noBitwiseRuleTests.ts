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

describe("<no-bitwise>", () => {
    var NoBitwiseRule = Lint.Test.getRule("no-bitwise");

    it("forbids access to bitwise operators", () => {
        var fileName = "rules/bitwise.test.ts";
        var createFailure = Lint.Test.createFailuresOnFile(fileName, NoBitwiseRule.FAILURE_STRING);
        var expectedFailures: Lint.RuleFailure[] = [
            createFailure([2, 10], [2, 15]),
            createFailure([3, 10], [3, 28]),
            createFailure([3, 22], [3, 27]),
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoBitwiseRule);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
