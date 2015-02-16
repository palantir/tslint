/// <reference path='../references.ts' />

describe("<indent>", () => {

    var IndentRule = Lint.Test.getRule("indent");
    var failureStringTabs = IndentRule.FAILURE_STRING_TABS;
    var failureStringSpaces = IndentRule.FAILURE_STRING_SPACES;
    var actualFailures;

    function expectFailure(failure) {
        Lint.Test.assertContainsFailure(actualFailures, failure);
    }

    // Checks only that the indent character is the specified one, *NOT* the size of the indent
    describe("on a tab-indented file", () => {
        var fileName = "rules/indentwith_tabs.test.ts";

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, IndentRule, [true, "tabs"]);
        });

        it("doesn't fail good code", () => {
            Lint.Test.assertNoFailuresWithin(fileName, actualFailures, 1, 55);
        });

        it("enforces variable indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [58, 1], [58, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [62, 1], [62, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [66, 1], [66, 5], failureStringTabs));
        });

        it("enforces class method indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [68, 1], [68, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [69, 1], [69, 8], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [70, 1], [70, 5], failureStringTabs));
        });

        it("enforces object literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [74, 1], [74, 5], failureStringTabs));
        });

        it("enforces enum indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [80, 1], [80, 5], failureStringTabs));
        });

        it("enforces switch indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [88, 1], [88, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [89, 1], [89, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [90, 1], [90, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [91, 1], [91, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [92, 1], [92, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [93, 1], [93, 9], failureStringTabs));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [97, 1], [97, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [101, 1], [101, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [105, 1], [105, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [109, 1], [109, 5], failureStringTabs));
        });

        it("enforces array literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [113, 1], [113, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [119, 1], [119, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [121, 1], [121, 5], failureStringTabs));
        });

    });


    // Checks only that the indent character is the specified one, *NOT* the size of the indent
    describe("on a space-indented file", () => {
        var fileName = "rules/indentwith_spaces.test.ts";

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, IndentRule, [true, "spaces"]);
        });

        it("doesn't fail good code", () => {
            Lint.Test.assertNoFailuresWithin(fileName, actualFailures, 1, 55);
        });

        it("enforces variable indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [58, 1], [58, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [62, 1], [62, 3], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [66, 1], [66, 2], failureStringSpaces));
        });

        it("enforces class method indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [68, 1], [68, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [69, 1], [69, 3], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [70, 1], [70, 2], failureStringSpaces));
        });

        it("enforces object literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [74, 1], [74, 2], failureStringSpaces));
        });

        it("enforces enum indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [80, 1], [80, 2], failureStringSpaces));
        });

        it("enforces switch indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [85, 1], [85, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [86, 1], [86, 3], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [87, 1], [87, 3], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [91, 1], [91, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [92, 1], [92, 3], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [93, 1], [93, 3], failureStringSpaces));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [97, 1], [97, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [101, 1], [101, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [105, 1], [105, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [109, 1], [109, 2], failureStringSpaces));
        });

        it("enforces array literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [113, 1], [113, 2], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [119, 1], [119, 3], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [121, 1], [121, 2], failureStringSpaces));
        });

    });

});
