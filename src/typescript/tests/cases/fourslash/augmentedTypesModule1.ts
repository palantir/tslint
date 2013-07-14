/// <reference path='fourslash.ts'/>

////module m1c {
////    export interface I { foo(): void; }
////}
////var m1c = 1; // Should be allowed

////var x: m1c./*1*/;
////var r/*2*/ = m1c;

goTo.marker('1');
verify.completionListContains('I');

// BUG 696913
//edit.insert('.');
//// BUG 693937
////verify.not.completionListContains('foo');
//verify.completionListContains('foo');
//edit.backspace(1);

//goTo.marker('2');
//verify.quickInfoIs('number');