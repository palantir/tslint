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

describe("<no-duplicate-let>", () => {
    it("ensures that let declarations are unique within a block scope", () => {
        var fileName = "rules/no-duplicate-let.test.ts";
        var NoDuplicateLetRule = Lint.Test.getRule("no-duplicate-let");
        var failureString = NoDuplicateLetRule.FAILURE_STRING + "duplicated'";

        var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            Lint.Test.createFailure(fileName, [8, 5], [8, 6], NoDuplicateLetRule.FAILURE_STRING + "b'"),
            Lint.Test.createFailure(fileName, [16, 13], [16, 14], NoDuplicateLetRule.FAILURE_STRING + "c'"),
            Lint.Test.createFailure(fileName, [22, 9], [22, 10], NoDuplicateLetRule.FAILURE_STRING + "d'")
        ];

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoDuplicateLetRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
