/// <reference path='../references.ts' />

describe("<classname>", () => {
    it("ensures class names are always pascal-cased", () => {
        var fileName = "rules/className.test.ts";
        var expectedFailure = Lint.Test.createFailure(fileName, [5, 7], [5, 23], Lint.Rules.ClassNameRule.FAILURE_STRING);

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "classname");

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
