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

describe("<no-construct>", () => {
    const fileName = "rules/noconstruct.test.ts";
    const NoConstructRule = Lint.Test.getRule("no-construct");
    const createFailure = Lint.Test.createFailuresOnFile(fileName, NoConstructRule.FAILURE_STRING);
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, NoConstructRule);
    });

    it("forbids access to String constructor", () => {
        const expectedFailure = createFailure([2, 13], [2, 23]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("forbids access to Number constructor", () => {
        const expectedFailure = createFailure([5, 10], [5, 23]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("forbids access to Boolean constructor", () => {
        const expectedFailure = createFailure([8, 10], [8, 21]);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
