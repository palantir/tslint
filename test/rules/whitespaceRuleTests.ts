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

describe("<whitespace>", () => {
    const fileName = "rules/whitespace.test.ts";
    const WhitespaceRule = Lint.Test.getRule("whitespace");
    const createFailure = Lint.Test.createFailuresOnFile(fileName, WhitespaceRule.FAILURE_STRING);
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        const options = [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-module",
            "check-separator",
            "check-type",
            "check-typecast"
        ];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, WhitespaceRule, options);
        assert.lengthOf(actualFailures, 39);
    });

    it("enforces rules only when enabled", () => {
        const failures = Lint.Test.applyRuleOnFile(fileName, WhitespaceRule);
        assert.equal(failures.length, 0);
    });

    it("enforces whitespace in import statements", () => {
        const expectedFailures = [
            createFailure([1, 11], [1, 12]),
            createFailure([1, 12], [1, 13]),
            createFailure([57, 19], [57, 20]),
            createFailure([58, 7], [58, 8]),
            createFailure([58, 16], [58, 17]),
            createFailure([58, 20], [58, 21]),
            createFailure([59, 26], [59, 27])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace in export statements", () => {
        const expectedFailures = [
            createFailure([3, 19], [3, 20]),
            createFailure([3, 20], [3, 21]),
            createFailure([42, 7], [42, 8]),
            createFailure([42, 8], [42, 9]),
            createFailure([64, 7], [64, 8])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace in type declarations", () => {
        const expectedFailure = createFailure([5, 11], [5, 12]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in conditional statements", () => {
        const expectedFailures = [
            createFailure([7, 23], [7, 24]),
            createFailure([7, 24], [7, 25]),
            createFailure([7, 25], [7, 26]),
            createFailure([7, 26], [7, 27])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace in binary expressions", () => {
        const expectedFailures = [
            createFailure([9, 16], [9, 17]),
            createFailure([9, 19], [9, 20])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace in variable definitions", () => {
        const expectedFailures = [
            createFailure([11, 10], [11, 11]),
            createFailure([11, 11], [11, 12]),
            createFailure([13, 11], [13, 12])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace in switch statements", () => {
        const expectedFailures = [
            createFailure([15, 11], [15, 12]),
            createFailure([16, 16], [16, 17]),
            createFailure([17, 17], [17, 18])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace in for statements", () => {
        const expectedFailures = [
            createFailure([20, 8], [20, 9]),
            createFailure([20, 15], [20, 16]),
            createFailure([20, 18], [20, 19])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace in while statements", () => {
        const expectedFailure = createFailure([24, 10], [24, 11]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in label definitions", () => {
        const expectedFailure = createFailure([21, 14], [21, 15]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace around the => token", () => {
        const expectedFailures = [
            createFailure([29, 17], [29, 18]),
            createFailure([29, 19], [29, 20]),
            createFailure([30, 17], [30, 18]),
            createFailure([30, 19], [30, 20]),
            createFailure([34, 14], [34, 15]),
            createFailure([34, 16], [34, 17]),
            createFailure([35, 18], [35, 19]),
            createFailure([35, 20], [35, 21])
        ];

        expectedFailures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
        });
    });

    it("enforces whitespace around typecasts", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([36, 21], [36, 22]));
    });
});
