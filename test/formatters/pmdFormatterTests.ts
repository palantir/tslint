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

import { assert } from "chai";
import * as ts from "typescript";

import { IFormatter, TestUtils } from "../lint";

import { createFailure } from "./utils";

describe("PMD Formatter", () => {
    const TEST_FILE = "formatters/pmdFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("pmd");
        sourceFile = TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition = sourceFile.getFullWidth();

        const failures = [
            createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            createFailure(
                sourceFile,
                2,
                3,
                "&<>'\" should be escaped",
                "escape",
                undefined,
                "error",
            ),
            createFailure(
                sourceFile,
                maxPosition - 1,
                maxPosition,
                "last failure",
                "last-name",
                undefined,
                "warning",
            ),
            createFailure(
                sourceFile,
                0,
                maxPosition,
                "full failure",
                "full-name",
                undefined,
                "warning",
            ),
        ];
        const expectedResult = `<pmd version="tslint">
                <file name="formatters/pmdFormatter.test.ts">
                    <violation begincolumn="1" beginline="1" priority="3" rule="first failure">
                    </violation>
                </file>
                <file name="formatters/pmdFormatter.test.ts">
                    <violation begincolumn="3" beginline="1" priority="3" rule="&amp;&lt;&gt;&#39;&quot; should be escaped">
                    </violation>
                </file>
                <file name="formatters/pmdFormatter.test.ts">
                    <violation begincolumn="3" beginline="6" priority="4" rule="last failure">
                    </violation>
                </file>
                <file name="formatters/pmdFormatter.test.ts">
                    <violation begincolumn="1" beginline="1" priority="4" rule="full failure">
                    </violation>
                </file>
            </pmd>`.replace(/>\s+/g, ">"); // Remove whitespace between tags

        assert.equal(formatter.format(failures), expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.deepEqual(result, '<pmd version="tslint"></pmd>');
    });
});
