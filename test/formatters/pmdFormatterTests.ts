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

/// <reference path='../references.ts' />

describe("PMD Formatter", () => {
    var TEST_FILE = "formatters/pmdFormatter.test.ts";
    var syntaxTree, formatter;

    before(function() {
        var Formatter = Lint.Test.getFormatter("pmd");
        syntaxTree = Lint.Test.getSyntaxTree(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        var maxPosition = TypeScript.fullWidth(syntaxTree.sourceUnit());

        var failures = [
            new Lint.RuleFailure(syntaxTree, 0, 1, "first failure", "first-name"),
            new Lint.RuleFailure(syntaxTree, 2, 3, "&<>'\" should be escaped", "escape"),
            new Lint.RuleFailure(syntaxTree, maxPosition - 1, maxPosition, "last failure", "last-name"),
            new Lint.RuleFailure(syntaxTree, 0, maxPosition, "full failure", "full-name")
        ];
        var expectedResult =
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
        var result = formatter.format([]);
        assert.deepEqual(result, "<pmd version=\"tslint\"></pmd>");
    });
});
