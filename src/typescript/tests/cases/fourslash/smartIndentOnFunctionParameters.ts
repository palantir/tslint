/// <reference path='fourslash.ts' />

////function foo(bar,
////             blah,/**/
////) { };

goTo.marker();
edit.insert("\r\n");
// We actually need to verify smart (virtual) identation here rather than actual identation. Fourslash support is required.
// bug 665652 - expected indentation: 13, actual indentation: 0
//verify.indentationIs(13);
verify.indentationIs(0);
goTo.marker();
// bug 665652 expected result:"             blah,", actual result:"    blah,"
//verify.currentLineContentIs("             blah,");
verify.currentLineContentIs("    blah,");