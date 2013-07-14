///<reference path="fourslash.ts"/>

/////*InsertSpaceAfterCommaDelimiter*/[1,2,   3];

runTest("InsertSpaceAfterCommaDelimiter", "[1, 2, 3];", "[1,2,3];");


/////*InsertSpaceAfterSemicolonInForStatements*/for (i = 0;i;    i++);

runTest("InsertSpaceAfterSemicolonInForStatements", "for (i = 0; i; i++);", "for (i = 0;i;i++);");


/////*InsertSpaceBeforeAndAfterBinaryOperators*/1+2-    3

runTest("InsertSpaceBeforeAndAfterBinaryOperators", "1 + 2 - 3", "1+2-3");


/////*InsertSpaceAfterKeywordsInControlFlowStatements*/if     (true) { }

runTest("InsertSpaceAfterKeywordsInControlFlowStatements", "if (true) { }", "if(true) { }");


/////*InsertSpaceAfterFunctionKeywordForAnonymousFunctions*/(function               () { })

runTest("InsertSpaceAfterFunctionKeywordForAnonymousFunctions", "(function () { })", "(function() { })");


/////*InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis*/(1  )

runTest("InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis", "( 1 )", "(1)");


function runTest(propertyName: string, expectedStringWhenTrue: string, expectedStringWhenFalse: string) {
    // Go to the correct file
    goTo.marker(propertyName);

    // Set the option to false first
    format.setOption(propertyName, false);

    // Format
    format.document();

    // Verify
    goTo.marker(propertyName);
    verify.currentLineContentIs(expectedStringWhenFalse);

    // Set the option to true
    format.setOption(propertyName, true);

    // Format
    format.document();

    // Verify
    goTo.marker(propertyName);
    verify.currentLineContentIs(expectedStringWhenTrue);
}