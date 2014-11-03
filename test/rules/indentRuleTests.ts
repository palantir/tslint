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

        it("enforces variable indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [58, 5], [58, 13], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [62, 9], [62, 21], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [66, 5], [66, 17], failureStringTabs));
        });

        it("enforces class method indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [68, 5], [69, 1], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [69, 8], [69, 19], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [70, 5], [73, 2], failureStringTabs));
        });

        it("enforces object literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [74, 5], [74, 10], failureStringTabs));
        });

        it("enforces enum indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [80, 5], [81, 3], failureStringTabs));
        });

        it("enforces switch indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [88, 5], [89, 2], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [89, 9], [89, 24], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [90, 9], [91, 7], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [91, 5], [92, 3], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [92, 9], [92, 24], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [93, 9], [96, 4], failureStringTabs));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [97, 5], [97, 16], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [101, 5], [101, 16], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [105, 5], [105, 16], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [109, 5], [109, 16], failureStringTabs));
        });

        it("enforces array literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [113, 5], [114, 3], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [119, 9], [120, 4], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [121, 5], [122, 3], failureStringTabs));
        });

    });


    // Checks only that the indent character is the specified one, *NOT* the size of the indent
    describe("on a space-indented file", () => {
        var fileName = "rules/indentwith_spaces.test.ts";

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, IndentRule, [true, "spaces"]);
        });

        it("enforces variable indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [58, 2], [58, 7], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [62, 3], [62, 9], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [66, 2], [66, 11], failureStringSpaces));
        });

        it("enforces class method indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [68, 2], [68, 16], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [69, 3], [69, 9], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [70, 2], [71, 2], failureStringSpaces));
        });

        it("enforces object literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [74, 2], [74, 4], failureStringSpaces));
        });

        it("enforces enum indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [80, 2], [80, 9], failureStringSpaces));
        });

        it("enforces switch indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [85, 2], [85, 8], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [86, 3], [86, 12], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [87, 3], [88, 1], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [91, 2], [91, 10], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [92, 3], [92, 12], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [93, 3], [94, 1], failureStringSpaces));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [97, 2], [97, 10], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [101, 2], [101, 10], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [105, 2], [105, 10], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [109, 2], [109, 10], failureStringSpaces));
        });

        it("enforces array literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [113, 2], [113, 4], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [119, 3], [119, 6], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [121, 2], [121, 4], failureStringSpaces));
        });

    });

});
