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
import * as Lint from "../lint";

describe("<comment-format>", () => {
    const CommentFormatRule = Lint.Test.getRule("comment-format");

    it("ensures comments start with a space and a lowercase letter", () => {
        const fileName = "rules/comment-lower.test.ts";
        const createLowercaseFailure = Lint.Test.createFailuresOnFile(fileName, CommentFormatRule.LOWERCASE_FAILURE);
        const createLeadingSpaceFailure = Lint.Test.createFailuresOnFile(fileName, CommentFormatRule.LEADING_SPACE_FAILURE);
        const expectedFailure1 = createLowercaseFailure([5, 27], [5, 73]);
        const expectedFailure2 = createLowercaseFailure([6, 11], [6, 84]);
        const expectedFailure3 = createLeadingSpaceFailure([6, 11], [6, 84]);
        const expectedFailure4 = createLeadingSpaceFailure([7, 32], [7, 57]);

        const options = [true,
            "check-space",
            "check-lowercase"
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, CommentFormatRule, options);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        assert.lengthOf(actualFailures, 4);
    });

    it("ensures comments start with a space and a uppercase letter", () => {
        const fileName = "rules/comment-upper.test.ts";
        const createUppercaseFailure = Lint.Test.createFailuresOnFile(fileName, CommentFormatRule.UPPERCASE_FAILURE);
        const createLeadingSpaceFailure = Lint.Test.createFailuresOnFile(fileName, CommentFormatRule.LEADING_SPACE_FAILURE);
        const expectedFailure1 = createUppercaseFailure([5, 27], [5, 73]);
        const expectedFailure2 = createUppercaseFailure([6, 11], [6, 84]);
        const expectedFailure3 = createLeadingSpaceFailure([6, 11], [6, 84]);
        const expectedFailure4 = createLeadingSpaceFailure([7, 32], [7, 57]);

        const options = [true,
            "check-space",
            "check-uppercase"
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, CommentFormatRule, options);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        assert.lengthOf(actualFailures, 4);
    });
});
