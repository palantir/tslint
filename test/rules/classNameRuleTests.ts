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

describe("<class-name>", () => {
    var ClassNameRule = Lint.Test.getRule("class-name");

    it("ensures class names are always pascal-cased", () => {
        var fileName = "rules/classname.test.ts";
        var createFailure = Lint.Test.createFailuresOnFile(fileName, ClassNameRule.FAILURE_STRING);
        var expectedFailure1 = createFailure([5, 7], [5, 23]);
        var expectedFailure2 = createFailure([9, 7], [9, 33]);
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, ClassNameRule);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });
});
