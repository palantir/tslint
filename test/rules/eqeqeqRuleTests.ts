/// <reference path='../references.ts' />

describe("<eqeqeq>", () => {
    var fileName = "rules/eqeqeq.test.ts";
    var actualFailures;

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, "eqeqeq");
    });


    it("ensures ===", () => {
        var failureString = Lint.Rules.EqEqEqRule.EQ_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [4, 33], [4, 35], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("ensures !==", () => {
        var failureString = Lint.Rules.EqEqEqRule.NEQ_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [8, 21], [8, 23], failureString);

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
