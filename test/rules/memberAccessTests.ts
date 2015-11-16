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

describe("<member-access>", () => {
    it("ensures that class properties have access modifiers", () => {
        const fileName = "rules/memberaccess.test.ts";
        const expectedFailures = [
            [[2, 5], [2, 17]],
            [[10, 5], [10, 15]],
            [[16, 5], [16, 33]],
            [[17, 5], [17, 29]],
            [[29, 9], [29, 19]]
        ];

        assertFailuresInFile(fileName, expectedFailures);
    });

    it("ensures that constructors have access modifiers", () => {
        const fileName = "rules/memberaccess-constructor.test.ts";
        const expectedFailures = [
            [[2, 5], [2, 28]],
            [[3, 5], [3, 27]]
        ];
        const options = [true, "check-constructor"];

        assertFailuresInFile(fileName, expectedFailures, options);
    });

    it("ensures that accessors have access modifiers", () => {
        const fileName = "rules/memberaccess-accessor.test.ts";
        const expectedFailures = [
            [[2, 5], [4, 6]],
            [[5, 5], [5, 21]]
        ];
        const options = [true, "check-accessor"];

        assertFailuresInFile(fileName, expectedFailures, options);
    });

    function assertFailuresInFile(fileName: string, expectedFailures: number[][][], options: any[] = [true]) {
        const MemberAccessRule = Lint.Test.getRule("member-access");
        const createFailure = Lint.Test.createFailuresOnFile(fileName, MemberAccessRule.FAILURE_STRING);
        const expectedFileFailures = expectedFailures.map(failure => createFailure(failure[0], failure[1]));

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, MemberAccessRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFileFailures);
    }
});
