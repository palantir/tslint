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

describe("<curly>", () => {
    var actualFailures;
    var fileName = "rules/curly.test.ts";
    var CurlyRule = Lint.Test.getRule("curly");

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, CurlyRule);
    });

    it("ensures if statements are always braced", () => {
        var failureString = CurlyRule.IF_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [10, 5], [11, 26], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("ensures for statements are always braced", () => {
        var failureString = CurlyRule.FOR_FAILURE_STRING;
        var expectedFailure1 = Lint.Test.createFailure(fileName, [22, 3], [23, 24], failureString);
        var expectedFailure2 = Lint.Test.createFailure(fileName, [25, 1], [26, 22], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("ensures while statements are always braced", () => {
        var failureString = CurlyRule.WHILE_FAILURE_STRING;
        var expectedFailure1 = Lint.Test.createFailure(fileName, [37, 1], [38, 22], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
    });

    it("ensures do statements are always braced", () => {
        var failureString = CurlyRule.DO_FAILURE_STRING;
        var expectedFailure1 = Lint.Test.createFailure(fileName, [50, 1], [52, 16], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
    });
});
