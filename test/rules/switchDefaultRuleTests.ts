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
import * as Lint from "../lint";

describe("<switch-default>", () => {
    const SwitchDefaultRule = Lint.Test.getRule("switch-default");
    const fileName = "rules/switchdefault.test.ts";
    const failureString = SwitchDefaultRule.FAILURE_STRING;

    it("Switch default", () => {
        const failure = Lint.Test.createFailuresOnFile(fileName, failureString);
        const expectedFailures = [
            failure([2, 1], [6, 2]),
            failure([8, 1], [18, 2])
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, SwitchDefaultRule);
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
