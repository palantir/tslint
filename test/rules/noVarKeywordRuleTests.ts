/*
 * Copyright 2015 Palantir Technologies, Inc.
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

describe("<no-var-keyword>", () => {
    const NoVarKeywordRule = TestUtils.getRule("no-var-keyword");
    const fileName = "rules/novarkeyword.test.ts";

    it("disallows use of creating variables with 'var'", () => {
        const createFailure = TestUtils.createFailuresOnFile(fileName, NoVarKeywordRule.FAILURE_STRING);
        const expectedFailures = [
            createFailure([1, 1], [1, 4]),
            createFailure([4, 5], [4, 8]),
            createFailure([7, 1], [7, 4]),
            createFailure([10, 1], [10, 4]),
        ];
        const actualFailures = TestUtils.applyRuleOnFile(fileName, NoVarKeywordRule);

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
