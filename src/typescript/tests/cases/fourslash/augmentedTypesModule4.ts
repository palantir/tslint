/// <reference path='fourslash.ts'/>

////module m3d { export var y = 2; } 
////declare class m3d { foo(): void }
////var r/*1*/ = new m3d();
////r./*2*/
////var r2/*4*/ = m3d./*3*/

goTo.marker('1');
// BUG 697145
//verify.quickInfoIs('m3d');
verify.quickInfoIs('any');

goTo.marker('2');
// BUG 697145
//verify.completionListContains('foo');
verify.completionListIsEmpty();
edit.insert('foo();');

goTo.marker('3');
verify.completionListContains('y');
edit.insert('y;');

goTo.marker('4');
verify.quickInfoIs('number');