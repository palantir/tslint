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

describe("<typed-functions>", () => {
    describe("enabled", () => {
        var fileName = "rules/typed-functions.test.ts";
        var actualFailures;
        var TypedFunctionsRule = Lint.Test.getRule("typed-functions");

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedFunctionsRule, true);
            assert.equal(actualFailures.length, 2);
        });

        it("ensures a function's parameters are typed", () => {
            var failureString = "expected type to have a type.";
            var expectedFailure = Lint.Test.createFailure(fileName, [1, 31], [1, 32], failureString);

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("ensures a function is typed", () => {
            var failureString = TypedFunctionsRule.FAILURE_STRING;
            var expectedFailure = Lint.Test.createFailure(fileName, [1, 34], [1, 35], failureString);

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });
    });
});
