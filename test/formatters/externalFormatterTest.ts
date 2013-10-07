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

describe("External Formatter", () => {
    var TEST_FILE = "formatters/externalFormatter.test.ts";
    var TEST_MODULE = "../test/files/formatters/simple";
    var syntaxTree, formatter;

    before(function() {
        var Formatter = Lint.Test.getFormatter(TEST_MODULE);
        syntaxTree = Lint.Test.getSyntaxTree(TEST_FILE);
        formatter = new Formatter();
    });
    it("formats failures", () => {
        var maxPosition = syntaxTree.sourceUnit().fullWidth();

        var failures = [
            new Lint.RuleFailure(syntaxTree, 0, 1, "first failure"),
            new Lint.RuleFailure(syntaxTree, 32, 36, "mid failure"),
            new Lint.RuleFailure(syntaxTree, maxPosition - 1, maxPosition, "last failure")
        ];

        var expectedResult =
            getPositionString(1, 1) + TEST_FILE + "\n" +
            getPositionString(2, 11) + TEST_FILE + "\n" +
            getPositionString(9, 2) + TEST_FILE + "\n";

        var actualResult = formatter.format(failures);
        assert.equal(actualResult, expectedResult);
    });

    it("returns undefined for unresolvable module", () => {
        assert.isUndefined(Lint.Test.getFormatter(TEST_FILE + "/__non-existent__"));
    });

    it("handles no failures", () => {
        var result = formatter.format([]);
        assert.equal(result, "");
    });

    function getPositionString(line, character) {
        return "[" + line + ", " + character + "]";
    }
});
