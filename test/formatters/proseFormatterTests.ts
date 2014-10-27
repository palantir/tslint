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

describe("Prose Formatter", () => {
    var TEST_FILE = "formatters/proseFormatter.test.ts";
    var syntaxTree, formatter;

    before(function() {
        var Formatter = Lint.Test.getFormatter("prose");
        syntaxTree = Lint.Test.getSyntaxTree(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        var maxPosition = TypeScript.fullWidth(syntaxTree.sourceUnit());

        var failures = [
            new Lint.RuleFailure(syntaxTree, 0, 1, "first failure", "first-name"),
            new Lint.RuleFailure(syntaxTree, 32, 36, "mid failure", "mid-name"),
            new Lint.RuleFailure(syntaxTree, maxPosition - 1, maxPosition, "last failure", "last-name")
        ];

        var expectedResult =
            TEST_FILE + getPositionString(1, 1) + "first failure\n" +
            TEST_FILE + getPositionString(2, 12) + "mid failure\n" +
            TEST_FILE + getPositionString(9, 2) + "last failure\n";

        var actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("handles no failures", () => {
        var result = formatter.format([]);
        assert.equal(result, "");
    });

    function getPositionString(line, character) {
        return "[" + line + ", " + character + "]: ";
    }
});
