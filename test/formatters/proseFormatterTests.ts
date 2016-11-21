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

import {IFormatter, RuleViolation, TestUtils} from "../lint";
import {RuleLevel} from "../../src/language/rule/rule";

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
            new RuleViolation(sourceFile, 0, 1, "first failure", RuleLevel.ERROR, "first-name"),
            new RuleViolation(sourceFile, 32, 36, "mid failure", RuleLevel.ERROR, "mid-name"),
            new RuleViolation(sourceFile, maxPosition - 1, maxPosition, "last failure", RuleLevel.ERROR, "last-name"),
        ];

        const expectedResult =
            "ERROR: " + TEST_FILE + getPositionString(1, 1) + "first failure\n" +
            "ERROR: " + TEST_FILE + getPositionString(2, 12) + "mid failure\n" +
            "ERROR: " + TEST_FILE + getPositionString(9, 2) + "last failure\n";

        const actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("formats fixes", () => {
        const failures = [
            new RuleViolation(sourceFile, 0, 1, "first failure", RuleLevel.ERROR, "first-name"),
        ];

        const mockFix = { getFileName: () => { return "file2"; } } as any;

        const fixes = [
            new RuleViolation(sourceFile, 0, 1, "first failure", RuleLevel.ERROR, "first-name"),
            new RuleViolation(sourceFile, 32, 36, "mid failure", RuleLevel.ERROR, "mid-name"),
             mockFix,
        ];

        const expectedResult =
            `Fixed 2 error(s) in ${TEST_FILE}\n` +
            `Fixed 1 error(s) in file2\n\n` +
            `ERROR: ${TEST_FILE}${getPositionString(1, 1)}first failure\n`;

        const actualResult = formatter.format(failures, fixes);
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
