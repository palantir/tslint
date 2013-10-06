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

describe("<variable-name>", () => {
    var VariableNameRule = Lint.Test.getRule("variable-name");

    it("ensures only (camel/upper)case naming convention for variables", () => {
        var fileName = "rules/varname.test.ts";
        var failureString = VariableNameRule.FAILURE_STRING;

        var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            createFailure([3, 5], [3, 17]),
            createFailure([4, 5], [4, 18]),
            createFailure([7, 13], [7, 26]),
            createFailure([8, 13], [8, 29]),
            createFailure([13, 13], [13, 25])
        ];

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("ensures leading underscores can optionally be legal", () => {
        var fileName = "rules/varname.test.ts";
        var failureString = VariableNameRule.FAILURE_STRING;

        var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            createFailure([3, 5], [3, 17]),
            createFailure([4, 5], [4, 18]),
            createFailure([7, 13], [7, 26]),
            createFailure([13, 13], [13, 25])
        ];
        var options = [true,
            "allow-leading-underscore"
        ];

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
