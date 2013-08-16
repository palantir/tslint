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

describe("<noconsole>", () => {
    it("forbids access to specified console properties", () => {
        var fileName = "rules/noconsole.test.ts";
        var createFailure = Lint.Test.createFailuresOnFile(fileName, Lint.Rules.NoConsoleRule.FAILURE_STRING);
        var dirFailure = createFailure([3, 1], [3, 12]);
        var errorFailure = createFailure([7, 1], [7, 14]);
        var logFailure = createFailure([2, 1], [2, 12]);
        var warnFailure = createFailure([6, 1], [6, 13]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "noconsole", [true, "dir", "error", "log", "warn"]);
        Lint.Test.assertContainsFailure(actualFailures, dirFailure);
    });
});
