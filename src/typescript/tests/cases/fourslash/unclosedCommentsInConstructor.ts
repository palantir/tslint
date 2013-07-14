/// <reference path="fourslash.ts" />

////class Foo {
////    constructor(/*/**/) { }
////}

goTo.marker();
// Bug 509675: Completion list is available within comments
// verify.completionListIsEmpty();