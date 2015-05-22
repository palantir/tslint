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

describe("<class-member-no-default-access>", () => {
    it("disallow default access on member", () => {
        var fileName = "rules/classmembernodefaultaccess.test.ts";
        var ClassMemberNoDefaultAccess = Lint.Test.getRule("class-member-no-default-access");
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, ClassMemberNoDefaultAccess, []);

        Lint.Test.assertFailuresEqual(actualFailures, [
            Lint.Test.createFailure(fileName, [8, 5], [8, 15],
                "Default access modifier on member/method not allowed"),
            Lint.Test.createFailure(fileName, [16, 5], [17, 6],
                "Default access modifier on member/method not allowed")
        ]);
    });
});
