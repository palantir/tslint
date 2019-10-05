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

describe("Stylish Formatter", () => {
    const TEST_FILE = "formatters/stylishFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("stylish");
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
                "error",
            ),
            createFailure(
                sourceFile,
                0,
                maxPosition,
                "full failure",
                "full-name",
                undefined,
                "error",
            ),
        ];

        const maxPositionObj = sourceFile.getLineAndCharacterOfPosition(maxPosition - 1);

        const maxPositionTuple = `${maxPositionObj.line + 1}:${maxPositionObj.character + 1}`;

        const expectedResult = dedent`
            formatters/stylishFormatter.test.ts\u001b[8m:1:1\u001b[28m
            \u001b[31mERROR: 1:1\u001b[39m  \u001b[90mfirst-name\u001b[39m  \u001b[33mfirst failure\u001b[39m
            \u001b[31mERROR: 1:1\u001b[39m  \u001b[90mfull-name \u001b[39m  \u001b[33mfull failure\u001b[39m
            \u001b[31mERROR: 1:3\u001b[39m  \u001b[90mescape    \u001b[39m  \u001b[33m&<>'\" should be escaped\u001b[39m
            \u001b[31mERROR: ${maxPositionTuple}\u001b[39m  \u001b[90mlast-name \u001b[39m  \u001b[33mlast failure\u001b[39m\n`.slice(
            1,
        ); // remove leading newline

        assert.equal(formatter.format(failures), expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "\n");
    });
});
