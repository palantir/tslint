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

describe("<jsdoc-format>", () => {
    var JsdocFormatRule = Lint.Test.getRule("jsdoc-format");

    it("ensures jsdoc comments have properly lined up asterisks and start with spaces", () => {
        var fileName = "rules/jsdoc.test.ts";
        var createFailure = Lint.Test.createFailuresOnFile(fileName, JsdocFormatRule.FAILURE_STRING);
        var expectedFailure1 = createFailure([18, 5], [21, 8]);
        var expectedFailure2 = createFailure([23, 5], [26, 6]);
        var expectedFailure3 = createFailure([28, 5], [30, 8]);
        var expectedFailure4 = createFailure([32, 5], [35, 8]);
        var expectedFailure5 = createFailure([37, 5], [40, 8]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, JsdocFormatRule);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure5);
        assert.lengthOf(actualFailures, 5);
    });
});
