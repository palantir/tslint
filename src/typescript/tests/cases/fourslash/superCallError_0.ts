//bug 703653: retyper: changing errors on invalid super call after edit
/// <reference path="../fourslash.ts" />

////class T5<T>{
////    constructor(public bar: T) { }
////}

////class T6 extends T5<number>{
////    constructor() {
////        super();
////    }
////}/*1*/

goTo.marker(1);
//edit.insert('/n');