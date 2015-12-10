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

import {RuleFailure, TestUtils} from "../lint";

describe("<no-conditional-assignment>", () => {
    const fileName = "rules/nocondassign.test.ts";
    const NoConditionalAssignmentRule = TestUtils.getRule("no-conditional-assignment");
    const createFailure = TestUtils.createFailuresOnFile(fileName, NoConditionalAssignmentRule.FAILURE_STRING);
    let actualFailures: RuleFailure[];

    before(() => {
        actualFailures = TestUtils.applyRuleOnFile(fileName, NoConditionalAssignmentRule);
    });

    it("should detect assignments in if conditionals", () => {
        const expectedFailure1 = createFailure([19, 5], [19, 10]);
        const expectedFailure2 = createFailure([20, 11], [20, 16]);
        const expectedFailure3 = createFailure([21, 10], [21, 15]);
        const expectedFailure4 = createFailure([31, 5], [31, 11]);
        const expectedFailure5 = createFailure([32, 16], [32, 23]);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure2);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure3);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure4);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure5);
    });

    it("should detect assignments in do-while conditionals", () => {
        const expectedFailure1 = createFailure([23, 15], [23, 20]);
        const expectedFailure2 = createFailure([34, 15], [34, 21]);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("should detect assignments in while conditionals", () => {
        const expectedFailure1 = createFailure([25, 8], [25, 13]);
        const expectedFailure2 = createFailure([26, 9], [26, 19]);
        const expectedFailure3 = createFailure([35, 9], [35, 14]);
        const expectedFailure4 = createFailure([35, 33], [35, 38]);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure2);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure3);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure4);
    });

    it("should detect assignments in for conditionals", () => {
        const expectedFailure1 = createFailure([28, 17], [28, 22]);
        const expectedFailure2 = createFailure([29, 21], [29, 26]);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("no false positives for rule", () => {
        assert.lengthOf(actualFailures, 13);
    });
});
