/// <reference path='../references.ts' />

describe("Arguments Rule", () => {
    it("forbids access to arguments properties", () => {
        var fileName = "rules/argumentsRule.test.ts";
        var failures = Lint.Test.applyRuleOnFile(fileName, "noarg");
        var expectedFailure = Lint.Test.createFailure(fileName, [4, 8], [4, 17], Lint.Rules.ArgumentsRule.FAILURE_STRING);

        assert.equal(failures.length, 1);
        assert.isTrue(failures[0].equals(expectedFailure));
    });
});
