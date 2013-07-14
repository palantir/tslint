/// <reference path='fourslash.ts'/>

////var x;
////var n;
////
////function n(x: number, n/*1*/: number) {
////    /*2*/n = 32;
////    x = n;
////}

goTo.marker("1");
debugger;verify.referencesCountIs(3);

goTo.marker("2");
verify.referencesCountIs(3);