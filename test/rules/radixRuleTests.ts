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

describe("<radix>", () => {
    const RadixRule = Lint.Test.getRule("radix");
    const fileName = "rules/radix.test.ts";
    const failureString = RadixRule.FAILURE_STRING;

    it("enforces radix parameter of parseInt", () => {
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, RadixRule);
        const expectedFailure = Lint.Test.createFailure(fileName, [2, 9], [2, 20], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
