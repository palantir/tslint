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

describe("<no-duplicate-variable>", () => {
    it("ensures that variable declarations are unique within a scope", () => {
        var fileName = "rules/duplicate-variable.test.ts";
        var NoDuplicateVariableRule = Lint.Test.getRule("no-duplicate-variable");
        var failureString = NoDuplicateVariableRule.FAILURE_STRING + "duplicated'";

        var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            createFailure([11, 13], [11, 23]),
            createFailure([22, 9], [22, 19]),
            createFailure([26, 5], [26, 15])
        ];

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoDuplicateVariableRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
