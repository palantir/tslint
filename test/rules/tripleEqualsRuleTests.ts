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

/// <reference path='../references.ts' />

describe("<triple-equals>", () => {
    var fileName = "rules/eqeqeq.test.ts";
    var actualFailures;
    var TripleEqualsRule = Lint.Test.getRule("triple-equals");

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TripleEqualsRule, [true, "allow-null-check"]);
        assert.equal(actualFailures.length, 2);
    });

    it("ensures ===", () => {
        var failureString = TripleEqualsRule.EQ_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [4, 33], [4, 35], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("ensures !==", () => {
        var failureString = TripleEqualsRule.NEQ_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [8, 21], [8, 23], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
