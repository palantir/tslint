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

describe("<no-console>", () => {
    it("forbids access to specified console properties", () => {
        var fileName = "rules/noconsole.test.ts";
        var NoConsoleRule = Lint.Test.getRule("no-console");
        var dirFailure = Lint.Test.createFailuresOnFile(fileName, NoConsoleRule.FAILURE_STRING_PART + "console.dir")([3, 1], [3, 12]);
        var errorFailure = Lint.Test.createFailuresOnFile(fileName, NoConsoleRule.FAILURE_STRING_PART + "console.error")([7, 1], [7, 14]);
        var logFailure = Lint.Test.createFailuresOnFile(fileName, NoConsoleRule.FAILURE_STRING_PART + "console.log")([2, 1], [2, 12]);
        var warnFailure = Lint.Test.createFailuresOnFile(fileName, NoConsoleRule.FAILURE_STRING_PART + "console.warn")([6, 1], [6, 13]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoConsoleRule, [true, "dir", "error", "log", "warn"]);
        Lint.Test.assertContainsFailure(actualFailures, dirFailure);
        Lint.Test.assertContainsFailure(actualFailures, errorFailure);
        Lint.Test.assertContainsFailure(actualFailures, logFailure);
        Lint.Test.assertContainsFailure(actualFailures, warnFailure);
    });
});
