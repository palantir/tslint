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

describe("<comment-format>", () => {
    var CommentFormatRule = Lint.Test.getRule("comment-format");

    it("ensures comments start with a space and a lowercase letter", () => {
        var fileName = "rules/comment.test.ts";
        var createLowercaseFailure = Lint.Test.createFailuresOnFile(fileName, CommentFormatRule.LOWERCASE_FAILURE);
        var createLeadingSpaceFailure = Lint.Test.createFailuresOnFile(fileName, CommentFormatRule.LEADING_SPACE_FAILURE);
        var expectedFailure1 = createLowercaseFailure([5, 27], [5, 73]);
        var expectedFailure2 = createLowercaseFailure([6, 11], [6, 84]);
        var expectedFailure3 = createLeadingSpaceFailure([6, 11], [6, 84]);
        var expectedFailure4 = createLeadingSpaceFailure([7, 32], [7, 57]);

        var options = [true,
            "check-space",
            "check-lowercase"
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, CommentFormatRule, options);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        assert.lengthOf(actualFailures, 4);
    });
});
