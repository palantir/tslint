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
        var createFormatFailure = Lint.Test.createFailuresOnFile(fileName, JsdocFormatRule.FORMAT_FAILURE_STRING);
        var createAlignmentFailure = Lint.Test.createFailuresOnFile(fileName, JsdocFormatRule.ALIGNMENT_FAILURE_STRING);
        var expectedFailure1 = createFormatFailure([20, 1], [20, 40]);
        var expectedFailure2 = createAlignmentFailure([26, 1], [26, 6]);
        var expectedFailure3 = createFormatFailure([30, 1], [30, 8]);
        var expectedFailure4 = createFormatFailure([34, 1], [34, 7]);
        var expectedFailure5 = createAlignmentFailure([39, 1], [39, 19]);
        var expectedFailure6 = createFormatFailure([42, 5], [42, 26]);
        var expectedFailure7 = createFormatFailure([44, 5], [44, 32]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, JsdocFormatRule);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure5);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure6);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure7);
        assert.lengthOf(actualFailures, 7);
    });
});
