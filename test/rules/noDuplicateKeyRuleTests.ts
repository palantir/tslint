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

describe("<no-duplicate-key>", () => {
    const NoDuplicateKeyRule = TestUtils.getRule("no-duplicate-key");
    const fileName = "rules/dupkey.test.ts";
    const failureString = NoDuplicateKeyRule.FAILURE_STRING;

    it("forbids duplicate keys in object literals", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, NoDuplicateKeyRule);
        const createFailure1 = TestUtils.createFailuresOnFile(fileName, failureString + "axa'");
        const createFailure2 = TestUtils.createFailuresOnFile(fileName, failureString + "bd'");
        const createFailure3 = TestUtils.createFailuresOnFile(fileName, failureString + "duplicated'");
        const expectedFailures = [
            createFailure1([10, 5], [10, 8]),
            createFailure2([13, 5], [13, 7]),
            createFailure1([14, 5], [14, 8]),
            createFailure3([31, 5], [31, 15])
        ];

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
