/// <reference path='fourslash.ts'/>

////function m2f(x: number) { };
////module m2f { export interface I { foo(): void } } 
////var x: m2f./*1*/
////var r/*2*/ = m2f/*3*/;

goTo.marker('1');
verify.completionListContains('I');

edit.insert('I.');
// BUG 693937
//verify.not.completionListContains('foo');
verify.completionListContains('foo');
edit.backspace(1);

goTo.marker('2');
verify.quickInfoIs('(x: number) => void');

goTo.marker('3');
edit.insert('(');
// BUG 697000
//verify.currentSignatureHelpIs('m2f(x: number): void');
verify.not.signatureHelpPresent();