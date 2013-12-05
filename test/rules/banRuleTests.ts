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

describe("<ban>", () => {
    it("bans access to specified functions", () => {
        var fileName = "rules/ban.test.ts";
        var BanRule = Lint.Test.getRule("ban");
        var dirFailure = Lint.Test.createFailuresOnFile(fileName, BanRule.FAILURE_STRING_PART + "window.toString")([2, 1], [2, 16]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, BanRule, [true, ["window", "toString"]]);
        Lint.Test.assertContainsFailure(actualFailures, dirFailure);
    });
});
