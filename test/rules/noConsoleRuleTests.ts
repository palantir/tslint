/// <reference path='../references.ts' />

describe("<noconsole>", () => {
    it("forbids access to specified console properties", () => {
        var fileName = "rules/noconsole.test.ts";
        var createFailure = Lint.Test.createFailuresOnFile(fileName, Lint.Rules.NoConsoleRule.FAILURE_STRING);
        var dirFailure = createFailure([3, 1], [3, 12]);
        var errorFailure = createFailure([7, 1], [7, 14]);
        var logFailure = createFailure([2, 1], [2, 12]);
        var warnFailure = createFailure([6, 1], [6, 13]);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "noconsole", "dir, error, log, warn");
        Lint.Test.assertContainsFailure(actualFailures, dirFailure);
    });
});
