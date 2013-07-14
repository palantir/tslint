/// <reference path='fourslash.ts' />

////module Test10 {
////    var x: string[] = [];
////    x.forEach(function (y) { y./**/} );
////}

goTo.marker();
// bug 671689: Unexpected exception is thrown when calling verify.memberListContains() in fourslash test
//verify.memberListContains("charAt");
//verify.memberListContains("charCodeAt");
//verify.memberListContains("length");
//verify.memberListContains("concat");