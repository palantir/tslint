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

describe("<no-consecutive-blank-lines>", () => {
    const NoConsecutiveBlankLinesRule = TestUtils.getRule("no-consecutive-blank-lines");
    const fileName = "rules/blanklines.test.ts";

    it("ensures there is at most one consecutive blank line", () => {
        const createFailure = TestUtils.createFailuresOnFile(fileName, NoConsecutiveBlankLinesRule.FAILURE_STRING);
        const expectedFailure1 = createFailure([2, 1], [3, 1]);
        const expectedFailure2 = createFailure([9, 1], [10, 1]);
        const expectedFailure3 = createFailure([14, 1], [15, 1]);

        const actualFailures = TestUtils.applyRuleOnFile(fileName, NoConsecutiveBlankLinesRule);

        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure2);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure3);
        assert.lengthOf(actualFailures, 3);
    });
});
