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

describe("<use-strict>", () => {
    const UseStrictRule = Lint.Test.getRule("use-strict");
    const fileName = "rules/usestrict.test.ts";
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        const options = [true, "check-function", "check-module"];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, UseStrictRule, options);
        assert.lengthOf(actualFailures, 3);
    });

    it("enforces checks for 'use strict' in functions", () => {
        const expectedFailures = Lint.Test.createFailure(fileName, [14, 1], [14, 9], UseStrictRule.FAILURE_STRING);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailures);
    });

    it("enforces checks for 'use strict' in modules", () => {
        const expectedFailures = Lint.Test.createFailure(fileName, [24, 1], [24, 7], UseStrictRule.FAILURE_STRING);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailures);
    });

    it("enforces checks for 'use strict' in module declaration with more than one identifier", () => {
        const expectedFailures = Lint.Test.createFailure(fileName, [29, 1], [29, 7], UseStrictRule.FAILURE_STRING);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailures);
    });
});
