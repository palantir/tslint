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

describe("<no-any>", () => {
    var fileName = "rules/noAny.test.ts";
    var NoAnyRule = Lint.Test.getRule("no-any");

    it("var declaration with type of 'any' should not be allowed", () => {
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoAnyRule);
        var expectedFailure = Lint.Test.createFailure(fileName, [1, 8], [1, 11], "Type decoration of 'any' is forbidden.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

});
