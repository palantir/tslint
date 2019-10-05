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

describe("External Formatter", () => {
    const TEST_FILE = "formatters/externalFormatter.test.ts";
    const TEST_MODULE = "../../test/files/formatters/simple";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter(TEST_MODULE);
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
            ${getPositionString(1, 1)}${TEST_FILE}
            ${getPositionString(2, 11)}${TEST_FILE}
            ${getPositionString(9, 2)}${TEST_FILE}\n`.slice(1); // remove leading newline

        const actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("returns undefined for unresolvable module", () => {
        assert.isUndefined(TestUtils.getFormatter(`${TEST_FILE}/__non-existent__`));
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "");
    });

    function getPositionString(line: number, character: number) {
        return `[${line}, ${character}]`;
    }
});
