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

describe("<member-access>", () => {
    it("enforces using explicit visibility on class members", () => {
        let fileName = "rules/memberaccess.test.ts";
        let MemberAccessRule = Lint.Test.getRule("member-access");
        let actualFailures = Lint.Test.applyRuleOnFile(fileName, MemberAccessRule);

        Lint.Test.assertFailuresEqual(actualFailures, [
            Lint.Test.createFailure(fileName, [8, 5], [8, 15], MemberAccessRule.FAILURE_STRING),
            Lint.Test.createFailure(fileName, [16, 5], [17, 6], MemberAccessRule.FAILURE_STRING)
        ]);
    });
});
