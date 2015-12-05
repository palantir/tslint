/*
 * Copyright 2014 Palantir Technologies, Inc.
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

describe("<no-constructor-variable-declarations>", () => {
    const Rule = TestUtils.getRule("no-constructor-vars");
    const fileName = "rules/noconstructorvars.test.ts";
    const failureString = Rule.FAILURE_STRING_PART;

    it("no constructor variable declarations", () => {
        const failureFoo = TestUtils.createFailuresOnFile(fileName, "'foo'" + failureString);
        const failureBar = TestUtils.createFailuresOnFile(fileName, "'bar'" + failureString);

        const expectedFailures = [
            failureFoo([3, 17], [3, 24]),
            failureFoo([9, 17], [9, 24]),
            failureBar([9, 38], [9, 44])
        ];
        const actualFailures = TestUtils.applyRuleOnFile(fileName, Rule);
        assert.lengthOf(actualFailures, 3);

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
