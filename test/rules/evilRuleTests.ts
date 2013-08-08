/// <reference path='../references.ts' />

describe("<evil>", () => {
    it("forbids eval", () => {
        var fileName = "rules/evil.test.ts";
        var failureString = Lint.Rules.EvilRule.FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [6, 13], [6, 17], failureString);
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "evil");

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
