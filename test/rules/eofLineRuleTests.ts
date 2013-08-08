/// <reference path='../references.ts' />

describe("<eofline>", () => {
    it("ensures a trailing newline at EOF", () => {
        var fileName = "rules/eofline.test.ts";
        var failureString = Lint.Rules.EofLineRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "eofline");
        var expectedFailure = Lint.Test.createFailure(fileName, [4, 38], [4, 38], failureString);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
