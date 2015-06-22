/*
 * Copyright 2015 Palantir Technologies, Inc.
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

describe("<no-var-keyword>", () => {
    it("disallows use of creating variables with 'var'", () => {
        var fileName = "rules/novarkeyword.test.ts";
        var NoVarKeywordRule = Lint.Test.getRule("no-var-keyword");
        var failure = Lint.Test.createFailuresOnFile(fileName, NoVarKeywordRule.FAILURE_STRING);
        var expectedFailure = [
            failure([3, 1], [3, 4]),
            failure([6, 5], [6, 8]),
            failure([9, 1], [9, 4]),
            failure([12, 1], [12, 4]),
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoVarKeywordRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailure);
    });
});
