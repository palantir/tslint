/// <reference path='../references.ts' />

describe("<sub>", () => {
    it("forbids object access via string literals", () => {
        var fileName = "rules/sub.test.ts";
        var failureString = Lint.Rules.SubRule.FAILURE_STRING;

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "sub");
        var expectedFailure1 = Lint.Test.createFailure(fileName, [10, 20], [10, 25], failureString);
        var expectedFailure2 = Lint.Test.createFailure(fileName, [11, 21], [11, 24], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });
});
