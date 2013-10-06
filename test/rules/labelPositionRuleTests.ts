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

describe("<label-position>", () => {
    it("enforces that labels are correctly positioned", () => {
        var fileName = "rules/labelpos.test.ts";
        var LabelPositionRule = Lint.Test.getRule("label-position");
        var createFailure = Lint.Test.createFailuresOnFile(fileName, LabelPositionRule.FAILURE_STRING);
        var expectedFailures: Lint.RuleFailure[] = [
            createFailure([2, 5], [2, 9]),
            createFailure([5, 5], [5, 9])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, LabelPositionRule);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
