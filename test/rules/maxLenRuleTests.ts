/// <reference path='../references.ts' />

describe("<maxlen>", () => {
    it("enforces a maximum line length", () => {
        var fileName = "rules/maxlen.test.ts";
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "maxlen", 140);
        var expectedFailures = [
            Lint.Test.createFailure(fileName, [2, 1], [2, 165], Lint.Rules.MaxLenRule.FAILURE_STRING + "140")
        ];

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
