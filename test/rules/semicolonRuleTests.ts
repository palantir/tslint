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

describe("<semicolon>", () => {
    var SemicolonRule = Lint.Test.getRule("semicolon");
    var fileName = "rules/semicolon.test.ts";
    var failureString = SemicolonRule.FAILURE_STRING;
    var actualFailures: Lint.RuleFailure[];
    var createFailure = (start: number[], end: number[]) => {
        return Lint.Test.createFailure(fileName, start, end, failureString);
    };

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, SemicolonRule);
    });

    it("warns on all statements", () => {
        assert.equal(actualFailures.length, 14);
    });

    it("warns on variable statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([1, 10], [1, 10]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([25, 14], [25, 14]));
    });

    it("warns on expression statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([2, 7], [2, 7]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([5, 2], [5, 2]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([7, 19], [7, 19]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([9, 32], [9, 32]));
    });

    it("warns on return statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([12, 11], [12, 11]));
    });

    it("warns on break statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([17, 14], [17, 14]));
    });

    it("warns on continue statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([19, 17], [19, 17]));
    });

    it("warns on throw statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([22, 30], [22, 30]));
    });

    it("warns on do while statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([26, 18], [26, 18]));
    });

    it("warns on debugger statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([28, 9], [28, 9]));
    });

    it("warns on import and export statements", () => {
        Lint.Test.assertContainsFailure(actualFailures, createFailure([30, 20], [30, 20]));
        Lint.Test.assertContainsFailure(actualFailures, createFailure([32, 17], [32, 17]));
    });
});
