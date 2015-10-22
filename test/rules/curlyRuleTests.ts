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

describe("<curly>", () => {
    const fileName = "rules/curly.test.ts";
    const CurlyRule = Lint.Test.getRule("curly");
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, CurlyRule);
    });

    it("ensures if statements are always braced", () => {
        const failureString = CurlyRule.IF_FAILURE_STRING;
        const expectedFailure = Lint.Test.createFailure(fileName, [10, 5], [11, 26], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("ensures for statements are always braced", () => {
        const failureString = CurlyRule.FOR_FAILURE_STRING;
        const expectedFailure1 = Lint.Test.createFailure(fileName, [22, 3], [23, 24], failureString);
        const expectedFailure2 = Lint.Test.createFailure(fileName, [25, 1], [26, 22], failureString);
        const expectedFailure3 = Lint.Test.createFailure(fileName, [67, 1], [68, 20], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("ensures while statements are always braced", () => {
        const failureString = CurlyRule.WHILE_FAILURE_STRING;
        const expectedFailure1 = Lint.Test.createFailure(fileName, [37, 1], [38, 22], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
    });

    it("ensures do statements are always braced", () => {
        const failureString = CurlyRule.DO_FAILURE_STRING;
        const expectedFailure1 = Lint.Test.createFailure(fileName, [50, 1], [52, 16], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
    });

    it("ensures else statements are always braced", () => {
        const failureString = CurlyRule.ELSE_FAILURE_STRING;
        const expectedFailure = Lint.Test.createFailure(fileName, [56, 3], [56, 25], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("does not have false positives", () => {
        assert.lengthOf(actualFailures, 7);
    });
});
