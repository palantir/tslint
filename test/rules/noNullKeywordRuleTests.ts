/**
 * @license
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

describe("<no-null-keyword>", () => {
    const fileName = "rules/nonullkeyword.test.ts";
    const NoNullKeywordRule = TestUtils.getRule("no-null-keyword");
    const actualFailures = TestUtils.applyRuleOnFile(fileName, NoNullKeywordRule);

    const createFailure = TestUtils.createFailuresOnFile(fileName, NoNullKeywordRule.FAILURE_STRING);

    it("disallows assignment 'null'", () => {
        assert.equal(actualFailures.length, 2);

        const expectedFailures = [
            createFailure([1, 9], [1, 13]),
            createFailure([2, 13], [2, 17])
        ];

        for (let failure of expectedFailures) {
            TestUtils.assertContainsFailure(actualFailures, failure);
        }
    });
});
