/// <reference path='../references.ts' />

describe("<oneline>", () => {
    var actualFailures;
    var fileName = "rules/oneline.test.ts";
    var braceFailure = Lint.Rules.OneLineRule.BRACE_FAILURE_STRING;

    before(() => {
        actualFailures = Lint.Test.applyRuleOnFile(fileName, "oneline");
    });

    it("enforces module brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [2, 1], [2, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces enumeration brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [4, 5], [4, 6], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces function brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [12, 5], [12, 6], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces if brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [14, 9], [14, 10], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces else position", () => {
        var elseFailure = Lint.Rules.OneLineRule.ELSE_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [17, 9], [17, 13], elseFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces class brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [25, 1], [25, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces object literal brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [30, 1], [30, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces block brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [36, 1], [36, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces switch brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [41, 1], [41, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces try brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [51, 1], [51, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces catch brace", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [55, 1], [55, 2], braceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace before a brace", () => {
        var whitespaceFailure = Lint.Rules.OneLineRule.WHITESPACE_FAILURE_STRING;
        var expectedFailure = Lint.Test.createFailure(fileName, [59, 14], [59, 15], whitespaceFailure);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
});
