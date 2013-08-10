/// <reference path='../references.ts' />

describe("<trailing>", () => {
    it("forbids trailing whitespace", () => {
        var fileName = "rules/trailing.test.ts";
        var failureString = Lint.Rules.TrailingRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "trailing");
        var expectedFailure1 = Lint.Test.createFailure(fileName, [2, 24], [2, 28], failureString);
        var expectedFailure2 = Lint.Test.createFailure(fileName, [3, 32], [3, 36], failureString);
        var expectedFailure3 = Lint.Test.createFailure(fileName, [5, 2], [5, 6], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });
});
