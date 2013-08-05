/// <reference path='../references.ts' />

describe("JSON Formatter", () => {
    var TEST_FILE = "formatters/jsonTest.ts";
    var syntaxTree, formatter;

    before(function() {
        syntaxTree = Lint.Test.getSyntaxTree(TEST_FILE);
        formatter = new Lint.Formatters.JsonFormatter();
    });

    it("formats failures", () => {
        var maxPosition = syntaxTree.sourceUnit().fullWidth();

        var failures = [
            new Lint.RuleFailure(syntaxTree, 0, 1, "first failure"),
            new Lint.RuleFailure(syntaxTree, maxPosition - 1, maxPosition, "last failure"),
            new Lint.RuleFailure(syntaxTree, 0, maxPosition, "full failure")
        ];

        var expectedResult = [{
            name: TEST_FILE,
            failure: "first failure",
            startPosition: {
                position: 0,
                line: 0,
                character: 0
            },
            endPosition: {
                position: 1,
                line: 0,
                character: 1
            }
        },
        {
            name: TEST_FILE,
            failure: "last failure",
            startPosition: {
                position: maxPosition - 1,
                line: 5,
                character: 2
            },
            endPosition: {
                position: maxPosition,
                line: 6,
                character: 0
            }
        },
        {
            name: TEST_FILE,
            failure: "full failure",
            startPosition: {
                position: 0,
                line: 0,
                character: 0
            },
            endPosition: {
                position: maxPosition,
                line: 6,
                character: 0
            }
        }];

        var actualResult = JSON.parse(formatter.format(failures));
        assert.deepEqual(actualResult, expectedResult);
    });

    it("handles no failures", () => {
        var result = JSON.parse(formatter.format([]));
        assert.deepEqual(result, []);
    });
});
