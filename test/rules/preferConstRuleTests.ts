/**
 * @license
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

describe.only("<prefer-const>", () => {
    const fileName = "rules/preferconst.test.ts";
    const PreferConstRule = Lint.Test.getRule("prefer-const");

    it("catches failures when let-declared variables are never reassigned", () => {
        const createFailure = (identifier: string, start: number[], end: number[]) => {
            return Lint.Test.createFailuresOnFile(fileName, PreferConstRule.FAILURE_STRING_FACTORY(identifier))(start, end);
        };
        const expectedFailures = [
            createFailure("c", [3, 5], [3, 6]),
            createFailure("f", [8, 9], [8, 10]),
            createFailure("h", [13, 6], [13, 7]),
            createFailure("j", [14, 6], [14, 7]),
            createFailure("l", [20, 10], [20, 11]),
            createFailure("n", [25, 10], [25, 11]),
            createFailure("o", [29, 11], [29, 12])
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, PreferConstRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
