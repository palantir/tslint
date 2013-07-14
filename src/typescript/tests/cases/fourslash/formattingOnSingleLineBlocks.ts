/// <reference path='fourslash.ts' />

/////*1*/class C
////{}/*2*/
/////*3*/if (true)
////{}/*4*/

format.document();
goTo.marker("1");
verify.currentLineContentIs("class C {");
goTo.marker("2");
verify.currentLineContentIs("}");
goTo.marker("3");
// bug 680024 - expected result: "if (true) {", actual result: "if (true)"
//verify.currentLineContentIs("if (true) {");
verify.currentLineContentIs("if (true)");
goTo.marker("4");
// bug 680024 - expected result: "}", actual result: "{ }"
//verify.currentLineContentIs("}");
verify.currentLineContentIs("{ }");