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

import {TestUtils} from "../lint";

describe("<no-shadowed-variable>", () => {
    const NoShadowedVariableRule = TestUtils.getRule("no-shadowed-variable");
    const fileName = "rules/no-shadowed-variable.test.ts";

    it("ensures that variable declarations are not shadowed", () => {
        const expectedFailures = [
            createFailure("a", [6, 13], [6, 14]),
            createFailure("b", [7, 13], [7, 14]),
            createFailure("b", [11, 13], [11, 14]),
            createFailure("e", [13, 13], [13, 14]),
            createFailure("a", [22, 9], [22, 10]),
            createFailure("g", [27, 9], [27, 10]),
            createFailure("h", [35, 15], [35, 16]),
            createFailure("i", [36, 15], [36, 16]),
            createFailure("x", [41, 9], [41, 10]),
            createFailure("y", [42, 9], [42, 10]),
            createFailure("index", [46, 10], [46, 15]),
            createFailure("j", [47, 9], [47, 10]),
            createFailure("bar", [59, 13], [59, 16]),
            createFailure("foo", [67, 13], [67, 16]),
            createFailure("foo", [75, 13], [75, 16]),
            createFailure("x", [88, 14], [88, 15]),
            createFailure("y", [89, 14], [89, 15]),
            createFailure("z", [90, 16], [90, 17]),
            createFailure("x", [94, 15], [94, 16]),
            createFailure("y", [95, 15], [95, 16]),
            createFailure("z", [97, 17], [97, 18]),
            createFailure("p", [120, 12], [120, 13]),
            createFailure("q", [125, 9], [125, 10]),
            createFailure("pos", [128, 13], [128, 16])
        ];
        const actualFailures = TestUtils.applyRuleOnFile(fileName, NoShadowedVariableRule);

        TestUtils.assertFailuresEqual(actualFailures, expectedFailures);
    });

    function createFailure(identifier: string, start: number[], end: number[]) {
        return TestUtils.createFailure(fileName, start, end, `${NoShadowedVariableRule.FAILURE_STRING}${identifier}'`);
    }
});
