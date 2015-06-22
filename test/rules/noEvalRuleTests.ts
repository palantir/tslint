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

describe("<no-eval>", () => {
    const NoEvalRule = Lint.Test.getRule("no-eval");
    const fileName = "rules/evil.test.ts";
    const failureString = NoEvalRule.FAILURE_STRING;

    it("forbids eval", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [6, 13], [6, 17], failureString);
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, NoEvalRule);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
