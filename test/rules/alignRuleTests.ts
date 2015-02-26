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

///<reference path='../references.ts' />

describe("<align, enabled>", () => {

    it("ensures that parameters in function signatures are aligned", () => {
        var fileName = "rules/align.test.ts";
        var AlignRule = Lint.Test.getRule("align");
        var options = [true, AlignRule.PARAMETERS_OPTION];
        var failureString = AlignRule.PARAMETERS_OPTION + AlignRule.FAILURE_STRING_SUFFIX;
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            failure([2, 1], [2, 10]),
            failure([7, 1], [7, 10]),
            failure([12, 30], [12, 39]),
            failure([19, 28], [19, 37]),
            failure([26, 34], [26, 45]),
            failure([32, 31], [32, 39])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, AlignRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("ensures that arguments in function calls are aligned", () => {
        var fileName = "rules/align.test.ts";
        var AlignRule = Lint.Test.getRule("align");
        var options = [true, AlignRule.ARGUMENTS_OPTION];
        var failureString = AlignRule.ARGUMENTS_OPTION + AlignRule.FAILURE_STRING_SUFFIX;
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            failure([65, 5], [65, 11]),
            failure([72, 9], [72, 10])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, AlignRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("ensures that statements at the same nesting level are aligned", () => {
        var fileName = "rules/align.test.ts";
        var AlignRule = Lint.Test.getRule("align");
        var options = [true, AlignRule.STATEMENTS_OPTION];
        var failureString = AlignRule.STATEMENTS_OPTION + AlignRule.FAILURE_STRING_SUFFIX;
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            failure([109, 6], [109, 16]),
            failure([117, 8], [117, 18])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, AlignRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});

