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

describe("<trailing-comma>", () => {
    const TrailingCommaRule = Lint.Test.getRule("trailing-comma");
    const fileName = "rules/trailingcomma.test.ts";

    describe("multiline", () => {
        it("restricts the use of trailing commas if set to never", () => {
            const options = [true, {multiline: "never"}];

            const expectedFailure1 = Lint.Test.createFailure(fileName, [6, 2], [6, 3], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure2 = Lint.Test.createFailure(fileName, [5, 15], [5, 16], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure3 = Lint.Test.createFailure(fileName, [17, 11], [17, 12], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure4 = Lint.Test.createFailure(fileName, [27, 7], [27, 8], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure5 = Lint.Test.createFailure(fileName, [49, 7], [49, 8], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure6 = Lint.Test.createFailure(fileName, [59, 8], [59, 9], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure7 = Lint.Test.createFailure(fileName, [77, 11], [77, 12], TrailingCommaRule.FAILURE_STRING_NEVER);
            const actualFailures = Lint.Test.applyRuleOnFile(fileName, TrailingCommaRule, options);

            Lint.Test.assertFailuresEqual(actualFailures, [
                expectedFailure1,
                expectedFailure2,
                expectedFailure3,
                expectedFailure4,
                expectedFailure5,
                expectedFailure6,
                expectedFailure7
            ]);
        });

        it("enforces the use of trailing commas if set to always", () => {
            const options = [true, {multiline: "always"}];

            const expectedFailure1 = Lint.Test.createFailure(fileName, [13, 2], [13, 3], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure2 = Lint.Test.createFailure(fileName, [12, 15], [13, 1], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure3 = Lint.Test.createFailure(fileName, [22, 12], [23, 1], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure4 = Lint.Test.createFailure(fileName, [32, 6], [33, 1], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure5 = Lint.Test.createFailure(fileName, [54, 9], [55, 1], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure6 = Lint.Test.createFailure(fileName, [64, 10], [65, 1], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure7 = Lint.Test.createFailure(fileName, [82, 11], [83, 1], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const actualFailures = Lint.Test.applyRuleOnFile(fileName, TrailingCommaRule, options);

            Lint.Test.assertFailuresEqual(actualFailures, [
                expectedFailure1,
                expectedFailure2,
                expectedFailure3,
                expectedFailure4,
                expectedFailure5,
                expectedFailure6,
                expectedFailure7
            ]);
        });
    });

    describe("singleline", () => {
        it("restricts the use of trailing commas if set to never", () => {
            const options = [true, {singleline: "never"}];

            const expectedFailure1 = Lint.Test.createFailure(fileName, [35, 42], [35, 43], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure2 = Lint.Test.createFailure(fileName, [35, 40], [35, 41], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure3 = Lint.Test.createFailure(fileName, [39, 24], [39, 25], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure4 = Lint.Test.createFailure(fileName, [43, 17], [43, 18], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure5 = Lint.Test.createFailure(fileName, [67, 12], [67, 13], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure6 = Lint.Test.createFailure(fileName, [71, 14], [71, 15], TrailingCommaRule.FAILURE_STRING_NEVER);
            const expectedFailure7 = Lint.Test.createFailure(fileName, [85, 23], [85, 24], TrailingCommaRule.FAILURE_STRING_NEVER);
            const actualFailures = Lint.Test.applyRuleOnFile(fileName, TrailingCommaRule, options);

            Lint.Test.assertFailuresEqual(actualFailures, [
                expectedFailure1,
                expectedFailure2,
                expectedFailure3,
                expectedFailure4,
                expectedFailure5,
                expectedFailure6,
                expectedFailure7
            ]);
        });

        it("enforces the use of trailing commas in if set to always", () => {
            const options = [true, {singleline: "always"}];

            const expectedFailure1 = Lint.Test.createFailure(fileName, [37, 41], [37, 42], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure2 = Lint.Test.createFailure(fileName, [37, 40], [37, 41], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure3 = Lint.Test.createFailure(fileName, [41, 26], [41, 27], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure4 = Lint.Test.createFailure(fileName, [45, 15], [45, 16], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure5 = Lint.Test.createFailure(fileName, [69, 16], [69, 17], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure6 = Lint.Test.createFailure(fileName, [73, 18], [73, 19], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const expectedFailure7 = Lint.Test.createFailure(fileName, [87, 23], [87, 24], TrailingCommaRule.FAILURE_STRING_ALWAYS);
            const actualFailures = Lint.Test.applyRuleOnFile(fileName, TrailingCommaRule, options);

            Lint.Test.assertFailuresEqual(actualFailures, [
                expectedFailure1,
                expectedFailure2,
                expectedFailure3,
                expectedFailure4,
                expectedFailure5,
                expectedFailure6,
                expectedFailure7
            ]);
        });
    });
});
