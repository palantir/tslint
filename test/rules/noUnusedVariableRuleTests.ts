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

describe("<no-unused-variable>", () => {
    it("restricts unused imports", () => {
        var fileName = "rules/nounusedvariable-imports.test.ts";
        var Rule = Lint.Test.getRule("no-unused-variable");
        var failureString = Rule.FAILURE_STRING + "'xyz'";
        var failure = Lint.Test.createFailuresOnFile(fileName, failureString)([3, 9], [3, 12]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        Lint.Test.assertContainsFailure(actualFailures, failure);
    });
});
