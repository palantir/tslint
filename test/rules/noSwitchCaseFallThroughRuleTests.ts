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

describe("<no-switch-case-fall-through>", () => {
    it("Switch fall through", () => {
        var fileName = "rules/noswitchcasefallthrough.test.ts";
        var Rule = Lint.Test.getRule("no-switch-case-fall-through");
        var failureString = Rule.FAILURE_STRING_PART;
        var failureDefault = Lint.Test.createFailuresOnFile(fileName, failureString + "'default'");
        var failureCase = Lint.Test.createFailuresOnFile(fileName, failureString + "'case'");
        var expectedFailures = [
            failureCase([3, 15], [3, 16]),
            failureCase([6, 15], [6, 16]),
            failureDefault([8, 12], [8, 13]),
            failureCase([16, 15], [16, 16]),
            failureDefault([24, 12], [24, 13]),
            failureCase([35, 10], [35, 11]),
            failureDefault([32, 21], [32, 22])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 7);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
