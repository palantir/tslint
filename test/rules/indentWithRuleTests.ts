/// <reference path='../references.ts' />

describe("<indent-with>", () => {

    var IndentWithRule = Lint.Test.getRule("indent-with");
    var failureStringTabs = IndentWithRule.FAILURE_STRING_TABS;
    var failureStringSpaces = IndentWithRule.FAILURE_STRING_SPACES;
    var actualFailures;

    function expectFailure(failure) {
        Lint.Test.assertContainsFailure(actualFailures, failure);
    }

    describe("on a tab-indented file", () => {
        var fileName = "rules/indentwith_tabs.test.ts";

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, IndentWithRule, [true, "tabs"]);
        });

        it("enforces variable indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [58, 5], [58, 8], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [62, 9], [62, 12], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [66, 5], [66, 12], failureStringTabs));
        });

        it("enforces class method indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [68, 5], [68, 17], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [69, 8], [69, 12], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [70, 5], [70, 6], failureStringTabs));
        });

        it("enforces object literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [74, 5], [74, 6], failureStringTabs));
        });

        it("enforces enum indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [80, 5], [80, 11], failureStringTabs));
        });

        it("enforces switch indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [88, 5], [88, 9], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [89, 9], [89, 16], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [90, 9], [90, 14], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [91, 5], [91, 12], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [92, 9], [92, 16], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [93, 9], [93, 14], failureStringTabs));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [97, 5], [97, 12], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [101, 5], [101, 12], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [105, 5], [105, 12], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [109, 5], [109, 12], failureStringTabs));
        });

        it("enforces array literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [113, 5], [113, 6], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [119, 9], [119, 10], failureStringTabs));
            expectFailure(Lint.Test.createFailure(fileName, [121, 5], [121, 6], failureStringTabs));
        });

    });


    describe("on a space-indented file", () => {
        var fileName = "rules/indentwith_spaces.test.ts";

        before(() => {
            actualFailures = Lint.Test.applyRuleOnFile(fileName, IndentWithRule, [true, "spaces"]);
        });

        it("enforces variable indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [58, 2], [58, 5], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [62, 3], [62, 6], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [66, 2], [66, 9], failureStringSpaces));
        });

        it("enforces class method indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [68, 2], [68, 14], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [69, 3], [69, 7], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [70, 2], [70, 3], failureStringSpaces));
        });

        it("enforces object literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [74, 2], [74, 3], failureStringSpaces));
        });

        it("enforces enum indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [80, 2], [80, 8], failureStringSpaces));
        });

        it("enforces switch indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [85, 2], [85, 6], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [86, 3], [86, 10], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [87, 3], [87, 8], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [91, 2], [91, 9], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [92, 3], [92, 10], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [93, 3], [93, 8], failureStringSpaces));
        });

        it("enforces control blocks indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [97, 2], [97, 9], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [101, 2], [101, 9], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [105, 2], [105, 9], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [109, 2], [109, 9], failureStringSpaces));
        });

        it("enforces array literal indentation", () => {
            expectFailure(Lint.Test.createFailure(fileName, [113, 2], [113, 3], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [119, 3], [119, 4], failureStringSpaces));
            expectFailure(Lint.Test.createFailure(fileName, [121, 2], [121, 3], failureStringSpaces));
        });

    });

});
