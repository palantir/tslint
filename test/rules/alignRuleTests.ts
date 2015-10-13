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

describe("<align, enabled>", () => {
    const fileName = "rules/align.test.ts";
    const AlignRule = Lint.Test.getRule("align");

    it("ensures that parameters in function signatures are aligned", () => {
        const options = [true, AlignRule.PARAMETERS_OPTION];
        const failureString = AlignRule.PARAMETERS_OPTION + AlignRule.FAILURE_STRING_SUFFIX;
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([2, 1], [2, 10]),
            createFailure([7, 1], [7, 10]),
            createFailure([12, 30], [12, 39]),
            createFailure([19, 28], [19, 37]),
            createFailure([26, 34], [26, 45]),
            createFailure([32, 31], [32, 39])
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, AlignRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("ensures that arguments in function calls are aligned", () => {
        const options = [true, AlignRule.ARGUMENTS_OPTION];
        const failureString = AlignRule.ARGUMENTS_OPTION + AlignRule.FAILURE_STRING_SUFFIX;
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([65, 5], [65, 11]),
            createFailure([72, 9], [72, 10]),
            createFailure([83, 14], [83, 20])
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, AlignRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("ensures that statements at the same nesting level are aligned", () => {
        const options = [true, AlignRule.STATEMENTS_OPTION];
        const failureString = AlignRule.STATEMENTS_OPTION + AlignRule.FAILURE_STRING_SUFFIX;
        const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            createFailure([119, 6], [119, 16]),
            createFailure([127, 8], [127, 18])
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, AlignRule, options);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
