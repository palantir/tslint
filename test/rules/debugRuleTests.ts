/// <reference path='../references.ts' />

describe("<debug>", () => {
    it("forbids debugger statements", () => {
        var fileName = "rules/debug.test.ts";
        var failureString = Lint.Rules.DebugRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "debug");
        var expectedFailure = Lint.Test.createFailure(fileName, [5, 9], [5, 17], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
