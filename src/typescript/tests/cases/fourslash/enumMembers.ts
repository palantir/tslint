/// <reference path='fourslash.ts' />

//// enum Foo { A, B, C }
//// var n = Foo./*1*/A;
//// var k = n./*2*/

goTo.marker('1');
verify.memberListContains('A');
verify.memberListContains('B');
verify.memberListContains('C');

goTo.marker('2');
// Bug 15037: Shouldn't be able to dot the enum members off a variable of enum type
// verify.not.memberListContains('C');
verify.memberListContains('C');
