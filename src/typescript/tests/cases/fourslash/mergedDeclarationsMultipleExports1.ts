/// <reference path='fourslash.ts'/>

////declare module 'M' 
////{
////    export interface Options { a: number; }

////    export class Foo {
////        doStuff(x: Options): number;
////    }

////    export module Foo {
////        export var x: number;
////    }
////}
    
////import M = require('M');
////var x/*2*/ = new M./*1*/Foo();
////var r2/*5*/ = M./*3*/Foo./*4*/x;

goTo.marker('1');
// BUG 713504
// verify.completionListContains('Foo');
verify.not.completionListContains('Foo');
verify.completionListContains('Options');

goTo.marker('2');
// BUG 713458
// verify.quickInfoIs('Foo');
verify.quickInfoIs('any');

goTo.marker('3');
// BUG 713504
//verify.completionListContains('Foo');
verify.completionListContains('Options');

goTo.marker('4');
//verify.completionListContains('x');
// BUG 713533
verify.completionListIsEmpty();

goTo.marker('5');
// BUG 713458
// verify.quickInfoIs('number');
verify.quickInfoIs('any');
