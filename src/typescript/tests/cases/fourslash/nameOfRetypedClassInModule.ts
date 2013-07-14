/// <reference path="fourslash.ts" />

//// module M {
//// }
//// 
//// module M {
//// 	/*A*/class A {}
////    class Check { constructor/*check*/(val) {} }
//// }
//// 

edit.disableFormatting();

goTo.marker('check');
verify.quickInfoSymbolNameIs('M.Check');

goTo.marker('A');
edit.deleteAtCaret('class A {}'.length);
edit.insert('class A { constructor(val) {} }');
edit.moveLeft('(val) {} }'.length);
// Bug 679484: Inconsistent class name getting quick info on constructor in class in reopened internal module
// verify.quickInfoSymbolNameIs('M.A');
