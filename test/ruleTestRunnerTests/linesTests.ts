/*
 * Copyright 2016 Palantir Technologies, Inc.
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

import * as lines from "../ruleTestRunner/lines";

describe("Rule Test Runner", () => {
    describe("lines", () => {
        describe("::createErrorString", () => {
            it("should correctly create strings", () => {
                const code1 = "this is a line of code";
                const errorMarkup1 = "  ~~~~~~~~~~~~~~~~~~~~";
                const errorLine1 = new lines.MultilineErrorLine(3);
                assert.equal(lines.createErrorString(code1, errorLine1), errorMarkup1);

                const code2 = "another line of code here";
                const errorMarkup2 = "~~~~~~~~~~~~~~~~~~~~~~~~~ [foo]";
                const errorLine2 = new lines.EndErrorLine(1, code2.length + 1, "foo");
                assert.equal(lines.createErrorString(code2, errorLine2), errorMarkup2);
            });
        });
    });
});
