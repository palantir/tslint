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

describe("TAP Formatter", () => {
    const TEST_FILE = "formatters/tapFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("tap");
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

        const failureStrings = [
            getFailureString(1, "first-name", "error", TEST_FILE, 0, 0, "first failure"),
            getFailureString(2, "mid-name", "error", TEST_FILE, 1, 19, "mid failure"),
            getFailureString(3, "last-name", "error", TEST_FILE, 0, 12, "last failure"),
        ];

        const actualResult = formatter.format(failures);
        assert.equal(
            actualResult,
            `TAP version 13\n1..${failures.length}\n${failureStrings.join("\n")}\n`,
        );
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "TAP version 13\n1..0 # SKIP No failures\n");
    });

    function getFailureString(
        num: number,
        ruleName: string,
        severity: string,
        file: string,
        line: number,
        character: number,
        reason: string,
    ) {
        return dedent`
            not ok ${num} - ${reason}
              ---
              message : ${reason}
              severity: ${severity}
              data:
                ruleName: ${ruleName}
                fileName: ${file}
                line: ${line}
                character: ${character}
                failureString: ${reason}
                rawLines: var x = 123;\n
              ...`;
    }
});
