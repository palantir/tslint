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

describe("<indent>", () => {
    var failureString = Lint.Rules.IndentRule.FAILURE_STRING + "expected 4, got ";
    var failureString8 = Lint.Rules.IndentRule.FAILURE_STRING + "expected 8, got ";

    describe("on a tab-indented file", () => {
        var fileName = "rules/indent_tabs.test.ts";
        var actualFailures;

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, "indent", [true, 4]);
        });

        it("enforces module indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [58, 4], [58, 27], failureString + "6");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces function indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [62, 4], [62, 19], failureString + "9");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces class variable indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [66, 3], [66, 10], failureString + "2");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces class method indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [68, 3], [68, 15], failureString + "2");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces object literal indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [74, 3], [74, 7], failureString + "5");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [75, 4], [75, 8], failureString + "6");
            var expectedFailure3 = Lint.Test.createFailure(fileName, [76, 5], [76, 9], failureString + "7");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        });

        it("enforces array literal indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [111, 4], [111, 8], failureString8 + "6");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [112, 5], [112, 9], failureString8 + "7");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        });

        it("enforces enum indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [80, 4], [80, 10], failureString + "6");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [81, 3], [81, 9], failureString + "5");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        });

        it("enforces switch indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [85, 3], [85, 7], failureString + "5");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [86, 4], [86, 22], failureString8 + "6");
            var expectedFailure3 = Lint.Test.createFailure(fileName, [88, 3], [88, 10], failureString + "2");
            var expectedFailure4 = Lint.Test.createFailure(fileName, [89, 4], [89, 28], failureString8 + "6");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        });

        it("enforces block indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [94, 3], [94, 9], failureString + "2");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [98, 4], [98, 10], failureString + "6");
            var expectedFailure3 = Lint.Test.createFailure(fileName, [102, 3], [102, 9], failureString + "5");
            var expectedFailure4 = Lint.Test.createFailure(fileName, [106, 5], [106, 11], failureString + "7");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        });
    });

    describe("on a space-indented file", () => {
        var fileName = "rules/indent_spaces.test.ts";
        var actualFailures;

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, "indent", [true, 4]);
        });

        it("enforces module indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [58, 7], [58, 30], failureString + "6");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces function indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [62, 10], [62, 25], failureString + "9");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces class variable indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [66, 3], [66, 10], failureString + "2");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces class method indentation", () => {
            var expectedFailure = Lint.Test.createFailure(fileName, [68, 3], [68, 15], failureString + "2");
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });

        it("enforces object literal indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [74, 6], [74, 10], failureString + "5");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [75, 7], [75, 11], failureString + "6");
            var expectedFailure3 = Lint.Test.createFailure(fileName, [76, 8], [76, 12], failureString + "7");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        });

        it("enforces array literal indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [111, 7], [111, 11], failureString8 + "6");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [112, 8], [112, 12], failureString8 + "7");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        });

        it("enforces enum indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [80, 7], [80, 13], failureString + "6");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [81, 6], [81, 12], failureString + "5");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        });

        it("enforces switch indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [85, 6], [85, 10], failureString + "5");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [86, 7], [86, 25], failureString8 + "6");
            var expectedFailure3 = Lint.Test.createFailure(fileName, [88, 3], [88, 10], failureString + "2");
            var expectedFailure4 = Lint.Test.createFailure(fileName, [89, 7], [89, 31], failureString8 + "6");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        });

        it("enforces block indentation", () => {
            var expectedFailure1 = Lint.Test.createFailure(fileName, [94, 3], [94, 9], failureString + "2");
            var expectedFailure2 = Lint.Test.createFailure(fileName, [98, 7], [98, 13], failureString + "6");
            var expectedFailure3 = Lint.Test.createFailure(fileName, [102, 6], [102, 12], failureString + "5");
            var expectedFailure4 = Lint.Test.createFailure(fileName, [106, 8], [106, 14], failureString + "7");

            Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        });
    });
});
