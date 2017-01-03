/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

describe("Checkstyle Formatter", () => {
    const TEST_FILE_1 = "formatters/jsonFormatter.test.ts"; // reuse existing sample file
    const TEST_FILE_2 = "formatters/pmdFormatter.test.ts"; // reuse existing sample file
    let sourceFile1: ts.SourceFile;
    let sourceFile2: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("checkstyle");
        sourceFile1 = TestUtils.getSourceFile(TEST_FILE_1);
        sourceFile2 = TestUtils.getSourceFile(TEST_FILE_2);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition1 = sourceFile1.getFullWidth();
        const maxPosition2 = sourceFile2.getFullWidth();

        const failures = [
            new RuleFailure(sourceFile1, 0, 1, "first failure", "first-name"),
            new RuleFailure(sourceFile1, 2, 3, "&<>'\" should be escaped", "escape"),
            new RuleFailure(sourceFile1, maxPosition1 - 1, maxPosition1, "last failure", "last-name"),
            new RuleFailure(sourceFile2, 0, 1, "first failure", "first-name"),
            new RuleFailure(sourceFile2, 2, 3, "&<>'\" should be escaped", "escape"),
            new RuleFailure(sourceFile2, maxPosition2 - 1, maxPosition2, "last failure", "last-name"),
        ];
        const expectedResult =
            '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3">' +
            `<file name="${TEST_FILE_1}">` +
            '<error line="1" column="1" severity="warning" message="first failure" source="failure.tslint.first-name" />' +
            '<error line="1" column="3" severity="warning" message="&amp;&lt;&gt;&#39;&quot; should be escaped" ' +
            'source="failure.tslint.escape" />' +
            '<error line="6" column="3" severity="warning" message="last failure" source="failure.tslint.last-name" />' +
            "</file>" +
            `<file name="${TEST_FILE_2}">` +
            '<error line="1" column="1" severity="warning" message="first failure" source="failure.tslint.first-name" />' +
            '<error line="1" column="3" severity="warning" message="&amp;&lt;&gt;&#39;&quot; should be escaped" ' +
            'source="failure.tslint.escape" />' +
            '<error line="6" column="3" severity="warning" message="last failure" source="failure.tslint.last-name" />' +
            "</file>" +
            "</checkstyle>";

        assert.equal(formatter.format(failures), expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.deepEqual(result, '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3"></checkstyle>');
    });
});
