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

describe("<class-name>", () => {
    const ClassNameRule = Lint.Test.getRule("class-name");
    const fileName = "rules/classname.test.ts";

    it("ensures class names are always pascal-cased", () => {
        const createFailure = Lint.Test.createFailuresOnFile(fileName, ClassNameRule.FAILURE_STRING);
        const expectedFailures = [
            createFailure([5, 7], [5, 23]),
            createFailure([9, 7], [9, 33])
        ];
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, ClassNameRule);

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
