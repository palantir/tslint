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

describe("<label-undefined>", () => {
    const LabelUndefinedRule = TestUtils.getRule("label-undefined");
    const fileName = "rules/label-undefined.test.ts";
    const failureString = LabelUndefinedRule.FAILURE_STRING;

    it("forbids the use of undefined labels", () => {
        const expectedFailures: RuleFailure[] = [
            TestUtils.createFailure(fileName, [6, 9], [6, 14], failureString + "lab1'"),
            TestUtils.createFailure(fileName, [13, 9], [13, 17], failureString + "lab2'"),
            TestUtils.createFailure(fileName, [27, 17], [27, 22], failureString + "lab3'"),
            TestUtils.createFailure(fileName, [36, 9], [36, 17], failureString + "lab4'")
        ];
        const actualFailures = TestUtils.applyRuleOnFile(fileName, LabelUndefinedRule);

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
