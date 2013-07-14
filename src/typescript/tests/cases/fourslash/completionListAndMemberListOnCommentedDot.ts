/// <reference path='fourslash.ts' />

////module M {
////  export class C { public pub = 0; private priv = 1; }
////  export var V = 0;
////}
////
////
////var c = new M.C();
////
////c. // test on c.
////
//////Test for comment
//////c./**/

goTo.marker();
// bug 655025: Unexpected exception is thrown when calling verify.completionListIsEmpty() in fourslash test
// bug 655043: Intellisense should not show up in the commented line
//verify.completionListIsEmpty();
//verify.memberListIsEmpty();