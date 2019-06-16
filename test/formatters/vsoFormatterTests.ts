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

describe("VSO Formatter", () => {
    const TEST_FILE = "formatters/vsoFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("vso");
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
                "error",
            ),
        ];

        const expectedResult =
            getFailureString(TEST_FILE, 1, 1, "first failure", "first-name") +
            getFailureString(TEST_FILE, 2, 12, "mid failure", "mid-name") +
            getFailureString(TEST_FILE, 9, 2, "last failure", "last-name");

        const actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("does not duplicate output for fixed failures", () => {
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
                "error",
            ),
        ];

        const expectedResult =
            getFailureString(TEST_FILE, 1, 1, "first failure", "first-name") +
            getFailureString(TEST_FILE, 2, 12, "mid failure", "mid-name") +
            getFailureString(TEST_FILE, 9, 2, "last failure", "last-name");

        const fixed = failures.slice();

        const actualResult = formatter.format(failures, fixed);
        assert.equal(actualResult, expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "\n");
    });

    function getFailureString(
        file: string,
        line: number,
        character: number,
        reason: string,
        code: string,
    ) {
        return `##vso[task.logissue type=warning;sourcepath=${file};linenumber=${line};columnnumber=${character};code=${code};]${reason}\n`;
    }
});
