/// <reference path='../references.ts' />

describe("<noarg>", () => {
    it("forbids access to arguments properties", () => {
        var fileName = "rules/noarg.test.ts";
        var expectedFailure = Lint.Test.createFailure(fileName, [4, 8], [4, 17], Lint.Rules.NoArgRule.FAILURE_STRING);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "noarg");

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
