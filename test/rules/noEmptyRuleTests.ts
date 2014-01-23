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

describe("<no-empty>", () => {
    var actualFailures;
    var fileName = "rules/noempty.test.ts";
    var NoEmptyRule = Lint.Test.getRule("no-empty");
    var createFailure = Lint.Test.createFailuresOnFile(fileName, NoEmptyRule.FAILURE_STRING);

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, NoEmptyRule);
    });

    it("forbids empty conditional blocks", () => {
        var expectedFailure1 = createFailure([1, 14], [1, 16]);
        var expectedFailure2 = createFailure([2, 14], [5, 2]);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("forbids empty function blocks", () => {
        var expectedFailure = createFailure([7, 25], [9, 2]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("forbids empty loop blocks", () => {
        var expectedFailure = createFailure([11, 29], [11, 32]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("forbids empty constructors", () => {
        var expectedFailure = createFailure([24, 34], [25, 6]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("non empty blocks are allowed", () => {
        assert.lengthOf(actualFailures, 5);
    });
});
