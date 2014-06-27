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

describe("<forin>", () => {
    it("enforces filtering for the body of a for...in statement", () => {
        var fileName = "rules/forin.test.ts";
        var ForInRule = Lint.Test.getRule("forin");
        var failureString = ForInRule.FAILURE_STRING;
        var firstFailure = Lint.Test.createFailure(fileName, [2, 5], [4, 6], failureString);
        var secondFailure = Lint.Test.createFailure(fileName, [6, 5], [11, 6], failureString);
        var expectedFailures = [firstFailure, secondFailure];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, ForInRule);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
