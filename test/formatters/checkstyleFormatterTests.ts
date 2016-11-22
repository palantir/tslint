import * as ts from "typescript";

import {IFormatter, RuleLevel, RuleViolation, TestUtils} from "../lint";

describe("Checkstyle Formatter", () => {
    const TEST_FILE = "formatters/pmdFormatter.test.ts"; // reuse existing sample file
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        const Formatter = TestUtils.getFormatter("checkstyle");
        sourceFile = TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition = sourceFile.getFullWidth();

        const failures = [
            new RuleViolation(sourceFile, 0, 1, "first failure", RuleLevel.ERROR, "first-name"),
            new RuleViolation(sourceFile, 2, 3, "&<>'\" should be escaped", RuleLevel.ERROR, "escape"),
            new RuleViolation(sourceFile, maxPosition - 1, maxPosition, "last failure", RuleLevel.ERROR, "last-name"),
        ];
        const expectedResult =
            '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3">' +
            `<file name="${TEST_FILE}">` +
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
