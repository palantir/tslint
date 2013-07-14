//bug 703448: retyper: remove export from interface doesn't show error on incremental
/// <reference path="../fourslash.ts" />

//// module M {
//// export class C1 { }
////     /*1*/export interface I { n: number; }
//// }
//// module M {
//// function f(): I { return null; } }
//// 

edit.disableFormatting();

goTo.marker(1);

//edit.deleteAtCaret(6);
