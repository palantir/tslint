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

/// <reference path='../references.ts' />

describe("<whitespace>", () => {
    var actualFailures: Lint.RuleFailure[];
    var fileName = "rules/whitespace.test.ts";
    var WhitespaceRule = Lint.Test.getRule("whitespace");
    var failureString = WhitespaceRule.FAILURE_STRING;
    var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);

    before(() => {
        var options = [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type",
            "check-typecast"
        ];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, WhitespaceRule, options);
        assert.lengthOf(actualFailures, 31);
    });

    it("enforces rules only when enabled", () => {
        var failures = Lint.Test.applyRuleOnFile(fileName, WhitespaceRule);
        assert.equal(failures.length, 0);
    });

    it("enforces whitespace in import statements", () => {
        var expectedFailure1 = createFailure([1, 11], [1, 12]);
        var expectedFailure2 = createFailure([1, 12], [1, 13]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("enforces whitespace in export statements", () => {
        var expectedFailure1 = createFailure([3, 15], [3, 16]);
        var expectedFailure2 = createFailure([3, 16], [3, 17]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("enforces whitespace in type declarations", () => {
        var expectedFailure = createFailure([5, 11], [5, 12]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in conditional statements", () => {
        var expectedFailures = [
            createFailure([7, 23], [7, 24]),
            createFailure([7, 24], [7, 25]),
            createFailure([7, 25], [7, 26]),
            createFailure([7, 26], [7, 27])
        ];

        Lint.Test.assertContainsFailure(actualFailures, expectedFailures[0]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailures[1]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailures[2]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailures[3]);
    });

    it("enforces whitespace in binary expressions", () => {
        var expectedFailure1 = createFailure([9, 16], [9, 17]);
        var expectedFailure2 = createFailure([9, 19], [9, 20]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("enforces whitespace in variable definitions", () => {
        var expectedFailure1 = createFailure([11, 10], [11, 11]);
        var expectedFailure2 = createFailure([11, 11], [11, 12]);
        var expectedFailure3 = createFailure([13, 11], [13, 12]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces whitespace in switch statements", () => {
        var expectedFailure1 = createFailure([15, 11], [15, 12]);
        var expectedFailure2 = createFailure([16, 16], [16, 17]);
        var expectedFailure3 = createFailure([17, 17], [17, 18]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces whitespace in for statements", () => {
        var expectedFailure1 = createFailure([20, 8], [20, 9]);
        var expectedFailure2 = createFailure([20, 15], [20, 16]);
        var expectedFailure3 = createFailure([20, 18], [20, 19]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces whitespace in while statements", () => {
        var expectedFailure = createFailure([24, 10], [24, 11]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in label definitions", () => {
        var expectedFailure = createFailure([21, 14], [21, 15]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace around the => token", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([29, 17], [29, 18]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([29, 19], [29, 20]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([30, 17], [30, 18]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([30, 19], [30, 20]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([34, 14], [34, 15]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([34, 16], [34, 17]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([35, 18], [35, 19]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([35, 20], [35, 21]));
    });

    it("enforces whitespace around typecasts", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([36, 21], [36, 22]));
    });
});
