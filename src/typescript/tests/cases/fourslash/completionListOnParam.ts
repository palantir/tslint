/// <reference path='fourslash.ts' />

////module Bar {
////    export class Blah { }
////}
////
////class Point {
////    public Foo(x: Bar./**/Blah, y: Bar.Blah) { }
////}

debugger;

goTo.marker();
// 17382: Completion list wont work on a certain position
verify.memberListContains('Blah');