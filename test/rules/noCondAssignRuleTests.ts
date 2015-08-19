/*
 * Copyright 2015 Palantir Technologies, Inc.
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

describe("<no-cond-assign>", () => {
    const fileName = "rules/nocondassign.test.ts";
    const NoCondAssignRule = Lint.Test.getRule("no-cond-assign");
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, NoCondAssignRule);
    });

    it("no false positives for rule", () => {
        assert.lengthOf(actualFailures, 8);
    });
});
