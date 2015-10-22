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
import * as Lint from "../lint";

describe("<quotemark>", () => {
    const QuoteMarkRule = Lint.Test.getRule("quotemark");
    const fileName = "rules/quotemark.test.ts";
    const singleFailureString = QuoteMarkRule.SINGLE_QUOTE_FAILURE;
    const doubleFailureString = QuoteMarkRule.DOUBLE_QUOTE_FAILURE;

    it("enforces single quotes", () => {
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, QuoteMarkRule, [true, "single"]);
        const expectedFailures = [
            Lint.Test.createFailure(fileName, [2, 19], [2, 28], singleFailureString),
            Lint.Test.createFailure(fileName, [3, 26], [3, 48], singleFailureString)
        ];

        assert.equal(actualFailures.length, 2);
        assert.isTrue(actualFailures[0].equals(expectedFailures[0]));
        assert.isTrue(actualFailures[1].equals(expectedFailures[1]));
    });

    it("enforces double quotes", () => {
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, QuoteMarkRule, [true, "double"]);
        const expectedFailures = [
          Lint.Test.createFailure(fileName, [1, 14], [1, 22], doubleFailureString),
          Lint.Test.createFailure(fileName, [4, 26], [4, 48], doubleFailureString)
        ];

        assert.equal(actualFailures.length, 2);
        assert.isTrue(actualFailures[0].equals(expectedFailures[0]));
        assert.isTrue(actualFailures[1].equals(expectedFailures[1]));
    });

    it("enforces single quotes but allow other quote marks to avoid having to escape", () => {
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, QuoteMarkRule, [true, "single", "avoid-escape"]);
        const expectedFailure = Lint.Test.createFailure(fileName, [2, 19], [2, 28], singleFailureString);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });

    it("enforces double quotes but allow other quote marks to avoid having to escape", () => {
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, QuoteMarkRule, [true, "double", "avoid-escape"]);
        const expectedFailure = Lint.Test.createFailure(fileName, [1, 14], [1, 22], doubleFailureString);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
