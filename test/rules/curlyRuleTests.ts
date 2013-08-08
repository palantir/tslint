/// <reference path='../references.ts' />

describe("<curly>", () => {
    var actualFailures;
    var fileName = "rules/curly.test.ts";

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, "curly");
    });

    it("ensures if statements are always braced", () => {
        var failureString = Lint.Rules.CurlyRule.IF_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [10, 5], [11, 26], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("ensures for statements are always braced", () => {
        var failureString = Lint.Rules.CurlyRule.FOR_FAILURE_STRING;
        var expectedFailure1 = Lint.Test.createFailure(fileName, [22, 3], [23, 24], failureString);
        var expectedFailure2 = Lint.Test.createFailure(fileName, [25, 1], [26, 22], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });

    it("ensures while statements are always braced", () => {
        var failureString = Lint.Rules.CurlyRule.WHILE_FAILURE_STRING;
        var expectedFailure1 = Lint.Test.createFailure(fileName, [37, 1], [38, 22], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
    });

    it("ensures do statements are always braced", () => {
        var failureString = Lint.Rules.CurlyRule.DO_FAILURE_STRING;
        var expectedFailure1 = Lint.Test.createFailure(fileName, [50, 1], [52, 16], failureString);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
    });
});
