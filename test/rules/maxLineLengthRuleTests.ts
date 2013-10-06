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

describe("<max-line-length>", () => {
    it("enforces a maximum line length", () => {
        var fileName = "rules/maxlen.test.ts";
        var MaxLineLengthRule = Lint.Test.getRule("max-line-length");
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, MaxLineLengthRule, [true, 140]);
        var expectedFailures = [
            Lint.Test.createFailure(fileName, [2, 1], [2, 165], MaxLineLengthRule.FAILURE_STRING + "140")
        ];

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
