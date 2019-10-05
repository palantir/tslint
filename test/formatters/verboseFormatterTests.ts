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
import { IFormatter, TestUtils } from "../lint";

import { createFailure } from "./utils";

describe("Verbose Formatter", () => {
    const TEST_FILE = "formatters/proseFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("verbose");
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

        const expectedResult = dedent`
            ERROR: (first-name) ${TEST_FILE}${getPositionString(1, 1)}first failure
            ERROR: (mid-name) ${TEST_FILE}${getPositionString(2, 12)}mid failure
            ERROR: (last-name) ${TEST_FILE}${getPositionString(9, 2)}last failure\n`.slice(1); // remove leading newline

        const actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "\n");
    });

    function getPositionString(line: number, character: number) {
        return `[${line}, ${character}]: `;
    }
});
