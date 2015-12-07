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

import {RuleFailure, TestUtils} from "../lint";

describe("<indent>", () => {
    const IndentRule = TestUtils.getRule("indent");
    const failureStringTabs = IndentRule.FAILURE_STRING_TABS;
    const failureStringSpaces = IndentRule.FAILURE_STRING_SPACES;
    let actualFailures: RuleFailure[];

    function expectFailure(failure: RuleFailure) {
        TestUtils.assertContainsFailure(actualFailures, failure);
    }

    // checks only that the indent character is the specified one, *NOT* the size of the indent
    describe("on a tab-indented file", () => {
        const fileName = "rules/indentwith_tabs.test.ts";

        before(() => {
            actualFailures = TestUtils.applyRuleOnFile(fileName, IndentRule, [true, "tabs"]);
        });

        it("doesn't fail good code", () => {
            assert.lengthOf(actualFailures, 21);
        });

        it("enforces variable indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [61, 1], [61, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [65, 1], [65, 9], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [69, 1], [69, 5], failureStringTabs));
        });

        it("enforces class method indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [71, 1], [71, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [72, 1], [72, 8], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [73, 1], [73, 5], failureStringTabs));
        });

        it("enforces object literal indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [77, 1], [77, 5], failureStringTabs));
        });

        it("enforces enum indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [83, 1], [83, 5], failureStringTabs));
        });

        it("enforces switch indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [91, 1], [91, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [92, 1], [92, 9], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [93, 1], [93, 9], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [94, 1], [94, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [95, 1], [95, 9], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [96, 1], [96, 9], failureStringTabs));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [100, 1], [100, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [104, 1], [104, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [108, 1], [108, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [112, 1], [112, 5], failureStringTabs));
        });

        it("enforces array literal indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [116, 1], [116, 5], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [122, 1], [122, 9], failureStringTabs));
            expectFailure(TestUtils.createFailure(fileName, [124, 1], [124, 5], failureStringTabs));
        });
    });

    // checks only that the indent character is the specified one, *NOT* the size of the indent
    describe("on a space-indented file", () => {
        const fileName = "rules/indentwith_spaces.test.ts";

        before(() => {
            actualFailures = TestUtils.applyRuleOnFile(fileName, IndentRule, [true, "spaces"]);
        });

        it("doesn't fail good code", () => {
            assert.lengthOf(actualFailures, 21);
        });

        it("enforces variable indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [58, 1], [58, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [62, 1], [62, 3], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [66, 1], [66, 2], failureStringSpaces));
        });

        it("enforces class method indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [68, 1], [68, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [69, 1], [69, 3], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [70, 1], [70, 2], failureStringSpaces));
        });

        it("enforces object literal indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [74, 1], [74, 2], failureStringSpaces));
        });

        it("enforces enum indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [80, 1], [80, 2], failureStringSpaces));
        });

        it("enforces switch indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [85, 1], [85, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [86, 1], [86, 3], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [87, 1], [87, 3], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [91, 1], [91, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [92, 1], [92, 3], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [93, 1], [93, 3], failureStringSpaces));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [97, 1], [97, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [101, 1], [101, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [105, 1], [105, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [109, 1], [109, 2], failureStringSpaces));
        });

        it("enforces array literal indentation", () => {
            expectFailure(TestUtils.createFailure(fileName, [113, 1], [113, 2], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [119, 1], [119, 3], failureStringSpaces));
            expectFailure(TestUtils.createFailure(fileName, [121, 1], [121, 2], failureStringSpaces));
        });
    });
});
