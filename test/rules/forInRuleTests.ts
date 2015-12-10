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

describe("<forin>", () => {
    const ForInRule = TestUtils.getRule("forin");
    const fileName = "rules/forin.test.ts";
    const failureString = ForInRule.FAILURE_STRING;

    it("enforces filtering for the body of a for...in statement", () => {
        const expectedFailures = [
            TestUtils.createFailure(fileName, [2, 5], [4, 6], failureString),
            TestUtils.createFailure(fileName, [6, 5], [11, 6], failureString)
        ];
        const actualFailures = TestUtils.applyRuleOnFile(fileName, ForInRule);

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
