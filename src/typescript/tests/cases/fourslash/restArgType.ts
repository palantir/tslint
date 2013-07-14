/// <reference path="fourslash.ts"/>

////class Test {
////    private _priv(...restArgs/*1*/) {
////    }
////    public pub(...restArgs/*2*/) {
////        var x = restArgs[2];
////    }
////}
////var x: (...y: string[]) => void = function (...y/*3*/) {
////    var t = y;
////};

goTo.marker("1");
// Bug 686822
// verify.quickInfoIs("any[]", "", "restArgs", "parameter");
goTo.marker("2");
// verify.quickInfoIs("any[]", "", "restArgs", "parameter");
goTo.marker("3");
// verify.quickInfoIs("string[]", "", "y", "parameter");
