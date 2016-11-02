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

import * as colors from "colors";

import * as ts from "typescript";

import {IFormatter, RuleFailure, TestUtils} from "../lint";

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
            new RuleFailure(sourceFile, 0, 1, "first failure", "first-name"),
            new RuleFailure(sourceFile, 2, 3, "&<>'\" should be escaped", "escape"),
            new RuleFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name"),
            new RuleFailure(sourceFile, 0, maxPosition, "full failure", "full-name"),
        ];

        const maxPositionObj = sourceFile.getLineAndCharacterOfPosition(maxPosition - 1);

        const maxPositionTuple = `${maxPositionObj.line + 1}:${maxPositionObj.character + 1}`;

        const expectedResult = colors.enabled ?
            "formatters/stylishFormatter.test.ts" + "\n" +
            "\u001b[33m1:1\u001b[39m  \u001b[90mfirst-name\u001b[39m  \u001b[31mfirst failure\u001b[39m" + "\n" +
            "\u001b[33m1:3\u001b[39m  \u001b[90mescape    \u001b[39m  \u001b[31m&<>'\" should be escaped\u001b[39m" + "\n" +
            `\u001b[33m${maxPositionTuple}\u001b[39m  \u001b[90mlast-name \u001b[39m  \u001b[31mlast failure\u001b[39m` + "\n" +
            "\u001b[33m1:1\u001b[39m  \u001b[90mfull-name \u001b[39m  \u001b[31mfull failure\u001b[39m" + "\n" +
            "\n" :
            "formatters/stylishFormatter.test.ts" + "\n" +
            "1:1  first-name  first failure" + "\n" +
            "1:3  escape      &<>\'\" should be escaped" + "\n" +
            `${maxPositionTuple}  last-name   last failure` + "\n" +
            "1:1  full-name   full failure" + "\n" +
            "\n";

        assert.equal(formatter.format(failures), expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "\n");
    });
});
