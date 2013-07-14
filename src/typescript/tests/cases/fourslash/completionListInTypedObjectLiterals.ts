/// <reference path="fourslash.ts" />

////interface MyPoint {
////    x1: number;
////    y1: number;
////}

////var p1: MyPoint = {
////    /*1*/
////};

goTo.marker("1");
verify.memberListContains("x1");
verify.memberListContains("y1");


////var p2: MyPoint = {
////    /*2*/x1: 5,
////    /*3*/
////};

goTo.marker("2");
verify.not.memberListContains("x1");
verify.memberListContains("y1");

goTo.marker("3");
verify.not.memberListContains("x1");
verify.memberListContains("y1");


////var p3: MyPoint = {
////    x1: /*4*/
////};

goTo.marker("4");
verify.not.memberListContains("x1");
verify.not.memberListContains("y1");


////var p4: any = {
////    /*5*/
////}

goTo.marker("5");
verify.completionListIsEmpty();


// Cast expressions
////var x = (<MyPoint>{
////    /*6*/x1: 0,
////});

goTo.marker("6");
verify.not.memberListContains("x1");
verify.memberListContains("y1");


// Call expression
////function bar(e: MyPoint) { }
////bar({
////    /*7*/
////});
goTo.marker("7");
verify.memberListContains("x1");
verify.memberListContains("y1");


// New Expression
////class bar2 {
////    constructor(e: MyPoint) { }
////}
////
////new bar2({
////    x1: 0,
////    /*8*/
////});

goTo.marker("8");
verify.not.memberListContains("x1");
verify.memberListContains("y1");


////interface Foo {
////    x: { a: number };
////}
////var aaa: Foo;

////aaa = {/*9*/

goTo.marker("9");
verify.memberListContains("x");
verify.memberListCount(1);


////aaa.x = { /*10*/

goTo.marker("10");
verify.memberListContains("a");
verify.memberListCount(1);


////var bbb = <Foo>{ /*11*/ 

goTo.marker("11");
verify.memberListContains("x");
verify.memberListCount(1);


////var bbb = <Foo>{ x: { /*12*/

goTo.marker("12");
verify.memberListContains("a");
verify.memberListCount(1);


////var ccc: Foo = { func: () => ({ /*13*/ }) 

goTo.marker("13");
verify.memberListCount(0);


////var ddd: Foo = {
////
////    /*14*/

goTo.marker("14");
verify.memberListContains("x");
verify.memberListCount(1);



////var p15: MyPoint = {
////    "x1": 5,
////    /*15*/
////};

goTo.marker("15");
verify.not.memberListContains("x1");
verify.memberListContains("y1");
verify.memberListCount(1);



// return statements

////function foo(): MyPoint {
////    return {
////        /*16*/ };
////}

goTo.marker("16");
verify.memberListContains("x1");
verify.memberListContains("y1");
verify.memberListCount(2);


////interface MyPointCreator {
////    create(): MyPoint;
////}
////
////function getMyPointCreator(): MyPointCreator {
////    return {
////        create: () => {
////            return {
////                x1: 5,
////                /*17*/
////            };
////        },
////    }
////}

goTo.marker("17");
verify.not.memberListContains("x1");
verify.memberListContains("y1");
verify.memberListCount(1);