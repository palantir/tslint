/*
 * Copyright 2014 Palantir Technologies, Inc.
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

describe("<no-use-before-declare>", () => {
    it("restricts usage of imports before declaration", () => {
        var fileName = "rules/nousebeforedeclare.test.ts";
        var Rule = Lint.Test.getRule("no-use-before-declare");
        var failureString = Rule.FAILURE_STRING_PREFIX + "$" + Rule.FAILURE_STRING_POSTFIX;
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString)([1, 1], [1, 2]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.equal(actualFailures.length, 4);
        Lint.Test.assertContainsFailure(actualFailures, failure);
    });

    it("restricts usage of variables before declaration", () => {
        var fileName = "rules/nousebeforedeclare.test.ts";
        var Rule = Lint.Test.getRule("no-use-before-declare");
        var failureString1 = Rule.FAILURE_STRING_PREFIX + "varb" + Rule.FAILURE_STRING_POSTFIX;
        var failureString2 = Rule.FAILURE_STRING_PREFIX + "j" + Rule.FAILURE_STRING_POSTFIX;
        var failure1 = Lint.Test.createFailuresOnFile(fileName, failureString1)([3, 12], [3, 16]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, failureString2)([13, 9], [13, 10]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        assert.equal(actualFailures.length, 4);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
    });

    it("restricts usage of class variables before declaration", () => {
        var fileName = "rules/nousebeforedeclare.test.ts";
        var Rule = Lint.Test.getRule("no-use-before-declare");
        var failureString = Rule.FAILURE_STRING_PREFIX + "a" + Rule.FAILURE_STRING_POSTFIX;
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString)([7, 14], [7, 15]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        assert.equal(actualFailures.length, 4);
        Lint.Test.assertContainsFailure(actualFailures, failure);
    });
});
