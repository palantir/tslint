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

import {IFormatter, RuleFailure, RuleLevel, TestUtils} from "../lint";

describe("PMD Formatter", () => {
    const TEST_FILE = "formatters/pmdFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("pmd");
        sourceFile = TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition = sourceFile.getFullWidth();

        const failures = [
            new RuleFailure(sourceFile, 0, 1, "first failure", RuleLevel.ERROR, "first-name"),
            new RuleFailure(sourceFile, 2, 3, "&<>'\" should be escaped", RuleLevel.ERROR, "escape"),
            new RuleFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", RuleLevel.ERROR, "last-name"),
            new RuleFailure(sourceFile, 0, maxPosition, "full failure", RuleLevel.ERROR, "full-name"),
        ];
        const expectedResult =
            "<pmd version=\"tslint\">" +
                "<file name=\"formatters/pmdFormatter.test.ts\">" +
                    "<violation begincolumn=\"1\" beginline=\"1\" priority=\"1\" rule=\"first failure\"> " +
                    "</violation>" +
                "</file>" +
                "<file name=\"formatters/pmdFormatter.test.ts\">" +
                    "<violation begincolumn=\"3\" beginline=\"1\" priority=\"1\" rule=\"&amp;&lt;&gt;&#39;&quot; should be escaped\"> " +
                    "</violation>" +
                "</file>" +
                "<file name=\"formatters/pmdFormatter.test.ts\">" +
                    "<violation begincolumn=\"3\" beginline=\"6\" priority=\"1\" rule=\"last failure\"> " +
                    "</violation>" +
                "</file>" +
                "<file name=\"formatters/pmdFormatter.test.ts\">" +
                    "<violation begincolumn=\"1\" beginline=\"1\" priority=\"1\" rule=\"full failure\"> " +
                    "</violation>" +
                "</file>" +
            "</pmd>";

        assert.equal(formatter.format(failures), expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.deepEqual(result, "<pmd version=\"tslint\"></pmd>");
    });
});
