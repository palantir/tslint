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

describe("<no-shadowed-variable>", () => {
    const NoShadowedVariableRule = Lint.Test.getRule("no-shadowed-variable");
    const fileName = "rules/no-shadowed-variable.test.ts";

    it("ensures that variable declarations are not shadowed", () => {
        const expectedFailures = [
            Lint.Test.createFailure(fileName, [6, 13], [6, 14], NoShadowedVariableRule.FAILURE_STRING + "a'"),
            Lint.Test.createFailure(fileName, [7, 13], [7, 14], NoShadowedVariableRule.FAILURE_STRING + "b'"),
            Lint.Test.createFailure(fileName, [11, 13], [11, 14], NoShadowedVariableRule.FAILURE_STRING + "b'"),
            Lint.Test.createFailure(fileName, [13, 13], [13, 14], NoShadowedVariableRule.FAILURE_STRING + "e'"),
            Lint.Test.createFailure(fileName, [22, 9], [22, 10], NoShadowedVariableRule.FAILURE_STRING + "a'"),
            Lint.Test.createFailure(fileName, [27, 9], [27, 10], NoShadowedVariableRule.FAILURE_STRING + "g'"),
            Lint.Test.createFailure(fileName, [35, 15], [35, 16], NoShadowedVariableRule.FAILURE_STRING + "h'"),
            Lint.Test.createFailure(fileName, [36, 15], [36, 16], NoShadowedVariableRule.FAILURE_STRING + "i'"),
            Lint.Test.createFailure(fileName, [41, 9], [41, 10], NoShadowedVariableRule.FAILURE_STRING + "x'"),
            Lint.Test.createFailure(fileName, [42, 9], [42, 10], NoShadowedVariableRule.FAILURE_STRING + "y'"),
            Lint.Test.createFailure(fileName, [46, 10], [46, 15], NoShadowedVariableRule.FAILURE_STRING + "index'"),
            Lint.Test.createFailure(fileName, [47, 9], [47, 10], NoShadowedVariableRule.FAILURE_STRING + "j'"),
            Lint.Test.createFailure(fileName, [59, 13], [59, 16], NoShadowedVariableRule.FAILURE_STRING + "bar'"),
            Lint.Test.createFailure(fileName, [67, 13], [67, 16], NoShadowedVariableRule.FAILURE_STRING + "foo'"),
            Lint.Test.createFailure(fileName, [75, 13], [75, 16], NoShadowedVariableRule.FAILURE_STRING + "foo'"),
            Lint.Test.createFailure(fileName, [88, 14], [88, 15], NoShadowedVariableRule.FAILURE_STRING + "x'"),
            Lint.Test.createFailure(fileName, [89, 14], [89, 15], NoShadowedVariableRule.FAILURE_STRING + "y'"),
            Lint.Test.createFailure(fileName, [90, 16], [90, 17], NoShadowedVariableRule.FAILURE_STRING + "z'"),
            Lint.Test.createFailure(fileName, [94, 15], [94, 16], NoShadowedVariableRule.FAILURE_STRING + "x'"),
            Lint.Test.createFailure(fileName, [95, 15], [95, 16], NoShadowedVariableRule.FAILURE_STRING + "y'"),
            Lint.Test.createFailure(fileName, [97, 17], [97, 18], NoShadowedVariableRule.FAILURE_STRING + "z'")
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, NoShadowedVariableRule);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
