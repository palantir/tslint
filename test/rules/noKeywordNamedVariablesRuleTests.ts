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

describe("<no-keyword-named-variables>", () => {
    const VariableNameRule = Lint.Test.getRule("no-keyword-named-variables");
    const failureString = VariableNameRule.FAILURE_STRING;

    it("checks assigned let variables", () => {
        const fileName = "rules/nokeywordnamedvariables_1.test.ts";
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([1, 5], [1, 8]),
            createFailure([2, 5], [2, 11]),
            createFailure([3, 5], [3, 11]),
            createFailure([4, 5], [4, 11]),
            createFailure([5, 5], [5, 11]),
            createFailure([6, 5], [6, 12]),
            createFailure([7, 5], [7, 12]),
            createFailure([8, 5], [8, 14]),
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("checks declared let variables", () => {
        const fileName = "rules/nokeywordnamedvariables_2.test.ts";
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([1, 5], [1, 8]),
            createFailure([2, 5], [2, 11]),
            createFailure([3, 5], [3, 11]),
            createFailure([4, 5], [4, 11]),
            createFailure([5, 5], [5, 11]),
            createFailure([6, 5], [6, 12]),
            createFailure([7, 5], [7, 12]),
            createFailure([8, 5], [8, 14]),
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("checks parameters", () => {
        const fileName = "rules/nokeywordnamedvariables_3.test.ts";
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([1, 13], [1, 16]),
            createFailure([2, 13], [2, 19]),
            createFailure([3, 13], [3, 19]),
            createFailure([4, 13], [4, 19]),
            createFailure([5, 13], [5, 19]),
            createFailure([6, 13], [6, 20]),
            createFailure([7, 13], [7, 20]),
            createFailure([8, 13], [8, 22]),
            createFailure([10, 13], [10, 16]),
            createFailure([11, 13], [11, 19]),
            createFailure([12, 13], [12, 19]),
            createFailure([13, 13], [13, 19]),
            createFailure([14, 13], [14, 19]),
            createFailure([15, 13], [15, 20]),
            createFailure([16, 13], [16, 20]),
            createFailure([17, 13], [17, 22]),
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("checks destructuring assignment", () => {
        const fileName = "rules/nokeywordnamedvariables_4.test.ts";
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([1, 7], [1, 10]),
            createFailure([2, 7], [2, 13]),
            createFailure([3, 7], [3, 13]),
            createFailure([4, 7], [4, 13]),
            createFailure([5, 7], [5, 13]),
            createFailure([6, 7], [6, 14]),
            createFailure([7, 7], [7, 14]),
            createFailure([8, 7], [8, 16]),
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("checks destructuring variable declarations", () => {
        const fileName = "rules/nokeywordnamedvariables_5.test.ts";
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([1, 7], [1, 10]),
            createFailure([2, 7], [2, 13]),
            createFailure([3, 7], [3, 13]),
            createFailure([4, 7], [4, 13]),
            createFailure([5, 7], [5, 13]),
            createFailure([6, 7], [6, 14]),
            createFailure([7, 7], [7, 14]),
            createFailure([8, 7], [8, 16]),
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
