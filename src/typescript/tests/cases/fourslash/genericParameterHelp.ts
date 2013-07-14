/// <reference path="fourslash.ts"/>

////interface IFoo { }
////
////function testFunction<T extends IFoo, U, M extends IFoo>(a: T, b: U, c: M): M {
////    return null;
////}
////
////class testClass<T extends IFoo, U, M extends IFoo> {
////    constructor(a:T, b:U, c:M){ }
////}
////

// Function calls

////testFunction</*1*/

goTo.marker("1");
verify.currentSignatureParamterCountIs(3);
verify.currentSignatureHelpIs("testFunction<T extends IFoo, U, M extends IFoo>(a: T, b: U, c: M): M");

verify.currentParameterHelpArgumentNameIs("T");
verify.currentParameterSpanIs("T extends IFoo");


////testFunction<any, /*2*/

goTo.marker("2");
verify.currentParameterHelpArgumentNameIs("U");
verify.currentParameterSpanIs("U");


////testFunction<any, any, any>(/*3*/

goTo.marker("3");
verify.currentParameterHelpArgumentNameIs("a");
verify.currentParameterSpanIs("a: T");


////testFunction<any, any,/*4*/ any>(null, null, null);

goTo.marker("4");
verify.currentParameterHelpArgumentNameIs("M");
verify.currentParameterSpanIs("M extends IFoo");


////testFunction<, ,/*5*/>(null, null, null);

goTo.marker("5");
verify.currentParameterHelpArgumentNameIs("M");
verify.currentParameterSpanIs("M extends IFoo");


// Constructor calls

////new testClass</*construcor1*/

goTo.marker("construcor1");
verify.currentSignatureHelpIs("testClass<T extends IFoo, U, M extends IFoo>(a: T, b: U, c: M): testClass<T, U, M>");
verify.currentParameterHelpArgumentNameIs("T");
verify.currentParameterSpanIs("T extends IFoo");


////new testClass<IFoo, /*construcor2*/

goTo.marker("construcor2");
verify.currentParameterHelpArgumentNameIs("U");
verify.currentParameterSpanIs("U");


////new testClass</*construcor3*/>(null, null, null)

goTo.marker("construcor3");
verify.currentParameterHelpArgumentNameIs("T");
verify.currentParameterSpanIs("T extends IFoo");


////new testClass<,,/*construcor4*/>(null, null, null)

goTo.marker("construcor4");
verify.currentParameterHelpArgumentNameIs("M");
verify.currentParameterSpanIs("M extends IFoo");

////new testClass<IFoo,/*construcor5*/IFoo,IFoo>(null, null, null)

goTo.marker("construcor5");
verify.currentParameterHelpArgumentNameIs("U");
verify.currentParameterSpanIs("U");



// Generic types

////testClass</*type1*/

goTo.marker("type1");
verify.signatureHelpCountIs(1);
verify.currentSignatureHelpIs("testClass<T extends IFoo, U, M extends IFoo>");
verify.currentParameterHelpArgumentNameIs("T");
verify.currentParameterSpanIs("T extends IFoo");


////var x : testClass</*type2*/

goTo.marker("type2");
verify.signatureHelpCountIs(1);
verify.currentParameterHelpArgumentNameIs("T");
verify.currentParameterSpanIs("T extends IFoo");


////class Bar<T> extends testClass</*type3*/

goTo.marker("type3");
verify.signatureHelpCountIs(1);
verify.currentParameterHelpArgumentNameIs("T");
verify.currentParameterSpanIs("T extends IFoo");



////var x : testClass<,, /*type4*/any>;

goTo.marker("type4");
verify.signatureHelpCountIs(1);
verify.currentParameterHelpArgumentNameIs("M");
verify.currentParameterSpanIs("M extends IFoo");