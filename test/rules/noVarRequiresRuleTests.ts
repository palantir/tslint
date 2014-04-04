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

describe("<no-var-requires>", () => {
    it("disallows use of require outside import statments", () => {
        var fileName = "rules/novarrequires.test.ts";
        var NoVarRequiresRule = Lint.Test.getRule("no-var-requires");
        var expectedFailure = Lint.Test.createFailure(fileName, [2, 9], [2, 21], NoVarRequiresRule.FAILURE_STRING);
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoVarRequiresRule);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        assert.lengthOf(actualFailures, 1);
    });
});
