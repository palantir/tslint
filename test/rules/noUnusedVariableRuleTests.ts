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

describe("<no-unused-variable>", () => {
    it("restricts unused imports", () => {
        var fileName = "rules/nounusedvariable-imports.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");
        var failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'xyz'")([3, 9], [3, 12]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'createReadStream'")([4, 9], [4, 25]);
        var failure3 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'template'")([14, 7], [14, 15]);
        var failure4 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'foo'")([17, 13], [17, 16]);
        var failure5 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'defaultExport'")([20, 8], [20, 21]);
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 5);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
        Lint.Test.assertContainsFailure(actualFailures, failure3);
        Lint.Test.assertContainsFailure(actualFailures, failure4);
        Lint.Test.assertContainsFailure(actualFailures, failure5);
    });

    it("restricts unused variables", () => {
        var fileName = "rules/nounusedvariable-var.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");

        var failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([3, 5], [3, 6]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'a'")([23, 10], [23, 11]);
        var failure3 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'b'")([23, 13], [23, 14]);
        var failure4 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'d'")([26, 10], [26, 11]);
        var failure5 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'e'")([26, 13], [26, 14]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 5);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
        Lint.Test.assertContainsFailure(actualFailures, failure3);
        Lint.Test.assertContainsFailure(actualFailures, failure4);
        Lint.Test.assertContainsFailure(actualFailures, failure5);
    });

    it("restricts unused functions", () => {
        var fileName = "rules/nounusedvariable-function.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");

        var failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'func2'")([5, 5], [5, 10]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'func3'")([9, 10], [9, 15]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 2);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
    });

    it("restricts unused class members", () => {
        var fileName = "rules/nounusedvariable-class.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");
        var failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'z2'")([2, 13], [2, 15]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'mfunc4'")([18, 13], [18, 19]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 2);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
    });

    it("restricts unused parameters", () => {
        var fileName = "rules/nounusedvariable-parameter.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");

        var failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'args'")([1, 48], [1, 52]);
        var failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([5, 34], [5, 35]);
        var failure3 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([9, 35], [9, 36]);
        var failure4 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'x'")([18, 25], [18, 26]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule, [true, "check-parameters"]);

        assert.lengthOf(actualFailures, 4);

        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
        Lint.Test.assertContainsFailure(actualFailures, failure3);
        Lint.Test.assertContainsFailure(actualFailures, failure4);
    });
});
