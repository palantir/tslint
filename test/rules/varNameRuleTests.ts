/// <reference path='../references.ts' />

describe("<varname>", () => {
    it("ensures only (camel/upper)case naming convention for variables", () => {
        var fileName = "rules/varname.test.ts";
        var failureString = Lint.Rules.VarNameRule.FAILURE_STRING;

        var createFailure = Lint.Test.createFailuresOnFile(fileName, failureString);
        var expectedFailures = [
            createFailure([3, 5], [3, 17]),
            createFailure([4, 5], [4, 18]),
            createFailure([7, 13], [7, 26]),
            createFailure([12, 13], [12, 25])
        ];

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "varname");
        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
