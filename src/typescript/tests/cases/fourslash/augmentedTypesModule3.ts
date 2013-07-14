/// <reference path='fourslash.ts'/>

////function m2g() { };
////module m2g { export class C { foo(x: number) { } } } 
////var x: m2g./*1*/;
////var r/*2*/ = m2g/*3*/;

goTo.marker('1');
verify.completionListContains('C');

edit.insert('C.');
// BUG 693937
//verify.not.completionListContains('foo');
verify.completionListContains('foo');
edit.backspace(1);

goTo.marker('2');
// BUG 697035
//verify.quickInfoIs('(x: number) => void');
verify.quickInfoIs('{ ; (): void; }');

goTo.marker('3');
edit.insert('(');
// BUG 697000
//verify.currentSignatureHelpIs('m2g(x: number): void');
verify.not.signatureHelpPresent();