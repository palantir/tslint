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

describe("<interface-name>", () => {
    const InterfaceNameRule = TestUtils.getRule("interface-name");
    const fileName = "rules/interfacename.test.ts";

    it("ensures interface names always start with a capital I", () => {
        const createFailure = TestUtils.createFailuresOnFile(fileName, InterfaceNameRule.FAILURE_STRING);
        const expectedFailure1 = createFailure([5, 11], [5, 32]);
        const actualFailures = TestUtils.applyRuleOnFile(fileName, InterfaceNameRule);

        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        assert.lengthOf(actualFailures, 1);
    });
});
