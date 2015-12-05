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

import {RuleFailure, TestUtils} from "../lint";

describe("<label-position>", () => {
    const LabelPositionRule = TestUtils.getRule("label-position");
    const fileName = "rules/labelpos.test.ts";

    it("enforces that labels are correctly positioned", () => {
        const createFailure = TestUtils.createFailuresOnFile(fileName, LabelPositionRule.FAILURE_STRING);
        const expectedFailures: RuleFailure[] = [
            createFailure([2, 5], [2, 9]),
            createFailure([5, 5], [5, 9])
        ];
        const actualFailures = TestUtils.applyRuleOnFile(fileName, LabelPositionRule);

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
