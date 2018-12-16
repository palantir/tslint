/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

describe("JUnit Formatter", () => {
    const TEST_FILE_1 = "formatters/jsonFormatter.test.ts"; // reuse existing sample file
    const TEST_FILE_2 = "formatters/pmdFormatter.test.ts"; // reuse existing sample file
    let sourceFile1: ts.SourceFile;
    let sourceFile2: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("junit");
        sourceFile1 = TestUtils.getSourceFile(TEST_FILE_1);
        sourceFile2 = TestUtils.getSourceFile(TEST_FILE_2);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition1 = sourceFile1.getFullWidth();
        const maxPosition2 = sourceFile2.getFullWidth();

        const failures = [
            createFailure(sourceFile1, 0, 1, "first failure", "first-name", undefined, "error"),
            createFailure(
                sourceFile1,
                2,
                3,
                "&<>'\" should be escaped",
                "escape",
                undefined,
                "error",
            ),
            createFailure(
                sourceFile1,
                maxPosition1 - 1,
                maxPosition1,
                "last failure",
                "last-name",
                undefined,
                "error",
            ),
            createFailure(sourceFile2, 0, 1, "first failure", "first-name", undefined, "error"),
            createFailure(
                sourceFile2,
                2,
                3,
                "&<>'\" should be escaped",
                "escape",
                undefined,
                "warning",
            ),
            createFailure(
                sourceFile2,
                maxPosition2 - 1,
                maxPosition2,
                "last failure",
                "last-name",
                undefined,
                "warning",
            ),
        ];
        const expectedResult = `<?xml version="1.0" encoding="utf-8"?>
            <testsuites package="tslint">
                <testsuite name="${TEST_FILE_1}">
                    <testcase name="first-name" classname="${TEST_FILE_1}">
                        <failure type="error">first failure Line 1, Column 1</failure>
                    </testcase>
                    <testcase name="escape" classname="${TEST_FILE_1}">
                        <failure type="error">&amp;&lt;&gt;&#39;&quot; should be escaped Line 1, Column 3</failure>
                    </testcase>
                    <testcase name="last-name" classname="${TEST_FILE_1}">
                        <failure type="error">last failure Line 6, Column 3</failure>
                    </testcase>
                </testsuite>
                <testsuite name="${TEST_FILE_2}">
                    <testcase name="first-name" classname="${TEST_FILE_2}">
                        <failure type="error">first failure Line 1, Column 1</failure>
                    </testcase>
                    <testcase name="escape" classname="${TEST_FILE_2}">
                        <failure type="warning">&amp;&lt;&gt;&#39;&quot; should be escaped Line 1, Column 3</failure>
                    </testcase>
                    <testcase name="last-name" classname="${TEST_FILE_2}">
                        <failure type="warning">last failure Line 6, Column 3</failure>
                    </testcase>
                </testsuite>
            </testsuites>`.replace(/>\s+/g, ">"); // Remove whitespace between tags;

        assert.equal(formatter.format(failures), expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.deepEqual(
            result,
            '<?xml version="1.0" encoding="utf-8"?><testsuites package="tslint"></testsuites>',
        );
    });
});
