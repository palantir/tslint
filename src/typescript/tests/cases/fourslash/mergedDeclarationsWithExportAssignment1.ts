/// <reference path='fourslash.ts'/>

////declare module 'M' 
////{
////    class Foo {
////        doStuff(x: number): number;
////    }

////    module Foo {
////        export var x: number;
////    }

////    export = Foo;
////}

////import Foo/*1*/ = require('M');
////var z/*3*/ = new /*2*/Foo();
////var r2/*5*/ = Foo./*4*/z;

goTo.marker('1');
verify.quickInfoIs('Foo');

goTo.marker('2');
verify.completionListContains('Foo');

goTo.marker('3');
// BUG 713458
//verify.quickInfoIs('Foo');
verify.quickInfoIs('any');

goTo.marker('4');
// BUG 713504
//verify.completionListContains('x');
verify.completionListContains('Foo');

goTo.marker('5');
// BUG 713458
//verify.quickInfoIs('number');
verify.quickInfoIs('any');

