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

describe("<no-unreachable>", () => {
    it("restricts the use of unreachable code statements", () => {
        var fileName = "rules/nounreachable.test.ts";
        var NoUnreachableRule = Lint.Test.getRule("no-unreachable");
        var createFailure = Lint.Test.createFailuresOnFile(fileName, NoUnreachableRule.FAILURE_STRING);
        var expectedFailures: Lint.RuleFailure[] = [
            createFailure([6, 5], [6, 11]),
            createFailure([13, 9], [13, 15]),
            createFailure([25, 9], [25, 27]),
            createFailure([28, 9], [28, 15]),
            createFailure([88, 5], [88, 15])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoUnreachableRule);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
