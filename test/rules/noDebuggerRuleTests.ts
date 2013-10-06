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

describe("<no-debugger>", () => {
    var NoDebuggerRule = Lint.Test.getRule("no-debugger");

    it("forbids debugger statements", () => {
        var fileName = "rules/debug.test.ts";
        var failureString = NoDebuggerRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoDebuggerRule);
        var expectedFailure = Lint.Test.createFailure(fileName, [5, 9], [5, 17], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
