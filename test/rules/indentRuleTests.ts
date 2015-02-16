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
            Lint.Test.assertNoFailuresWithin(fileName, actualFailures, 1, 58);
        });

        it("enforces variable indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [61, 1], [61, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [65, 1], [65, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [69, 1], [69, 5], failureStringTabs));
        });

        it("enforces class method indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [71, 1], [71, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [72, 1], [72, 8], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [73, 1], [73, 5], failureStringTabs));
        });

        it("enforces object literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [77, 1], [77, 5], failureStringTabs));
        });

        it("enforces enum indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [83, 1], [83, 5], failureStringTabs));
        });

        it("enforces switch indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [91, 1], [91, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [92, 1], [92, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [93, 1], [93, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [94, 1], [94, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [95, 1], [95, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [96, 1], [96, 9], failureStringTabs));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [100, 1], [100, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [104, 1], [104, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [108, 1], [108, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [112, 1], [112, 5], failureStringTabs));
        });

        it("enforces array literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [116, 1], [116, 5], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [122, 1], [122, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [124, 1], [124, 5], failureStringTabs));
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
