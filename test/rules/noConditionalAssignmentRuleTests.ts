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

describe("<no-conditional-assignment>", () => {
    const fileName = "rules/nocondassign.test.ts";
    const NoConditionalAssignmentRule = Lint.Test.getRule("no-conditional-assignment");
    const createFailure = Lint.Test.createFailuresOnFile(fileName, NoConditionalAssignmentRule.FAILURE_STRING);
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, NoConditionalAssignmentRule);
    });

    it("should detect assignments in if conditionals", () => {
        const expectedFailure1 = createFailure([19, 5], [19, 10]);
        const expectedFailure2 = createFailure([20, 11], [20, 16]);
        const expectedFailure3 = createFailure([21, 10], [21, 15]);
        const expectedFailure4 = createFailure([31, 5], [31, 11]);
        const expectedFailure5 = createFailure([32, 16], [32, 23]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure5);
    });

    it("should detect assignments in do-while conditionals", () => {
        const expectedFailure1 = createFailure([23, 15], [23, 20]);
        const expectedFailure2 = createFailure([34, 15], [34, 21]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("should detect assignments in while conditionals", () => {
        const expectedFailure1 = createFailure([25, 8], [25, 13]);
        const expectedFailure2 = createFailure([26, 9], [26, 19]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("should detect assignments in for conditionals", () => {
        const expectedFailure1 = createFailure([28, 17], [28, 22]);
        const expectedFailure2 = createFailure([29, 21], [29, 26]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("no false positives for rule", () => {
        assert.lengthOf(actualFailures, 11);
    });
});
