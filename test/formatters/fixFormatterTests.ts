/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import * as path from "path";
import * as ts from "typescript";

import {Fix, IFormatter, Replacement, RuleFailure, TestUtils} from "../lint";

describe("Fix Formatter", () => {
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("fix");
        const sourceFilePath = path.resolve(__dirname, "../../../test/files/formatters/fixFormatter.test.ts");
        sourceFile = TestUtils.getSourceFileAbsolute(sourceFilePath);
        formatter = new Formatter();
    });

    it("returns the formatted source", () => {
        const failures = [
            new RuleFailure(
                sourceFile,
                0,
                3,
                "",
                "no-var-keyword",
                new Fix("no-var-keyword", [new Replacement(0, 3, "let")]),
            ),
        ];

        const actualResult = formatter.format(failures);
        assert.deepEqual(actualResult, "let x = 123;\n");
    });

    it("fails when there are multiple files given", () => {
        const failures = [
            new RuleFailure(
                sourceFile,
                0,
                3,
                "",
                "no-var-keyword",
                new Fix("no-var-keyword", [new Replacement(0, 3, "let")]),
            ),
            new RuleFailure(
                TestUtils.getSourceFile("formatters/jsonFormatter.test.ts"),
                0,
                3,
                "",
                "no-var-keyword",
                new Fix("no-var-keyword", [new Replacement(0, 3, "let")]),
            ),
        ];

        try {
            formatter.format(failures);
            throw new Error("Should not happen");
        } catch (e) {
            assert.include(e.message, "Only one file can be formatted with the fix formatter.");
        }
    });

    it("throws an an error when there are no failures", () => {
        try {
            formatter.format([]);
            throw new Error("Should not happen");
        } catch (e) {
            assert.deepEqual("Must have exactly one file with failures to apply Fix formatter.", e.message);
        }
    });
});
