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

describe("<no-any>", () => {
    const fileName = "rules/noany.test.ts";
    const NoAnyRule = Lint.Test.getRule("no-any");
    const actualFailures = Lint.Test.applyRuleOnFile(fileName, NoAnyRule);

    const createFailure = Lint.Test.createFailuresOnFile(fileName, NoAnyRule.FAILURE_STRING);

    it("disallows variables with type 'any'", () => {
        const expectedFailures = [
            createFailure([1, 8], [1, 11]),
            createFailure([7, 8], [7, 11]),
            createFailure([8, 8], [8, 11])
        ];

        for (let failure of expectedFailures) {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        }
    });

    it("disallows functions with parameter type 'any'", () => {
        const expectedFailure = createFailure([3, 17], [3, 20]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("disallows functions with return type 'any'", () => {
        const expectedFailure = createFailure([3, 24], [3, 27]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("catches destructuring bindings with member types of 'any'", () => {
        const expectedFailure = createFailure([10, 23], [10, 26]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("finds the expected number of errors", () => {
       assert.equal(actualFailures.length, 6);
    });

});
