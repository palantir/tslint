/*
 * Copyright 2014 Palantir Technologies, Inc.
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

import {TestUtils} from "../lint";

describe("<no-use-before-declare>", () => {
    const Rule = TestUtils.getRule("no-use-before-declare");
    const fileName = "rules/nousebeforedeclare.test.ts";

    it("restricts usage before declaration", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, Rule);
        assert.equal(actualFailures.length, 8);
    });

    it("restricts usage of imports before declaration", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, Rule);

        const failure1 = TestUtils.createFailuresOnFile(fileName, makeFailureString("$"))([1, 1], [1, 2]);
        const failure2 = TestUtils.createFailuresOnFile(fileName, makeFailureString("foo1"))([35, 17], [35, 21]);
        const failure3 = TestUtils.createFailuresOnFile(fileName, makeFailureString("foo2"))([36, 17], [36, 21]);
        const failure4 = TestUtils.createFailuresOnFile(fileName, makeFailureString("foo3"))([37, 17], [37, 21]);
        const failure5 = TestUtils.createFailuresOnFile(fileName, makeFailureString("map"))([38, 5], [38, 8]);

        TestUtils.assertContainsFailure(actualFailures, failure1);
        TestUtils.assertContainsFailure(actualFailures, failure2);
        TestUtils.assertContainsFailure(actualFailures, failure3);
        TestUtils.assertContainsFailure(actualFailures, failure4);
        TestUtils.assertContainsFailure(actualFailures, failure5);
    });

    it("restricts usage of variables before declaration", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, Rule);

        const failure1 = TestUtils.createFailuresOnFile(fileName, makeFailureString("varb"))([3, 12], [3, 16]);
        const failure2 = TestUtils.createFailuresOnFile(fileName, makeFailureString("j"))([13, 9], [13, 10]);

        TestUtils.assertContainsFailure(actualFailures, failure1);
        TestUtils.assertContainsFailure(actualFailures, failure2);
    });

    it("restricts exporting variables before declaration", () => {
        const actualFailures = TestUtils.applyRuleOnFile(fileName, Rule);
        const failure1 = TestUtils.createFailuresOnFile(fileName, makeFailureString("undeclaredA"))([52, 5], [52, 16]);

        TestUtils.assertContainsFailure(actualFailures, failure1);
    });

    function makeFailureString(varName: string) {
        return `${Rule.FAILURE_STRING_PREFIX}${varName}${Rule.FAILURE_STRING_POSTFIX}`;
    }
});
