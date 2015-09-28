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

describe("<no-inferrable-types>", () => {
    const Rule = Lint.Test.getRule("no-inferrable-types");
    const fileName = "rules/noinferrabletypes.test.ts";

    it("forbids explicit type declarations where easily inferrable", () => {
        const createFailure = (start: number[], end: number[], type: string) => {
            const failureString = Rule.FAILURE_STRING_FACTORY(type);
            return Lint.Test.createFailure(fileName, start, end, failureString);
        };

        const expectedFailures = [
            createFailure([2, 8], [2, 14], "number"),
            createFailure([3, 8], [3, 15], "boolean"),
            createFailure([4, 8], [4, 14], "string"),
            createFailure([7, 18], [7, 24], "number"),
            createFailure([7, 33], [7, 40], "boolean"),
            createFailure([7, 52], [7, 58], "string")
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
