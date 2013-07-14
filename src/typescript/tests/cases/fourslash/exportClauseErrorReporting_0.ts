//bug 703308: retyper: add/remove export clause changes reported error
/// <reference path="../fourslash.ts" />

//// module M {
////     /*1*/class C<T> { }
//// }
////  
//// var x = new M.C<string>();
//// 

edit.disableFormatting();

goTo.marker(1);
edit.insert("export ");
goTo.marker(1);

//edit.deleteAtCaret(8);
