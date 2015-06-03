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

describe("<variable-name>", () => {
    const VariableNameRule = Lint.Test.getRule("variable-name");
    const failureString = VariableNameRule.FAILURE_STRING;
    const fileName = "rules/varname.test.ts";
    const createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);

    it("ensures only (camel/upper)case naming convention for variables & parameters", () => {
        const expectedFailures = [
            createFailure([3, 5], [3, 17]),
            createFailure([4, 5], [4, 18]),
            createFailure([7, 13], [7, 26]),
            createFailure([8, 13], [8, 29]),
            createFailure([13, 13], [13, 25]),
            createFailure([19, 48], [19, 56]),
            createFailure([19, 58], [19, 68]),
            createFailure([24, 7], [24, 17]),
            createFailure([24, 19], [24, 30]),
            createFailure([26, 56], [26, 69]),
            createFailure([26, 71], [26, 84]),
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });

    it("ensures leading underscores can optionally be legal", () => {
        const options = [true,
            "allow-leading-underscore"
        ];

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, VariableNameRule, options);
        const optionallyValidFailures = [
            createFailure([8, 13], [8, 29])
        ];

        // none of the optionally valid names should appear in the failures list
        assert.isFalse(actualFailures.some((failure) => {
            return optionallyValidFailures.some((f) => f.equals(failure));
        }));
    });
});
