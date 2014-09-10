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

describe("<no-constructor-variable-declarations>", () => {
    it("No constrctor variable declarations", () => {
        var fileName = "rules/noconstructorvars.test.ts";
        var Rule = Lint.Test.getRule("no-constructor-vars");
        var failureString = Rule.FAILURE_STRING_PART;

        var failureFoo = Lint.Test.createFailuresOnFile(fileName, "'foo'" + failureString);
        var failureBar = Lint.Test.createFailuresOnFile(fileName, "'bar'" + failureString);

        var expectedFailures = [
            failureFoo([3, 17], [3, 25]),
            failureFoo([9, 17], [9, 25]),
            failureBar([9, 38], [9, 45])
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        assert.lengthOf(actualFailures, 3);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
