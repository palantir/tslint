/// <reference path='fourslash.ts'/>

////module BugFix2 {
////    interface iFace { (event: string); }
////    var foo: iFace = function (elem) { /**/ }
////}

goTo.marker();
verify.completionListContains("elem", "string");