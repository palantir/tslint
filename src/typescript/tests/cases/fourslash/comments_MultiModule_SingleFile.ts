/// <reference path='fourslash.ts' />

/////** this is multi declare module*/
////module mult/*3*/iM {
////    /** class b*/
////    export class b {
////    }
////}
/////** thi is multi module 2*/
////module mu/*2*/ltiM {
////    /** class c comment*/
////    export class c {
////    }
////}
////
////new /*1*/mu/*4*/ltiM.b();
////new mu/*5*/ltiM.c();

goTo.marker('1');
verify.completionListContains("multiM", "multiM", "this is multi declare module\nthi is multi module 2", "multiM", "module");

goTo.marker('2');
verify.quickInfoIs("multiM", "this is multi declare module\nthi is multi module 2", "multiM", "module");

goTo.marker('3');
verify.quickInfoIs("multiM", "this is multi declare module\nthi is multi module 2", "multiM", "module");

goTo.marker('4');
verify.quickInfoIs("multiM");

goTo.marker('5');
verify.quickInfoIs("multiM");
