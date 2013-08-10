/// <reference path='../references.ts' />

describe("<semicolon>", () => {
    it("warns on missing semicolons", () => {
        var fileName = "rules/semicolon.test.ts";
        var failureString = Lint.Rules.SemicolonRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "semicolon");
        var expectedFailure = Lint.Test.createFailure(fileName, [1, 32], [1, 32], failureString);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
