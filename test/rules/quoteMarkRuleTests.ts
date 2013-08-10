/// <reference path='../references.ts' />

describe("<quotemark>", () => {
    var fileName = "rules/quotemark.test.ts";
    var singleFailure = Lint.Rules.QuoteMarkRule.SINGLE_QUOTE_FAILURE;
    var doubleFailure = Lint.Rules.QuoteMarkRule.DOUBLE_QUOTE_FAILURE;

    it("enforces single quotes", () => {
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "quotemark", "single");
        var expectedFailure = Lint.Test.createFailure(fileName, [2, 19], [2, 28], singleFailure);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });

    it("enforces double quotes", () => {
        var actualFailures = Lint.Test.applyRuleOnFile(fileName, "quotemark", "double");
        var expectedFailure = Lint.Test.createFailure(fileName, [1, 14], [1, 22], doubleFailure);

        assert.equal(actualFailures.length, 1);
        assert.isTrue(actualFailures[0].equals(expectedFailure));
    });
});
