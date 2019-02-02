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

import { dedent } from "../../src/utils";
import { IFormatter, RuleFailure, TestUtils } from "../lint";

import { createFailure } from "./utils";

describe("Prose Formatter", () => {
    const TEST_FILE = "formatters/proseFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("prose");
        sourceFile = TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition = sourceFile.getFullWidth();

        const failures = [
            createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            createFailure(sourceFile, 32, 36, "mid failure", "mid-name", undefined, "error"),
            createFailure(
                sourceFile,
                maxPosition - 1,
                maxPosition,
                "last failure",
                "last-name",
                undefined,
                "warning",
            ),
        ];

        const expectedResult = dedent`
            ERROR: ${TEST_FILE}${getPositionString(1, 1)}first failure
            ERROR: ${TEST_FILE}${getPositionString(2, 12)}mid failure
            WARNING: ${TEST_FILE}${getPositionString(9, 2)}last failure\n`.slice(1); // remove leading newline

        const actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("formats fixes", () => {
        const failures = [
            createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
        ];

        const mockFix = ({ getFileName: () => "file2" } as any) as RuleFailure; // tslint:disable-line no-object-literal-type-assertion

        const fixes = [
            createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            createFailure(sourceFile, 32, 36, "mid failure", "mid-name", undefined, "error"),
            mockFix,
        ];

        const expectedResult = dedent`
            Fixed 2 error(s) in ${TEST_FILE}
            Fixed 1 error(s) in file2

            ERROR: ${TEST_FILE}${getPositionString(1, 1)}first failure\n`.slice(1); // remove leading newline

        const actualResult = formatter.format(failures, fixes);
        assert.equal(actualResult, expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "\n");
    });

    function getPositionString(line: number, character: number) {
        return `:${line}:${character} - `;
    }
});
