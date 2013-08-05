/// <reference path='../references.ts' />

describe("Prose Formatter", () => {
    var TEST_FILE = "formatters/proseTest.ts";
    var syntaxTree, formatter;

    before(function() {
        syntaxTree = Lint.Test.getSyntaxTree(TEST_FILE);
        formatter = new Lint.Formatters.ProseFormatter();
    });

    it("formats failures", () => {
        var maxPosition = syntaxTree.sourceUnit().fullWidth();

        var failures = [
            new Lint.RuleFailure(syntaxTree, 0, 1, "first failure"),
            new Lint.RuleFailure(syntaxTree, 32, 36, "mid failure"),
            new Lint.RuleFailure(syntaxTree, maxPosition - 1, maxPosition, "last failure")
        ];

        var expectedResult =
            TEST_FILE + getPositionString(1, 1) + "first failure\n" +
            TEST_FILE + getPositionString(2, 12) + "mid failure\n" +
            TEST_FILE + getPositionString(9, 2) + "last failure\n";

        var actualResult = formatter.format(failures)
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
