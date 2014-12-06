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

describe("<switch-always-default>", () => {
    it("Switch without default case", () => {
        var fileName = "rules/switchalwaysdefault.test.ts";
        var Rule = Lint.Test.getRule("switch-always-default");
        var failureString = Rule.FAILURE_STRING;
        var failureDefault = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            failureDefault([24, 1], [24, 2]),
            failureDefault([33, 1], [33, 2]),
            failureDefault([35, 9], [35, 10])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        actualFailures.every((i) => {
            //console.log(i.toJson());
            return true;
        });
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
