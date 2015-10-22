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

describe("<object-literal-sort-keys>", () => {
    const SortedKeyRule = Lint.Test.getRule("object-literal-sort-keys");
    const fileName = "rules/objectliteralsortkeys.test.ts";
    const failureString = SortedKeyRule.FAILURE_STRING;

    it("forbids unsorted keys in object literals", () => {
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, SortedKeyRule);
        const createFailure1 = Lint.Test.createFailuresOnFile(fileName, failureString + "a'");
        const createFailure2 = Lint.Test.createFailuresOnFile(fileName, failureString + "a'");
        const createFailure3 = Lint.Test.createFailuresOnFile(fileName, failureString + "aa'");
        const createFailure4 = Lint.Test.createFailuresOnFile(fileName, failureString + "b'");
        const createFailure5 = Lint.Test.createFailuresOnFile(fileName, failureString + "asdf'");
        const createFailure6 = Lint.Test.createFailuresOnFile(fileName, failureString + "asdfn'");
        const expectedFailures = [
            createFailure1([8, 5], [8, 6]),
            createFailure2([20, 5], [20, 6]),
            createFailure3([37, 9], [37, 11]),
            createFailure4([56, 5], [56, 6]),
            createFailure5([68, 5], [68, 9]),
            createFailure6([78, 5], [78, 10])
        ];

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
