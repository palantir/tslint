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

describe("<use-strict>", () => {
    var UseStrictRule = Lint.Test.getRule("use-strict");

    var actualFailures: any;
    var fileName = "rules/usestrict.test.ts";

    before(() => {
        var options = [true, "check-function", "check-module"];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, UseStrictRule, options);
        assert.lengthOf(actualFailures, 2);
    });

    it("enforces checks for 'use strict' in functions", () => {
        var expectedFailures = Lint.Test.createFailure(fileName, [14, 1], [14, 9], UseStrictRule.FAILURE_STRING);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailures);
    });

    it("enforces checks for 'use strict' in modules", () => {
        var expectedFailures = Lint.Test.createFailure(fileName, [24, 1], [24, 7], UseStrictRule.FAILURE_STRING);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailures);
    });
});
