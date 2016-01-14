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

describe("<quotemark>", () => {
    const QuoteMarkRule = TestUtils.getRule("quotemark");
    const fileName = "rules/quotemark.test.ts";
    const tsxFileName = "rules/quotemark.test.tsx";
    const singleFailureString = QuoteMarkRule.SINGLE_QUOTE_FAILURE;
    const doubleFailureString = QuoteMarkRule.DOUBLE_QUOTE_FAILURE;

    it("enforces single quotes", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, QuoteMarkRule, [true, "single"]);
        const expectedFailures = [
            TestUtils.createFailure(fileName, [2, 19], [2, 28], singleFailureString),
            TestUtils.createFailure(fileName, [3, 26], [3, 48], singleFailureString)
        ];

        assert.equal(actualFailures.length, 2);
        assert.isTrue(actualFailures[0].equals(expectedFailures[0]));
        assert.isTrue(actualFailures[1].equals(expectedFailures[1]));
    });

    it("enforces double quotes", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, QuoteMarkRule, [true, "double"]);
        const expectedFailures = [
          TestUtils.createFailure(fileName, [1, 14], [1, 22], doubleFailureString),
          TestUtils.createFailure(fileName, [4, 26], [4, 48], doubleFailureString)
        ];

        assert.equal(actualFailures.length, 2);
        assert.isTrue(actualFailures[0].equals(expectedFailures[0]));
        assert.isTrue(actualFailures[1].equals(expectedFailures[1]));
    });

    it("enforces single quotes but allow other quote marks to avoid having to escape", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, QuoteMarkRule, [true, "single", "avoid-escape"]);
        const expectedFailure = TestUtils.createFailure(fileName, [2, 19], [2, 28], singleFailureString);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });

    it("enforces double quotes but allow other quote marks to avoid having to escape", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, QuoteMarkRule, [true, "double", "avoid-escape"]);
        const expectedFailure = TestUtils.createFailure(fileName, [1, 14], [1, 22], doubleFailureString);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });

    it("enforces double quotes and jsx single quotes", () => {
        const actualFailures = TestUtils.applyRuleOnFile(tsxFileName, QuoteMarkRule, [true, "double", "jsx-single"]);

        const expectedFailures = [
            TestUtils.createFailure(tsxFileName, [4, 20], [4, 27], singleFailureString),
            TestUtils.createFailure(tsxFileName, [4, 44], [4, 47], doubleFailureString)
        ];
        assert.equal(actualFailures.length, 2);
        assert.isTrue(actualFailures[0].equals(expectedFailures[0]));
        assert.isTrue(actualFailures[1].equals(expectedFailures[1]));
    });

    it("enforces single quotes and jsx double quotes", () => {
        const actualFailures = TestUtils.applyRuleOnFile(tsxFileName, QuoteMarkRule, [true, "single", "jsx-double"]);

        const expectedFailures = [
            TestUtils.createFailure(tsxFileName, [1, 24], [1, 31], singleFailureString),
            TestUtils.createFailure(tsxFileName, [4, 31], [4, 35], doubleFailureString),
            TestUtils.createFailure(tsxFileName, [4, 50], [4, 53], singleFailureString)
        ];
        assert.equal(actualFailures.length, 3);
        assert.isTrue(actualFailures[0].equals(expectedFailures[0]));
        assert.isTrue(actualFailures[1].equals(expectedFailures[1]));
        assert.isTrue(actualFailures[2].equals(expectedFailures[2]));
    });

});
