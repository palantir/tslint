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

describe("<all-caps>", () => {
    const AllCapsRule = Lint.Test.getRule("all-caps");
    const fileName = "rules/allcaps.test.ts";

    it("ensures all-caps variables are always const", () => {
        const createFailure = Lint.Test.createFailuresOnFile(fileName, AllCapsRule.FAILURE_STRING);
        const expectedFailures = [
            createFailure([14, 5], [14, 6]),
            createFailure([15, 5], [15, 6]),
            createFailure([16, 5], [16, 6]),
            createFailure([16, 8], [16, 9]),
            createFailure([17, 5], [17, 6]),
            createFailure([18, 5], [18, 6]),
            createFailure([19, 5], [19, 6]),
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, AllCapsRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
