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

import {TestUtils} from "../lint";

describe("<no-require-imports>", () => {
    const Rule = TestUtils.getRule("no-require-imports");
    const fileName = "rules/norequireimports.test.ts";

    it("forbids require() imports", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, Rule);

        assert(actualFailures.length === 5, "Expected 5 failures, got " + actualFailures.length);
        const failure1 = TestUtils.createFailuresOnFile(fileName, Rule.FAILURE_STRING)([1, 11], [1, 25]);
        const failure2 = TestUtils.createFailuresOnFile(fileName, Rule.FAILURE_STRING)([3, 12], [3, 27]);
        const failure3 = TestUtils.createFailuresOnFile(fileName, Rule.FAILURE_STRING)([11, 12], [11, 27]);
        const failure4 = TestUtils.createFailuresOnFile(fileName, Rule.FAILURE_STRING)([12, 12], [12, 27]);
        const failure5 = TestUtils.createFailuresOnFile(fileName, Rule.FAILURE_STRING)([15, 15], [15, 30]);

        TestUtils.assertContainsFailure(actualFailures, failure1);
        TestUtils.assertContainsFailure(actualFailures, failure2);
        TestUtils.assertContainsFailure(actualFailures, failure3);
        TestUtils.assertContainsFailure(actualFailures, failure4);
        TestUtils.assertContainsFailure(actualFailures, failure5);
    });
});
