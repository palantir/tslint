/// <reference path='fourslash.ts' />

////interface Array<T> {
////    length: number;
////}

////interface IFoo<T> {}
////var x/*1*/1: bo/*4*/ol;
////var x/*2*/2: bo/*5*/ol[];
////var x/*3*/3: IFoo<bo/*6*/ol>;


goTo.marker("1");
verify.quickInfoIs("boolean");

goTo.marker("2");
verify.quickInfoIs("boolean[]");

goTo.marker("3");
verify.quickInfoIs("IFoo<boolean>");

goTo.marker("4");
verify.quickInfoIs("boolean");

goTo.marker("5");
verify.quickInfoIs("boolean");

goTo.marker("6");
verify.quickInfoIs("boolean");
