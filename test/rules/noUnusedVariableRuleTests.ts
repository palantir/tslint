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

describe("<no-unused-variable>", () => {
    it("restricts unused imports", () => {
        var fileName = "rules/nounusedvariable-imports.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");
        var failureString = Rule.FAILURE_STRING + "'xyz'";
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString)([3, 9], [3, 12]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        Lint.Test.assertContainsFailure(actualFailures, failure);
    });

    it("restricts unused variables", () => {
        var fileName = "rules/nounusedvariable-var.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");
        var failureString = Rule.FAILURE_STRING + "'y'";
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString)([3, 5], [3, 6]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        Lint.Test.assertContainsFailure(actualFailures, failure);
    });

    it("restricts unused functions", () => {
        var fileName = "rules/nounusedvariable-function.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");

        var failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'func2'")([5, 5], [5, 10]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'func3'")([9, 10], [9, 15]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
    });

    it("restricts unused class members", () => {
        var fileName = "rules/nounusedvariable-class.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");
        var failureString = Rule.FAILURE_STRING + "'mfunc4'";
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString)([18, 13], [18, 19]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        Lint.Test.assertContainsFailure(actualFailures, failure);
    });

    it("restricts unused parameters", () => {
        var fileName = "rules/nounusedvariable-parameter.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");

        var failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'args'")([1, 45], [1, 49]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([5, 34], [5, 35]);
        var failure3 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'args'")([5, 45], [5, 49]);
        var failure4 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([9, 35], [9, 36]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 4);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
        Lint.Test.assertContainsFailure(actualFailures, failure3);
        Lint.Test.assertContainsFailure(actualFailures, failure4);
    });
});
