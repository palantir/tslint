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

describe("<one-line>", () => {
    const fileName = "rules/oneline.test.ts";
    const OneLineRule = Lint.Test.getRule("one-line");
    const braceFailure = OneLineRule.BRACE_FAILURE_STRING;
    const elseFailure = OneLineRule.ELSE_FAILURE_STRING;
    const whitespaceFailure = OneLineRule.WHITESPACE_FAILURE_STRING;
    const catchFailure = OneLineRule.CATCH_FAILURE_STRING;
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        const options = [true, "check-open-brace", "check-catch", "check-else", "check-whitespace"];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, OneLineRule, options);
        assert.lengthOf(actualFailures, 14);
    });

    it("enforces rules only when enabled", () => {
        const failures = Lint.Test.applyRuleOnFile(fileName, OneLineRule);
        assert.equal(failures.length, 0);
    });

    it("enforces module brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [2, 1], [2, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces enumeration brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [4, 5], [4, 6], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces function brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [12, 5], [12, 6], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces if brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [14, 9], [14, 10], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces else position", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [17, 9], [17, 13], elseFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces interface brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [25, 1], [25, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces object literal brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [30, 1], [30, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces block brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [36, 1], [36, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces switch brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [41, 1], [41, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces try brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [51, 1], [51, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces catch position", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [54, 1], [54, 6], catchFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces catch brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [55, 1], [55, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces class brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [70, 1], [70, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace before a brace", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [59, 14], [59, 15], whitespaceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
