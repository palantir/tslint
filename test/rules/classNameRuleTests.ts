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

describe("<class-name>", () => {
    const ClassNameRule = TestUtils.getRule("class-name");
    const fileName = "rules/classname.test.ts";

    it("ensures class names are always pascal-cased", () => {
        const createFailure = TestUtils.createFailuresOnFile(fileName, ClassNameRule.FAILURE_STRING);
        const expectedFailures = [
            createFailure([5, 7], [5, 23]),
            createFailure([9, 7], [9, 33])
        ];
        const actualFailures = TestUtils.applyRuleOnFile(fileName, ClassNameRule);

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
