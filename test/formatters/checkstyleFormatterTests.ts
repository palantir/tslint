import * as ts from "typescript";

import {IFormatter, RuleFailure, TestUtils} from "../lint";

describe("Checkstyle Formatter", () => {
    const TEST_FILE_1 = "formatters/jsonFormatter.test.ts"; // reuse existing sample file
    const TEST_FILE_2 = "formatters/pmdFormatter.test.ts"; // reuse existing sample file
    let sourceFile_1: ts.SourceFile;
    let sourceFile_2: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("checkstyle");
        sourceFile_1 = TestUtils.getSourceFile(TEST_FILE_1);
        sourceFile_2 = TestUtils.getSourceFile(TEST_FILE_2);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition_1 = sourceFile_1.getFullWidth();
        const maxPosition_2 = sourceFile_2.getFullWidth();

        const failures = [
            new RuleFailure(sourceFile_1, 0, 1, "first failure", "first-name"),
            new RuleFailure(sourceFile_1, 2, 3, "&<>'\" should be escaped", "escape"),
            new RuleFailure(sourceFile_1, maxPosition_1 - 1, maxPosition_1, "last failure", "last-name"),
            new RuleFailure(sourceFile_2, 0, 1, "first failure", "first-name"),
            new RuleFailure(sourceFile_2, 2, 3, "&<>'\" should be escaped", "escape"),
            new RuleFailure(sourceFile_2, maxPosition_2 - 1, maxPosition_2, "last failure", "last-name"),
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
