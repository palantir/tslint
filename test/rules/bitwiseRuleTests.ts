/// <reference path='../references.ts' />

describe("<bitwise>", () => {
    it("forbids access to bitwise operators", () => {
        var fileName = "rules/bitwise.test.ts";
        var createFailure = Lint.Test.createFailuresOnFile(fileName, Lint.Rules.BitwiseRule.FAILURE_STRING);
        var expectedFailures: Lint.RuleFailure[] = [
            createFailure([2, 10], [2, 15]),
            createFailure([3, 10], [3, 28]),
            createFailure([3, 22], [3, 27]),
        ];
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "bitwise");

        Lint.Test.assertFailuresEqual(actualFailures, expectedFailures);
    });
});
