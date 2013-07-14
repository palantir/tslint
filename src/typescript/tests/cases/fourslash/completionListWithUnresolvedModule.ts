/// <reference path="fourslash.ts" />

////module m {
////    import foo = module('_foo');
////    var n: num/**/
////}

goTo.marker();
// Bug 17641: Completion list stops working if unresolved module import is present
// ... currently causes an unhandled exception in the LS
// verify.completionListContains('number');
