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

import {TestUtils} from "../lint";

describe("<member-ordering>", () => {
    it("requires public variables to go before private ones", () => {
        const fileName = "rules/memberordering-private.test.ts";
        const MemberOrderingRule = TestUtils.getRule("member-ordering");
        const actualFailures = TestUtils.applyRuleOnFile(fileName, MemberOrderingRule, [
            true,
            "public-before-private"
        ]);

        TestUtils.assertFailuresEqual(actualFailures, [
            TestUtils.createFailure(fileName, [6, 5], [6, 15],
                "Declaration of public instance member variable not allowed " +
                "to appear after declaration of private instance member function")
        ]);
    });

    it("requires variables to go before methods", () => {
        const fileName = "rules/memberordering-method.test.ts";
        const MemberOrderingRule = TestUtils.getRule("member-ordering");
        const actualFailures = TestUtils.applyRuleOnFile(fileName, MemberOrderingRule, [
            true,
            "variables-before-functions"
        ]);

        TestUtils.assertFailuresEqual(actualFailures, [
            TestUtils.createFailure(fileName, [12, 5], [12, 15],
                    "Declaration of public instance member variable not allowed " +
                    "to appear after declaration of public instance member function"),
            TestUtils.createFailure(fileName, [17, 5], [17, 15],
                    "Declaration of public instance member variable not allowed " +
                    "to appear after declaration of public instance member function"),
        ]);
    });

    it("requires static variables to go before instance variables", () => {
        const fileName = "rules/memberordering-static.test.ts";
        const MemberOrderingRule = TestUtils.getRule("member-ordering");
        const actualFailures = TestUtils.applyRuleOnFile(fileName, MemberOrderingRule, [
            true,
            "static-before-instance"
        ]);

        TestUtils.assertFailuresEqual(actualFailures, [
            TestUtils.createFailure(fileName, [3, 5], [3, 22],
                    "Declaration of public static member variable not allowed " +
                    "to appear after declaration of public instance member variable")
        ]);
    });
});
