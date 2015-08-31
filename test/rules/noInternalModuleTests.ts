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

describe("<no-internal-module>", () => {
    const NoInternalModule = Lint.Test.getRule("no-internal-module");
    const fileName = "rules/nointernalmodule.test.ts";
    const failureString = NoInternalModule.FAILURE_STRING;

    it("forbids internal module", () => {
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, NoInternalModule);
        const expectedFailures = [
            Lint.Test.createFailure(fileName, [4, 1], [4, 15], failureString),
            Lint.Test.createFailure(fileName, [7, 1], [7, 24], failureString),
            Lint.Test.createFailure(fileName, [25, 5], [28, 6], failureString),
            Lint.Test.createFailure(fileName, [31, 1], [36, 2], failureString),
            Lint.Test.createFailure(fileName, [33, 9], [33, 32], failureString),
            Lint.Test.createFailure(fileName, [44, 1], [44, 30], failureString),
            Lint.Test.createFailure(fileName, [46, 1], [46, 35], failureString),
            Lint.Test.createFailure(fileName, [49, 1], [49, 21], failureString),
            Lint.Test.createFailure(fileName, [50, 1], [50, 22], failureString)
        ];

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
