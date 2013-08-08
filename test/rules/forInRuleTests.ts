/// <reference path='../references.ts' />

describe("<forin>", () => {
    it("enforces filtering for the body of a for...in statement", () => {
        var fileName = "rules/forin.test.ts";
        var failureString = Lint.Rules.ForInRule.FAILURE_STRING;
        var firstFailure = Lint.Test.createFailure(fileName, [2, 5], [4, 6], failureString);
        var secondFailure = Lint.Test.createFailure(fileName, [6, 5], [11, 6], failureString);
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "forin");

        Lint.Test.assertContainsFailure(actualFailures, firstFailure);
        Lint.Test.assertContainsFailure(actualFailures, secondFailure);
    });
});
