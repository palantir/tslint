/// <reference path='fourslash.ts'/>

// Global variable reference.

// @Filename: ReferencesForGlobals1.ts
////var /*1*/global = 2;
////
////class foo {
////    constructor (public global) { }
////    public f(global) { }
////    public f2(global) { }
////}
////
////class bar {
////    constructor () {
////        var n = global;
////
////        var f = new foo('');
////        f.global = '';
////    }
////}
////
////var k = global;

// @Filename: ReferencesForGlobals2.ts
////var m = global;

goTo.marker("1");
verify.referencesCountIs(4);