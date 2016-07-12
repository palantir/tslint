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

import * as ts from "typescript";

import {IFormatter, RuleFailure, TestUtils} from "../lint";

describe("MSBuild Formatter", () => {
    const TEST_FILE = "formatters/msbuildFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("msbuild");
        sourceFile = TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition = sourceFile.getFullWidth();

        const failures = [
            new RuleFailure(sourceFile, 0, 1, "first failure", "first-name"),
            new RuleFailure(sourceFile, 32, 36, "mid failure", "mid-name"),
            new RuleFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name"),
        ];

        const expectedResult =
            getFailureString(TEST_FILE, 1,  1, "first failure") +
            getFailureString(TEST_FILE, 2, 12, "mid failure") +
            getFailureString(TEST_FILE, 9,  2,  "last failure");

        const actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "\n");
    });

    function getFailureString(file: string, line: number, character: number, reason: string) {
        return `${file}(${line},${character}): warning: ${reason}\n`;
    }
});
